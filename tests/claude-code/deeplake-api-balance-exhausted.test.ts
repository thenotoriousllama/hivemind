import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests for the balance-exhausted notification path in DeeplakeApi.
 *
 * Server returns 402 with body `{"balance_cents":0,"error":"insufficient
 * balance, please top up"}` when the org runs out of credits. Without
 * surfacing this, captures and memory recalls fail silently — the agent
 * reads empty memory and confidently reasons from no data, never telling
 * the user why. This pins the contract that:
 *
 *   - A 402 with `balance_cents` in the body enqueues a session-start banner
 *   - Process-local dedup: subsequent 402s in the same process don't double-enqueue
 *   - Non-402 errors do NOT enqueue
 *   - 402 WITHOUT `balance_cents` (some other 402 cause) does NOT enqueue
 *   - The original error still throws so callers' existing handling is unchanged
 */

const enqueueNotificationMock = vi.fn();
vi.mock("../../src/notifications/queue.js", async () => {
  const actual = await vi.importActual<typeof import("../../src/notifications/queue.js")>(
    "../../src/notifications/queue.js",
  );
  return { ...actual, enqueueNotification: (...a: unknown[]) => enqueueNotificationMock(...a) };
});

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

function bodyResp(status: number, body: string): Response {
  return new Response(body, { status, headers: { "Content-Type": "application/json" } });
}

beforeEach(async () => {
  fetchMock.mockReset();
  enqueueNotificationMock.mockReset();
  enqueueNotificationMock.mockResolvedValue(undefined);
  const { _resetSdkStateForTesting } = await import("../../src/deeplake-api.js");
  _resetSdkStateForTesting();
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function makeApi() {
  const { DeeplakeApi } = await import("../../src/deeplake-api.js");
  return new DeeplakeApi("tok", "https://api.example", "org", "ws", "memory");
}

describe("DeeplakeApi — 402 balance-exhausted handling", () => {
  it("enqueues a session-start banner when the daemon returns 402 with balance_cents:0", async () => {
    fetchMock.mockResolvedValueOnce(
      bodyResp(402, JSON.stringify({ balance_cents: 0, error: "insufficient balance, please top up" })),
    );
    const api = await makeApi();
    await expect(api.query("SELECT 1")).rejects.toThrow(/Query failed: 402/);

    expect(enqueueNotificationMock).toHaveBeenCalledTimes(1);
    const arg = enqueueNotificationMock.mock.calls[0][0];
    expect(arg.id).toBe("balance-exhausted");
    expect(arg.severity).toBe("warn");
    expect(arg.title).toMatch(/credits exhausted/i);
    expect(arg.body).toMatch(/top up/i);
    expect(arg.dedupKey.reason).toBe("balance-zero");
    // Date is included so the banner re-fires daily until the user tops up
    // rather than firing once-ever and going quiet.
    expect(arg.dedupKey.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("process-local dedup: a second 402 in the same process does not re-enqueue", async () => {
    fetchMock.mockResolvedValue(
      bodyResp(402, JSON.stringify({ balance_cents: 0, error: "insufficient balance, please top up" })),
    );
    const api = await makeApi();
    await expect(api.query("SELECT 1")).rejects.toThrow(/402/);
    await expect(api.query("INSERT INTO sessions VALUES (1)")).rejects.toThrow(/402/);
    await expect(api.query("SELECT 2")).rejects.toThrow(/402/);
    expect(enqueueNotificationMock).toHaveBeenCalledTimes(1);
  });

  it("does NOT enqueue when status is 402 but body lacks balance_cents (a different 402 reason)", async () => {
    fetchMock.mockResolvedValueOnce(bodyResp(402, JSON.stringify({ error: "some-other-402-cause" })));
    const api = await makeApi();
    await expect(api.query("SELECT 1")).rejects.toThrow(/402/);
    expect(enqueueNotificationMock).not.toHaveBeenCalled();
  });

  it("does NOT enqueue for non-402 errors", async () => {
    // 500 with balance_cents in body — only the STATUS+BODY combination should match.
    fetchMock.mockResolvedValueOnce(
      bodyResp(500, JSON.stringify({ balance_cents: 0, error: "internal" })),
    );
    // Re-fire 4 times (3 retries + final) to exhaust retry budget.
    fetchMock.mockResolvedValue(bodyResp(500, JSON.stringify({ balance_cents: 0, error: "internal" })));
    vi.spyOn(global, "setTimeout").mockImplementation(((fn: () => void) => {
      fn();
      return 0 as unknown as ReturnType<typeof setTimeout>;
    }) as typeof setTimeout);
    const api = await makeApi();
    await expect(api.query("SELECT 1")).rejects.toThrow(/Query failed: 500/);
    expect(enqueueNotificationMock).not.toHaveBeenCalled();
  });

  it("still throws the original Query failed error (caller's catch path unchanged)", async () => {
    fetchMock.mockResolvedValueOnce(
      bodyResp(402, JSON.stringify({ balance_cents: 0, error: "insufficient balance, please top up" })),
    );
    const api = await makeApi();
    let caught: unknown = null;
    try {
      await api.query("SELECT 1");
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(Error);
    expect((caught as Error).message).toMatch(/Query failed: 402/);
    expect((caught as Error).message).toMatch(/insufficient balance/);
  });
});
