#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// dist/src/index-marker-store.js
var index_marker_store_exports = {};
__export(index_marker_store_exports, {
  buildIndexMarkerPath: () => buildIndexMarkerPath,
  getIndexMarkerDir: () => getIndexMarkerDir,
  hasFreshIndexMarker: () => hasFreshIndexMarker,
  writeIndexMarker: () => writeIndexMarker
});
import { existsSync as existsSync14, mkdirSync as mkdirSync6, readFileSync as readFileSync14, writeFileSync as writeFileSync11 } from "node:fs";
import { join as join19 } from "node:path";
import { tmpdir } from "node:os";
function getIndexMarkerDir() {
  return process.env.HIVEMIND_INDEX_MARKER_DIR ?? join19(tmpdir(), "hivemind-deeplake-indexes");
}
function buildIndexMarkerPath(workspaceId, orgId, table, suffix) {
  const markerKey = [workspaceId, orgId, table, suffix].join("__").replace(/[^a-zA-Z0-9_.-]/g, "_");
  return join19(getIndexMarkerDir(), `${markerKey}.json`);
}
function hasFreshIndexMarker(markerPath) {
  if (!existsSync14(markerPath))
    return false;
  try {
    const raw = JSON.parse(readFileSync14(markerPath, "utf-8"));
    const updatedAt = raw.updatedAt ? new Date(raw.updatedAt).getTime() : NaN;
    if (!Number.isFinite(updatedAt) || Date.now() - updatedAt > INDEX_MARKER_TTL_MS)
      return false;
    return true;
  } catch {
    return false;
  }
}
function writeIndexMarker(markerPath) {
  mkdirSync6(getIndexMarkerDir(), { recursive: true });
  writeFileSync11(markerPath, JSON.stringify({ updatedAt: (/* @__PURE__ */ new Date()).toISOString() }), "utf-8");
}
var INDEX_MARKER_TTL_MS;
var init_index_marker_store = __esm({
  "dist/src/index-marker-store.js"() {
    "use strict";
    INDEX_MARKER_TTL_MS = Number(process.env.HIVEMIND_INDEX_MARKER_TTL_MS ?? 6 * 60 * 6e4);
  }
});

// node_modules/@anthropic-ai/sdk/internal/tslib.mjs
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
var init_tslib = __esm({
  "node_modules/@anthropic-ai/sdk/internal/tslib.mjs"() {
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/uuid.mjs
var uuid4;
var init_uuid = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/uuid.mjs"() {
    uuid4 = function() {
      const { crypto: crypto2 } = globalThis;
      if (crypto2?.randomUUID) {
        uuid4 = crypto2.randomUUID.bind(crypto2);
        return crypto2.randomUUID();
      }
      const u8 = new Uint8Array(1);
      const randomByte = crypto2 ? () => crypto2.getRandomValues(u8)[0] : () => Math.random() * 255 & 255;
      return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ randomByte() & 15 >> +c / 4).toString(16));
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/errors.mjs
function isAbortError(err) {
  return typeof err === "object" && err !== null && // Spec-compliant fetch implementations
  ("name" in err && err.name === "AbortError" || // Expo fetch
  "message" in err && String(err.message).includes("FetchRequestCanceledException"));
}
var castToError;
var init_errors = __esm({
  "node_modules/@anthropic-ai/sdk/internal/errors.mjs"() {
    castToError = (err) => {
      if (err instanceof Error)
        return err;
      if (typeof err === "object" && err !== null) {
        try {
          if (Object.prototype.toString.call(err) === "[object Error]") {
            const error = new Error(err.message, err.cause ? { cause: err.cause } : {});
            if (err.stack)
              error.stack = err.stack;
            if (err.cause && !error.cause)
              error.cause = err.cause;
            if (err.name)
              error.name = err.name;
            return error;
          }
        } catch {
        }
        try {
          return new Error(JSON.stringify(err));
        } catch {
        }
      }
      return new Error(err);
    };
  }
});

// node_modules/@anthropic-ai/sdk/core/error.mjs
var AnthropicError, APIError, APIUserAbortError, APIConnectionError, APIConnectionTimeoutError, BadRequestError, AuthenticationError, PermissionDeniedError, NotFoundError, ConflictError, UnprocessableEntityError, RateLimitError, InternalServerError;
var init_error = __esm({
  "node_modules/@anthropic-ai/sdk/core/error.mjs"() {
    init_errors();
    AnthropicError = class extends Error {
    };
    APIError = class _APIError extends AnthropicError {
      constructor(status, error, message, headers, type2) {
        super(`${_APIError.makeMessage(status, error, message)}`);
        this.status = status;
        this.headers = headers;
        this.requestID = headers?.get("request-id");
        this.error = error;
        this.type = type2 ?? null;
      }
      static makeMessage(status, error, message) {
        const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
        if (status && msg) {
          return `${status} ${msg}`;
        }
        if (status) {
          return `${status} status code (no body)`;
        }
        if (msg) {
          return msg;
        }
        return "(no status code or body)";
      }
      static generate(status, errorResponse, message, headers) {
        if (!status || !headers) {
          return new APIConnectionError({ message, cause: castToError(errorResponse) });
        }
        const error = errorResponse;
        const type2 = error?.["error"]?.["type"];
        if (status === 400) {
          return new BadRequestError(status, error, message, headers, type2);
        }
        if (status === 401) {
          return new AuthenticationError(status, error, message, headers, type2);
        }
        if (status === 403) {
          return new PermissionDeniedError(status, error, message, headers, type2);
        }
        if (status === 404) {
          return new NotFoundError(status, error, message, headers, type2);
        }
        if (status === 409) {
          return new ConflictError(status, error, message, headers, type2);
        }
        if (status === 422) {
          return new UnprocessableEntityError(status, error, message, headers, type2);
        }
        if (status === 429) {
          return new RateLimitError(status, error, message, headers, type2);
        }
        if (status >= 500) {
          return new InternalServerError(status, error, message, headers, type2);
        }
        return new _APIError(status, error, message, headers, type2);
      }
    };
    APIUserAbortError = class extends APIError {
      constructor({ message } = {}) {
        super(void 0, void 0, message || "Request was aborted.", void 0);
      }
    };
    APIConnectionError = class extends APIError {
      constructor({ message, cause }) {
        super(void 0, void 0, message || "Connection error.", void 0);
        if (cause)
          this.cause = cause;
      }
    };
    APIConnectionTimeoutError = class extends APIConnectionError {
      constructor({ message } = {}) {
        super({ message: message ?? "Request timed out." });
      }
    };
    BadRequestError = class extends APIError {
    };
    AuthenticationError = class extends APIError {
    };
    PermissionDeniedError = class extends APIError {
    };
    NotFoundError = class extends APIError {
    };
    ConflictError = class extends APIError {
    };
    UnprocessableEntityError = class extends APIError {
    };
    RateLimitError = class extends APIError {
    };
    InternalServerError = class extends APIError {
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/values.mjs
function maybeObj(x) {
  if (typeof x !== "object") {
    return {};
  }
  return x ?? {};
}
function isEmptyObj(obj) {
  if (!obj)
    return true;
  for (const _k in obj)
    return false;
  return true;
}
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
var startsWithSchemeRegexp, isAbsoluteURL, isArray, isReadonlyArray, validatePositiveInteger, safeJSON;
var init_values = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/values.mjs"() {
    init_error();
    startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
    isAbsoluteURL = (url) => {
      return startsWithSchemeRegexp.test(url);
    };
    isArray = (val) => (isArray = Array.isArray, isArray(val));
    isReadonlyArray = isArray;
    validatePositiveInteger = (name, n) => {
      if (typeof n !== "number" || !Number.isInteger(n)) {
        throw new AnthropicError(`${name} must be an integer`);
      }
      if (n < 0) {
        throw new AnthropicError(`${name} must be a positive integer`);
      }
      return n;
    };
    safeJSON = (text) => {
      try {
        return JSON.parse(text);
      } catch (err) {
        return void 0;
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/sleep.mjs
var sleep3;
var init_sleep = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/sleep.mjs"() {
    sleep3 = (ms, signal) => new Promise((resolve9) => {
      if (signal?.aborted)
        return resolve9();
      const onAbort = () => {
        clearTimeout(timer);
        resolve9();
      };
      const timer = setTimeout(() => {
        signal?.removeEventListener("abort", onAbort);
        resolve9();
      }, ms);
      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }
});

// node_modules/@anthropic-ai/sdk/version.mjs
var VERSION;
var init_version = __esm({
  "node_modules/@anthropic-ai/sdk/version.mjs"() {
    VERSION = "0.97.1";
  }
});

// node_modules/@anthropic-ai/sdk/internal/detect-platform.mjs
function getDetectedPlatform() {
  if (typeof Deno !== "undefined" && Deno.build != null) {
    return "deno";
  }
  if (typeof EdgeRuntime !== "undefined") {
    return "edge";
  }
  if (Object.prototype.toString.call(typeof globalThis.process !== "undefined" ? globalThis.process : 0) === "[object process]") {
    return "node";
  }
  return "unknown";
}
function getBrowserInfo() {
  if (typeof navigator === "undefined" || !navigator) {
    return null;
  }
  const browserPatterns = [
    { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
  ];
  for (const { key, pattern } of browserPatterns) {
    const match = pattern.exec(navigator.userAgent);
    if (match) {
      const major = match[1] || 0;
      const minor = match[2] || 0;
      const patch = match[3] || 0;
      return { browser: key, version: `${major}.${minor}.${patch}` };
    }
  }
  return null;
}
var isRunningInBrowser, getPlatformProperties, normalizeArch, normalizePlatform, _platformHeaders, getPlatformHeaders;
var init_detect_platform = __esm({
  "node_modules/@anthropic-ai/sdk/internal/detect-platform.mjs"() {
    init_version();
    isRunningInBrowser = () => {
      return (
        // @ts-ignore
        typeof window !== "undefined" && // @ts-ignore
        typeof window.document !== "undefined" && // @ts-ignore
        typeof navigator !== "undefined"
      );
    };
    getPlatformProperties = () => {
      const detectedPlatform = getDetectedPlatform();
      if (detectedPlatform === "deno") {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": VERSION,
          "X-Stainless-OS": normalizePlatform(Deno.build.os),
          "X-Stainless-Arch": normalizeArch(Deno.build.arch),
          "X-Stainless-Runtime": "deno",
          "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
        };
      }
      if (typeof EdgeRuntime !== "undefined") {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": VERSION,
          "X-Stainless-OS": "Unknown",
          "X-Stainless-Arch": `other:${EdgeRuntime}`,
          "X-Stainless-Runtime": "edge",
          "X-Stainless-Runtime-Version": globalThis.process.version
        };
      }
      if (detectedPlatform === "node") {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": VERSION,
          "X-Stainless-OS": normalizePlatform(globalThis.process.platform ?? "unknown"),
          "X-Stainless-Arch": normalizeArch(globalThis.process.arch ?? "unknown"),
          "X-Stainless-Runtime": "node",
          "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
        };
      }
      const browserInfo = getBrowserInfo();
      if (browserInfo) {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": VERSION,
          "X-Stainless-OS": "Unknown",
          "X-Stainless-Arch": "unknown",
          "X-Stainless-Runtime": `browser:${browserInfo.browser}`,
          "X-Stainless-Runtime-Version": browserInfo.version
        };
      }
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": "Unknown",
        "X-Stainless-Arch": "unknown",
        "X-Stainless-Runtime": "unknown",
        "X-Stainless-Runtime-Version": "unknown"
      };
    };
    normalizeArch = (arch) => {
      if (arch === "x32")
        return "x32";
      if (arch === "x86_64" || arch === "x64")
        return "x64";
      if (arch === "arm")
        return "arm";
      if (arch === "aarch64" || arch === "arm64")
        return "arm64";
      if (arch)
        return `other:${arch}`;
      return "unknown";
    };
    normalizePlatform = (platform) => {
      platform = platform.toLowerCase();
      if (platform.includes("ios"))
        return "iOS";
      if (platform === "android")
        return "Android";
      if (platform === "darwin")
        return "MacOS";
      if (platform === "win32")
        return "Windows";
      if (platform === "freebsd")
        return "FreeBSD";
      if (platform === "openbsd")
        return "OpenBSD";
      if (platform === "linux")
        return "Linux";
      if (platform)
        return `Other:${platform}`;
      return "Unknown";
    };
    getPlatformHeaders = () => {
      return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/shims.mjs
function getDefaultFetch() {
  if (typeof fetch !== "undefined") {
    return fetch;
  }
  throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
function makeReadableStream(...args) {
  const ReadableStream = globalThis.ReadableStream;
  if (typeof ReadableStream === "undefined") {
    throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
  }
  return new ReadableStream(...args);
}
function ReadableStreamFrom(iterable) {
  let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
  return makeReadableStream({
    start() {
    },
    async pull(controller) {
      const { done, value } = await iter.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
    async cancel() {
      await iter.return?.();
    }
  });
}
function ReadableStreamToAsyncIterable(stream) {
  if (stream[Symbol.asyncIterator])
    return stream;
  const reader = stream.getReader();
  return {
    async next() {
      try {
        const result = await reader.read();
        if (result?.done)
          reader.releaseLock();
        return result;
      } catch (e) {
        reader.releaseLock();
        throw e;
      }
    },
    async return() {
      const cancelPromise = reader.cancel();
      reader.releaseLock();
      await cancelPromise;
      return { done: true, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
async function CancelReadableStream(stream) {
  if (stream === null || typeof stream !== "object")
    return;
  if (stream[Symbol.asyncIterator]) {
    await stream[Symbol.asyncIterator]().return?.();
    return;
  }
  const reader = stream.getReader();
  const cancelPromise = reader.cancel();
  reader.releaseLock();
  await cancelPromise;
}
var init_shims = __esm({
  "node_modules/@anthropic-ai/sdk/internal/shims.mjs"() {
  }
});

// node_modules/@anthropic-ai/sdk/internal/request-options.mjs
var FallbackEncoder;
var init_request_options = __esm({
  "node_modules/@anthropic-ai/sdk/internal/request-options.mjs"() {
    FallbackEncoder = ({ headers, body }) => {
      return {
        bodyHeaders: {
          "content-type": "application/json"
        },
        body: JSON.stringify(body)
      };
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/qs/formats.mjs
var default_format, default_formatter, formatters, RFC1738;
var init_formats = __esm({
  "node_modules/@anthropic-ai/sdk/internal/qs/formats.mjs"() {
    default_format = "RFC3986";
    default_formatter = (v) => String(v);
    formatters = {
      RFC1738: (v) => String(v).replace(/%20/g, "+"),
      RFC3986: default_formatter
    };
    RFC1738 = "RFC1738";
  }
});

// node_modules/@anthropic-ai/sdk/internal/qs/utils.mjs
function is_buffer(obj) {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
}
function maybe_map(val, fn) {
  if (isArray(val)) {
    const mapped = [];
    for (let i = 0; i < val.length; i += 1) {
      mapped.push(fn(val[i]));
    }
    return mapped;
  }
  return fn(val);
}
var has, hex_table, limit, encode;
var init_utils = __esm({
  "node_modules/@anthropic-ai/sdk/internal/qs/utils.mjs"() {
    init_formats();
    init_values();
    has = (obj, key) => (has = Object.hasOwn ?? Function.prototype.call.bind(Object.prototype.hasOwnProperty), has(obj, key));
    hex_table = /* @__PURE__ */ (() => {
      const array = [];
      for (let i = 0; i < 256; ++i) {
        array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
      }
      return array;
    })();
    limit = 1024;
    encode = (str3, _defaultEncoder, charset, _kind, format) => {
      if (str3.length === 0) {
        return str3;
      }
      let string = str3;
      if (typeof str3 === "symbol") {
        string = Symbol.prototype.toString.call(str3);
      } else if (typeof str3 !== "string") {
        string = String(str3);
      }
      if (charset === "iso-8859-1") {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
          return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
        });
      }
      let out = "";
      for (let j = 0; j < string.length; j += limit) {
        const segment = string.length >= limit ? string.slice(j, j + limit) : string;
        const arr = [];
        for (let i = 0; i < segment.length; ++i) {
          let c = segment.charCodeAt(i);
          if (c === 45 || // -
          c === 46 || // .
          c === 95 || // _
          c === 126 || // ~
          c >= 48 && c <= 57 || // 0-9
          c >= 65 && c <= 90 || // a-z
          c >= 97 && c <= 122 || // A-Z
          format === RFC1738 && (c === 40 || c === 41)) {
            arr[arr.length] = segment.charAt(i);
            continue;
          }
          if (c < 128) {
            arr[arr.length] = hex_table[c];
            continue;
          }
          if (c < 2048) {
            arr[arr.length] = hex_table[192 | c >> 6] + hex_table[128 | c & 63];
            continue;
          }
          if (c < 55296 || c >= 57344) {
            arr[arr.length] = hex_table[224 | c >> 12] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
            continue;
          }
          i += 1;
          c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
          arr[arr.length] = hex_table[240 | c >> 18] + hex_table[128 | c >> 12 & 63] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
        }
        out += arr.join("");
      }
      return out;
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/qs/stringify.mjs
function is_non_nullish_primitive(v) {
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
}
function inner_stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
  let obj = object;
  let tmp_sc = sideChannel;
  let step = 0;
  let find_flag = false;
  while ((tmp_sc = tmp_sc.get(sentinel)) !== void 0 && !find_flag) {
    const pos = tmp_sc.get(object);
    step += 1;
    if (typeof pos !== "undefined") {
      if (pos === step) {
        throw new RangeError("Cyclic object value");
      } else {
        find_flag = true;
      }
    }
    if (typeof tmp_sc.get(sentinel) === "undefined") {
      step = 0;
    }
  }
  if (typeof filter === "function") {
    obj = filter(prefix, obj);
  } else if (obj instanceof Date) {
    obj = serializeDate?.(obj);
  } else if (generateArrayPrefix === "comma" && isArray(obj)) {
    obj = maybe_map(obj, function(value) {
      if (value instanceof Date) {
        return serializeDate?.(value);
      }
      return value;
    });
  }
  if (obj === null) {
    if (strictNullHandling) {
      return encoder && !encodeValuesOnly ? (
        // @ts-expect-error
        encoder(prefix, defaults.encoder, charset, "key", format)
      ) : prefix;
    }
    obj = "";
  }
  if (is_non_nullish_primitive(obj) || is_buffer(obj)) {
    if (encoder) {
      const key_value = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
      return [
        formatter?.(key_value) + "=" + // @ts-expect-error
        formatter?.(encoder(obj, defaults.encoder, charset, "value", format))
      ];
    }
    return [formatter?.(prefix) + "=" + formatter?.(String(obj))];
  }
  const values = [];
  if (typeof obj === "undefined") {
    return values;
  }
  let obj_keys;
  if (generateArrayPrefix === "comma" && isArray(obj)) {
    if (encodeValuesOnly && encoder) {
      obj = maybe_map(obj, encoder);
    }
    obj_keys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
  } else if (isArray(filter)) {
    obj_keys = filter;
  } else {
    const keys = Object.keys(obj);
    obj_keys = sort ? keys.sort(sort) : keys;
  }
  const encoded_prefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
  const adjusted_prefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encoded_prefix + "[]" : encoded_prefix;
  if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
    return adjusted_prefix + "[]";
  }
  for (let j = 0; j < obj_keys.length; ++j) {
    const key = obj_keys[j];
    const value = (
      // @ts-ignore
      typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key]
    );
    if (skipNulls && value === null) {
      continue;
    }
    const encoded_key = allowDots && encodeDotInKeys ? key.replace(/\./g, "%2E") : key;
    const key_prefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjusted_prefix, encoded_key) : adjusted_prefix : adjusted_prefix + (allowDots ? "." + encoded_key : "[" + encoded_key + "]");
    sideChannel.set(object, step);
    const valueSideChannel = /* @__PURE__ */ new WeakMap();
    valueSideChannel.set(sentinel, sideChannel);
    push_to_array(values, inner_stringify(
      value,
      key_prefix,
      generateArrayPrefix,
      commaRoundTrip,
      allowEmptyArrays,
      strictNullHandling,
      skipNulls,
      encodeDotInKeys,
      // @ts-ignore
      generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder,
      filter,
      sort,
      allowDots,
      serializeDate,
      format,
      formatter,
      encodeValuesOnly,
      charset,
      valueSideChannel
    ));
  }
  return values;
}
function normalize_stringify_options(opts = defaults) {
  if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
    throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
  }
  if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
    throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
  }
  if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
    throw new TypeError("Encoder has to be a function.");
  }
  const charset = opts.charset || defaults.charset;
  if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  }
  let format = default_format;
  if (typeof opts.format !== "undefined") {
    if (!has(formatters, opts.format)) {
      throw new TypeError("Unknown format option provided.");
    }
    format = opts.format;
  }
  const formatter = formatters[format];
  let filter = defaults.filter;
  if (typeof opts.filter === "function" || isArray(opts.filter)) {
    filter = opts.filter;
  }
  let arrayFormat;
  if (opts.arrayFormat && opts.arrayFormat in array_prefix_generators) {
    arrayFormat = opts.arrayFormat;
  } else if ("indices" in opts) {
    arrayFormat = opts.indices ? "indices" : "repeat";
  } else {
    arrayFormat = defaults.arrayFormat;
  }
  if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  }
  const allowDots = typeof opts.allowDots === "undefined" ? !!opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
  return {
    addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
    // @ts-ignore
    allowDots,
    allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
    arrayFormat,
    charset,
    charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
    commaRoundTrip: !!opts.commaRoundTrip,
    delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
    encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
    encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
    encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
    encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
    filter,
    format,
    formatter,
    serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
    skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
    // @ts-ignore
    sort: typeof opts.sort === "function" ? opts.sort : null,
    strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
  };
}
function stringify(object, opts = {}) {
  let obj = object;
  const options = normalize_stringify_options(opts);
  let obj_keys;
  let filter;
  if (typeof options.filter === "function") {
    filter = options.filter;
    obj = filter("", obj);
  } else if (isArray(options.filter)) {
    filter = options.filter;
    obj_keys = filter;
  }
  const keys = [];
  if (typeof obj !== "object" || obj === null) {
    return "";
  }
  const generateArrayPrefix = array_prefix_generators[options.arrayFormat];
  const commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
  if (!obj_keys) {
    obj_keys = Object.keys(obj);
  }
  if (options.sort) {
    obj_keys.sort(options.sort);
  }
  const sideChannel = /* @__PURE__ */ new WeakMap();
  for (let i = 0; i < obj_keys.length; ++i) {
    const key = obj_keys[i];
    if (options.skipNulls && obj[key] === null) {
      continue;
    }
    push_to_array(keys, inner_stringify(
      obj[key],
      key,
      // @ts-expect-error
      generateArrayPrefix,
      commaRoundTrip,
      options.allowEmptyArrays,
      options.strictNullHandling,
      options.skipNulls,
      options.encodeDotInKeys,
      options.encode ? options.encoder : null,
      options.filter,
      options.sort,
      options.allowDots,
      options.serializeDate,
      options.format,
      options.formatter,
      options.encodeValuesOnly,
      options.charset,
      sideChannel
    ));
  }
  const joined = keys.join(options.delimiter);
  let prefix = options.addQueryPrefix === true ? "?" : "";
  if (options.charsetSentinel) {
    if (options.charset === "iso-8859-1") {
      prefix += "utf8=%26%2310003%3B&";
    } else {
      prefix += "utf8=%E2%9C%93&";
    }
  }
  return joined.length > 0 ? prefix + joined : "";
}
var array_prefix_generators, push_to_array, toISOString, defaults, sentinel;
var init_stringify = __esm({
  "node_modules/@anthropic-ai/sdk/internal/qs/stringify.mjs"() {
    init_utils();
    init_formats();
    init_values();
    array_prefix_generators = {
      brackets(prefix) {
        return String(prefix) + "[]";
      },
      comma: "comma",
      indices(prefix, key) {
        return String(prefix) + "[" + key + "]";
      },
      repeat(prefix) {
        return String(prefix);
      }
    };
    push_to_array = function(arr, value_or_array) {
      Array.prototype.push.apply(arr, isArray(value_or_array) ? value_or_array : [value_or_array]);
    };
    defaults = {
      addQueryPrefix: false,
      allowDots: false,
      allowEmptyArrays: false,
      arrayFormat: "indices",
      charset: "utf-8",
      charsetSentinel: false,
      delimiter: "&",
      encode: true,
      encodeDotInKeys: false,
      encoder: encode,
      encodeValuesOnly: false,
      format: default_format,
      formatter: default_formatter,
      /** @deprecated */
      indices: false,
      serializeDate(date) {
        return (toISOString ?? (toISOString = Function.prototype.call.bind(Date.prototype.toISOString)))(date);
      },
      skipNulls: false,
      strictNullHandling: false
    };
    sentinel = {};
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/query.mjs
function stringifyQuery(query) {
  return stringify(query, { arrayFormat: "brackets" });
}
var init_query = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/query.mjs"() {
    init_stringify();
  }
});

// node_modules/@anthropic-ai/sdk/lib/credentials/types.mjs
function requireSecureTokenEndpoint(baseURL) {
  if (!baseURL)
    return;
  let u;
  try {
    u = new URL(baseURL);
  } catch (err) {
    throw new WorkloadIdentityError(`Invalid token endpoint base URL "${baseURL}": ${err}`);
  }
  if (u.protocol === "https:")
    return;
  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (u.protocol === "http:" && (host === "localhost" || host === "127.0.0.1" || host === "::1")) {
    return;
  }
  throw new WorkloadIdentityError(`Refusing to send credential over non-https token endpoint "${baseURL}"`);
}
async function parseTokenResponse(resp, requestId) {
  const text = await readLimitedText(resp);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new WorkloadIdentityError(`Token endpoint returned non-JSON response (status ${resp.status})`, resp.status, redactSensitive(text), requestId);
  }
  if (!data.access_token) {
    throw new WorkloadIdentityError(`Token endpoint response missing access_token: ${JSON.stringify(redactSensitive(data))}`, resp.status, redactSensitive(data), requestId);
  }
  if (data.token_type && data.token_type.toLowerCase() !== "bearer") {
    throw new WorkloadIdentityError(`Token endpoint response: unsupported token_type "${data.token_type}" (want Bearer)`, resp.status, redactSensitive(data), requestId);
  }
  return data;
}
function redactSensitive(body) {
  if (body == null)
    return body;
  if (typeof body === "string") {
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      if (body.length <= MAX_ERROR_BODY_CHARS)
        return body;
      return body.slice(0, MAX_ERROR_BODY_CHARS) + `... <${body.length - MAX_ERROR_BODY_CHARS} more chars>`;
    }
    return JSON.stringify(redactSensitive(parsed));
  }
  if (typeof body === "object" && !Array.isArray(body)) {
    const out = {};
    for (const [k, v] of Object.entries(body)) {
      if (SAFE_ERROR_KEYS.has(k))
        out[k] = v;
    }
    return out;
  }
  return null;
}
async function checkCredentialsFileSafety(path5, onWarn = (m) => console.warn(`anthropic-sdk: ${m}`)) {
  if (typeof process === "undefined" || process.platform === "win32")
    return;
  const fs4 = await import("node:fs");
  let resolved = path5;
  let st;
  try {
    resolved = await fs4.promises.realpath(path5);
    st = await fs4.promises.stat(resolved);
  } catch {
    return;
  }
  const mode = st.mode & 511;
  if (mode & 18) {
    throw new WorkloadIdentityError(`Credentials file at ${resolved} is group/world-writable (mode 0o${mode.toString(8)}); this allows other local users to plant tokens. Run \`chmod 600 ${resolved}\`.`);
  }
  if (mode & 36) {
    throw new WorkloadIdentityError(`Credentials file at ${resolved} is group/world-readable (mode 0o${mode.toString(8)}); run \`chmod 600 ${resolved}\` before retrying.`);
  }
  if (typeof process.getuid === "function" && st.uid !== process.getuid()) {
    onWarn(`credentials file at ${resolved} is owned by uid ${st.uid} (current process uid ${process.getuid()}); verify this is intentional.`);
  }
}
async function writeCredentialsFileAtomic(targetPath, data) {
  const fs4 = await import("node:fs");
  const path5 = await import("node:path");
  const dir = path5.dirname(targetPath);
  await fs4.promises.mkdir(dir, { recursive: true, mode: 448 });
  const tmpPath = `${targetPath}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
  try {
    const fh = await fs4.promises.open(tmpPath, "w", 384);
    try {
      await fh.writeFile(JSON.stringify(data, null, 2));
      await fh.sync();
    } finally {
      await fh.close();
    }
    await fs4.promises.rename(tmpPath, targetPath);
  } catch (err) {
    await fs4.promises.unlink(tmpPath).catch(() => {
    });
    throw err;
  }
  try {
    const dirFh = await fs4.promises.open(dir, "r");
    try {
      await dirFh.sync();
    } finally {
      await dirFh.close();
    }
  } catch {
  }
}
async function readLimitedText(resp) {
  if (!resp.body) {
    return "";
  }
  const reader = resp.body.getReader();
  const chunks = [];
  let received = 0;
  for (; ; ) {
    const { done, value } = await reader.read();
    if (done)
      break;
    if (received + value.length > MAX_TOKEN_RESPONSE_BYTES) {
      const remaining = MAX_TOKEN_RESPONSE_BYTES - received;
      if (remaining > 0)
        chunks.push(value.subarray(0, remaining));
      await reader.cancel();
      break;
    }
    chunks.push(value);
    received += value.length;
  }
  let merged;
  if (chunks.length === 1) {
    merged = chunks[0];
  } else {
    merged = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
    let offset = 0;
    for (const c of chunks) {
      merged.set(c, offset);
      offset += c.length;
    }
  }
  return new TextDecoder("utf-8").decode(merged);
}
var GRANT_TYPE_JWT_BEARER, GRANT_TYPE_REFRESH_TOKEN, TOKEN_ENDPOINT, OAUTH_API_BETA_HEADER, FEDERATION_BETA_HEADER, ADVISORY_REFRESH_THRESHOLD_IN_SECONDS, MANDATORY_REFRESH_THRESHOLD_IN_SECONDS, ADVISORY_REFRESH_BACKOFF_IN_SECONDS, MAX_TOKEN_RESPONSE_BYTES, MAX_ERROR_BODY_CHARS, SAFE_ERROR_KEYS, WorkloadIdentityError;
var init_types = __esm({
  "node_modules/@anthropic-ai/sdk/lib/credentials/types.mjs"() {
    init_error();
    GRANT_TYPE_JWT_BEARER = "urn:ietf:params:oauth:grant-type:jwt-bearer";
    GRANT_TYPE_REFRESH_TOKEN = "refresh_token";
    TOKEN_ENDPOINT = "/v1/oauth/token";
    OAUTH_API_BETA_HEADER = "oauth-2025-04-20";
    FEDERATION_BETA_HEADER = "oidc-federation-2026-04-01";
    ADVISORY_REFRESH_THRESHOLD_IN_SECONDS = 120;
    MANDATORY_REFRESH_THRESHOLD_IN_SECONDS = 30;
    ADVISORY_REFRESH_BACKOFF_IN_SECONDS = 5;
    MAX_TOKEN_RESPONSE_BYTES = 1 << 20;
    MAX_ERROR_BODY_CHARS = 2e3;
    SAFE_ERROR_KEYS = /* @__PURE__ */ new Set(["error", "error_description", "error_uri"]);
    WorkloadIdentityError = class extends AnthropicError {
      constructor(message, statusCode = null, body = null, requestId = null) {
        super(message);
        this.statusCode = statusCode;
        this.body = body;
        this.requestId = requestId;
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/time.mjs
function nowAsSeconds() {
  return Math.floor(Date.now() / 1e3);
}
var init_time = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/time.mjs"() {
  }
});

// node_modules/@anthropic-ai/sdk/lib/credentials/token-cache.mjs
var TokenCache;
var init_token_cache = __esm({
  "node_modules/@anthropic-ai/sdk/lib/credentials/token-cache.mjs"() {
    init_types();
    init_time();
    TokenCache = class {
      constructor(provider, onAdvisoryRefreshError) {
        this.cached = null;
        this.pendingRefresh = null;
        this.nextForce = false;
        this.lastAdvisoryError = 0;
        this.provider = provider;
        this.onAdvisoryRefreshError = onAdvisoryRefreshError;
      }
      async getToken() {
        const force = this.nextForce;
        this.nextForce = false;
        const cached = this.cached;
        if (force || cached == null) {
          const token2 = await this.refresh(force);
          return token2.token;
        }
        if (cached.expiresAt == null) {
          return cached.token;
        }
        const remaining = cached.expiresAt - nowAsSeconds();
        if (remaining > ADVISORY_REFRESH_THRESHOLD_IN_SECONDS) {
          return cached.token;
        }
        if (remaining > MANDATORY_REFRESH_THRESHOLD_IN_SECONDS) {
          this.backgroundRefresh();
          return cached.token;
        }
        const token = await this.refresh();
        return token.token;
      }
      /**
       * Clears the cached token and marks the next {@link getToken} as a forced
       * refresh, so the underlying provider bypasses any on-disk freshness check.
       * Called after a 401 — the server has just told us the token is bad even
       * if its `expires_at` still looks fresh.
       */
      invalidate() {
        this.cached = null;
        this.nextForce = true;
      }
      /**
       * Mandatory refresh. Joins any in-flight refresh unless forced — a forced
       * refresh must not coalesce into a non-forced one that may re-serve the
       * same stale disk token.
       */
      refresh(force = false) {
        if (this.pendingRefresh && !force) {
          return this.pendingRefresh;
        }
        return this.doRefresh(force);
      }
      /**
       * Advisory background refresh. Shares the same in-flight promise as
       * mandatory refreshes for deduplication, but swallows errors so the
       * stale cached token keeps being served. Backs off for
       * {@link ADVISORY_REFRESH_BACKOFF_IN_SECONDS} after a failure so an
       * outage during the advisory window doesn't hammer the token endpoint.
       */
      backgroundRefresh() {
        if (this.pendingRefresh) {
          return;
        }
        if (nowAsSeconds() - this.lastAdvisoryError < ADVISORY_REFRESH_BACKOFF_IN_SECONDS) {
          return;
        }
        this.doRefresh().catch((err) => {
          this.lastAdvisoryError = nowAsSeconds();
          this.onAdvisoryRefreshError?.(err);
        });
      }
      /**
       * Core refresh. Sets {@link pendingRefresh} so concurrent callers
       * (both advisory and mandatory) coalesce into a single provider call.
       */
      doRefresh(force = false) {
        this.pendingRefresh = this.provider(force ? { forceRefresh: true } : void 0).then((token) => {
          this.cached = token;
          this.pendingRefresh = null;
          return token;
        }, (err) => {
          this.pendingRefresh = null;
          throw err;
        });
        return this.pendingRefresh;
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/env.mjs
var readEnv;
var init_env = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/env.mjs"() {
    readEnv = (env) => {
      if (typeof globalThis.process !== "undefined") {
        return globalThis.process.env?.[env]?.trim() || void 0;
      }
      if (typeof globalThis.Deno !== "undefined") {
        return globalThis.Deno.env?.get?.(env)?.trim() || void 0;
      }
      return void 0;
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/bytes.mjs
function concatBytes(buffers) {
  let length = 0;
  for (const buffer of buffers) {
    length += buffer.length;
  }
  const output = new Uint8Array(length);
  let index = 0;
  for (const buffer of buffers) {
    output.set(buffer, index);
    index += buffer.length;
  }
  return output;
}
function encodeUTF8(str3) {
  let encoder;
  return (encodeUTF8_ ?? (encoder = new globalThis.TextEncoder(), encodeUTF8_ = encoder.encode.bind(encoder)))(str3);
}
function decodeUTF8(bytes) {
  let decoder;
  return (decodeUTF8_ ?? (decoder = new globalThis.TextDecoder(), decodeUTF8_ = decoder.decode.bind(decoder)))(bytes);
}
var encodeUTF8_, decodeUTF8_;
var init_bytes = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/bytes.mjs"() {
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/base64.mjs
var init_base64 = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/base64.mjs"() {
    init_error();
    init_bytes();
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/log.mjs
function noop() {
}
function makeLogFn(fnLevel, logger, logLevel) {
  if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) {
    return noop;
  } else {
    return logger[fnLevel].bind(logger);
  }
}
function loggerFor(client) {
  const logger = client.logger;
  const logLevel = client.logLevel ?? "off";
  if (!logger) {
    return noopLogger;
  }
  const cachedLogger = cachedLoggers.get(logger);
  if (cachedLogger && cachedLogger[0] === logLevel) {
    return cachedLogger[1];
  }
  const levelLogger = {
    error: makeLogFn("error", logger, logLevel),
    warn: makeLogFn("warn", logger, logLevel),
    info: makeLogFn("info", logger, logLevel),
    debug: makeLogFn("debug", logger, logLevel)
  };
  cachedLoggers.set(logger, [logLevel, levelLogger]);
  return levelLogger;
}
var levelNumbers, parseLogLevel, noopLogger, cachedLoggers, formatRequestDetails;
var init_log = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/log.mjs"() {
    init_values();
    levelNumbers = {
      off: 0,
      error: 200,
      warn: 300,
      info: 400,
      debug: 500
    };
    parseLogLevel = (maybeLevel, sourceName, client) => {
      if (!maybeLevel) {
        return void 0;
      }
      if (hasOwn(levelNumbers, maybeLevel)) {
        return maybeLevel;
      }
      loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
      return void 0;
    };
    noopLogger = {
      error: noop,
      warn: noop,
      info: noop,
      debug: noop
    };
    cachedLoggers = /* @__PURE__ */ new WeakMap();
    formatRequestDetails = (details) => {
      if (details.options) {
        details.options = { ...details.options };
        delete details.options["headers"];
      }
      if (details.headers) {
        details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [
          name,
          name.toLowerCase() === "authorization" || name.toLowerCase() === "api-key" || name.toLowerCase() === "x-api-key" || name.toLowerCase() === "cookie" || name.toLowerCase() === "set-cookie" ? "***" : value
        ]));
      }
      if ("retryOfRequestLogID" in details) {
        if (details.retryOfRequestLogID) {
          details.retryOf = details.retryOfRequestLogID;
        }
        delete details.retryOfRequestLogID;
      }
      return details;
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils.mjs
var init_utils2 = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils.mjs"() {
    init_values();
    init_base64();
    init_env();
    init_log();
    init_uuid();
    init_sleep();
    init_query();
  }
});

// node_modules/@anthropic-ai/sdk/core/credentials.mjs
function validateProfileName(name) {
  if (!name) {
    throw new Error("profile name is empty");
  }
  if (name === "." || name === "..") {
    throw new Error(`profile name "${name}" is not allowed`);
  }
  if (name.includes("/") || name.includes("\\")) {
    throw new Error(`profile name "${name}" must not contain path separators`);
  }
  if (!PROFILE_NAME_PATTERN.test(name)) {
    throw new Error(`profile name "${name}" contains disallowed characters (allowed: letters, digits, '_', '.', '-')`);
  }
}
var CREDENTIALS_FILE_VERSION, PROFILE_NAME_PATTERN, loadConfigWithSource, getCredentialsPath, getRootConfigPath, supportsLocalConfigFiles, getActiveProfileName;
var init_credentials = __esm({
  "node_modules/@anthropic-ai/sdk/core/credentials.mjs"() {
    init_detect_platform();
    init_utils2();
    CREDENTIALS_FILE_VERSION = "1.0";
    PROFILE_NAME_PATTERN = /^[A-Za-z0-9_.-]+$/;
    loadConfigWithSource = async (profile) => {
      var _a2, _b;
      const rootConfigPath = await getRootConfigPath();
      if (rootConfigPath === null) {
        return null;
      }
      const profileName = profile ?? await getActiveProfileName();
      if (profileName === null) {
        return null;
      }
      validateProfileName(profileName);
      const fs4 = await import("node:fs");
      const path5 = await import("node:path");
      const configPath2 = path5.join(rootConfigPath, "configs", `${profileName}.json`);
      let configRaw;
      try {
        configRaw = await fs4.promises.readFile(configPath2, "utf-8");
      } catch (err) {
        if (err?.code !== "ENOENT") {
          throw new Error(`failed to read config file ${configPath2}: ${err}`);
        }
        configRaw = null;
      }
      if (configRaw === null) {
        const organizationId = readEnv("ANTHROPIC_ORGANIZATION_ID");
        const identityTokenFile = readEnv("ANTHROPIC_IDENTITY_TOKEN_FILE");
        const federationRuleId = readEnv("ANTHROPIC_FEDERATION_RULE_ID");
        if (federationRuleId && organizationId) {
          return {
            fromFile: false,
            config: {
              organization_id: organizationId,
              // A defaulted-but-empty CI variable (`ANTHROPIC_WORKSPACE_ID=""`) is
              // treated as unset — readEnv coerces empty to undefined, and the body
              // builder's truthy check skips it — so `"workspace_id": ""` never goes
              // on the wire.
              workspace_id: readEnv("ANTHROPIC_WORKSPACE_ID"),
              base_url: readEnv("ANTHROPIC_BASE_URL"),
              authentication: {
                type: "oidc_federation",
                federation_rule_id: federationRuleId,
                service_account_id: readEnv("ANTHROPIC_SERVICE_ACCOUNT_ID"),
                identity_token: identityTokenFile ? { source: "file", path: identityTokenFile } : void 0,
                scope: readEnv("ANTHROPIC_SCOPE")
              }
            }
          };
        }
        return null;
      }
      let config;
      try {
        config = JSON.parse(configRaw);
      } catch (err) {
        throw new Error(`failed to parse config file ${configPath2}: ${err}`);
      }
      if (!config.authentication) {
        throw new Error(`config file ${configPath2} is missing "authentication"`);
      }
      const authType = config.authentication.type;
      if (authType !== "oidc_federation" && authType !== "user_oauth") {
        throw new Error(`authentication.type "${authType}" is not a known authentication type`);
      }
      config.organization_id ?? (config.organization_id = readEnv("ANTHROPIC_ORGANIZATION_ID"));
      config.workspace_id ?? (config.workspace_id = readEnv("ANTHROPIC_WORKSPACE_ID"));
      config.base_url ?? (config.base_url = readEnv("ANTHROPIC_BASE_URL"));
      (_a2 = config.authentication).scope ?? (_a2.scope = readEnv("ANTHROPIC_SCOPE"));
      if (config.authentication.type === "oidc_federation") {
        if (!config.authentication.identity_token) {
          const identityTokenFile = readEnv("ANTHROPIC_IDENTITY_TOKEN_FILE");
          if (identityTokenFile) {
            config.authentication.identity_token = {
              source: "file",
              path: identityTokenFile
            };
          }
        }
        if (!config.authentication.federation_rule_id) {
          config.authentication.federation_rule_id = readEnv("ANTHROPIC_FEDERATION_RULE_ID") ?? "";
        }
        (_b = config.authentication).service_account_id ?? (_b.service_account_id = readEnv("ANTHROPIC_SERVICE_ACCOUNT_ID"));
      }
      return { config, fromFile: true };
    };
    getCredentialsPath = async (config, profile) => {
      if (config?.authentication.credentials_path) {
        return config.authentication.credentials_path;
      }
      const rootConfigPath = await getRootConfigPath();
      if (!rootConfigPath) {
        return null;
      }
      const profileName = profile ?? await getActiveProfileName();
      if (!profileName) {
        return null;
      }
      validateProfileName(profileName);
      const path5 = await import("node:path");
      return path5.join(rootConfigPath, "credentials", `${profileName}.json`);
    };
    getRootConfigPath = async () => {
      if (!supportsLocalConfigFiles()) {
        return null;
      }
      const path5 = await import("node:path");
      const configDir3 = readEnv("ANTHROPIC_CONFIG_DIR");
      if (configDir3) {
        return configDir3;
      }
      const os = getPlatformHeaders()["X-Stainless-OS"];
      if (os === "Windows") {
        const appData = readEnv("APPDATA");
        if (appData) {
          return path5.join(appData, "Anthropic");
        }
        const userProfile = readEnv("USERPROFILE");
        if (userProfile) {
          return path5.join(userProfile, "AppData", "Roaming", "Anthropic");
        }
        return null;
      }
      const xdgConfigHome = readEnv("XDG_CONFIG_HOME");
      if (xdgConfigHome) {
        return path5.join(xdgConfigHome, "anthropic");
      }
      const home = readEnv("HOME");
      if (home) {
        return path5.join(home, ".config", "anthropic");
      }
      return null;
    };
    supportsLocalConfigFiles = () => {
      const runtime = getPlatformHeaders()["X-Stainless-Runtime"];
      return runtime === "node" || runtime === "deno";
    };
    getActiveProfileName = async () => {
      const rootConfigPath = await getRootConfigPath();
      if (!rootConfigPath) {
        return null;
      }
      const profileName = readEnv("ANTHROPIC_PROFILE");
      if (profileName) {
        return profileName;
      }
      const fs4 = await import("node:fs");
      const path5 = await import("node:path");
      const filePath = path5.join(rootConfigPath, "active_config");
      try {
        return (await fs4.promises.readFile(filePath, "utf-8")).trim() || "default";
      } catch (err) {
        if (err?.code !== "ENOENT") {
          throw new Error(`failed to read ${filePath}: ${err}`);
        }
        return "default";
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/lib/credentials/identity-token.mjs
function identityTokenFromFile(path5) {
  if (!path5) {
    throw new AnthropicError("Identity token file path is empty");
  }
  return async () => {
    const fs4 = await import("node:fs");
    let content;
    try {
      content = await fs4.promises.readFile(path5, "utf-8");
    } catch (err) {
      throw new AnthropicError(`Failed to read identity token file at ${path5}: ${err}`);
    }
    const token = content.trim();
    if (!token) {
      throw new AnthropicError(`Identity token file at ${path5} is empty`);
    }
    return token;
  };
}
function identityTokenFromValue(token) {
  if (!token) {
    throw new AnthropicError("Identity token value is empty");
  }
  return () => token;
}
var init_identity_token = __esm({
  "node_modules/@anthropic-ai/sdk/lib/credentials/identity-token.mjs"() {
    init_error();
  }
});

// node_modules/@anthropic-ai/sdk/lib/credentials/oidc-federation.mjs
function oidcFederationProvider(config) {
  return async () => {
    requireSecureTokenEndpoint(config.baseURL);
    const jwt = await config.identityTokenProvider();
    if (jwt.length > 16 * 1024) {
      throw new WorkloadIdentityError(`Identity token is ${Math.ceil(jwt.length / 1024)} KiB, exceeds the 16 KiB assertion limit`);
    }
    const body = {
      grant_type: GRANT_TYPE_JWT_BEARER,
      assertion: jwt,
      federation_rule_id: config.federationRuleId,
      organization_id: config.organizationId
    };
    if (config.serviceAccountId) {
      body["service_account_id"] = config.serviceAccountId;
    }
    if (config.workspaceId) {
      body["workspace_id"] = config.workspaceId;
    }
    const url = `${config.baseURL}${TOKEN_ENDPOINT}`;
    let resp;
    try {
      resp = await config.fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-beta": `${OAUTH_API_BETA_HEADER},${FEDERATION_BETA_HEADER}`,
          "User-Agent": config.userAgent || `anthropic-sdk-typescript/${VERSION} oidcFederationProvider`
        },
        body: JSON.stringify(body)
      });
    } catch (err) {
      throw new WorkloadIdentityError(`Failed to reach token endpoint ${url}: ${err}`);
    }
    const requestId = resp.headers.get("Request-Id");
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      const redacted = redactSensitive(text);
      let hint = "";
      if (resp.status === 401) {
        const hintMiddle = config.workspaceId ? "" : "If your federation rule is scoped to multiple workspaces, set the ANTHROPIC_WORKSPACE_ID environment variable, the 'workspace_id' config key, or the `workspaceId` option. ";
        hint = ` Ensure your federation rule matches your identity token. ${hintMiddle}View your authentication events in the Workload identity page of Claude Console for more details.`;
      }
      throw new WorkloadIdentityError(`Token exchange failed with status ${resp.status}${requestId ? ` (request-id ${requestId})` : ""}: ${redacted}${hint}`, resp.status, redacted, requestId);
    }
    const data = await parseTokenResponse(resp, requestId);
    const expiresIn = Number(data.expires_in);
    if (!Number.isFinite(expiresIn)) {
      throw new WorkloadIdentityError(`Token endpoint response missing required fields: ${JSON.stringify(redactSensitive(data))}`, resp.status, redactSensitive(data), requestId);
    }
    return {
      token: data.access_token,
      expiresAt: nowAsSeconds() + expiresIn
    };
  };
}
var init_oidc_federation = __esm({
  "node_modules/@anthropic-ai/sdk/lib/credentials/oidc-federation.mjs"() {
    init_types();
    init_time();
    init_version();
  }
});

// node_modules/@anthropic-ai/sdk/lib/credentials/user-oauth.mjs
function userOAuthProvider(config) {
  return async (opts) => {
    const fs4 = await import("node:fs");
    await checkCredentialsFileSafety(config.credentialsPath, config.onSafetyWarning);
    let raw;
    try {
      raw = await fs4.promises.readFile(config.credentialsPath, "utf-8");
    } catch (err) {
      throw new WorkloadIdentityError(`Credentials file not found at ${config.credentialsPath}: ${err}`);
    }
    let creds;
    try {
      creds = JSON.parse(raw);
    } catch (err) {
      throw new WorkloadIdentityError(`Credentials file at ${config.credentialsPath} is not valid JSON: ${err}`);
    }
    const accessToken = creds.access_token;
    if (!accessToken) {
      throw new WorkloadIdentityError(`Credentials file at ${config.credentialsPath} must include 'access_token'`);
    }
    const expiresAt = creds.expires_at;
    if (!opts?.forceRefresh && (expiresAt == null || nowAsSeconds() < expiresAt - MANDATORY_REFRESH_THRESHOLD_IN_SECONDS)) {
      return { token: accessToken, expiresAt: expiresAt ?? null };
    }
    const refreshToken = creds.refresh_token;
    if (!config.clientId || !refreshToken) {
      throw new WorkloadIdentityError(`Access token at ${config.credentialsPath} has expired and no refresh is available (client_id ${config.clientId ? "set" : "empty"}, refresh_token ${refreshToken ? "set" : "empty"})`);
    }
    requireSecureTokenEndpoint(config.baseURL);
    const body = {
      grant_type: GRANT_TYPE_REFRESH_TOKEN,
      refresh_token: refreshToken,
      client_id: config.clientId
    };
    const url = `${config.baseURL}${TOKEN_ENDPOINT}`;
    let resp;
    try {
      resp = await config.fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-beta": OAUTH_API_BETA_HEADER,
          "User-Agent": config.userAgent || `anthropic-sdk-typescript/${VERSION} userOAuthProvider`
        },
        body: JSON.stringify(body)
      });
    } catch (err) {
      throw new WorkloadIdentityError(`User OAuth refresh failed to reach token endpoint: ${err}`);
    }
    const requestId = resp.headers.get("Request-Id");
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new WorkloadIdentityError(`User OAuth refresh failed (HTTP ${resp.status}): ${redactSensitive(text)}`, resp.status, redactSensitive(text), requestId);
    }
    const data = await parseTokenResponse(resp, requestId);
    const expiresIn = Number(data.expires_in);
    if (!Number.isFinite(expiresIn)) {
      throw new WorkloadIdentityError(`User OAuth refresh response missing or invalid expires_in: ${JSON.stringify(redactSensitive(data))}`, resp.status, redactSensitive(data), requestId);
    }
    const newExpiresAt = nowAsSeconds() + expiresIn;
    const newRefreshToken = data.refresh_token || refreshToken;
    await writeCredentialsFileAtomic(config.credentialsPath, {
      ...creds,
      version: CREDENTIALS_FILE_VERSION,
      type: "oauth_token",
      access_token: data.access_token,
      expires_at: newExpiresAt,
      refresh_token: newRefreshToken
    });
    return { token: data.access_token, expiresAt: newExpiresAt };
  };
}
var init_user_oauth = __esm({
  "node_modules/@anthropic-ai/sdk/lib/credentials/user-oauth.mjs"() {
    init_credentials();
    init_types();
    init_time();
    init_version();
  }
});

// node_modules/@anthropic-ai/sdk/lib/credentials/credential-chain.mjs
function resolveCredentialsFromConfig(config, options) {
  const credentialsPath = config.authentication.credentials_path ?? null;
  const effectiveBaseURL = (config.base_url || options.baseURL).replace(/\/+$/, "");
  const provider = buildProvider(config, credentialsPath, effectiveBaseURL, options);
  const extraHeaders = {};
  if (config.workspace_id && config.authentication.type === "user_oauth") {
    extraHeaders["anthropic-workspace-id"] = config.workspace_id;
  }
  return { provider, extraHeaders, baseURL: config.base_url || void 0 };
}
async function defaultCredentials(options, profile) {
  const loaded = await loadConfigWithSource(profile);
  if (!loaded) {
    return null;
  }
  const { config, fromFile } = loaded;
  const withPath = config.authentication.credentials_path || !fromFile ? config : {
    ...config,
    authentication: {
      ...config.authentication,
      credentials_path: await getCredentialsPath(config, profile) ?? void 0
    }
  };
  return resolveCredentialsFromConfig(withPath, options);
}
function buildProvider(config, credentialsPath, baseURL, options) {
  switch (config.authentication.type) {
    case "oidc_federation": {
      const auth = config.authentication;
      const identityProvider = resolveIdentityTokenProvider(auth);
      if (!identityProvider) {
        throw new WorkloadIdentityError("oidc_federation config requires an identity token (set authentication.identity_token, ANTHROPIC_IDENTITY_TOKEN_FILE, or ANTHROPIC_IDENTITY_TOKEN)");
      }
      if (!auth.federation_rule_id) {
        throw new WorkloadIdentityError("oidc_federation config requires 'federation_rule_id'. Set it in authentication.federation_rule_id in your profile, or via ANTHROPIC_FEDERATION_RULE_ID (profile takes precedence).");
      }
      if (!config.organization_id) {
        throw new WorkloadIdentityError("oidc_federation config requires organization_id (set ANTHROPIC_ORGANIZATION_ID or config.organization_id)");
      }
      const exchange = oidcFederationProvider({
        identityTokenProvider: identityProvider,
        federationRuleId: auth.federation_rule_id,
        organizationId: config.organization_id,
        serviceAccountId: auth.service_account_id,
        workspaceId: config.workspace_id,
        baseURL,
        fetch: options.fetch,
        userAgent: options.userAgent
      });
      if (credentialsPath) {
        return cachedExchangeProvider(exchange, credentialsPath, options.onCacheWriteError, options.onSafetyWarning);
      }
      return exchange;
    }
    case "user_oauth": {
      if (!credentialsPath) {
        throw new WorkloadIdentityError("user_oauth config requires authentication.credentials_path (or load via a profile so it defaults to <config_dir>/credentials/<profile>.json)");
      }
      return userOAuthProvider({
        credentialsPath,
        clientId: config.authentication.client_id,
        baseURL,
        fetch: options.fetch,
        userAgent: options.userAgent,
        onSafetyWarning: options.onSafetyWarning
      });
    }
    default: {
      const t = config.authentication.type;
      throw new WorkloadIdentityError(`authentication.type "${t}" is not a known authentication type`);
    }
  }
}
function resolveIdentityTokenProvider(auth) {
  if (auth.identity_token) {
    const source = auth.identity_token.source;
    if (source !== "file") {
      throw new WorkloadIdentityError(`identity_token.source "${source}" is not supported by this SDK version (only "file")`);
    }
    if (!auth.identity_token.path) {
      throw new WorkloadIdentityError(`identity_token.source "file" requires a non-empty path`);
    }
    return identityTokenFromFile(auth.identity_token.path);
  }
  const tokenFile = readEnv("ANTHROPIC_IDENTITY_TOKEN_FILE");
  if (tokenFile) {
    return identityTokenFromFile(tokenFile);
  }
  const tokenValue = readEnv("ANTHROPIC_IDENTITY_TOKEN");
  if (tokenValue) {
    return identityTokenFromValue(tokenValue);
  }
  return null;
}
function cachedExchangeProvider(exchange, credentialsPath, onCacheWriteError, onSafetyWarning) {
  return async (opts) => {
    const fs4 = await import("node:fs");
    await checkCredentialsFileSafety(credentialsPath, onSafetyWarning);
    let existing;
    try {
      const raw = await fs4.promises.readFile(credentialsPath, "utf-8");
      existing = JSON.parse(raw);
      const token = existing?.["access_token"];
      if (token && !opts?.forceRefresh) {
        const expiresAt = existing?.["expires_at"];
        if (expiresAt == null || nowAsSeconds() < expiresAt - MANDATORY_REFRESH_THRESHOLD_IN_SECONDS) {
          return { token, expiresAt: expiresAt ?? null };
        }
      }
    } catch (err) {
      const code = err?.code;
      if (code !== "ENOENT" && !(err instanceof SyntaxError)) {
        onCacheWriteError?.(err);
      }
    }
    const result = await exchange(opts);
    try {
      await writeCredentialsFileAtomic(credentialsPath, {
        ...existing ?? {},
        version: CREDENTIALS_FILE_VERSION,
        type: "oauth_token",
        access_token: result.token,
        expires_at: result.expiresAt
      });
    } catch (err) {
      onCacheWriteError?.(err);
    }
    return result;
  };
}
var init_credential_chain = __esm({
  "node_modules/@anthropic-ai/sdk/lib/credentials/credential-chain.mjs"() {
    init_env();
    init_credentials();
    init_types();
    init_time();
    init_identity_token();
    init_oidc_federation();
    init_user_oauth();
  }
});

// node_modules/@anthropic-ai/sdk/internal/decoders/line.mjs
function findNewlineIndex(buffer, startIndex) {
  const newline = 10;
  const carriage = 13;
  for (let i = startIndex ?? 0; i < buffer.length; i++) {
    if (buffer[i] === newline) {
      return { preceding: i, index: i + 1, carriage: false };
    }
    if (buffer[i] === carriage) {
      return { preceding: i, index: i + 1, carriage: true };
    }
  }
  return null;
}
function findDoubleNewlineIndex(buffer) {
  const newline = 10;
  const carriage = 13;
  for (let i = 0; i < buffer.length - 1; i++) {
    if (buffer[i] === newline && buffer[i + 1] === newline) {
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === carriage) {
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) {
      return i + 4;
    }
  }
  return -1;
}
var _LineDecoder_buffer, _LineDecoder_carriageReturnIndex, LineDecoder;
var init_line = __esm({
  "node_modules/@anthropic-ai/sdk/internal/decoders/line.mjs"() {
    init_tslib();
    init_bytes();
    LineDecoder = class {
      constructor() {
        _LineDecoder_buffer.set(this, void 0);
        _LineDecoder_carriageReturnIndex.set(this, void 0);
        __classPrivateFieldSet(this, _LineDecoder_buffer, new Uint8Array(), "f");
        __classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
      }
      decode(chunk) {
        if (chunk == null) {
          return [];
        }
        const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? encodeUTF8(chunk) : chunk;
        __classPrivateFieldSet(this, _LineDecoder_buffer, concatBytes([__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), binaryChunk]), "f");
        const lines = [];
        let patternIndex;
        while ((patternIndex = findNewlineIndex(__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f"))) != null) {
          if (patternIndex.carriage && __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") == null) {
            __classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, patternIndex.index, "f");
            continue;
          }
          if (__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") != null && (patternIndex.index !== __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") + 1 || patternIndex.carriage)) {
            lines.push(decodeUTF8(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") - 1)));
            __classPrivateFieldSet(this, _LineDecoder_buffer, __classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f")), "f");
            __classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
            continue;
          }
          const endIndex = __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") !== null ? patternIndex.preceding - 1 : patternIndex.preceding;
          const line = decodeUTF8(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, endIndex));
          lines.push(line);
          __classPrivateFieldSet(this, _LineDecoder_buffer, __classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(patternIndex.index), "f");
          __classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
        }
        return lines;
      }
      flush() {
        if (!__classPrivateFieldGet(this, _LineDecoder_buffer, "f").length) {
          return [];
        }
        return this.decode("\n");
      }
    };
    _LineDecoder_buffer = /* @__PURE__ */ new WeakMap(), _LineDecoder_carriageReturnIndex = /* @__PURE__ */ new WeakMap();
    LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
    LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
  }
});

// node_modules/@anthropic-ai/sdk/core/streaming.mjs
async function* _iterSSEMessages(response, controller) {
  if (!response.body) {
    controller.abort();
    if (typeof globalThis.navigator !== "undefined" && globalThis.navigator.product === "ReactNative") {
      throw new AnthropicError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
    }
    throw new AnthropicError(`Attempted to iterate over a response with no body`);
  }
  const sseDecoder = new SSEDecoder();
  const lineDecoder = new LineDecoder();
  const iter = ReadableStreamToAsyncIterable(response.body);
  for await (const sseChunk of iterSSEChunks(iter)) {
    for (const line of lineDecoder.decode(sseChunk)) {
      const sse = sseDecoder.decode(line);
      if (sse)
        yield sse;
    }
  }
  for (const line of lineDecoder.flush()) {
    const sse = sseDecoder.decode(line);
    if (sse)
      yield sse;
  }
}
async function* iterSSEChunks(iterator) {
  let data = new Uint8Array();
  for await (const chunk of iterator) {
    if (chunk == null) {
      continue;
    }
    const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? encodeUTF8(chunk) : chunk;
    let newData = new Uint8Array(data.length + binaryChunk.length);
    newData.set(data);
    newData.set(binaryChunk, data.length);
    data = newData;
    let patternIndex;
    while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
      yield data.slice(0, patternIndex);
      data = data.slice(patternIndex);
    }
  }
  if (data.length > 0) {
    yield data;
  }
}
function partition(str3, delimiter3) {
  const index = str3.indexOf(delimiter3);
  if (index !== -1) {
    return [str3.substring(0, index), delimiter3, str3.substring(index + delimiter3.length)];
  }
  return [str3, "", ""];
}
var _Stream_client, Stream, SSEDecoder;
var init_streaming = __esm({
  "node_modules/@anthropic-ai/sdk/core/streaming.mjs"() {
    init_tslib();
    init_error();
    init_shims();
    init_line();
    init_shims();
    init_errors();
    init_values();
    init_bytes();
    init_log();
    init_error();
    Stream = class _Stream {
      constructor(iterator, controller, client) {
        this.iterator = iterator;
        _Stream_client.set(this, void 0);
        this.controller = controller;
        __classPrivateFieldSet(this, _Stream_client, client, "f");
      }
      static fromSSEResponse(response, controller, client) {
        let consumed = false;
        const logger = client ? loggerFor(client) : console;
        async function* iterator() {
          if (consumed) {
            throw new AnthropicError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
          }
          consumed = true;
          let done = false;
          try {
            for await (const sse of _iterSSEMessages(response, controller)) {
              if (sse.event === "completion") {
                try {
                  yield JSON.parse(sse.data);
                } catch (e) {
                  logger.error(`Could not parse message into JSON:`, sse.data);
                  logger.error(`From chunk:`, sse.raw);
                  throw e;
                }
              }
              if (sse.event === "message_start" || sse.event === "message_delta" || sse.event === "message_stop" || sse.event === "content_block_start" || sse.event === "content_block_delta" || sse.event === "content_block_stop" || sse.event === "message" || sse.event === "user.message" || sse.event === "user.interrupt" || sse.event === "user.tool_confirmation" || sse.event === "user.custom_tool_result" || sse.event === "user.tool_result" || sse.event === "agent.message" || sse.event === "agent.thinking" || sse.event === "agent.tool_use" || sse.event === "agent.tool_result" || sse.event === "agent.mcp_tool_use" || sse.event === "agent.mcp_tool_result" || sse.event === "agent.custom_tool_use" || sse.event === "agent.thread_context_compacted" || sse.event === "session.status_running" || sse.event === "session.status_idle" || sse.event === "session.status_rescheduled" || sse.event === "session.status_terminated" || sse.event === "session.error" || sse.event === "session.deleted" || sse.event === "session.updated" || sse.event === "span.model_request_start" || sse.event === "span.model_request_end" || sse.event === "span.outcome_evaluation_start" || sse.event === "span.outcome_evaluation_ongoing" || sse.event === "span.outcome_evaluation_end" || sse.event === "user.define_outcome" || sse.event === "agent.thread_message_received" || sse.event === "agent.thread_message_sent" || sse.event === "agent.session_thread_message_received" || sse.event === "agent.session_thread_message_sent" || sse.event === "session.thread_created" || sse.event === "session.thread_status_created" || sse.event === "session.thread_status_running" || sse.event === "session.thread_status_idle" || sse.event === "session.thread_status_rescheduled" || sse.event === "session.thread_status_terminated") {
                try {
                  yield JSON.parse(sse.data);
                } catch (e) {
                  logger.error(`Could not parse message into JSON:`, sse.data);
                  logger.error(`From chunk:`, sse.raw);
                  throw e;
                }
              }
              if (sse.event === "ping") {
                continue;
              }
              if (sse.event === "error") {
                const body = safeJSON(sse.data) ?? sse.data;
                const type2 = body?.error?.type;
                throw new APIError(void 0, body, void 0, response.headers, type2);
              }
            }
            done = true;
          } catch (e) {
            if (isAbortError(e))
              return;
            throw e;
          } finally {
            if (!done)
              controller.abort();
          }
        }
        return new _Stream(iterator, controller, client);
      }
      /**
       * Generates a Stream from a newline-separated ReadableStream
       * where each item is a JSON value.
       */
      static fromReadableStream(readableStream, controller, client) {
        let consumed = false;
        async function* iterLines() {
          const lineDecoder = new LineDecoder();
          const iter = ReadableStreamToAsyncIterable(readableStream);
          for await (const chunk of iter) {
            for (const line of lineDecoder.decode(chunk)) {
              yield line;
            }
          }
          for (const line of lineDecoder.flush()) {
            yield line;
          }
        }
        async function* iterator() {
          if (consumed) {
            throw new AnthropicError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
          }
          consumed = true;
          let done = false;
          try {
            for await (const line of iterLines()) {
              if (done)
                continue;
              if (line)
                yield JSON.parse(line);
            }
            done = true;
          } catch (e) {
            if (isAbortError(e))
              return;
            throw e;
          } finally {
            if (!done)
              controller.abort();
          }
        }
        return new _Stream(iterator, controller, client);
      }
      [(_Stream_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
        return this.iterator();
      }
      /**
       * Splits the stream into two streams which can be
       * independently read from at different speeds.
       */
      tee() {
        const left = [];
        const right = [];
        const iterator = this.iterator();
        const teeIterator = (queue) => {
          return {
            next: () => {
              if (queue.length === 0) {
                const result = iterator.next();
                left.push(result);
                right.push(result);
              }
              return queue.shift();
            }
          };
        };
        return [
          new _Stream(() => teeIterator(left), this.controller, __classPrivateFieldGet(this, _Stream_client, "f")),
          new _Stream(() => teeIterator(right), this.controller, __classPrivateFieldGet(this, _Stream_client, "f"))
        ];
      }
      /**
       * Converts this stream to a newline-separated ReadableStream of
       * JSON stringified values in the stream
       * which can be turned back into a Stream with `Stream.fromReadableStream()`.
       */
      toReadableStream() {
        const self = this;
        let iter;
        return makeReadableStream({
          async start() {
            iter = self[Symbol.asyncIterator]();
          },
          async pull(ctrl) {
            try {
              const { value, done } = await iter.next();
              if (done)
                return ctrl.close();
              const bytes = encodeUTF8(JSON.stringify(value) + "\n");
              ctrl.enqueue(bytes);
            } catch (err) {
              ctrl.error(err);
            }
          },
          async cancel() {
            await iter.return?.();
          }
        });
      }
    };
    SSEDecoder = class {
      constructor() {
        this.event = null;
        this.data = [];
        this.chunks = [];
      }
      decode(line) {
        if (line.endsWith("\r")) {
          line = line.substring(0, line.length - 1);
        }
        if (!line) {
          if (!this.event && !this.data.length)
            return null;
          const sse = {
            event: this.event,
            data: this.data.join("\n"),
            raw: this.chunks
          };
          this.event = null;
          this.data = [];
          this.chunks = [];
          return sse;
        }
        this.chunks.push(line);
        if (line.startsWith(":")) {
          return null;
        }
        let [fieldname, _, value] = partition(line, ":");
        if (value.startsWith(" ")) {
          value = value.substring(1);
        }
        if (fieldname === "event") {
          this.event = value;
        } else if (fieldname === "data") {
          this.data.push(value);
        }
        return null;
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/parse.mjs
async function defaultParseResponse(client, props) {
  const { response, requestLogID, retryOfRequestLogID, startTime } = props;
  const body = await (async () => {
    if (props.options.stream) {
      loggerFor(client).debug("response", response.status, response.url, response.headers, response.body);
      if (props.options.__streamClass) {
        return props.options.__streamClass.fromSSEResponse(response, props.controller);
      }
      return Stream.fromSSEResponse(response, props.controller);
    }
    if (response.status === 204) {
      return null;
    }
    if (props.options.__binaryResponse) {
      return response;
    }
    const contentType = response.headers.get("content-type");
    const mediaType = contentType?.split(";")[0]?.trim();
    const isJSON = mediaType?.includes("application/json") || mediaType?.endsWith("+json");
    if (isJSON) {
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0") {
        return void 0;
      }
      const json2 = await response.json();
      return addRequestID(json2, response);
    }
    const text = await response.text();
    return text;
  })();
  loggerFor(client).debug(`[${requestLogID}] response parsed`, formatRequestDetails({
    retryOfRequestLogID,
    url: response.url,
    status: response.status,
    body,
    durationMs: Date.now() - startTime
  }));
  return body;
}
function addRequestID(value, response) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }
  return Object.defineProperty(value, "_request_id", {
    value: response.headers.get("request-id"),
    enumerable: false
  });
}
var init_parse = __esm({
  "node_modules/@anthropic-ai/sdk/internal/parse.mjs"() {
    init_streaming();
    init_log();
  }
});

// node_modules/@anthropic-ai/sdk/core/api-promise.mjs
var _APIPromise_client, APIPromise;
var init_api_promise = __esm({
  "node_modules/@anthropic-ai/sdk/core/api-promise.mjs"() {
    init_tslib();
    init_parse();
    APIPromise = class _APIPromise extends Promise {
      constructor(client, responsePromise, parseResponse = defaultParseResponse) {
        super((resolve9) => {
          resolve9(null);
        });
        this.responsePromise = responsePromise;
        this.parseResponse = parseResponse;
        _APIPromise_client.set(this, void 0);
        __classPrivateFieldSet(this, _APIPromise_client, client, "f");
      }
      _thenUnwrap(transform) {
        return new _APIPromise(__classPrivateFieldGet(this, _APIPromise_client, "f"), this.responsePromise, async (client, props) => addRequestID(transform(await this.parseResponse(client, props), props), props.response));
      }
      /**
       * Gets the raw `Response` instance instead of parsing the response
       * data.
       *
       * If you want to parse the response body but still get the `Response`
       * instance, you can use {@link withResponse()}.
       *
       * 👋 Getting the wrong TypeScript type for `Response`?
       * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
       * to your `tsconfig.json`.
       */
      asResponse() {
        return this.responsePromise.then((p) => p.response);
      }
      /**
       * Gets the parsed response data, the raw `Response` instance and the ID of the request,
       * returned via the `request-id` header which is useful for debugging requests and resporting
       * issues to Anthropic.
       *
       * If you just want to get the raw `Response` instance without parsing it,
       * you can use {@link asResponse()}.
       *
       * 👋 Getting the wrong TypeScript type for `Response`?
       * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
       * to your `tsconfig.json`.
       */
      async withResponse() {
        const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
        return { data, response, request_id: response.headers.get("request-id") };
      }
      parse() {
        if (!this.parsedPromise) {
          this.parsedPromise = this.responsePromise.then((data) => this.parseResponse(__classPrivateFieldGet(this, _APIPromise_client, "f"), data));
        }
        return this.parsedPromise;
      }
      then(onfulfilled, onrejected) {
        return this.parse().then(onfulfilled, onrejected);
      }
      catch(onrejected) {
        return this.parse().catch(onrejected);
      }
      finally(onfinally) {
        return this.parse().finally(onfinally);
      }
    };
    _APIPromise_client = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/@anthropic-ai/sdk/core/pagination.mjs
var _AbstractPage_client, AbstractPage, PagePromise, Page, PageCursor;
var init_pagination = __esm({
  "node_modules/@anthropic-ai/sdk/core/pagination.mjs"() {
    init_tslib();
    init_error();
    init_parse();
    init_api_promise();
    init_values();
    AbstractPage = class {
      constructor(client, response, body, options) {
        _AbstractPage_client.set(this, void 0);
        __classPrivateFieldSet(this, _AbstractPage_client, client, "f");
        this.options = options;
        this.response = response;
        this.body = body;
      }
      hasNextPage() {
        const items = this.getPaginatedItems();
        if (!items.length)
          return false;
        return this.nextPageRequestOptions() != null;
      }
      async getNextPage() {
        const nextOptions = this.nextPageRequestOptions();
        if (!nextOptions) {
          throw new AnthropicError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
        }
        return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
      }
      async *iterPages() {
        let page = this;
        yield page;
        while (page.hasNextPage()) {
          page = await page.getNextPage();
          yield page;
        }
      }
      async *[(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
        for await (const page of this.iterPages()) {
          for (const item of page.getPaginatedItems()) {
            yield item;
          }
        }
      }
    };
    PagePromise = class extends APIPromise {
      constructor(client, request, Page2) {
        super(client, request, async (client2, props) => new Page2(client2, props.response, await defaultParseResponse(client2, props), props.options));
      }
      /**
       * Allow auto-paginating iteration on an unawaited list call, eg:
       *
       *    for await (const item of client.items.list()) {
       *      console.log(item)
       *    }
       */
      async *[Symbol.asyncIterator]() {
        const page = await this;
        for await (const item of page) {
          yield item;
        }
      }
    };
    Page = class extends AbstractPage {
      constructor(client, response, body, options) {
        super(client, response, body, options);
        this.data = body.data || [];
        this.has_more = body.has_more || false;
        this.first_id = body.first_id || null;
        this.last_id = body.last_id || null;
      }
      getPaginatedItems() {
        return this.data ?? [];
      }
      hasNextPage() {
        if (this.has_more === false) {
          return false;
        }
        return super.hasNextPage();
      }
      nextPageRequestOptions() {
        if (this.options.query?.["before_id"]) {
          const first_id = this.first_id;
          if (!first_id) {
            return null;
          }
          return {
            ...this.options,
            query: {
              ...maybeObj(this.options.query),
              before_id: first_id
            }
          };
        }
        const cursor = this.last_id;
        if (!cursor) {
          return null;
        }
        return {
          ...this.options,
          query: {
            ...maybeObj(this.options.query),
            after_id: cursor
          }
        };
      }
    };
    PageCursor = class extends AbstractPage {
      constructor(client, response, body, options) {
        super(client, response, body, options);
        this.data = body.data || [];
        this.next_page = body.next_page || null;
      }
      getPaginatedItems() {
        return this.data ?? [];
      }
      nextPageRequestOptions() {
        const cursor = this.next_page;
        if (!cursor) {
          return null;
        }
        return {
          ...this.options,
          query: {
            ...maybeObj(this.options.query),
            page: cursor
          }
        };
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/uploads.mjs
function makeFile(fileBits, fileName, options) {
  checkFileSupport();
  return new File(fileBits, fileName ?? "unknown_file", options);
}
function getName(value, stripPath) {
  const val = typeof value === "object" && value !== null && ("name" in value && value.name && String(value.name) || "url" in value && value.url && String(value.url) || "filename" in value && value.filename && String(value.filename) || "path" in value && value.path && String(value.path)) || "";
  return stripPath ? val.split(/[\\/]/).pop() || void 0 : val;
}
function supportsFormData(fetchObject) {
  const fetch2 = typeof fetchObject === "function" ? fetchObject : fetchObject.fetch;
  const cached = supportsFormDataMap.get(fetch2);
  if (cached)
    return cached;
  const promise = (async () => {
    try {
      const FetchResponse = "Response" in fetch2 ? fetch2.Response : (await fetch2("data:,")).constructor;
      const data = new FormData();
      if (data.toString() === await new FetchResponse(data).text()) {
        return false;
      }
      return true;
    } catch {
      return true;
    }
  })();
  supportsFormDataMap.set(fetch2, promise);
  return promise;
}
var checkFileSupport, isAsyncIterable, multipartFormRequestOptions, supportsFormDataMap, createForm, isNamedBlob, addFormValue;
var init_uploads = __esm({
  "node_modules/@anthropic-ai/sdk/internal/uploads.mjs"() {
    init_shims();
    checkFileSupport = () => {
      if (typeof File === "undefined") {
        const { process: process2 } = globalThis;
        const isOldNode = typeof process2?.versions?.node === "string" && parseInt(process2.versions.node.split(".")) < 20;
        throw new Error("`File` is not defined as a global, which is required for file uploads." + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
      }
    };
    isAsyncIterable = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";
    multipartFormRequestOptions = async (opts, fetch2, stripFilenames = true) => {
      return { ...opts, body: await createForm(opts.body, fetch2, stripFilenames) };
    };
    supportsFormDataMap = /* @__PURE__ */ new WeakMap();
    createForm = async (body, fetch2, stripFilenames = true) => {
      if (!await supportsFormData(fetch2)) {
        throw new TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
      }
      const form = new FormData();
      await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value, stripFilenames)));
      return form;
    };
    isNamedBlob = (value) => value instanceof Blob && "name" in value;
    addFormValue = async (form, key, value, stripFilenames) => {
      if (value === void 0)
        return;
      if (value == null) {
        throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
      }
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        form.append(key, String(value));
      } else if (value instanceof Response) {
        let options = {};
        const contentType = value.headers.get("Content-Type");
        if (contentType) {
          options = { type: contentType };
        }
        form.append(key, makeFile([await value.blob()], getName(value, stripFilenames), options));
      } else if (isAsyncIterable(value)) {
        form.append(key, makeFile([await new Response(ReadableStreamFrom(value)).blob()], getName(value, stripFilenames)));
      } else if (isNamedBlob(value)) {
        form.append(key, makeFile([value], getName(value, stripFilenames), { type: value.type }));
      } else if (Array.isArray(value)) {
        await Promise.all(value.map((entry) => addFormValue(form, key + "[]", entry, stripFilenames)));
      } else if (typeof value === "object") {
        await Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop, stripFilenames)));
      } else {
        throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/to-file.mjs
async function toFile(value, name, options) {
  checkFileSupport();
  value = await value;
  name || (name = getName(value, true));
  if (isFileLike(value)) {
    if (value instanceof File && name == null && options == null) {
      return value;
    }
    return makeFile([await value.arrayBuffer()], name ?? value.name, {
      type: value.type,
      lastModified: value.lastModified,
      ...options
    });
  }
  if (isResponseLike(value)) {
    const blob = await value.blob();
    name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
    return makeFile(await getBytes(blob), name, options);
  }
  const parts = await getBytes(value);
  if (!options?.type) {
    const type2 = parts.find((part) => typeof part === "object" && "type" in part && part.type);
    if (typeof type2 === "string") {
      options = { ...options, type: type2 };
    }
  }
  return makeFile(parts, name, options);
}
async function getBytes(value) {
  let parts = [];
  if (typeof value === "string" || ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
  value instanceof ArrayBuffer) {
    parts.push(value);
  } else if (isBlobLike(value)) {
    parts.push(value instanceof Blob ? value : await value.arrayBuffer());
  } else if (isAsyncIterable(value)) {
    for await (const chunk of value) {
      parts.push(...await getBytes(chunk));
    }
  } else {
    const constructor = value?.constructor?.name;
    throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ""}${propsForError(value)}`);
  }
  return parts;
}
function propsForError(value) {
  if (typeof value !== "object" || value === null)
    return "";
  const props = Object.getOwnPropertyNames(value);
  return `; props: [${props.map((p) => `"${p}"`).join(", ")}]`;
}
var isBlobLike, isFileLike, isResponseLike;
var init_to_file = __esm({
  "node_modules/@anthropic-ai/sdk/internal/to-file.mjs"() {
    init_uploads();
    init_uploads();
    isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
    isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
    isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
  }
});

// node_modules/@anthropic-ai/sdk/core/uploads.mjs
var init_uploads2 = __esm({
  "node_modules/@anthropic-ai/sdk/core/uploads.mjs"() {
    init_to_file();
  }
});

// node_modules/@anthropic-ai/sdk/resources/shared.mjs
var init_shared = __esm({
  "node_modules/@anthropic-ai/sdk/resources/shared.mjs"() {
  }
});

// node_modules/@anthropic-ai/sdk/core/resource.mjs
var APIResource;
var init_resource = __esm({
  "node_modules/@anthropic-ai/sdk/core/resource.mjs"() {
    APIResource = class {
      constructor(client) {
        this._client = client;
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/headers.mjs
function* iterateHeaders(headers) {
  if (!headers)
    return;
  if (brand_privateNullableHeaders in headers) {
    const { values, nulls } = headers;
    yield* values.entries();
    for (const name of nulls) {
      yield [name, null];
    }
    return;
  }
  let shouldClear = false;
  let iter;
  if (headers instanceof Headers) {
    iter = headers.entries();
  } else if (isReadonlyArray(headers)) {
    iter = headers;
  } else {
    shouldClear = true;
    iter = Object.entries(headers ?? {});
  }
  for (let row of iter) {
    const name = row[0];
    if (typeof name !== "string")
      throw new TypeError("expected header name to be a string");
    const values = isReadonlyArray(row[1]) ? row[1] : [row[1]];
    let didClear = false;
    for (const value of values) {
      if (value === void 0)
        continue;
      if (shouldClear && !didClear) {
        didClear = true;
        yield [name, null];
      }
      yield [name, value];
    }
  }
}
var brand_privateNullableHeaders, buildHeaders;
var init_headers = __esm({
  "node_modules/@anthropic-ai/sdk/internal/headers.mjs"() {
    init_values();
    brand_privateNullableHeaders = /* @__PURE__ */ Symbol.for("brand.privateNullableHeaders");
    buildHeaders = (newHeaders) => {
      const targetHeaders = new Headers();
      const nullHeaders = /* @__PURE__ */ new Set();
      for (const headers of newHeaders) {
        const seenHeaders = /* @__PURE__ */ new Set();
        for (const [name, value] of iterateHeaders(headers)) {
          const lowerName = name.toLowerCase();
          if (!seenHeaders.has(lowerName)) {
            targetHeaders.delete(name);
            seenHeaders.add(lowerName);
          }
          if (value === null) {
            targetHeaders.delete(name);
            nullHeaders.add(lowerName);
          } else {
            targetHeaders.append(name, value);
            nullHeaders.delete(lowerName);
          }
        }
      }
      return { [brand_privateNullableHeaders]: true, values: targetHeaders, nulls: nullHeaders };
    };
  }
});

// node_modules/@anthropic-ai/sdk/lib/stainless-helper-header.mjs
function wasCreatedByStainlessHelper(value) {
  return typeof value === "object" && value !== null && SDK_HELPER_SYMBOL in value;
}
function collectStainlessHelpers(tools, messages) {
  const helpers = /* @__PURE__ */ new Set();
  if (tools) {
    for (const tool of tools) {
      if (wasCreatedByStainlessHelper(tool)) {
        helpers.add(tool[SDK_HELPER_SYMBOL]);
      }
    }
  }
  if (messages) {
    for (const message of messages) {
      if (wasCreatedByStainlessHelper(message)) {
        helpers.add(message[SDK_HELPER_SYMBOL]);
      }
      if (Array.isArray(message.content)) {
        for (const block of message.content) {
          if (wasCreatedByStainlessHelper(block)) {
            helpers.add(block[SDK_HELPER_SYMBOL]);
          }
        }
      }
    }
  }
  return Array.from(helpers);
}
function stainlessHelperHeader(tools, messages) {
  const helpers = collectStainlessHelpers(tools, messages);
  if (helpers.length === 0)
    return {};
  return { "x-stainless-helper": helpers.join(", ") };
}
function stainlessHelperHeaderFromFile(file) {
  if (wasCreatedByStainlessHelper(file)) {
    return { "x-stainless-helper": file[SDK_HELPER_SYMBOL] };
  }
  return {};
}
var SDK_HELPER_SYMBOL;
var init_stainless_helper_header = __esm({
  "node_modules/@anthropic-ai/sdk/lib/stainless-helper-header.mjs"() {
    SDK_HELPER_SYMBOL = /* @__PURE__ */ Symbol("anthropic.sdk.stainlessHelper");
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/path.mjs
function encodeURIPath(str3) {
  return str3.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
var EMPTY, createPathTagFunction, path;
var init_path = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/path.mjs"() {
    init_error();
    EMPTY = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null));
    createPathTagFunction = (pathEncoder = encodeURIPath) => function path5(statics, ...params) {
      if (statics.length === 1)
        return statics[0];
      let postPath = false;
      const invalidSegments = [];
      const path6 = statics.reduce((previousValue, currentValue, index) => {
        if (/[?#]/.test(currentValue)) {
          postPath = true;
        }
        const value = params[index];
        let encoded = (postPath ? encodeURIComponent : pathEncoder)("" + value);
        if (index !== params.length && (value == null || typeof value === "object" && // handle values from other realms
        value.toString === Object.getPrototypeOf(Object.getPrototypeOf(value.hasOwnProperty ?? EMPTY) ?? EMPTY)?.toString)) {
          encoded = value + "";
          invalidSegments.push({
            start: previousValue.length + currentValue.length,
            length: encoded.length,
            error: `Value of type ${Object.prototype.toString.call(value).slice(8, -1)} is not a valid path parameter`
          });
        }
        return previousValue + currentValue + (index === params.length ? "" : encoded);
      }, "");
      const pathOnly = path6.split(/[?#]/, 1)[0];
      const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
      let match;
      while ((match = invalidSegmentPattern.exec(pathOnly)) !== null) {
        invalidSegments.push({
          start: match.index,
          length: match[0].length,
          error: `Value "${match[0]}" can't be safely passed as a path parameter`
        });
      }
      invalidSegments.sort((a, b) => a.start - b.start);
      if (invalidSegments.length > 0) {
        let lastEnd = 0;
        const underline = invalidSegments.reduce((acc, segment) => {
          const spaces = " ".repeat(segment.start - lastEnd);
          const arrows = "^".repeat(segment.length);
          lastEnd = segment.start + segment.length;
          return acc + spaces + arrows;
        }, "");
        throw new AnthropicError(`Path parameters result in path with invalid segments:
${invalidSegments.map((e) => e.error).join("\n")}
${path6}
${underline}`);
      }
      return path6;
    };
    path = /* @__PURE__ */ createPathTagFunction(encodeURIPath);
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/files.mjs
var Files;
var init_files = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/files.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_stainless_helper_header();
    init_uploads();
    init_path();
    Files = class extends APIResource {
      /**
       * List Files
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const fileMetadata of client.beta.files.list()) {
       *   // ...
       * }
       * ```
       */
      list(params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList("/v1/files?beta=true", Page, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Delete File
       *
       * @example
       * ```ts
       * const deletedFile = await client.beta.files.delete(
       *   'file_id',
       * );
       * ```
       */
      delete(fileID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.delete(path`/v1/files/${fileID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Download File
       *
       * @example
       * ```ts
       * const response = await client.beta.files.download(
       *   'file_id',
       * );
       *
       * const content = await response.blob();
       * console.log(content);
       * ```
       */
      download(fileID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.get(path`/v1/files/${fileID}/content?beta=true`, {
          ...options,
          headers: buildHeaders([
            {
              "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString(),
              Accept: "application/binary"
            },
            options?.headers
          ]),
          __binaryResponse: true
        });
      }
      /**
       * Get File Metadata
       *
       * @example
       * ```ts
       * const fileMetadata =
       *   await client.beta.files.retrieveMetadata('file_id');
       * ```
       */
      retrieveMetadata(fileID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.get(path`/v1/files/${fileID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Upload File
       *
       * @example
       * ```ts
       * const fileMetadata = await client.beta.files.upload({
       *   file: fs.createReadStream('path/to/file'),
       * });
       * ```
       */
      upload(params, options) {
        const { betas, ...body } = params;
        return this._client.post("/v1/files?beta=true", multipartFormRequestOptions({
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
            stainlessHelperHeaderFromFile(body.file),
            options?.headers
          ])
        }, this._client));
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/models.mjs
var Models;
var init_models = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/models.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_path();
    Models = class extends APIResource {
      /**
       * Get a specific model.
       *
       * The Models API response can be used to determine information about a specific
       * model or resolve a model alias to a model ID.
       *
       * @example
       * ```ts
       * const betaModelInfo = await client.beta.models.retrieve(
       *   'model_id',
       * );
       * ```
       */
      retrieve(modelID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.get(path`/v1/models/${modelID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
            options?.headers
          ])
        });
      }
      /**
       * List available models.
       *
       * The Models API response can be used to determine which models are available for
       * use in the API. More recently released models are listed first.
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaModelInfo of client.beta.models.list()) {
       *   // ...
       * }
       * ```
       */
      list(params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList("/v1/models?beta=true", Page, {
          query,
          ...options,
          headers: buildHeaders([
            { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
            options?.headers
          ])
        });
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/user-profiles.mjs
var UserProfiles;
var init_user_profiles = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/user-profiles.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_path();
    UserProfiles = class extends APIResource {
      /**
       * Create User Profile
       *
       * @example
       * ```ts
       * const betaUserProfile =
       *   await client.beta.userProfiles.create();
       * ```
       */
      create(params, options) {
        const { betas, ...body } = params;
        return this._client.post("/v1/user_profiles?beta=true", {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "user-profiles-2026-03-24"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Get User Profile
       *
       * @example
       * ```ts
       * const betaUserProfile =
       *   await client.beta.userProfiles.retrieve(
       *     'uprof_011CZkZCu8hGbp5mYRQgUmz9',
       *   );
       * ```
       */
      retrieve(userProfileID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.get(path`/v1/user_profiles/${userProfileID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "user-profiles-2026-03-24"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Update User Profile
       *
       * @example
       * ```ts
       * const betaUserProfile =
       *   await client.beta.userProfiles.update(
       *     'uprof_011CZkZCu8hGbp5mYRQgUmz9',
       *   );
       * ```
       */
      update(userProfileID, params, options) {
        const { betas, ...body } = params;
        return this._client.post(path`/v1/user_profiles/${userProfileID}?beta=true`, {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "user-profiles-2026-03-24"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List User Profiles
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaUserProfile of client.beta.userProfiles.list()) {
       *   // ...
       * }
       * ```
       */
      list(params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList("/v1/user_profiles?beta=true", PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "user-profiles-2026-03-24"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Create Enrollment URL
       *
       * @example
       * ```ts
       * const betaUserProfileEnrollmentURL =
       *   await client.beta.userProfiles.createEnrollmentURL(
       *     'uprof_011CZkZCu8hGbp5mYRQgUmz9',
       *   );
       * ```
       */
      createEnrollmentURL(userProfileID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.post(path`/v1/user_profiles/${userProfileID}/enrollment_url?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "user-profiles-2026-03-24"].toString() },
            options?.headers
          ])
        });
      }
    };
  }
});

// node_modules/standardwebhooks/dist/timing_safe_equal.js
var require_timing_safe_equal = __commonJS({
  "node_modules/standardwebhooks/dist/timing_safe_equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.timingSafeEqual = void 0;
    function assert(expr, msg = "") {
      if (!expr) {
        throw new Error(msg);
      }
    }
    function timingSafeEqual(a, b) {
      if (a.byteLength !== b.byteLength) {
        return false;
      }
      if (!(a instanceof DataView)) {
        a = new DataView(ArrayBuffer.isView(a) ? a.buffer : a);
      }
      if (!(b instanceof DataView)) {
        b = new DataView(ArrayBuffer.isView(b) ? b.buffer : b);
      }
      assert(a instanceof DataView);
      assert(b instanceof DataView);
      const length = a.byteLength;
      let out = 0;
      let i = -1;
      while (++i < length) {
        out |= a.getUint8(i) ^ b.getUint8(i);
      }
      return out === 0;
    }
    exports.timingSafeEqual = timingSafeEqual;
  }
});

// node_modules/@stablelib/base64/lib/base64.js
var require_base64 = __commonJS({
  "node_modules/@stablelib/base64/lib/base64.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    var INVALID_BYTE = 256;
    var Coder = (
      /** @class */
      (function() {
        function Coder2(_paddingCharacter) {
          if (_paddingCharacter === void 0) {
            _paddingCharacter = "=";
          }
          this._paddingCharacter = _paddingCharacter;
        }
        Coder2.prototype.encodedLength = function(length) {
          if (!this._paddingCharacter) {
            return (length * 8 + 5) / 6 | 0;
          }
          return (length + 2) / 3 * 4 | 0;
        };
        Coder2.prototype.encode = function(data) {
          var out = "";
          var i = 0;
          for (; i < data.length - 2; i += 3) {
            var c = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
            out += this._encodeByte(c >>> 3 * 6 & 63);
            out += this._encodeByte(c >>> 2 * 6 & 63);
            out += this._encodeByte(c >>> 1 * 6 & 63);
            out += this._encodeByte(c >>> 0 * 6 & 63);
          }
          var left = data.length - i;
          if (left > 0) {
            var c = data[i] << 16 | (left === 2 ? data[i + 1] << 8 : 0);
            out += this._encodeByte(c >>> 3 * 6 & 63);
            out += this._encodeByte(c >>> 2 * 6 & 63);
            if (left === 2) {
              out += this._encodeByte(c >>> 1 * 6 & 63);
            } else {
              out += this._paddingCharacter || "";
            }
            out += this._paddingCharacter || "";
          }
          return out;
        };
        Coder2.prototype.maxDecodedLength = function(length) {
          if (!this._paddingCharacter) {
            return (length * 6 + 7) / 8 | 0;
          }
          return length / 4 * 3 | 0;
        };
        Coder2.prototype.decodedLength = function(s) {
          return this.maxDecodedLength(s.length - this._getPaddingLength(s));
        };
        Coder2.prototype.decode = function(s) {
          if (s.length === 0) {
            return new Uint8Array(0);
          }
          var paddingLength = this._getPaddingLength(s);
          var length = s.length - paddingLength;
          var out = new Uint8Array(this.maxDecodedLength(length));
          var op = 0;
          var i = 0;
          var haveBad = 0;
          var v0 = 0, v1 = 0, v2 = 0, v3 = 0;
          for (; i < length - 4; i += 4) {
            v0 = this._decodeChar(s.charCodeAt(i + 0));
            v1 = this._decodeChar(s.charCodeAt(i + 1));
            v2 = this._decodeChar(s.charCodeAt(i + 2));
            v3 = this._decodeChar(s.charCodeAt(i + 3));
            out[op++] = v0 << 2 | v1 >>> 4;
            out[op++] = v1 << 4 | v2 >>> 2;
            out[op++] = v2 << 6 | v3;
            haveBad |= v0 & INVALID_BYTE;
            haveBad |= v1 & INVALID_BYTE;
            haveBad |= v2 & INVALID_BYTE;
            haveBad |= v3 & INVALID_BYTE;
          }
          if (i < length - 1) {
            v0 = this._decodeChar(s.charCodeAt(i));
            v1 = this._decodeChar(s.charCodeAt(i + 1));
            out[op++] = v0 << 2 | v1 >>> 4;
            haveBad |= v0 & INVALID_BYTE;
            haveBad |= v1 & INVALID_BYTE;
          }
          if (i < length - 2) {
            v2 = this._decodeChar(s.charCodeAt(i + 2));
            out[op++] = v1 << 4 | v2 >>> 2;
            haveBad |= v2 & INVALID_BYTE;
          }
          if (i < length - 3) {
            v3 = this._decodeChar(s.charCodeAt(i + 3));
            out[op++] = v2 << 6 | v3;
            haveBad |= v3 & INVALID_BYTE;
          }
          if (haveBad !== 0) {
            throw new Error("Base64Coder: incorrect characters for decoding");
          }
          return out;
        };
        Coder2.prototype._encodeByte = function(b) {
          var result = b;
          result += 65;
          result += 25 - b >>> 8 & 0 - 65 - 26 + 97;
          result += 51 - b >>> 8 & 26 - 97 - 52 + 48;
          result += 61 - b >>> 8 & 52 - 48 - 62 + 43;
          result += 62 - b >>> 8 & 62 - 43 - 63 + 47;
          return String.fromCharCode(result);
        };
        Coder2.prototype._decodeChar = function(c) {
          var result = INVALID_BYTE;
          result += (42 - c & c - 44) >>> 8 & -INVALID_BYTE + c - 43 + 62;
          result += (46 - c & c - 48) >>> 8 & -INVALID_BYTE + c - 47 + 63;
          result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
          result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
          result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
          return result;
        };
        Coder2.prototype._getPaddingLength = function(s) {
          var paddingLength = 0;
          if (this._paddingCharacter) {
            for (var i = s.length - 1; i >= 0; i--) {
              if (s[i] !== this._paddingCharacter) {
                break;
              }
              paddingLength++;
            }
            if (s.length < 4 || paddingLength > 2) {
              throw new Error("Base64Coder: incorrect padding");
            }
          }
          return paddingLength;
        };
        return Coder2;
      })()
    );
    exports.Coder = Coder;
    var stdCoder = new Coder();
    function encode2(data) {
      return stdCoder.encode(data);
    }
    exports.encode = encode2;
    function decode(s) {
      return stdCoder.decode(s);
    }
    exports.decode = decode;
    var URLSafeCoder = (
      /** @class */
      (function(_super) {
        __extends(URLSafeCoder2, _super);
        function URLSafeCoder2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        URLSafeCoder2.prototype._encodeByte = function(b) {
          var result = b;
          result += 65;
          result += 25 - b >>> 8 & 0 - 65 - 26 + 97;
          result += 51 - b >>> 8 & 26 - 97 - 52 + 48;
          result += 61 - b >>> 8 & 52 - 48 - 62 + 45;
          result += 62 - b >>> 8 & 62 - 45 - 63 + 95;
          return String.fromCharCode(result);
        };
        URLSafeCoder2.prototype._decodeChar = function(c) {
          var result = INVALID_BYTE;
          result += (44 - c & c - 46) >>> 8 & -INVALID_BYTE + c - 45 + 62;
          result += (94 - c & c - 96) >>> 8 & -INVALID_BYTE + c - 95 + 63;
          result += (47 - c & c - 58) >>> 8 & -INVALID_BYTE + c - 48 + 52;
          result += (64 - c & c - 91) >>> 8 & -INVALID_BYTE + c - 65 + 0;
          result += (96 - c & c - 123) >>> 8 & -INVALID_BYTE + c - 97 + 26;
          return result;
        };
        return URLSafeCoder2;
      })(Coder)
    );
    exports.URLSafeCoder = URLSafeCoder;
    var urlSafeCoder = new URLSafeCoder();
    function encodeURLSafe(data) {
      return urlSafeCoder.encode(data);
    }
    exports.encodeURLSafe = encodeURLSafe;
    function decodeURLSafe(s) {
      return urlSafeCoder.decode(s);
    }
    exports.decodeURLSafe = decodeURLSafe;
    exports.encodedLength = function(length) {
      return stdCoder.encodedLength(length);
    };
    exports.maxDecodedLength = function(length) {
      return stdCoder.maxDecodedLength(length);
    };
    exports.decodedLength = function(s) {
      return stdCoder.decodedLength(s);
    };
  }
});

// node_modules/fast-sha256/sha256.js
var require_sha256 = __commonJS({
  "node_modules/fast-sha256/sha256.js"(exports, module) {
    (function(root, factory) {
      var exports2 = {};
      factory(exports2);
      var sha256 = exports2["default"];
      for (var k in exports2) {
        sha256[k] = exports2[k];
      }
      if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = sha256;
      } else if (typeof define === "function" && define.amd) {
        define(function() {
          return sha256;
        });
      } else {
        root.sha256 = sha256;
      }
    })(exports, function(exports2) {
      "use strict";
      exports2.__esModule = true;
      exports2.digestLength = 32;
      exports2.blockSize = 64;
      var K = new Uint32Array([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ]);
      function hashBlocks(w, v, p, pos, len) {
        var a, b, c, d, e, f, g, h, u, i, j, t1, t2;
        while (len >= 64) {
          a = v[0];
          b = v[1];
          c = v[2];
          d = v[3];
          e = v[4];
          f = v[5];
          g = v[6];
          h = v[7];
          for (i = 0; i < 16; i++) {
            j = pos + i * 4;
            w[i] = (p[j] & 255) << 24 | (p[j + 1] & 255) << 16 | (p[j + 2] & 255) << 8 | p[j + 3] & 255;
          }
          for (i = 16; i < 64; i++) {
            u = w[i - 2];
            t1 = (u >>> 17 | u << 32 - 17) ^ (u >>> 19 | u << 32 - 19) ^ u >>> 10;
            u = w[i - 15];
            t2 = (u >>> 7 | u << 32 - 7) ^ (u >>> 18 | u << 32 - 18) ^ u >>> 3;
            w[i] = (t1 + w[i - 7] | 0) + (t2 + w[i - 16] | 0);
          }
          for (i = 0; i < 64; i++) {
            t1 = (((e >>> 6 | e << 32 - 6) ^ (e >>> 11 | e << 32 - 11) ^ (e >>> 25 | e << 32 - 25)) + (e & f ^ ~e & g) | 0) + (h + (K[i] + w[i] | 0) | 0) | 0;
            t2 = ((a >>> 2 | a << 32 - 2) ^ (a >>> 13 | a << 32 - 13) ^ (a >>> 22 | a << 32 - 22)) + (a & b ^ a & c ^ b & c) | 0;
            h = g;
            g = f;
            f = e;
            e = d + t1 | 0;
            d = c;
            c = b;
            b = a;
            a = t1 + t2 | 0;
          }
          v[0] += a;
          v[1] += b;
          v[2] += c;
          v[3] += d;
          v[4] += e;
          v[5] += f;
          v[6] += g;
          v[7] += h;
          pos += 64;
          len -= 64;
        }
        return pos;
      }
      var Hash = (
        /** @class */
        (function() {
          function Hash2() {
            this.digestLength = exports2.digestLength;
            this.blockSize = exports2.blockSize;
            this.state = new Int32Array(8);
            this.temp = new Int32Array(64);
            this.buffer = new Uint8Array(128);
            this.bufferLength = 0;
            this.bytesHashed = 0;
            this.finished = false;
            this.reset();
          }
          Hash2.prototype.reset = function() {
            this.state[0] = 1779033703;
            this.state[1] = 3144134277;
            this.state[2] = 1013904242;
            this.state[3] = 2773480762;
            this.state[4] = 1359893119;
            this.state[5] = 2600822924;
            this.state[6] = 528734635;
            this.state[7] = 1541459225;
            this.bufferLength = 0;
            this.bytesHashed = 0;
            this.finished = false;
            return this;
          };
          Hash2.prototype.clean = function() {
            for (var i = 0; i < this.buffer.length; i++) {
              this.buffer[i] = 0;
            }
            for (var i = 0; i < this.temp.length; i++) {
              this.temp[i] = 0;
            }
            this.reset();
          };
          Hash2.prototype.update = function(data, dataLength) {
            if (dataLength === void 0) {
              dataLength = data.length;
            }
            if (this.finished) {
              throw new Error("SHA256: can't update because hash was finished.");
            }
            var dataPos = 0;
            this.bytesHashed += dataLength;
            if (this.bufferLength > 0) {
              while (this.bufferLength < 64 && dataLength > 0) {
                this.buffer[this.bufferLength++] = data[dataPos++];
                dataLength--;
              }
              if (this.bufferLength === 64) {
                hashBlocks(this.temp, this.state, this.buffer, 0, 64);
                this.bufferLength = 0;
              }
            }
            if (dataLength >= 64) {
              dataPos = hashBlocks(this.temp, this.state, data, dataPos, dataLength);
              dataLength %= 64;
            }
            while (dataLength > 0) {
              this.buffer[this.bufferLength++] = data[dataPos++];
              dataLength--;
            }
            return this;
          };
          Hash2.prototype.finish = function(out) {
            if (!this.finished) {
              var bytesHashed = this.bytesHashed;
              var left = this.bufferLength;
              var bitLenHi = bytesHashed / 536870912 | 0;
              var bitLenLo = bytesHashed << 3;
              var padLength = bytesHashed % 64 < 56 ? 64 : 128;
              this.buffer[left] = 128;
              for (var i = left + 1; i < padLength - 8; i++) {
                this.buffer[i] = 0;
              }
              this.buffer[padLength - 8] = bitLenHi >>> 24 & 255;
              this.buffer[padLength - 7] = bitLenHi >>> 16 & 255;
              this.buffer[padLength - 6] = bitLenHi >>> 8 & 255;
              this.buffer[padLength - 5] = bitLenHi >>> 0 & 255;
              this.buffer[padLength - 4] = bitLenLo >>> 24 & 255;
              this.buffer[padLength - 3] = bitLenLo >>> 16 & 255;
              this.buffer[padLength - 2] = bitLenLo >>> 8 & 255;
              this.buffer[padLength - 1] = bitLenLo >>> 0 & 255;
              hashBlocks(this.temp, this.state, this.buffer, 0, padLength);
              this.finished = true;
            }
            for (var i = 0; i < 8; i++) {
              out[i * 4 + 0] = this.state[i] >>> 24 & 255;
              out[i * 4 + 1] = this.state[i] >>> 16 & 255;
              out[i * 4 + 2] = this.state[i] >>> 8 & 255;
              out[i * 4 + 3] = this.state[i] >>> 0 & 255;
            }
            return this;
          };
          Hash2.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
          };
          Hash2.prototype._saveState = function(out) {
            for (var i = 0; i < this.state.length; i++) {
              out[i] = this.state[i];
            }
          };
          Hash2.prototype._restoreState = function(from, bytesHashed) {
            for (var i = 0; i < this.state.length; i++) {
              this.state[i] = from[i];
            }
            this.bytesHashed = bytesHashed;
            this.finished = false;
            this.bufferLength = 0;
          };
          return Hash2;
        })()
      );
      exports2.Hash = Hash;
      var HMAC = (
        /** @class */
        (function() {
          function HMAC2(key) {
            this.inner = new Hash();
            this.outer = new Hash();
            this.blockSize = this.inner.blockSize;
            this.digestLength = this.inner.digestLength;
            var pad = new Uint8Array(this.blockSize);
            if (key.length > this.blockSize) {
              new Hash().update(key).finish(pad).clean();
            } else {
              for (var i = 0; i < key.length; i++) {
                pad[i] = key[i];
              }
            }
            for (var i = 0; i < pad.length; i++) {
              pad[i] ^= 54;
            }
            this.inner.update(pad);
            for (var i = 0; i < pad.length; i++) {
              pad[i] ^= 54 ^ 92;
            }
            this.outer.update(pad);
            this.istate = new Uint32Array(8);
            this.ostate = new Uint32Array(8);
            this.inner._saveState(this.istate);
            this.outer._saveState(this.ostate);
            for (var i = 0; i < pad.length; i++) {
              pad[i] = 0;
            }
          }
          HMAC2.prototype.reset = function() {
            this.inner._restoreState(this.istate, this.inner.blockSize);
            this.outer._restoreState(this.ostate, this.outer.blockSize);
            return this;
          };
          HMAC2.prototype.clean = function() {
            for (var i = 0; i < this.istate.length; i++) {
              this.ostate[i] = this.istate[i] = 0;
            }
            this.inner.clean();
            this.outer.clean();
          };
          HMAC2.prototype.update = function(data) {
            this.inner.update(data);
            return this;
          };
          HMAC2.prototype.finish = function(out) {
            if (this.outer.finished) {
              this.outer.finish(out);
            } else {
              this.inner.finish(out);
              this.outer.update(out, this.digestLength).finish(out);
            }
            return this;
          };
          HMAC2.prototype.digest = function() {
            var out = new Uint8Array(this.digestLength);
            this.finish(out);
            return out;
          };
          return HMAC2;
        })()
      );
      exports2.HMAC = HMAC;
      function hash(data) {
        var h = new Hash().update(data);
        var digest = h.digest();
        h.clean();
        return digest;
      }
      exports2.hash = hash;
      exports2["default"] = hash;
      function hmac(key, data) {
        var h = new HMAC(key).update(data);
        var digest = h.digest();
        h.clean();
        return digest;
      }
      exports2.hmac = hmac;
      function fillBuffer(buffer, hmac2, info, counter) {
        var num2 = counter[0];
        if (num2 === 0) {
          throw new Error("hkdf: cannot expand more");
        }
        hmac2.reset();
        if (num2 > 1) {
          hmac2.update(buffer);
        }
        if (info) {
          hmac2.update(info);
        }
        hmac2.update(counter);
        hmac2.finish(buffer);
        counter[0]++;
      }
      var hkdfSalt = new Uint8Array(exports2.digestLength);
      function hkdf(key, salt, info, length) {
        if (salt === void 0) {
          salt = hkdfSalt;
        }
        if (length === void 0) {
          length = 32;
        }
        var counter = new Uint8Array([1]);
        var okm = hmac(salt, key);
        var hmac_ = new HMAC(okm);
        var buffer = new Uint8Array(hmac_.digestLength);
        var bufpos = buffer.length;
        var out = new Uint8Array(length);
        for (var i = 0; i < length; i++) {
          if (bufpos === buffer.length) {
            fillBuffer(buffer, hmac_, info, counter);
            bufpos = 0;
          }
          out[i] = buffer[bufpos++];
        }
        hmac_.clean();
        buffer.fill(0);
        counter.fill(0);
        return out;
      }
      exports2.hkdf = hkdf;
      function pbkdf2(password, salt, iterations, dkLen) {
        var prf = new HMAC(password);
        var len = prf.digestLength;
        var ctr = new Uint8Array(4);
        var t = new Uint8Array(len);
        var u = new Uint8Array(len);
        var dk = new Uint8Array(dkLen);
        for (var i = 0; i * len < dkLen; i++) {
          var c = i + 1;
          ctr[0] = c >>> 24 & 255;
          ctr[1] = c >>> 16 & 255;
          ctr[2] = c >>> 8 & 255;
          ctr[3] = c >>> 0 & 255;
          prf.reset();
          prf.update(salt);
          prf.update(ctr);
          prf.finish(u);
          for (var j = 0; j < len; j++) {
            t[j] = u[j];
          }
          for (var j = 2; j <= iterations; j++) {
            prf.reset();
            prf.update(u).finish(u);
            for (var k = 0; k < len; k++) {
              t[k] ^= u[k];
            }
          }
          for (var j = 0; j < len && i * len + j < dkLen; j++) {
            dk[i * len + j] = t[j];
          }
        }
        for (var i = 0; i < len; i++) {
          t[i] = u[i] = 0;
        }
        for (var i = 0; i < 4; i++) {
          ctr[i] = 0;
        }
        prf.clean();
        return dk;
      }
      exports2.pbkdf2 = pbkdf2;
    });
  }
});

// node_modules/standardwebhooks/dist/index.js
var require_dist = __commonJS({
  "node_modules/standardwebhooks/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Webhook = exports.WebhookVerificationError = void 0;
    var timing_safe_equal_1 = require_timing_safe_equal();
    var base64 = require_base64();
    var sha256 = require_sha256();
    var WEBHOOK_TOLERANCE_IN_SECONDS = 5 * 60;
    var ExtendableError = class _ExtendableError extends Error {
      constructor(message) {
        super(message);
        Object.setPrototypeOf(this, _ExtendableError.prototype);
        this.name = "ExtendableError";
        this.stack = new Error(message).stack;
      }
    };
    var WebhookVerificationError = class _WebhookVerificationError extends ExtendableError {
      constructor(message) {
        super(message);
        Object.setPrototypeOf(this, _WebhookVerificationError.prototype);
        this.name = "WebhookVerificationError";
      }
    };
    exports.WebhookVerificationError = WebhookVerificationError;
    var Webhook2 = class _Webhook {
      constructor(secret, options) {
        if (!secret) {
          throw new Error("Secret can't be empty.");
        }
        if ((options === null || options === void 0 ? void 0 : options.format) === "raw") {
          if (secret instanceof Uint8Array) {
            this.key = secret;
          } else {
            this.key = Uint8Array.from(secret, (c) => c.charCodeAt(0));
          }
        } else {
          if (typeof secret !== "string") {
            throw new Error("Expected secret to be of type string");
          }
          if (secret.startsWith(_Webhook.prefix)) {
            secret = secret.substring(_Webhook.prefix.length);
          }
          this.key = base64.decode(secret);
        }
      }
      verify(payload, headers_) {
        const headers = {};
        for (const key of Object.keys(headers_)) {
          headers[key.toLowerCase()] = headers_[key];
        }
        const msgId = headers["webhook-id"];
        const msgSignature = headers["webhook-signature"];
        const msgTimestamp = headers["webhook-timestamp"];
        if (!msgSignature || !msgId || !msgTimestamp) {
          throw new WebhookVerificationError("Missing required headers");
        }
        const timestamp2 = this.verifyTimestamp(msgTimestamp);
        const computedSignature = this.sign(msgId, timestamp2, payload);
        const expectedSignature = computedSignature.split(",")[1];
        const passedSignatures = msgSignature.split(" ");
        const encoder = new globalThis.TextEncoder();
        for (const versionedSignature of passedSignatures) {
          const [version, signature] = versionedSignature.split(",");
          if (version !== "v1") {
            continue;
          }
          if ((0, timing_safe_equal_1.timingSafeEqual)(encoder.encode(signature), encoder.encode(expectedSignature))) {
            return JSON.parse(payload.toString());
          }
        }
        throw new WebhookVerificationError("No matching signature found");
      }
      sign(msgId, timestamp2, payload) {
        if (typeof payload === "string") {
        } else if (payload.constructor.name === "Buffer") {
          payload = payload.toString();
        } else {
          throw new Error("Expected payload to be of type string or Buffer.");
        }
        const encoder = new TextEncoder();
        const timestampNumber = Math.floor(timestamp2.getTime() / 1e3);
        const toSign = encoder.encode(`${msgId}.${timestampNumber}.${payload}`);
        const expectedSignature = base64.encode(sha256.hmac(this.key, toSign));
        return `v1,${expectedSignature}`;
      }
      verifyTimestamp(timestampHeader) {
        const now = Math.floor(Date.now() / 1e3);
        const timestamp2 = parseInt(timestampHeader, 10);
        if (isNaN(timestamp2)) {
          throw new WebhookVerificationError("Invalid Signature Headers");
        }
        if (now - timestamp2 > WEBHOOK_TOLERANCE_IN_SECONDS) {
          throw new WebhookVerificationError("Message timestamp too old");
        }
        if (timestamp2 > now + WEBHOOK_TOLERANCE_IN_SECONDS) {
          throw new WebhookVerificationError("Message timestamp too new");
        }
        return new Date(timestamp2 * 1e3);
      }
    };
    exports.Webhook = Webhook2;
    Webhook2.prefix = "whsec_";
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/webhooks.mjs
var import_standardwebhooks, Webhooks;
var init_webhooks = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/webhooks.mjs"() {
    init_resource();
    import_standardwebhooks = __toESM(require_dist(), 1);
    Webhooks = class extends APIResource {
      unwrap(body, { headers, key }) {
        if (headers !== void 0) {
          const keyStr = key === void 0 ? this._client.webhookKey : key;
          if (keyStr === null)
            throw new Error("Webhook key must not be null in order to unwrap");
          const wh = new import_standardwebhooks.Webhook(keyStr);
          wh.verify(body, headers);
        }
        return JSON.parse(body);
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/agents/versions.mjs
var Versions;
var init_versions = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/agents/versions.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_path();
    Versions = class extends APIResource {
      /**
       * List Agent Versions
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaManagedAgentsAgent of client.beta.agents.versions.list(
       *   'agent_011CZkYpogX7uDKUyvBTophP',
       * )) {
       *   // ...
       * }
       * ```
       */
      list(agentID, params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList(path`/v1/agents/${agentID}/versions?beta=true`, PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/agents/agents.mjs
var Agents;
var init_agents = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/agents/agents.mjs"() {
    init_resource();
    init_versions();
    init_versions();
    init_pagination();
    init_headers();
    init_path();
    Agents = class extends APIResource {
      constructor() {
        super(...arguments);
        this.versions = new Versions(this._client);
      }
      /**
       * Create Agent
       *
       * @example
       * ```ts
       * const betaManagedAgentsAgent =
       *   await client.beta.agents.create({
       *     model: 'claude-sonnet-4-6',
       *     name: 'My First Agent',
       *   });
       * ```
       */
      create(params, options) {
        const { betas, ...body } = params;
        return this._client.post("/v1/agents?beta=true", {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Get Agent
       *
       * @example
       * ```ts
       * const betaManagedAgentsAgent =
       *   await client.beta.agents.retrieve(
       *     'agent_011CZkYpogX7uDKUyvBTophP',
       *   );
       * ```
       */
      retrieve(agentID, params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.get(path`/v1/agents/${agentID}?beta=true`, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Update Agent
       *
       * @example
       * ```ts
       * const betaManagedAgentsAgent =
       *   await client.beta.agents.update(
       *     'agent_011CZkYpogX7uDKUyvBTophP',
       *     { version: 1 },
       *   );
       * ```
       */
      update(agentID, params, options) {
        const { betas, ...body } = params;
        return this._client.post(path`/v1/agents/${agentID}?beta=true`, {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List Agents
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaManagedAgentsAgent of client.beta.agents.list()) {
       *   // ...
       * }
       * ```
       */
      list(params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList("/v1/agents?beta=true", PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Archive Agent
       *
       * @example
       * ```ts
       * const betaManagedAgentsAgent =
       *   await client.beta.agents.archive(
       *     'agent_011CZkYpogX7uDKUyvBTophP',
       *   );
       * ```
       */
      archive(agentID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.post(path`/v1/agents/${agentID}/archive?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
    };
    Agents.Versions = Versions;
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/abort.mjs
function linkAbort(external, controller) {
  if (!external)
    return () => {
    };
  if (external.aborted) {
    controller.abort();
    return () => {
    };
  }
  const onAbort = () => controller.abort();
  external.addEventListener("abort", onAbort);
  return () => external.removeEventListener("abort", onAbort);
}
var init_abort = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/abort.mjs"() {
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/backoff.mjs
function isStatus(e, code) {
  return e instanceof APIError && e.status === code;
}
function is4xx(e) {
  return e instanceof APIError && typeof e.status === "number" && e.status >= 400 && e.status < 500;
}
function isFatal4xx(e) {
  return is4xx(e) && !isStatus(e, 408) && !isStatus(e, 409) && !isStatus(e, 429);
}
function backoff(attempt, baseMs, capMs) {
  return Math.min(baseMs * 2 ** attempt, capMs);
}
function jitter(lowMs, highMs) {
  return lowMs + Math.random() * (highMs - lowMs);
}
function applyJitter(ms) {
  return ms * (1 - Math.random() * 0.25);
}
var init_backoff = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/backoff.mjs"() {
    init_error();
  }
});

// node_modules/@anthropic-ai/sdk/lib/helper-client.mjs
function copyClientForHelper(client, { authToken, helper }) {
  if (!authToken) {
    throw new AnthropicError(`copyClientForHelper: expected a non-empty authToken but received ${JSON.stringify(authToken)}`);
  }
  const internal = client;
  const parentDefaults = internal._options.defaultHeaders;
  const parentAuthExtraHeaders = internal._authState?.extraHeaders;
  const inheritedAuthExtraHeaders = parentAuthExtraHeaders ? Object.fromEntries(Object.entries(parentAuthExtraHeaders).filter(([name]) => {
    const lower = name.toLowerCase();
    return lower !== "authorization" && lower !== "x-api-key";
  })) : void 0;
  const defaultHeaders = buildHeaders([
    inheritedAuthExtraHeaders,
    parentDefaults,
    { "x-stainless-helper": helper }
  ]);
  return client.withOptions({
    apiKey: null,
    authToken,
    baseURL: client.baseURL,
    credentials: void 0,
    defaultHeaders
  });
}
var init_helper_client = __esm({
  "node_modules/@anthropic-ai/sdk/lib/helper-client.mjs"() {
    init_error();
    init_headers();
  }
});

// node_modules/@anthropic-ai/sdk/lib/environments/poller.mjs
function backoff2(attempt) {
  return backoff(attempt, POLL_BACKOFF_BASE_MS, POLL_BACKOFF_CAP_MS);
}
function defaultWorkerId() {
  const env = globalThis.process?.env;
  const host = env?.["HOSTNAME"];
  return host ? `${host}-${uuid4()}` : uuid4();
}
var _WorkPoller_runnerClient, _WorkPoller_consumed, _WorkPoller_controller, _WorkPoller_detachExternal, _WorkPoller_autoStop, _WorkPoller_drain, _WorkPoller_blockMs, _WorkPoller_reclaimOlderThanMs, _WorkPoller_requestOpts, POLL_BLOCK_MS, POLL_BACKOFF_BASE_MS, POLL_BACKOFF_CAP_MS, WorkPoller;
var init_poller = __esm({
  "node_modules/@anthropic-ai/sdk/lib/environments/poller.mjs"() {
    init_tslib();
    init_error();
    init_log();
    init_sleep();
    init_uuid();
    init_abort();
    init_headers();
    init_backoff();
    init_helper_client();
    init_backoff();
    POLL_BLOCK_MS = 999;
    POLL_BACKOFF_BASE_MS = 1e3;
    POLL_BACKOFF_CAP_MS = 6e4;
    WorkPoller = class {
      constructor(opts) {
        _WorkPoller_runnerClient.set(this, void 0);
        _WorkPoller_consumed.set(this, false);
        _WorkPoller_controller.set(this, void 0);
        _WorkPoller_detachExternal.set(this, void 0);
        _WorkPoller_autoStop.set(this, void 0);
        _WorkPoller_drain.set(this, void 0);
        _WorkPoller_blockMs.set(this, void 0);
        _WorkPoller_reclaimOlderThanMs.set(this, void 0);
        _WorkPoller_requestOpts.set(this, void 0);
        this.client = opts.client;
        this.environmentId = opts.environmentId;
        this.environmentKey = opts.environmentKey;
        this.workerId = opts.workerId ?? defaultWorkerId();
        __classPrivateFieldSet(this, _WorkPoller_runnerClient, copyClientForHelper(opts.client, {
          authToken: opts.environmentKey,
          helper: "environments-work-poller"
        }), "f");
        __classPrivateFieldSet(this, _WorkPoller_autoStop, opts.autoStop ?? true, "f");
        __classPrivateFieldSet(this, _WorkPoller_drain, opts.drain ?? false, "f");
        __classPrivateFieldSet(this, _WorkPoller_blockMs, opts.blockMs === void 0 ? POLL_BLOCK_MS : opts.blockMs, "f");
        __classPrivateFieldSet(this, _WorkPoller_reclaimOlderThanMs, opts.reclaimOlderThanMs ?? null, "f");
        __classPrivateFieldSet(this, _WorkPoller_requestOpts, opts.requestOptions, "f");
        __classPrivateFieldSet(this, _WorkPoller_controller, new AbortController(), "f");
        __classPrivateFieldSet(this, _WorkPoller_detachExternal, linkAbort(opts.signal, __classPrivateFieldGet(this, _WorkPoller_controller, "f")), "f");
      }
      /** Read-only view of this iterator's abort signal. */
      get signal() {
        return __classPrivateFieldGet(this, _WorkPoller_controller, "f").signal;
      }
      /** Abort the iterator. The current `for await` will exit cleanly. */
      abort() {
        __classPrivateFieldGet(this, _WorkPoller_controller, "f").abort();
      }
      async *[(_WorkPoller_runnerClient = /* @__PURE__ */ new WeakMap(), _WorkPoller_consumed = /* @__PURE__ */ new WeakMap(), _WorkPoller_controller = /* @__PURE__ */ new WeakMap(), _WorkPoller_detachExternal = /* @__PURE__ */ new WeakMap(), _WorkPoller_autoStop = /* @__PURE__ */ new WeakMap(), _WorkPoller_drain = /* @__PURE__ */ new WeakMap(), _WorkPoller_blockMs = /* @__PURE__ */ new WeakMap(), _WorkPoller_reclaimOlderThanMs = /* @__PURE__ */ new WeakMap(), _WorkPoller_requestOpts = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
        if (__classPrivateFieldGet(this, _WorkPoller_consumed, "f")) {
          throw new AnthropicError("Cannot iterate over a consumed WorkPoller");
        }
        __classPrivateFieldSet(this, _WorkPoller_consumed, true, "f");
        const log8 = loggerFor(this.client);
        log8.info("poller starting", {
          component: "work-poller",
          environment_id: this.environmentId
        });
        try {
          let attempt = 0;
          while (!__classPrivateFieldGet(this, _WorkPoller_controller, "f").signal.aborted) {
            let work;
            try {
              work = await __classPrivateFieldGet(this, _WorkPoller_runnerClient, "f").beta.environments.work.poll(this.environmentId, {
                "Anthropic-Worker-ID": this.workerId,
                ...__classPrivateFieldGet(this, _WorkPoller_blockMs, "f") !== null ? { block_ms: __classPrivateFieldGet(this, _WorkPoller_blockMs, "f") } : {},
                ...__classPrivateFieldGet(this, _WorkPoller_reclaimOlderThanMs, "f") !== null ? { reclaim_older_than_ms: __classPrivateFieldGet(this, _WorkPoller_reclaimOlderThanMs, "f") } : {}
              }, { headers: buildHeaders([__classPrivateFieldGet(this, _WorkPoller_requestOpts, "f")?.headers]), signal: __classPrivateFieldGet(this, _WorkPoller_controller, "f").signal });
            } catch (e) {
              if (__classPrivateFieldGet(this, _WorkPoller_controller, "f").signal.aborted)
                return;
              if (isFatal4xx(e)) {
                log8.error("poll failed permanently, stopping poller", { error: String(e) });
                throw e;
              }
              const wait = applyJitter(backoff2(attempt));
              log8.warn("poll failed, backing off", { error: String(e), backoff_ms: wait });
              attempt++;
              await sleep3(wait, __classPrivateFieldGet(this, _WorkPoller_controller, "f").signal);
              continue;
            }
            attempt = 0;
            if (work == null) {
              if (__classPrivateFieldGet(this, _WorkPoller_drain, "f"))
                return;
              await sleep3(jitter(1e3, 3e3), __classPrivateFieldGet(this, _WorkPoller_controller, "f").signal);
              continue;
            }
            log8.info("claimed work", {
              component: "work-poller",
              environment_id: this.environmentId,
              work_id: work.id,
              work_type: work.data.type
            });
            try {
              await __classPrivateFieldGet(this, _WorkPoller_runnerClient, "f").beta.environments.work.ack(work.id, { environment_id: work.environment_id }, { headers: buildHeaders([__classPrivateFieldGet(this, _WorkPoller_requestOpts, "f")?.headers]), signal: __classPrivateFieldGet(this, _WorkPoller_controller, "f").signal });
            } catch (e) {
              log8.error("ack failed", { work_id: work.id, error: String(e) });
              continue;
            }
            try {
              yield work;
            } finally {
              if (__classPrivateFieldGet(this, _WorkPoller_autoStop, "f")) {
                try {
                  await __classPrivateFieldGet(this, _WorkPoller_runnerClient, "f").beta.environments.work.stop(work.id, { environment_id: work.environment_id }, { headers: buildHeaders([__classPrivateFieldGet(this, _WorkPoller_requestOpts, "f")?.headers]) });
                } catch (e) {
                  if (!isStatus(e, 409))
                    log8.warn("stop failed", { work_id: work.id, error: String(e) });
                }
              }
            }
          }
        } finally {
          __classPrivateFieldGet(this, _WorkPoller_detachExternal, "f").call(this);
        }
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/async-queue.mjs
var _AsyncQueue_items, _AsyncQueue_waiters, _AsyncQueue_closed, AsyncQueue;
var init_async_queue = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/async-queue.mjs"() {
    init_tslib();
    AsyncQueue = class {
      constructor() {
        _AsyncQueue_items.set(this, []);
        _AsyncQueue_waiters.set(this, []);
        _AsyncQueue_closed.set(this, false);
      }
      /** Enqueue an item, or hand it directly to a waiting reader. Returns `false` once closed. */
      push(item) {
        if (__classPrivateFieldGet(this, _AsyncQueue_closed, "f"))
          return false;
        const w = __classPrivateFieldGet(this, _AsyncQueue_waiters, "f").shift();
        if (w)
          w({ done: false, value: item });
        else
          __classPrivateFieldGet(this, _AsyncQueue_items, "f").push(item);
        return true;
      }
      /** Mark the queue done. Idempotent; wakes every pending reader with `done: true`. */
      close() {
        if (__classPrivateFieldGet(this, _AsyncQueue_closed, "f"))
          return;
        __classPrivateFieldSet(this, _AsyncQueue_closed, true, "f");
        while (__classPrivateFieldGet(this, _AsyncQueue_waiters, "f").length > 0) {
          const w = __classPrivateFieldGet(this, _AsyncQueue_waiters, "f").shift();
          w({ done: true, value: void 0 });
        }
      }
      /**
       * Resolve with the next item, or `done: true` once the queue is closed and
       * drained. When `signal` is supplied, aborting it resolves a pending read
       * with `done: true` (cancellation is pushed down here rather than handled by
       * an outer `Promise.race`).
       */
      next(signal) {
        if (__classPrivateFieldGet(this, _AsyncQueue_items, "f").length > 0) {
          return Promise.resolve({ done: false, value: __classPrivateFieldGet(this, _AsyncQueue_items, "f").shift() });
        }
        if (__classPrivateFieldGet(this, _AsyncQueue_closed, "f") || signal?.aborted) {
          return Promise.resolve({ done: true, value: void 0 });
        }
        return new Promise((resolve9) => {
          const waiter = (r) => {
            signal?.removeEventListener("abort", onAbort);
            resolve9(r);
          };
          const onAbort = () => {
            const idx = __classPrivateFieldGet(this, _AsyncQueue_waiters, "f").indexOf(waiter);
            if (idx >= 0)
              __classPrivateFieldGet(this, _AsyncQueue_waiters, "f").splice(idx, 1);
            resolve9({ done: true, value: void 0 });
          };
          __classPrivateFieldGet(this, _AsyncQueue_waiters, "f").push(waiter);
          signal?.addEventListener("abort", onAbort, { once: true });
        });
      }
      /** Synchronously remove and return the next buffered item, or `undefined` if empty. */
      tryShift() {
        return __classPrivateFieldGet(this, _AsyncQueue_items, "f").shift();
      }
    };
    _AsyncQueue_items = /* @__PURE__ */ new WeakMap(), _AsyncQueue_waiters = /* @__PURE__ */ new WeakMap(), _AsyncQueue_closed = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/@anthropic-ai/sdk/lib/tools/ToolError.mjs
var ToolError;
var init_ToolError = __esm({
  "node_modules/@anthropic-ai/sdk/lib/tools/ToolError.mjs"() {
    ToolError = class extends Error {
      constructor(content) {
        const message = typeof content === "string" ? content : content.map((block) => {
          if (block.type === "text")
            return block.text;
          return `[${block.type}]`;
        }).join(" ");
        super(message);
        this.name = "ToolError";
        this.content = content;
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/lib/tools/BetaRunnableTool.mjs
function toolName(tool) {
  return "name" in tool ? tool.name : tool.mcp_server_name;
}
function toolErrorContent(e) {
  return e instanceof ToolError ? e.content : `Error: ${e instanceof Error ? e.message : String(e)}`;
}
async function runRunnableTool(tool, rawInput, context) {
  try {
    const input = tool.parse ? tool.parse(rawInput) : rawInput;
    const content = await tool.run(input, context);
    return { content, isError: false };
  } catch (e) {
    return { content: toolErrorContent(e), isError: true };
  }
}
var init_BetaRunnableTool = __esm({
  "node_modules/@anthropic-ai/sdk/lib/tools/BetaRunnableTool.mjs"() {
    init_ToolError();
  }
});

// node_modules/@anthropic-ai/sdk/lib/tools/SessionToolRunner.mjs
function isEndTurnIdle(ev) {
  return ev.type === "session.status_idle" && ev.stop_reason?.type === "end_turn";
}
function buildResultEvent(ev, isError, content) {
  if (ev.type === "agent.custom_tool_use") {
    return { type: "user.custom_tool_result", custom_tool_use_id: ev.id, is_error: isError, content };
  }
  return { type: "user.tool_result", tool_use_id: ev.id, is_error: isError, content };
}
function toSessionContent(content) {
  if (typeof content === "string")
    return [{ type: "text", text: content || "(no output)" }];
  const out = content.map((b) => {
    if (b.type === "text")
      return { type: "text", text: b.text || "(no output)" };
    if (b.type === "image" || b.type === "document")
      return b;
    if (b.type === "search_result") {
      return {
        type: "search_result",
        source: b.source,
        title: b.title,
        content: b.content.map((c) => ({ type: "text", text: c.text })),
        citations: { enabled: b.citations?.enabled ?? false }
      };
    }
    return { type: "text", text: JSON.stringify(b) };
  });
  return out.length > 0 ? out : [{ type: "text", text: "(no output)" }];
}
var _SessionToolRunner_instances, _SessionToolRunner_consumed, _SessionToolRunner_controller, _SessionToolRunner_detachExternal, _SessionToolRunner_requestOpts, _SessionToolRunner_toolByName, _SessionToolRunner_logger, _SessionToolRunner_seen, _SessionToolRunner_answered, _SessionToolRunner_results, _SessionToolRunner_inFlightCount, _SessionToolRunner_onIdle, _SessionToolRunner_idleTimer, _SessionToolRunner_requestOptions, _SessionToolRunner_streamLoop, _SessionToolRunner_reconcile, _SessionToolRunner_ingestHistory, _SessionToolRunner_handleStreamEvent, _SessionToolRunner_armIdleTimer, _SessionToolRunner_disarmIdleTimer, _SessionToolRunner_execute, _SessionToolRunner_sendResult, _SessionToolRunner_drain, HELPER_NAME, STREAM_BACKOFF_START_MS, STREAM_BACKOFF_CAP_MS, TOOL_TIMEOUT_MS, DRAIN_TIMEOUT_MS, SEND_RETRIES, DEFAULT_MAX_IDLE_MS, SessionToolRunner;
var init_SessionToolRunner = __esm({
  "node_modules/@anthropic-ai/sdk/lib/tools/SessionToolRunner.mjs"() {
    init_tslib();
    init_error();
    init_log();
    init_sleep();
    init_backoff();
    init_abort();
    init_async_queue();
    init_headers();
    init_BetaRunnableTool();
    HELPER_NAME = "SessionToolRunner";
    STREAM_BACKOFF_START_MS = 500;
    STREAM_BACKOFF_CAP_MS = 1e4;
    TOOL_TIMEOUT_MS = 12e4;
    DRAIN_TIMEOUT_MS = 3e4;
    SEND_RETRIES = 3;
    DEFAULT_MAX_IDLE_MS = 6e4;
    SessionToolRunner = class {
      constructor(sessionId, opts) {
        _SessionToolRunner_instances.add(this);
        _SessionToolRunner_consumed.set(this, false);
        _SessionToolRunner_controller.set(this, void 0);
        _SessionToolRunner_detachExternal.set(this, void 0);
        _SessionToolRunner_requestOpts.set(this, void 0);
        _SessionToolRunner_toolByName.set(this, void 0);
        _SessionToolRunner_logger.set(this, void 0);
        _SessionToolRunner_seen.set(this, /* @__PURE__ */ new Set());
        _SessionToolRunner_answered.set(this, /* @__PURE__ */ new Set());
        _SessionToolRunner_results.set(this, new AsyncQueue());
        _SessionToolRunner_inFlightCount.set(this, 0);
        _SessionToolRunner_onIdle.set(this, null);
        _SessionToolRunner_idleTimer.set(this, void 0);
        this.client = opts.client;
        this.sessionId = sessionId;
        this.tools = opts.tools;
        this.maxIdleMs = opts.maxIdleMs ?? DEFAULT_MAX_IDLE_MS;
        __classPrivateFieldSet(this, _SessionToolRunner_logger, loggerFor(opts.client), "f");
        __classPrivateFieldSet(this, _SessionToolRunner_toolByName, new Map(opts.tools.map((t) => [toolName(t), t])), "f");
        __classPrivateFieldSet(this, _SessionToolRunner_controller, new AbortController(), "f");
        __classPrivateFieldSet(this, _SessionToolRunner_detachExternal, linkAbort(opts.signal, __classPrivateFieldGet(this, _SessionToolRunner_controller, "f")), "f");
        __classPrivateFieldSet(this, _SessionToolRunner_requestOpts, opts.requestOptions, "f");
      }
      /** Read-only view of this runner's abort signal. */
      get signal() {
        return __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").signal;
      }
      /** Abort the runner. Background tasks will wind down and `for await` will exit cleanly. */
      abort() {
        __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").abort();
      }
      async *[(_SessionToolRunner_consumed = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_controller = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_detachExternal = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_requestOpts = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_toolByName = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_logger = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_seen = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_answered = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_results = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_inFlightCount = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_onIdle = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_idleTimer = /* @__PURE__ */ new WeakMap(), _SessionToolRunner_instances = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
        if (__classPrivateFieldGet(this, _SessionToolRunner_consumed, "f")) {
          throw new AnthropicError("Cannot iterate over a consumed SessionToolRunner");
        }
        __classPrivateFieldSet(this, _SessionToolRunner_consumed, true, "f");
        __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").info("session tool runner starting", {
          component: "session-tool-runner",
          session_id: this.sessionId
        });
        const streamPromise = __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_streamLoop).call(this).catch((e) => {
          if (!__classPrivateFieldGet(this, _SessionToolRunner_controller, "f").signal.aborted) {
            __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").error("stream loop failed", { error: String(e) });
          }
          __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").abort();
        });
        try {
          while (true) {
            const next = await __classPrivateFieldGet(this, _SessionToolRunner_results, "f").next(__classPrivateFieldGet(this, _SessionToolRunner_controller, "f").signal);
            if (next.done)
              break;
            yield next.value;
          }
          await streamPromise;
          let pending;
          while ((pending = __classPrivateFieldGet(this, _SessionToolRunner_results, "f").tryShift()) !== void 0) {
            yield pending;
          }
        } finally {
          __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").abort();
          __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_disarmIdleTimer).call(this);
          await streamPromise;
          try {
            await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_drain).call(this);
          } catch (e) {
            __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").warn("drain failed", { error: String(e) });
          }
          __classPrivateFieldGet(this, _SessionToolRunner_results, "f").close();
          for (const t of this.tools) {
            try {
              await t.close?.();
            } catch (e) {
              __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").warn("tool.close failed", { tool: toolName(t), error: String(e) });
            }
          }
          __classPrivateFieldGet(this, _SessionToolRunner_detachExternal, "f").call(this);
        }
      }
    };
    _SessionToolRunner_requestOptions = function _SessionToolRunner_requestOptions2() {
      return {
        ...__classPrivateFieldGet(this, _SessionToolRunner_requestOpts, "f"),
        headers: buildHeaders([{ "x-stainless-helper": HELPER_NAME }, __classPrivateFieldGet(this, _SessionToolRunner_requestOpts, "f")?.headers]),
        signal: __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").signal
      };
    }, _SessionToolRunner_streamLoop = // ===== event stream =====
    async function _SessionToolRunner_streamLoop2() {
      const ctrl = __classPrivateFieldGet(this, _SessionToolRunner_controller, "f");
      let backoff3 = STREAM_BACKOFF_START_MS;
      while (!ctrl.signal.aborted) {
        try {
          const stream = await this.client.beta.sessions.events.stream(this.sessionId, {}, __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_requestOptions).call(this));
          await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_reconcile).call(this);
          for await (const ev of stream) {
            backoff3 = STREAM_BACKOFF_START_MS;
            if (await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_handleStreamEvent).call(this, ev))
              return;
          }
        } catch (e) {
          ctrl.signal.throwIfAborted();
          if (isFatal4xx(e)) {
            __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").error("permanent stream failure, shutting down", { error: String(e) });
            ctrl.abort();
            throw e;
          }
          __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").warn("stream disconnected, reconnecting", {
            error: String(e),
            backoff_ms: backoff3
          });
        }
        ctrl.signal.throwIfAborted();
        await sleep3(backoff3, ctrl.signal);
        backoff3 = Math.min(backoff3 * 2, STREAM_BACKOFF_CAP_MS);
      }
    }, _SessionToolRunner_reconcile = /**
     * Read full history before dispatching so a `tool_use` whose result appears
     * later in the same history is not re-executed. Runs after the live stream is
     * already attached (see {@link SessionToolRunner.#streamLoop}).
     */
    async function _SessionToolRunner_reconcile2() {
      const ctrl = __classPrivateFieldGet(this, _SessionToolRunner_controller, "f");
      const pending = [];
      let lastWasEndTurn = false;
      try {
        for await (const ev of this.client.beta.sessions.events.list(this.sessionId, { limit: 1e3 }, __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_requestOptions).call(this))) {
          __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_ingestHistory).call(this, ev, pending);
          lastWasEndTurn = isEndTurnIdle(ev);
        }
      } catch (e) {
        ctrl.signal.throwIfAborted();
        __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").warn("reconcile list failed", { error: String(e) });
        for (const ev of pending)
          __classPrivateFieldGet(this, _SessionToolRunner_seen, "f").delete(ev.id);
        return;
      }
      const unanswered = pending.filter((ev) => !__classPrivateFieldGet(this, _SessionToolRunner_answered, "f").has(ev.id));
      if (lastWasEndTurn && unanswered.length === 0)
        __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_armIdleTimer).call(this);
      else
        __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_disarmIdleTimer).call(this);
      for (const ev of unanswered)
        await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_execute).call(this, ev);
    }, _SessionToolRunner_ingestHistory = function _SessionToolRunner_ingestHistory2(ev, pending) {
      if (ev.type === "agent.tool_use" || ev.type === "agent.custom_tool_use") {
        __classPrivateFieldGet(this, _SessionToolRunner_seen, "f").add(ev.id);
        if (!__classPrivateFieldGet(this, _SessionToolRunner_answered, "f").has(ev.id))
          pending.push(ev);
      } else if (ev.type === "user.tool_result") {
        __classPrivateFieldGet(this, _SessionToolRunner_answered, "f").add(ev.tool_use_id);
      } else if (ev.type === "user.custom_tool_result") {
        __classPrivateFieldGet(this, _SessionToolRunner_answered, "f").add(ev.custom_tool_use_id);
      }
    }, _SessionToolRunner_handleStreamEvent = /** Returns true when the runner should exit. */
    async function _SessionToolRunner_handleStreamEvent2(ev) {
      if (isEndTurnIdle(ev))
        __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_armIdleTimer).call(this);
      else
        __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_disarmIdleTimer).call(this);
      switch (ev.type) {
        case "agent.tool_use":
        case "agent.custom_tool_use":
          if (!__classPrivateFieldGet(this, _SessionToolRunner_seen, "f").has(ev.id)) {
            __classPrivateFieldGet(this, _SessionToolRunner_seen, "f").add(ev.id);
            await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_execute).call(this, ev);
          }
          return false;
        case "user.tool_result":
          __classPrivateFieldGet(this, _SessionToolRunner_answered, "f").add(ev.tool_use_id);
          return false;
        case "user.custom_tool_result":
          __classPrivateFieldGet(this, _SessionToolRunner_answered, "f").add(ev.custom_tool_use_id);
          return false;
        case "session.status_terminated":
        case "session.deleted":
          __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").info("session terminated", {
            component: "session-tool-runner",
            session_id: this.sessionId
          });
          __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").abort();
          return true;
        default:
          return false;
      }
    }, _SessionToolRunner_armIdleTimer = function _SessionToolRunner_armIdleTimer2() {
      __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_disarmIdleTimer).call(this);
      if (this.maxIdleMs <= 0)
        return;
      __classPrivateFieldSet(this, _SessionToolRunner_idleTimer, setTimeout(() => {
        __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").info("session idle after end_turn; stopping", {
          component: "session-tool-runner",
          session_id: this.sessionId,
          max_idle_ms: this.maxIdleMs
        });
        __classPrivateFieldGet(this, _SessionToolRunner_controller, "f").abort();
      }, this.maxIdleMs), "f");
    }, _SessionToolRunner_disarmIdleTimer = function _SessionToolRunner_disarmIdleTimer2() {
      if (__classPrivateFieldGet(this, _SessionToolRunner_idleTimer, "f") !== void 0) {
        clearTimeout(__classPrivateFieldGet(this, _SessionToolRunner_idleTimer, "f"));
        __classPrivateFieldSet(this, _SessionToolRunner_idleTimer, void 0, "f");
      }
    }, _SessionToolRunner_execute = // ===== tool execution =====
    async function _SessionToolRunner_execute2(ev) {
      var _a2, _b;
      if (__classPrivateFieldGet(this, _SessionToolRunner_answered, "f").has(ev.id))
        return;
      __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").info("executing tool", {
        component: "session-tool-runner",
        session_id: this.sessionId,
        tool: ev.name,
        tool_use_id: ev.id
      });
      __classPrivateFieldSet(this, _SessionToolRunner_inFlightCount, (_a2 = __classPrivateFieldGet(this, _SessionToolRunner_inFlightCount, "f"), _a2++, _a2), "f");
      try {
        const tool = __classPrivateFieldGet(this, _SessionToolRunner_toolByName, "f").get(ev.name);
        if (!tool) {
          __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").info("tool not owned by this runner; leaving the tool_use_id pending for its owner", {
            component: "session-tool-runner",
            session_id: this.sessionId,
            tool: ev.name,
            tool_use_id: ev.id
          });
          __classPrivateFieldGet(this, _SessionToolRunner_results, "f").push({ event: ev, toolUseId: ev.id, name: ev.name, isError: false, posted: false });
          return;
        }
        let content;
        let isError;
        const toolCtrl = new AbortController();
        const detachTool = linkAbort(__classPrivateFieldGet(this, _SessionToolRunner_controller, "f").signal, toolCtrl);
        const timer = setTimeout(() => toolCtrl.abort(), TOOL_TIMEOUT_MS);
        try {
          const outcome = await runRunnableTool(tool, ev.input, {
            toolUse: ev,
            toolUseBlock: ev,
            signal: toolCtrl.signal
          });
          content = outcome.content;
          isError = outcome.isError;
        } finally {
          clearTimeout(timer);
          detachTool();
        }
        const result = buildResultEvent(ev, isError, toSessionContent(content));
        const posted = await __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_sendResult).call(this, result, ev.id);
        __classPrivateFieldGet(this, _SessionToolRunner_results, "f").push({
          event: ev,
          result,
          toolUseId: ev.id,
          name: ev.name,
          isError,
          posted
        });
      } finally {
        __classPrivateFieldSet(this, _SessionToolRunner_inFlightCount, (_b = __classPrivateFieldGet(this, _SessionToolRunner_inFlightCount, "f"), _b--, _b), "f");
        if (__classPrivateFieldGet(this, _SessionToolRunner_inFlightCount, "f") === 0)
          __classPrivateFieldGet(this, _SessionToolRunner_onIdle, "f")?.call(this);
      }
    }, _SessionToolRunner_sendResult = async function _SessionToolRunner_sendResult2(result, toolUseId) {
      const ctrl = __classPrivateFieldGet(this, _SessionToolRunner_controller, "f");
      let lastErr;
      for (let i = 0; i < SEND_RETRIES; i++) {
        ctrl.signal.throwIfAborted();
        try {
          await this.client.beta.sessions.events.send(this.sessionId, { events: [result] }, __classPrivateFieldGet(this, _SessionToolRunner_instances, "m", _SessionToolRunner_requestOptions).call(this));
          __classPrivateFieldGet(this, _SessionToolRunner_answered, "f").add(toolUseId);
          return true;
        } catch (e) {
          lastErr = e;
          if (isFatal4xx(e))
            break;
          if (i < SEND_RETRIES - 1)
            await sleep3((i + 1) * 1e3, ctrl.signal);
        }
      }
      __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").error("failed to send tool result", {
        tool_use_id: toolUseId,
        error: String(lastErr)
      });
      return false;
    }, _SessionToolRunner_drain = /** Wait (bounded) for in-flight tool executions to finish during teardown. */
    async function _SessionToolRunner_drain2() {
      if (__classPrivateFieldGet(this, _SessionToolRunner_inFlightCount, "f") === 0)
        return;
      await Promise.race([new Promise((r) => __classPrivateFieldSet(this, _SessionToolRunner_onIdle, r, "f")), sleep3(DRAIN_TIMEOUT_MS)]);
      __classPrivateFieldSet(this, _SessionToolRunner_onIdle, null, "f");
      if (__classPrivateFieldGet(this, _SessionToolRunner_inFlightCount, "f") > 0) {
        __classPrivateFieldGet(this, _SessionToolRunner_logger, "f").warn("drain timeout exceeded");
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/lib/transform-json-schema.mjs
var init_transform_json_schema = __esm({
  "node_modules/@anthropic-ai/sdk/lib/transform-json-schema.mjs"() {
    init_utils2();
  }
});

// node_modules/@anthropic-ai/sdk/helpers/beta/json-schema.mjs
function betaTool(options) {
  if (options.inputSchema.type !== "object") {
    throw new Error(`JSON schema for tool "${options.name}" must be an object, but got ${options.inputSchema.type}`);
  }
  return {
    type: "custom",
    name: options.name,
    input_schema: options.inputSchema,
    description: options.description,
    run: options.run,
    parse: (content) => content,
    ...options.close ? { close: options.close } : {}
  };
}
var init_json_schema = __esm({
  "node_modules/@anthropic-ai/sdk/helpers/beta/json-schema.mjs"() {
    init_sdk();
    init_transform_json_schema();
  }
});

// node_modules/@anthropic-ai/sdk/internal/utils/promise.mjs
function promiseWithResolvers() {
  let resolve9;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve9 = res;
    reject = rej;
  });
  return { promise, resolve: resolve9, reject };
}
var init_promise = __esm({
  "node_modules/@anthropic-ai/sdk/internal/utils/promise.mjs"() {
  }
});

// node_modules/@anthropic-ai/sdk/tools/agent-toolset/fs-util.mjs
import * as fs from "node:fs/promises";
import * as path2 from "node:path";
import { randomUUID as randomUUID6 } from "node:crypto";
async function realpathOrSelf(p) {
  try {
    return await fs.realpath(p);
  } catch {
    return p;
  }
}
async function canonicalize(abs) {
  const tail = [];
  let prefix = abs;
  for (; ; ) {
    let real;
    try {
      real = await fs.realpath(prefix);
    } catch {
      let isLink2 = false;
      try {
        isLink2 = (await fs.lstat(prefix)).isSymbolicLink();
      } catch {
      }
      if (isLink2) {
        prefix = path2.resolve(path2.dirname(prefix), await fs.readlink(prefix));
        continue;
      }
      const parent = path2.dirname(prefix);
      if (parent === prefix)
        return abs;
      tail.push(path2.basename(prefix));
      prefix = parent;
      continue;
    }
    return tail.length ? path2.join(real, ...tail.reverse()) : real;
  }
}
async function confineToRoot(root, p, opts) {
  const allowOutside = opts?.allowOutside ?? false;
  if (path2.isAbsolute(p)) {
    if (!allowOutside) {
      throw new ToolError(`absolute path ${JSON.stringify(p)} not permitted`);
    }
    return path2.resolve(p);
  }
  const realRoot = await realpathOrSelf(path2.resolve(root));
  const abs = path2.resolve(realRoot, p);
  if (allowOutside)
    return abs;
  const real = await canonicalize(abs);
  const rootSep = realRoot.endsWith(path2.sep) ? realRoot : realRoot + path2.sep;
  if (real !== realRoot && !real.startsWith(rootSep)) {
    throw new ToolError(`path ${JSON.stringify(p)} escapes workdir`);
  }
  return real;
}
async function atomicWriteFile(targetPath, content) {
  const dir = path2.dirname(targetPath);
  const tempPath = path2.join(dir, `.tmp-${process.pid}-${randomUUID6()}`);
  let handle;
  try {
    handle = await fs.open(tempPath, "wx", FILE_CREATE_MODE);
    await handle.writeFile(content, "utf-8");
    await handle.sync();
    await handle.close();
    handle = void 0;
    await fs.rename(tempPath, targetPath);
  } catch (err) {
    if (handle)
      await handle.close().catch(() => {
      });
    await fs.unlink(tempPath).catch(() => {
    });
    throw err;
  }
}
function fsErrorMessage(err, file) {
  const code = err?.code;
  switch (code) {
    case "ENOENT":
      return `${file}: no such file or directory`;
    case "EACCES":
    case "EPERM":
      return `${file}: permission denied`;
    case "ENOTDIR":
      return `${file}: not a directory`;
    case "EISDIR":
      return `${file}: is a directory`;
    case "ELOOP":
      return `${file}: too many levels of symbolic links`;
    case "ENAMETOOLONG":
      return `${file}: file name too long`;
    case "ENOSPC":
      return `${file}: no space left on device`;
    case "EMFILE":
    case "ENFILE":
      return `${file}: too many open files`;
    default:
      return `${file}: ${err instanceof Error ? err.message : String(err)}`;
  }
}
var DIR_CREATE_MODE, FILE_CREATE_MODE;
var init_fs_util = __esm({
  "node_modules/@anthropic-ai/sdk/tools/agent-toolset/fs-util.mjs"() {
    init_ToolError();
    DIR_CREATE_MODE = 493;
    FILE_CREATE_MODE = 420;
  }
});

// node_modules/@anthropic-ai/sdk/tools/agent-toolset/skills.mjs
import * as fs2 from "node:fs/promises";
import * as fssync from "node:fs";
import * as path3 from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
async function setupSkills(ctx) {
  const { client, sessionId } = ctx;
  if (!client || !sessionId)
    return async () => {
    };
  const log8 = loggerFor(client);
  const session = await client.beta.sessions.retrieve(sessionId);
  const skillsRoot = path3.resolve(ctx.workdir, "skills");
  const created = [];
  for (const skill of session.agent.skills) {
    try {
      const versionId = await resolveSkillVersion(client, skill.skill_id, skill.version);
      const version = await client.beta.skills.versions.retrieve(versionId, { skill_id: skill.skill_id });
      let dirname23 = path3.basename(version.name.trim());
      if (dirname23 === "" || dirname23 === "." || dirname23 === "..")
        dirname23 = skill.skill_id;
      const dest = path3.resolve(skillsRoot, dirname23);
      if (dest !== skillsRoot && !dest.startsWith(skillsRoot + path3.sep)) {
        log8.warn("skill name escapes the skills dir; skipping", {
          component: "agent-tool-context",
          name: version.name
        });
        continue;
      }
      const resp = await client.beta.skills.versions.download(versionId, { skill_id: skill.skill_id });
      await fs2.rm(dest, { recursive: true, force: true });
      await fs2.mkdir(dest, { recursive: true, mode: DIR_CREATE_MODE });
      created.push(dest);
      await extractSkillArchive(resp, dest);
      log8.info("downloaded skill", {
        component: "agent-tool-context",
        skill_id: skill.skill_id,
        version: versionId,
        dest
      });
    } catch (e) {
      log8.warn("failed to download skill", {
        component: "agent-tool-context",
        skill_id: skill.skill_id,
        error: String(e)
      });
    }
  }
  return async () => {
    for (const dest of created) {
      await fs2.rm(dest, { recursive: true, force: true }).catch((e) => {
        log8.warn("failed to clean up skill", { component: "agent-tool-context", dest, error: String(e) });
      });
    }
  };
}
async function resolveSkillVersion(client, skillId, version) {
  if (/^\d+$/.test(version))
    return version;
  let newest;
  for await (const v of client.beta.skills.versions.list(skillId)) {
    if (/^\d+$/.test(v.version) && (newest === void 0 || BigInt(v.version) > BigInt(newest))) {
      newest = v.version;
    }
  }
  if (newest === void 0) {
    throw new AnthropicError(`skill ${JSON.stringify(skillId)} has no concrete version to resolve ${JSON.stringify(version)} against`);
  }
  return newest;
}
function assertSafeMemberNames(names) {
  for (const raw of names.split("\n")) {
    const entry = raw.trim();
    if (!entry)
      continue;
    if (path3.isAbsolute(entry) || entry.split(/[\\/]/).includes("..")) {
      throw new AnthropicError(`refusing to extract unsafe archive member: ${entry}`);
    }
  }
}
function assertNoSpecialMembers(verboseListing) {
  for (const line of verboseListing.split("\n")) {
    const type2 = line.trimStart()[0];
    if (type2 === "l" || type2 === "h" || type2 === "b" || type2 === "c" || type2 === "p" || type2 === "s") {
      throw new AnthropicError("refusing to extract archive with symlink/hardlink/device member");
    }
  }
}
async function runArchiveTool(cmd, args) {
  try {
    const { stdout } = await execFileAsync(cmd, args);
    return stdout;
  } catch (e) {
    if (e != null && typeof e === "object" && e.code === "ENOENT") {
      throw new AnthropicError(`skill extraction requires the \`${cmd}\` command, but it was not found on PATH`);
    }
    throw e;
  }
}
function archiveTopDir(listing) {
  let top;
  let nested = false;
  for (const raw of listing.split("\n")) {
    const parts = raw.trim().split("/").filter((p) => p !== "" && p !== ".");
    if (parts.length === 0)
      continue;
    const first = parts[0];
    if (top === void 0)
      top = first;
    else if (first !== top)
      return "";
    if (parts.length > 1)
      nested = true;
  }
  return top !== void 0 && nested ? top : "";
}
async function extractSkillArchive(resp, dest) {
  const tmp = path3.join(dest, `.skill-archive-${process.pid}-${Date.now()}`);
  if (!resp.body) {
    throw new AnthropicError("skill download response had no body");
  }
  await pipeline(Readable.fromWeb(resp.body), fssync.createWriteStream(tmp));
  const stage = path3.join(path3.dirname(dest), `.skill-stage-${process.pid}-${Date.now()}`);
  try {
    const head = await readHead(tmp, 4);
    const isZip = head.length >= 4 && head[0] === 80 && head[1] === 75 && head[2] === 3 && head[3] === 4;
    const archiveCmd = isZip ? "unzip" : "tar";
    const listing = await runArchiveTool(archiveCmd, isZip ? ["-Z1", tmp] : ["-tf", tmp]);
    assertSafeMemberNames(listing);
    assertNoSpecialMembers(await runArchiveTool(archiveCmd, isZip ? ["-Z", tmp] : ["-tvf", tmp]));
    const top = archiveTopDir(listing);
    await fs2.mkdir(stage, { recursive: true, mode: DIR_CREATE_MODE });
    await runArchiveTool(archiveCmd, isZip ? ["-oq", tmp, "-d", stage] : ["-xf", tmp, "-C", stage]);
    const srcRoot = top ? path3.join(stage, top) : stage;
    for (const entry of await fs2.readdir(srcRoot)) {
      await fs2.rename(path3.join(srcRoot, entry), path3.join(dest, entry));
    }
  } finally {
    await fs2.rm(tmp, { force: true });
    await fs2.rm(stage, { recursive: true, force: true });
  }
}
async function readHead(file, n) {
  const handle = await fs2.open(file, "r");
  try {
    const buf = Buffer.alloc(n);
    const { bytesRead } = await handle.read(buf, 0, n, 0);
    return buf.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}
var execFileAsync;
var init_skills = __esm({
  "node_modules/@anthropic-ai/sdk/tools/agent-toolset/skills.mjs"() {
    init_error();
    init_log();
    init_fs_util();
    execFileAsync = promisify(execFile);
  }
});

// node_modules/@anthropic-ai/sdk/tools/agent-toolset/node.mjs
var node_exports = {};
__export(node_exports, {
  BashSession: () => BashSession,
  betaAgentToolset20260401: () => betaAgentToolset20260401,
  betaBashTool: () => betaBashTool,
  betaEditTool: () => betaEditTool,
  betaGlobTool: () => betaGlobTool,
  betaGrepTool: () => betaGrepTool,
  betaReadTool: () => betaReadTool,
  betaWriteTool: () => betaWriteTool,
  extractSkillArchive: () => extractSkillArchive,
  resolvePath: () => resolvePath,
  resolveSkillVersion: () => resolveSkillVersion,
  setupSkills: () => setupSkills
});
import * as fs3 from "node:fs/promises";
import * as fssync2 from "node:fs";
import * as path4 from "node:path";
import * as cp from "node:child_process";
import * as crypto from "node:crypto";
import * as readline from "node:readline";
function betaAgentToolset20260401(ctx) {
  return [
    betaBashTool(ctx),
    betaReadTool(ctx),
    betaWriteTool(ctx),
    betaEditTool(ctx),
    betaGlobTool(ctx),
    betaGrepTool(ctx)
  ];
}
function resolvePath(ctx, p) {
  return confineToRoot(ctx.workdir, p, { allowOutside: ctx.unrestrictedPaths ?? false });
}
function scrubbedShellEnv() {
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith("ANTHROPIC_"))
      continue;
    env[key] = value;
  }
  return env;
}
function betaBashTool(ctx) {
  let session;
  let tail = Promise.resolve();
  return betaTool({
    name: "bash",
    description: "Run a bash command in a persistent shell. State (cwd, env vars) persists across calls.",
    inputSchema: {
      type: "object",
      properties: {
        command: { type: "string", description: "The command to run" },
        restart: { type: "boolean", description: "Restart the persistent shell before running" },
        timeout_ms: { type: "integer", description: "Per-call timeout in milliseconds" }
      }
    },
    run: async ({ command, restart, timeout_ms }, context) => {
      const prev = tail;
      const gate = promiseWithResolvers();
      tail = gate.promise;
      try {
        await prev;
      } catch {
      }
      try {
        if (restart) {
          session?.close();
          session = void 0;
        }
        if (!command) {
          if (restart)
            return "bash session restarted";
          throw new ToolError("bash: command is required");
        }
        session ?? (session = new BashSession(ctx.workdir, ctx.env));
        try {
          const { output, exitCode } = await session.exec(command, {
            timeoutMs: timeout_ms ?? BASH_DEFAULT_TIMEOUT_MS,
            signal: context?.signal
          });
          if (exitCode !== 0)
            throw new ToolError(output || `exit ${exitCode}`);
          return output;
        } catch (e) {
          if (e instanceof ToolError)
            throw e;
          session.close();
          session = void 0;
          throw new ToolError(`bash: ${e instanceof Error ? e.message : String(e)}`);
        }
      } finally {
        gate.resolve();
      }
    },
    close: () => {
      session?.close();
      session = void 0;
    }
  });
}
function betaReadTool(ctx) {
  return betaTool({
    name: "read",
    description: "Read a UTF-8 text file relative to the workdir.",
    inputSchema: {
      type: "object",
      properties: {
        file_path: { type: "string" },
        view_range: {
          type: "array",
          items: { type: "integer" },
          description: "[start_line, end_line] 1-indexed inclusive"
        }
      },
      required: ["file_path"]
    },
    run: async ({ file_path, view_range }) => {
      if (!file_path)
        throw new ToolError("read: file_path is required");
      const abs = await resolvePath(ctx, file_path);
      let data;
      try {
        const st = await fs3.stat(abs);
        if (!st.isFile()) {
          throw new ToolError(`read: ${file_path} is not a regular file`);
        }
        if (st.size > READ_MAX_BYTES) {
          throw new ToolError(`read: ${file_path} is ${st.size} bytes, exceeds ${READ_MAX_BYTES}-byte limit. Use bash (head/tail/sed) to read a slice.`);
        }
        data = await fs3.readFile(abs, "utf8");
      } catch (e) {
        if (e instanceof ToolError)
          throw e;
        throw new ToolError(`read: ${fsErrorMessage(e, file_path)}`);
      }
      if (!view_range)
        return data;
      if (view_range.length !== 2)
        throw new ToolError("read: view_range must be [start_line, end_line]");
      const [startLine, endLine] = view_range;
      const lines = data.split("\n");
      const start = Math.max(0, startLine - 1);
      const end = endLine > 0 ? endLine : lines.length;
      return lines.slice(start, end).join("\n");
    }
  });
}
function betaWriteTool(ctx) {
  return betaTool({
    name: "write",
    description: "Write a UTF-8 text file relative to the workdir, creating parent directories as needed.",
    inputSchema: {
      type: "object",
      properties: { file_path: { type: "string" }, content: { type: "string" } },
      required: ["file_path", "content"]
    },
    run: async ({ file_path, content }) => {
      if (!file_path)
        throw new ToolError("write: file_path is required");
      const abs = await resolvePath(ctx, file_path);
      try {
        await fs3.mkdir(path4.dirname(abs), { recursive: true, mode: DIR_CREATE_MODE });
        await atomicWriteFile(abs, content ?? "");
      } catch (e) {
        throw new ToolError(`write: ${fsErrorMessage(e, file_path)}`);
      }
      return `wrote ${Buffer.byteLength(content ?? "")} bytes to ${file_path}`;
    }
  });
}
function betaEditTool(ctx) {
  return betaTool({
    name: "edit",
    description: "Replace old_string with new_string in a file. old_string must be unique unless replace_all.",
    inputSchema: {
      type: "object",
      properties: {
        file_path: { type: "string" },
        old_string: { type: "string" },
        new_string: { type: "string" },
        replace_all: { type: "boolean" }
      },
      required: ["file_path", "old_string", "new_string"]
    },
    run: async ({ file_path, old_string, new_string, replace_all }) => {
      if (!file_path)
        throw new ToolError("edit: file_path is required");
      if (!old_string)
        throw new ToolError("edit: old_string is required");
      const abs = await resolvePath(ctx, file_path);
      let data;
      try {
        const st = await fs3.stat(abs);
        if (!st.isFile()) {
          throw new ToolError(`edit: ${file_path} is not a regular file`);
        }
        if (st.size > EDIT_MAX_BYTES) {
          throw new ToolError(`edit: ${file_path} is ${st.size} bytes, exceeds ${EDIT_MAX_BYTES}-byte limit. Use bash (sed/awk) to edit a large file.`);
        }
        data = await fs3.readFile(abs, "utf8");
      } catch (e) {
        if (e instanceof ToolError)
          throw e;
        throw new ToolError(`edit: ${fsErrorMessage(e, file_path)}`);
      }
      const count = data.split(old_string).length - 1;
      if (count === 0)
        throw new ToolError(`edit: old_string not found in ${file_path}`);
      let updated;
      if (replace_all) {
        updated = data.split(old_string).join(new_string);
      } else {
        if (count > 1)
          throw new ToolError(`edit: old_string appears ${count} times in ${file_path} (must be unique)`);
        updated = data.replace(old_string, () => new_string);
      }
      try {
        await atomicWriteFile(abs, updated);
      } catch (e) {
        throw new ToolError(`edit: write: ${fsErrorMessage(e, file_path)}`);
      }
      return `edited ${file_path} (${replace_all ? count : 1} replacement(s))`;
    }
  });
}
function betaGlobTool(ctx) {
  return betaTool({
    name: "glob",
    description: "Match files under the workdir against a glob pattern. Results are mtime-sorted, newest first.",
    inputSchema: {
      type: "object",
      properties: {
        pattern: { type: "string" },
        path: { type: "string", description: "Directory to search in. Defaults to the workdir." }
      },
      required: ["pattern"]
    },
    run: async ({ pattern, path: searchPath }) => {
      if (!pattern)
        throw new ToolError("glob: pattern is required");
      let root = path4.resolve(ctx.workdir);
      let pat = pattern;
      if (path4.isAbsolute(pattern)) {
        if (!ctx.unrestrictedPaths)
          throw new ToolError("glob: absolute pattern not permitted");
        root = path4.parse(pattern).root;
        pat = path4.relative(root, pattern);
      } else if (searchPath) {
        root = await resolvePath(ctx, searchPath);
      }
      if (!ctx.unrestrictedPaths && pat.split(/[\\/]/).includes("..")) {
        throw new ToolError('glob: ".." is not permitted in the pattern');
      }
      const matches = [];
      try {
        for await (const entry of fsGlob(pat, {
          cwd: root,
          withFileTypes: true,
          exclude: (d) => d.name === ".git" || d.name === "node_modules"
        })) {
          if (!entry.isFile())
            continue;
          const full = path4.join(entry.parentPath, entry.name);
          if (!ctx.unrestrictedPaths && !isWithin(root, full))
            continue;
          let mtime = 0;
          try {
            mtime = (await fs3.stat(full)).mtimeMs;
          } catch {
          }
          matches.push({ path: full, mtime });
        }
      } catch (e) {
        throw new ToolError(`glob: ${e instanceof Error ? e.message : String(e)}`);
      }
      if (matches.length === 0)
        return "no matches";
      matches.sort((a, b) => b.mtime - a.mtime);
      return matches.slice(0, GLOB_RESULT_LIMIT).map((m) => m.path).join("\n");
    }
  });
}
function betaGrepTool(ctx) {
  return betaTool({
    name: "grep",
    description: "Search file contents for a regex. Uses ripgrep if available, otherwise a built-in walker.",
    inputSchema: {
      type: "object",
      properties: { pattern: { type: "string" }, path: { type: "string" } },
      required: ["pattern"]
    },
    run: async ({ pattern, path: p }, context) => {
      if (!pattern)
        throw new ToolError("grep: pattern is required");
      let searchPath = path4.resolve(ctx.workdir);
      if (p)
        searchPath = await resolvePath(ctx, p);
      const rg = await findRg();
      return rg ? runRipgrep(rg, pattern, searchPath, context?.signal) : runWalkGrep(pattern, searchPath, context?.signal);
    }
  });
}
function runRipgrep(rg, pattern, searchPath, signal) {
  return new Promise((resolve9, reject) => {
    const proc = cp.spawn(rg, ["-n", "--no-heading", "-e", pattern, "--", searchPath], {
      ...signal ? { signal } : {}
    });
    let out = "";
    let errOut = "";
    let truncated = false;
    proc.stdout.on("data", (d) => {
      if (truncated)
        return;
      out += d;
      if (out.length > GREP_OUTPUT_LIMIT) {
        truncated = true;
        out = out.slice(0, GREP_OUTPUT_LIMIT);
        proc.kill("SIGKILL");
      }
    });
    proc.stderr.on("data", (d) => errOut += d);
    proc.on("close", (code) => {
      if (signal?.aborted)
        return reject(new ToolError("grep: aborted"));
      if (truncated)
        return resolve9(out + `
[output truncated at ${GREP_OUTPUT_LIMIT} bytes]`);
      if (code === 0)
        return resolve9(out);
      if (code === 1)
        return resolve9("no matches");
      reject(new ToolError(`grep: rg failed: ${errOut || `exit ${code}`}`));
    });
    proc.on("error", (e) => {
      if (signal?.aborted)
        return reject(new ToolError("grep: aborted"));
      reject(new ToolError(`grep: rg failed: ${e.message}`));
    });
  });
}
async function runWalkGrep(pattern, root, signal) {
  let re;
  try {
    re = new RegExp(pattern);
  } catch (e) {
    throw new ToolError(`grep: invalid regex: ${e instanceof Error ? e.message : String(e)}`);
  }
  const hits = [];
  let budget = GREP_OUTPUT_LIMIT;
  const push = (line) => {
    budget -= line.length + 1;
    if (budget < 0) {
      hits.push(`[output truncated at ${GREP_OUTPUT_LIMIT} bytes]`);
      return false;
    }
    hits.push(line);
    return true;
  };
  const stat2 = await fs3.stat(root).catch(() => null);
  if (stat2?.isFile()) {
    await grepFile(root, re, push);
  } else {
    await walk2(root, "", (rel) => grepFile(path4.join(root, rel), re, push), signal);
  }
  if (signal?.aborted)
    throw new ToolError("grep: aborted");
  if (hits.length === 0)
    return "no matches";
  return hits.join("\n");
}
async function grepFile(file, re, push) {
  const stream = fssync2.createReadStream(file, { encoding: "utf8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let i = 0;
  try {
    for await (const line of rl) {
      i++;
      if (line.length > GREP_MAX_LINE_LENGTH)
        continue;
      if (re.test(line) && !push(`${file}:${i}:${line}`))
        return false;
    }
  } catch {
  } finally {
    stream.destroy();
  }
  return true;
}
function isWithin(root, p) {
  const rel = path4.relative(root, p);
  return rel === "" || !rel.startsWith(".." + path4.sep) && rel !== ".." && !path4.isAbsolute(rel);
}
async function walk2(root, rel, fn, signal) {
  let remaining = WALK_MAX_ENTRIES;
  async function inner(rel2, depth) {
    if (depth > WALK_MAX_DEPTH)
      return true;
    if (signal?.aborted)
      return false;
    let entries;
    try {
      entries = await fs3.readdir(path4.join(root, rel2), { withFileTypes: true });
    } catch {
      return true;
    }
    for (const e of entries) {
      if (e.name === ".git" || e.name === "node_modules")
        continue;
      if (remaining-- <= 0)
        return false;
      if (signal?.aborted)
        return false;
      const childRel = rel2 ? path4.join(rel2, e.name) : e.name;
      if (e.isDirectory()) {
        if (!await inner(childRel, depth + 1))
          return false;
      } else if (e.isFile()) {
        if (await fn(childRel) === false)
          return false;
      }
    }
    return true;
  }
  await inner(rel, 0);
}
async function findRg() {
  const dirs = (process.env["PATH"] ?? "").split(path4.delimiter);
  for (const d of dirs) {
    const candidate = path4.join(d, "rg");
    try {
      await fs3.access(candidate, fssync2.constants.X_OK);
      return candidate;
    } catch {
    }
  }
  return null;
}
var _BashSession_instances, _BashSession_proc, _BashSession_buf, _BashSession_truncated, _BashSession_closed, _BashSession_waiting, _BashSession_append, BASH_OUTPUT_LIMIT, BASH_DEFAULT_TIMEOUT_MS, READ_MAX_BYTES, EDIT_MAX_BYTES, GREP_OUTPUT_LIMIT, GREP_MAX_LINE_LENGTH, GLOB_RESULT_LIMIT, ANSI_RE, fsGlob, BashSession, WALK_MAX_DEPTH, WALK_MAX_ENTRIES;
var init_node = __esm({
  "node_modules/@anthropic-ai/sdk/tools/agent-toolset/node.mjs"() {
    init_tslib();
    init_error();
    init_ToolError();
    init_json_schema();
    init_promise();
    init_fs_util();
    init_skills();
    BASH_OUTPUT_LIMIT = 100 * 1024;
    BASH_DEFAULT_TIMEOUT_MS = 12e4;
    READ_MAX_BYTES = 256 * 1024;
    EDIT_MAX_BYTES = READ_MAX_BYTES;
    GREP_OUTPUT_LIMIT = 100 * 1024;
    GREP_MAX_LINE_LENGTH = 2e3;
    GLOB_RESULT_LIMIT = 200;
    ANSI_RE = /\x1b\[[0-9;?]*[ -/]*[@-~]/g;
    fsGlob = fs3.glob;
    BashSession = class {
      constructor(dir, env = scrubbedShellEnv()) {
        _BashSession_instances.add(this);
        _BashSession_proc.set(this, void 0);
        _BashSession_buf.set(this, "");
        _BashSession_truncated.set(this, false);
        _BashSession_closed.set(this, false);
        _BashSession_waiting.set(this, null);
        __classPrivateFieldSet(this, _BashSession_proc, cp.spawn("/bin/bash", ["--noprofile", "--norc"], {
          cwd: dir,
          // `env` is the full base environment (the scrubbed process env by
          // default, or the verbatim replacement from `AgentToolContext.env`).
          // PS1/PS2/TERM are shell-control settings BashSession always applies so
          // the pipe-based sentinel exec parsing works — not part of the
          // user-facing environment.
          env: { ...env, PS1: "", PS2: "", TERM: "dumb" },
          stdio: ["pipe", "pipe", "pipe"],
          detached: true
        }), "f");
        __classPrivateFieldGet(this, _BashSession_proc, "f").stdout.setEncoding("utf8");
        __classPrivateFieldGet(this, _BashSession_proc, "f").stderr.setEncoding("utf8");
        __classPrivateFieldGet(this, _BashSession_proc, "f").stdout.on("data", (d) => __classPrivateFieldGet(this, _BashSession_instances, "m", _BashSession_append).call(this, d));
        __classPrivateFieldGet(this, _BashSession_proc, "f").stderr.on("data", (d) => __classPrivateFieldGet(this, _BashSession_instances, "m", _BashSession_append).call(this, d));
        __classPrivateFieldGet(this, _BashSession_proc, "f").once("close", () => {
          __classPrivateFieldSet(this, _BashSession_closed, true, "f");
          const w = __classPrivateFieldGet(this, _BashSession_waiting, "f");
          __classPrivateFieldSet(this, _BashSession_waiting, null, "f");
          w?.resolve();
        });
      }
      /** Whether the underlying shell process has exited. */
      get closed() {
        return __classPrivateFieldGet(this, _BashSession_closed, "f");
      }
      async exec(command, opts = {}) {
        if (__classPrivateFieldGet(this, _BashSession_closed, "f")) {
          throw new AnthropicError("bash session terminated");
        }
        const timeoutMs = opts.timeoutMs ?? BASH_DEFAULT_TIMEOUT_MS;
        const signal = opts.signal;
        if (signal?.aborted) {
          throw new AnthropicError("bash command aborted");
        }
        __classPrivateFieldSet(this, _BashSession_buf, "", "f");
        __classPrivateFieldSet(this, _BashSession_truncated, false, "f");
        const sentinel2 = `__ANT_CMD_${crypto.randomUUID()}_DONE__`;
        const sentinelSplit = `${sentinel2.slice(0, 8)}''${sentinel2.slice(8)}`;
        const wrapped = `{ ${command}
} </dev/null 2>&1; printf '\\n${sentinelSplit}%d\\n' $?
`;
        __classPrivateFieldGet(this, _BashSession_proc, "f").stdin.write(wrapped);
        if (__classPrivateFieldGet(this, _BashSession_buf, "f").indexOf(sentinel2) < 0) {
          const { promise: sentinelSeen, resolve: resolve9 } = promiseWithResolvers();
          __classPrivateFieldSet(this, _BashSession_waiting, { sentinel: sentinel2, resolve: resolve9 }, "f");
          let timer;
          let onAbort;
          try {
            await Promise.race([
              sentinelSeen,
              new Promise((_, reject) => {
                timer = setTimeout(() => reject(new AnthropicError(`bash command timed out after ${timeoutMs}ms`)), timeoutMs);
              }),
              new Promise((_, reject) => {
                if (!signal)
                  return;
                onAbort = () => reject(new AnthropicError("bash command aborted"));
                signal.addEventListener("abort", onAbort, { once: true });
              })
            ]);
          } finally {
            if (timer)
              clearTimeout(timer);
            if (onAbort && signal)
              signal.removeEventListener("abort", onAbort);
            __classPrivateFieldSet(this, _BashSession_waiting, null, "f");
          }
        }
        const idx = __classPrivateFieldGet(this, _BashSession_buf, "f").indexOf(sentinel2);
        if (idx < 0) {
          throw new AnthropicError("bash session terminated");
        }
        const tail = __classPrivateFieldGet(this, _BashSession_buf, "f").slice(idx + sentinel2.length);
        const m = tail.match(/^(-?\d+)/);
        const exitCode = m ? parseInt(m[1], 10) : -1;
        let out = __classPrivateFieldGet(this, _BashSession_buf, "f").slice(0, idx).replace(ANSI_RE, "").replace(/\n+$/, "");
        if (__classPrivateFieldGet(this, _BashSession_truncated, "f")) {
          out = `[output truncated]
${out}`;
        }
        return { output: out, exitCode };
      }
      close() {
        if (__classPrivateFieldGet(this, _BashSession_closed, "f"))
          return;
        __classPrivateFieldSet(this, _BashSession_closed, true, "f");
        const w = __classPrivateFieldGet(this, _BashSession_waiting, "f");
        __classPrivateFieldSet(this, _BashSession_waiting, null, "f");
        w?.resolve();
        __classPrivateFieldGet(this, _BashSession_proc, "f").stdout.destroy();
        __classPrivateFieldGet(this, _BashSession_proc, "f").stderr.destroy();
        __classPrivateFieldGet(this, _BashSession_proc, "f").stdin.destroy();
        try {
          process.kill(-__classPrivateFieldGet(this, _BashSession_proc, "f").pid, "SIGKILL");
        } catch {
          __classPrivateFieldGet(this, _BashSession_proc, "f").kill("SIGKILL");
        }
        __classPrivateFieldGet(this, _BashSession_proc, "f").unref();
      }
    };
    _BashSession_proc = /* @__PURE__ */ new WeakMap(), _BashSession_buf = /* @__PURE__ */ new WeakMap(), _BashSession_truncated = /* @__PURE__ */ new WeakMap(), _BashSession_closed = /* @__PURE__ */ new WeakMap(), _BashSession_waiting = /* @__PURE__ */ new WeakMap(), _BashSession_instances = /* @__PURE__ */ new WeakSet(), _BashSession_append = function _BashSession_append2(d) {
      __classPrivateFieldSet(this, _BashSession_buf, __classPrivateFieldGet(this, _BashSession_buf, "f") + d, "f");
      if (__classPrivateFieldGet(this, _BashSession_buf, "f").length > BASH_OUTPUT_LIMIT) {
        __classPrivateFieldSet(this, _BashSession_buf, __classPrivateFieldGet(this, _BashSession_buf, "f").slice(__classPrivateFieldGet(this, _BashSession_buf, "f").length - BASH_OUTPUT_LIMIT), "f");
        __classPrivateFieldSet(this, _BashSession_truncated, true, "f");
      }
      if (__classPrivateFieldGet(this, _BashSession_waiting, "f") && __classPrivateFieldGet(this, _BashSession_buf, "f").indexOf(__classPrivateFieldGet(this, _BashSession_waiting, "f").sentinel) >= 0) {
        const w = __classPrivateFieldGet(this, _BashSession_waiting, "f");
        __classPrivateFieldSet(this, _BashSession_waiting, null, "f");
        w.resolve();
      }
    };
    WALK_MAX_DEPTH = 40;
    WALK_MAX_ENTRIES = 5e4;
  }
});

// node_modules/@anthropic-ai/sdk/lib/environments/worker.mjs
async function forceStop(client, work, log8, requestOptions) {
  try {
    await client.beta.environments.work.stop(
      work.id,
      { environment_id: work.environment_id, force: true },
      // Caller's headers pass through; the helper-tag header is on the scoped
      // sub-client's default_headers via copyClientForHelper, so no per-call
      // re-stamping needed.
      { ...requestOptions, headers: buildHeaders([requestOptions?.headers]) }
    );
  } catch (e) {
    if (!isStatus(e, 409)) {
      log8.error("force-stop on exit failed", { work_id: work.id, error: String(e) });
    }
  }
}
async function heartbeatLoop(client, work, ctrl, logger, requestOptions) {
  let intervalMs = HEARTBEAT_DEFAULT_MS;
  let last = NO_HEARTBEAT_SENTINEL;
  const beat = async () => {
    try {
      const resp = await client.beta.environments.work.heartbeat(work.id, { environment_id: work.environment_id, expected_last_heartbeat: last }, { ...requestOptions, headers: buildHeaders([requestOptions?.headers]), signal: ctrl.signal });
      last = resp.last_heartbeat;
      if (resp.ttl_seconds > 0) {
        intervalMs = Math.max(1e3, Math.min(resp.ttl_seconds * 1e3 / 2, HEARTBEAT_DEFAULT_MS));
      }
      if (resp.state === "stopping" || resp.state === "stopped") {
        logger.info("heartbeat signals shutdown", { work_id: work.id, state: resp.state });
        ctrl.abort();
      }
      if (!resp.lease_extended) {
        logger.warn("lease not extended, shutting down", { work_id: work.id });
        ctrl.abort();
      }
    } catch (e) {
      ctrl.signal.throwIfAborted();
      if (isFatal4xx(e)) {
        logger.error("permanent heartbeat failure", { work_id: work.id, error: String(e) });
        ctrl.abort();
        throw e;
      }
      logger.warn("transient heartbeat failure", { work_id: work.id, error: String(e) });
    }
  };
  await beat();
  while (!ctrl.signal.aborted) {
    await sleep3(intervalMs, ctrl.signal);
    ctrl.signal.throwIfAborted();
    await beat();
  }
}
var _EnvironmentWorker_instances, _EnvironmentWorker_signal, _EnvironmentWorker_handleItem, HEARTBEAT_DEFAULT_MS, NO_HEARTBEAT_SENTINEL, EnvironmentWorker;
var init_worker = __esm({
  "node_modules/@anthropic-ai/sdk/lib/environments/worker.mjs"() {
    init_tslib();
    init_error();
    init_log();
    init_env();
    init_sleep();
    init_backoff();
    init_abort();
    init_headers();
    init_SessionToolRunner();
    init_poller();
    init_helper_client();
    HEARTBEAT_DEFAULT_MS = 3e4;
    NO_HEARTBEAT_SENTINEL = "NO_HEARTBEAT";
    EnvironmentWorker = class {
      constructor(opts) {
        _EnvironmentWorker_instances.add(this);
        _EnvironmentWorker_signal.set(this, void 0);
        this.client = opts.client;
        this.environmentId = opts.environmentId;
        this.environmentKey = opts.environmentKey;
        this.tools = opts.tools;
        this.workdir = opts.workdir ?? process.cwd();
        this.unrestrictedPaths = opts.unrestrictedPaths;
        this.maxIdleMs = opts.maxIdleMs;
        this.workerId = opts.workerId;
        this.requestOptions = opts.requestOptions;
        __classPrivateFieldSet(this, _EnvironmentWorker_signal, opts.signal, "f");
      }
      /**
       * Poll the environment and service each claimed session until the supplied
       * signal (or the one passed to the constructor) aborts. Throws if
       * `environmentId` / `environmentKey` were not provided to the constructor.
       */
      async run(signal) {
        const { environmentId, environmentKey } = this;
        if (environmentId === void 0 || environmentKey === void 0) {
          throw new AnthropicError("EnvironmentWorker.run: environmentId and environmentKey are required to poll for work");
        }
        const externalSignal = signal ?? __classPrivateFieldGet(this, _EnvironmentWorker_signal, "f");
        const poller = new WorkPoller({
          client: this.client,
          environmentId,
          environmentKey,
          ...this.workerId !== void 0 ? { workerId: this.workerId } : {},
          ...externalSignal ? { signal: externalSignal } : {},
          ...this.requestOptions !== void 0 ? { requestOptions: this.requestOptions } : {},
          // The per-item handler force-stops every work item on exit; let it be the
          // single owner of `work.stop` rather than double-posting from the poller.
          autoStop: false
        });
        for await (const work of poller) {
          await __classPrivateFieldGet(this, _EnvironmentWorker_instances, "m", _EnvironmentWorker_handleItem).call(this, work, environmentKey, poller.signal);
        }
      }
      /**
       * Service a single, already-claimed work item without the poll loop: build the
       * per-session {@link AgentToolContext} (workdir from this worker's options),
       * download the session agent's skills (`setupSkills`), run a
       * {@link SessionToolRunner} for the session while heartbeating the work-item
       * lease in parallel, and force-stop the work item on exit (whether the runner
       * finishes normally, throws, or the heartbeat loop signals shutdown).
       *
       * Use this when something else does the claiming — e.g. a `worker poll
       * --on-work` script that hands an already-claimed item to a fresh process. The
       * work id / environment id / session id each fall back to `ANTHROPIC_WORK_ID` /
       * `ANTHROPIC_ENVIRONMENT_ID` / `ANTHROPIC_SESSION_ID` (the env vars that
       * command sets) when not passed; the environment key resolves from this
       * option, then the worker's own `environmentKey`, then
       * `ANTHROPIC_ENVIRONMENT_KEY`. With no arguments inside that command it just
       * works. Throws a clear error naming the first of the four required values
       * still missing after resolution.
       */
      async handleItem(opts) {
        const workId = opts?.workId ?? readEnv("ANTHROPIC_WORK_ID");
        const environmentId = opts?.environmentId ?? readEnv("ANTHROPIC_ENVIRONMENT_ID");
        const sessionId = opts?.sessionId ?? readEnv("ANTHROPIC_SESSION_ID");
        const environmentKey = opts?.environmentKey ?? this.environmentKey ?? readEnv("ANTHROPIC_ENVIRONMENT_KEY");
        if (!workId) {
          throw new AnthropicError("handleItem: workId is required \u2014 pass it or set ANTHROPIC_WORK_ID");
        }
        if (!environmentId) {
          throw new AnthropicError("handleItem: environmentId is required \u2014 pass it or set ANTHROPIC_ENVIRONMENT_ID");
        }
        if (!sessionId) {
          throw new AnthropicError("handleItem: sessionId is required \u2014 pass it or set ANTHROPIC_SESSION_ID");
        }
        if (!environmentKey) {
          throw new AnthropicError("handleItem: environmentKey is required \u2014 pass it, construct the worker with it, or set ANTHROPIC_ENVIRONMENT_KEY");
        }
        const work = {
          id: workId,
          environment_id: environmentId,
          data: { type: "session", id: sessionId }
        };
        await __classPrivateFieldGet(this, _EnvironmentWorker_instances, "m", _EnvironmentWorker_handleItem).call(this, work, environmentKey, opts?.signal ?? __classPrivateFieldGet(this, _EnvironmentWorker_signal, "f"));
      }
    };
    _EnvironmentWorker_signal = /* @__PURE__ */ new WeakMap(), _EnvironmentWorker_instances = /* @__PURE__ */ new WeakSet(), _EnvironmentWorker_handleItem = /**
     * The per-item body shared by {@link EnvironmentWorker.run}'s poll loop and
     * {@link EnvironmentWorker.handleItem}: run a {@link SessionToolRunner} for the
     * work item's session while heartbeating its lease, force-stopping on exit.
     * Non-session work items are ignored.
     */
    async function _EnvironmentWorker_handleItem2(work, environmentKey, externalSignal) {
      const log8 = loggerFor(this.client);
      const sessionClient = copyClientForHelper(this.client, {
        authToken: environmentKey,
        helper: "environments-worker"
      });
      const sessionId = work.data.id;
      const ctx = {
        workdir: this.workdir,
        client: this.client,
        sessionId,
        ...this.unrestrictedPaths !== void 0 ? { unrestrictedPaths: this.unrestrictedPaths } : {}
      };
      const agentToolset = await Promise.resolve().then(() => (init_node(), node_exports));
      let cleanupSkills = async () => {
      };
      try {
        cleanupSkills = await agentToolset.setupSkills(ctx);
      } catch (e) {
        log8.warn("skill setup failed", { session_id: sessionId, work_id: work.id, error: String(e) });
      }
      const tools = typeof this.tools === "function" ? this.tools(ctx) : this.tools ?? agentToolset.betaAgentToolset20260401(ctx);
      const ctrl = new AbortController();
      const detachExternal = linkAbort(externalSignal, ctrl);
      const heartbeatPromise = heartbeatLoop(sessionClient, work, ctrl, log8, this.requestOptions).catch((e) => {
        if (!ctrl.signal.aborted)
          log8.error("heartbeat loop failed", { work_id: work.id, error: String(e) });
        ctrl.abort();
      });
      try {
        const runner = new SessionToolRunner(sessionId, {
          client: sessionClient,
          tools,
          ...this.maxIdleMs !== void 0 ? { maxIdleMs: this.maxIdleMs } : {},
          ...this.requestOptions !== void 0 ? { requestOptions: this.requestOptions } : {},
          signal: ctrl.signal
        });
        for await (const _ of runner) {
        }
      } finally {
        ctrl.abort();
        detachExternal();
        await heartbeatPromise;
        await cleanupSkills().catch((e) => {
          log8.warn("skill cleanup failed", { session_id: sessionId, work_id: work.id, error: String(e) });
        });
        await forceStop(sessionClient, work, log8, this.requestOptions);
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/environments/work.mjs
var Work;
var init_work = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/environments/work.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_path();
    init_poller();
    init_worker();
    init_poller();
    init_worker();
    Work = class extends APIResource {
      /**
       * Note: these endpoints are called automatically by the pre-built environment
       * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
       * sandbox environments. They are included here as a reference; you do not need to
       * invoke them directly.
       *
       * Retrieve detailed information about a specific work item.
       *
       * @example
       * ```ts
       * const betaSelfHostedWork =
       *   await client.beta.environments.work.retrieve('work_id', {
       *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
       *   });
       * ```
       */
      retrieve(workID, params, options) {
        const { environment_id, betas } = params;
        return this._client.get(path`/v1/environments/${environment_id}/work/${workID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Note: these endpoints are called automatically by the pre-built environment
       * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
       * sandbox environments. They are included here as a reference; you do not need to
       * invoke them directly.
       *
       * Update work item metadata with merge semantics.
       *
       * @example
       * ```ts
       * const betaSelfHostedWork =
       *   await client.beta.environments.work.update('work_id', {
       *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
       *     metadata: { foo: 'string' },
       *   });
       * ```
       */
      update(workID, params, options) {
        const { environment_id, betas, ...body } = params;
        return this._client.post(path`/v1/environments/${environment_id}/work/${workID}?beta=true`, {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Note: these endpoints are called automatically by the pre-built environment
       * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
       * sandbox environments. They are included here as a reference; you do not need to
       * invoke them directly.
       *
       * List work items in an environment.
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaSelfHostedWork of client.beta.environments.work.list(
       *   'env_011CZkZ9X2dpNyB7HsEFoRfW',
       * )) {
       *   // ...
       * }
       * ```
       */
      list(environmentID, params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList(path`/v1/environments/${environmentID}/work?beta=true`, PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Note: these endpoints are called automatically by the pre-built environment
       * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
       * sandbox environments. They are included here as a reference; you do not need to
       * invoke them directly.
       *
       * Acknowledge receipt of a work item, transitioning it from 'queued' to 'starting'
       * and removing it from the queue.
       *
       * @example
       * ```ts
       * const betaSelfHostedWork =
       *   await client.beta.environments.work.ack('work_id', {
       *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
       *   });
       * ```
       */
      ack(workID, params, options) {
        const { environment_id, betas } = params;
        return this._client.post(path`/v1/environments/${environment_id}/work/${workID}/ack?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Note: these endpoints are called automatically by the pre-built environment
       * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
       * sandbox environments. They are included here as a reference; you do not need to
       * invoke them directly.
       *
       * Record a heartbeat for a work item to maintain the lease.
       *
       * @example
       * ```ts
       * const betaSelfHostedWorkHeartbeatResponse =
       *   await client.beta.environments.work.heartbeat('work_id', {
       *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
       *   });
       * ```
       */
      heartbeat(workID, params, options) {
        const { environment_id, desired_ttl_seconds, expected_last_heartbeat, betas } = params;
        return this._client.post(path`/v1/environments/${environment_id}/work/${workID}/heartbeat?beta=true`, {
          query: { desired_ttl_seconds, expected_last_heartbeat },
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Note: these endpoints are called automatically by the pre-built environment
       * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
       * sandbox environments. They are included here as a reference; you do not need to
       * invoke them directly.
       *
       * Long poll for work items in the queue.
       *
       * @example
       * ```ts
       * const betaSelfHostedWork =
       *   await client.beta.environments.work.poll(
       *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
       *   );
       * ```
       */
      poll(environmentID, params = {}, options) {
        const { betas, "Anthropic-Worker-ID": anthropicWorkerID, ...query } = params ?? {};
        return this._client.get(path`/v1/environments/${environmentID}/work/poll?beta=true`, {
          query,
          ...options,
          headers: buildHeaders([
            {
              "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString(),
              ...anthropicWorkerID != null ? { "Anthropic-Worker-ID": anthropicWorkerID } : void 0
            },
            options?.headers
          ])
        });
      }
      /**
       * Get statistics about the work queue for an environment.
       *
       * @example
       * ```ts
       * const betaSelfHostedWorkQueueStats =
       *   await client.beta.environments.work.stats(
       *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
       *   );
       * ```
       */
      stats(environmentID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.get(path`/v1/environments/${environmentID}/work/stats?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Note: these endpoints are called automatically by the pre-built environment
       * worker provided in the SDKs and CLI, for orchestrating sessions with self-hosted
       * sandbox environments. They are included here as a reference; you do not need to
       * invoke them directly.
       *
       * Stop a work item, initiating graceful or forced shutdown.
       *
       * @example
       * ```ts
       * const betaSelfHostedWork =
       *   await client.beta.environments.work.stop('work_id', {
       *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
       *   });
       * ```
       */
      stop(workID, params, options) {
        const { environment_id, betas, ...body } = params;
        return this._client.post(path`/v1/environments/${environment_id}/work/${workID}/stop?beta=true`, {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Continuously claim work from a self-hosted environment, ack each item,
       * and yield it. Posts `stop` automatically when the consumer's loop body
       * returns or when iteration ends.
       *
       * @example
       * ```ts
       * for await (const work of client.beta.environments.work.poller({
       *   environmentId,
       *   environmentKey,
       * })) {
       *   if (work.data.type !== 'session') continue;
       *   // ...service the work...
       * }
       * ```
       */
      poller(opts) {
        return new WorkPoller({ ...opts, client: this._client });
      }
      /**
       * The self-hosted environment runner: poll for work, and for each claimed
       * session set up the workdir, download the agent's skills, run the tools while
       * heartbeating the lease, and force-stop on exit.
       *
       * @example
       * ```ts
       * // Long-running daemon — poll, serve each session, loop:
       * await client.beta.environments.work
       *   .worker({ environmentId, environmentKey, workdir: '/workspace' })
       *   .run();
       *
       * // Or service one already-claimed work item (e.g. inside a sandbox spawned
       * // by `ant worker poll --on-work`) — handleItem() reads the ANTHROPIC_* env vars:
       * await client.beta.environments.work.worker({ workdir: '/workspace' }).handleItem();
       * ```
       */
      worker(opts) {
        return new EnvironmentWorker({ ...opts, client: this._client });
      }
    };
    Work.WorkPoller = WorkPoller;
    Work.EnvironmentWorker = EnvironmentWorker;
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/environments/environments.mjs
var Environments;
var init_environments = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/environments/environments.mjs"() {
    init_resource();
    init_work();
    init_work();
    init_pagination();
    init_headers();
    init_path();
    Environments = class extends APIResource {
      constructor() {
        super(...arguments);
        this.work = new Work(this._client);
      }
      /**
       * Create a new environment with the specified configuration.
       *
       * @example
       * ```ts
       * const betaEnvironment =
       *   await client.beta.environments.create({
       *     name: 'python-data-analysis',
       *   });
       * ```
       */
      create(params, options) {
        const { betas, ...body } = params;
        return this._client.post("/v1/environments?beta=true", {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Retrieve a specific environment by ID.
       *
       * @example
       * ```ts
       * const betaEnvironment =
       *   await client.beta.environments.retrieve(
       *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
       *   );
       * ```
       */
      retrieve(environmentID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.get(path`/v1/environments/${environmentID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Update an existing environment's configuration.
       *
       * @example
       * ```ts
       * const betaEnvironment =
       *   await client.beta.environments.update(
       *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
       *   );
       * ```
       */
      update(environmentID, params, options) {
        const { betas, ...body } = params;
        return this._client.post(path`/v1/environments/${environmentID}?beta=true`, {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List environments with pagination support.
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaEnvironment of client.beta.environments.list()) {
       *   // ...
       * }
       * ```
       */
      list(params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList("/v1/environments?beta=true", PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Delete an environment by ID. Returns a confirmation of the deletion.
       *
       * @example
       * ```ts
       * const betaEnvironmentDeleteResponse =
       *   await client.beta.environments.delete(
       *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
       *   );
       * ```
       */
      delete(environmentID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.delete(path`/v1/environments/${environmentID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Archive an environment by ID. Archived environments cannot be used to create new
       * sessions.
       *
       * @example
       * ```ts
       * const betaEnvironment =
       *   await client.beta.environments.archive(
       *     'env_011CZkZ9X2dpNyB7HsEFoRfW',
       *   );
       * ```
       */
      archive(environmentID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.post(path`/v1/environments/${environmentID}/archive?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
    };
    Environments.Work = Work;
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/memory-stores/memories.mjs
var Memories;
var init_memories = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/memory-stores/memories.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_path();
    Memories = class extends APIResource {
      /**
       * Create a memory
       *
       * @example
       * ```ts
       * const betaManagedAgentsMemory =
       *   await client.beta.memoryStores.memories.create(
       *     'memory_store_id',
       *     { content: 'content', path: 'xx' },
       *   );
       * ```
       */
      create(memoryStoreID, params, options) {
        const { view, betas, ...body } = params;
        return this._client.post(path`/v1/memory_stores/${memoryStoreID}/memories?beta=true`, {
          query: { view },
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Retrieve a memory
       *
       * @example
       * ```ts
       * const betaManagedAgentsMemory =
       *   await client.beta.memoryStores.memories.retrieve(
       *     'memory_id',
       *     { memory_store_id: 'memory_store_id' },
       *   );
       * ```
       */
      retrieve(memoryID, params, options) {
        const { memory_store_id, betas, ...query } = params;
        return this._client.get(path`/v1/memory_stores/${memory_store_id}/memories/${memoryID}?beta=true`, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Update a memory
       *
       * @example
       * ```ts
       * const betaManagedAgentsMemory =
       *   await client.beta.memoryStores.memories.update(
       *     'memory_id',
       *     { memory_store_id: 'memory_store_id' },
       *   );
       * ```
       */
      update(memoryID, params, options) {
        const { memory_store_id, view, betas, ...body } = params;
        return this._client.post(path`/v1/memory_stores/${memory_store_id}/memories/${memoryID}?beta=true`, {
          query: { view },
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List memories
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaManagedAgentsMemoryListItem of client.beta.memoryStores.memories.list(
       *   'memory_store_id',
       * )) {
       *   // ...
       * }
       * ```
       */
      list(memoryStoreID, params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList(path`/v1/memory_stores/${memoryStoreID}/memories?beta=true`, PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Delete a memory
       *
       * @example
       * ```ts
       * const betaManagedAgentsDeletedMemory =
       *   await client.beta.memoryStores.memories.delete(
       *     'memory_id',
       *     { memory_store_id: 'memory_store_id' },
       *   );
       * ```
       */
      delete(memoryID, params, options) {
        const { memory_store_id, expected_content_sha256, betas } = params;
        return this._client.delete(path`/v1/memory_stores/${memory_store_id}/memories/${memoryID}?beta=true`, {
          query: { expected_content_sha256 },
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/memory-stores/memory-versions.mjs
var MemoryVersions;
var init_memory_versions = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/memory-stores/memory-versions.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_path();
    MemoryVersions = class extends APIResource {
      /**
       * Retrieve a memory version
       *
       * @example
       * ```ts
       * const betaManagedAgentsMemoryVersion =
       *   await client.beta.memoryStores.memoryVersions.retrieve(
       *     'memory_version_id',
       *     { memory_store_id: 'memory_store_id' },
       *   );
       * ```
       */
      retrieve(memoryVersionID, params, options) {
        const { memory_store_id, betas, ...query } = params;
        return this._client.get(path`/v1/memory_stores/${memory_store_id}/memory_versions/${memoryVersionID}?beta=true`, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List memory versions
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaManagedAgentsMemoryVersion of client.beta.memoryStores.memoryVersions.list(
       *   'memory_store_id',
       * )) {
       *   // ...
       * }
       * ```
       */
      list(memoryStoreID, params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList(path`/v1/memory_stores/${memoryStoreID}/memory_versions?beta=true`, PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Redact a memory version
       *
       * @example
       * ```ts
       * const betaManagedAgentsMemoryVersion =
       *   await client.beta.memoryStores.memoryVersions.redact(
       *     'memory_version_id',
       *     { memory_store_id: 'memory_store_id' },
       *   );
       * ```
       */
      redact(memoryVersionID, params, options) {
        const { memory_store_id, betas } = params;
        return this._client.post(path`/v1/memory_stores/${memory_store_id}/memory_versions/${memoryVersionID}/redact?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/memory-stores/memory-stores.mjs
var MemoryStores;
var init_memory_stores = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/memory-stores/memory-stores.mjs"() {
    init_resource();
    init_memories();
    init_memories();
    init_memory_versions();
    init_memory_versions();
    init_pagination();
    init_headers();
    init_path();
    MemoryStores = class extends APIResource {
      constructor() {
        super(...arguments);
        this.memories = new Memories(this._client);
        this.memoryVersions = new MemoryVersions(this._client);
      }
      /**
       * Create a memory store
       *
       * @example
       * ```ts
       * const betaManagedAgentsMemoryStore =
       *   await client.beta.memoryStores.create({ name: 'x' });
       * ```
       */
      create(params, options) {
        const { betas, ...body } = params;
        return this._client.post("/v1/memory_stores?beta=true", {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Retrieve a memory store
       *
       * @example
       * ```ts
       * const betaManagedAgentsMemoryStore =
       *   await client.beta.memoryStores.retrieve(
       *     'memory_store_id',
       *   );
       * ```
       */
      retrieve(memoryStoreID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.get(path`/v1/memory_stores/${memoryStoreID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Update a memory store
       *
       * @example
       * ```ts
       * const betaManagedAgentsMemoryStore =
       *   await client.beta.memoryStores.update('memory_store_id');
       * ```
       */
      update(memoryStoreID, params, options) {
        const { betas, ...body } = params;
        return this._client.post(path`/v1/memory_stores/${memoryStoreID}?beta=true`, {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List memory stores
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaManagedAgentsMemoryStore of client.beta.memoryStores.list()) {
       *   // ...
       * }
       * ```
       */
      list(params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList("/v1/memory_stores?beta=true", PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Delete a memory store
       *
       * @example
       * ```ts
       * const betaManagedAgentsDeletedMemoryStore =
       *   await client.beta.memoryStores.delete('memory_store_id');
       * ```
       */
      delete(memoryStoreID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.delete(path`/v1/memory_stores/${memoryStoreID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Archive a memory store
       *
       * @example
       * ```ts
       * const betaManagedAgentsMemoryStore =
       *   await client.beta.memoryStores.archive('memory_store_id');
       * ```
       */
      archive(memoryStoreID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.post(path`/v1/memory_stores/${memoryStoreID}/archive?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
    };
    MemoryStores.Memories = Memories;
    MemoryStores.MemoryVersions = MemoryVersions;
  }
});

// node_modules/@anthropic-ai/sdk/error.mjs
var init_error2 = __esm({
  "node_modules/@anthropic-ai/sdk/error.mjs"() {
    init_error();
  }
});

// node_modules/@anthropic-ai/sdk/internal/decoders/jsonl.mjs
var JSONLDecoder;
var init_jsonl = __esm({
  "node_modules/@anthropic-ai/sdk/internal/decoders/jsonl.mjs"() {
    init_error();
    init_shims();
    init_line();
    JSONLDecoder = class _JSONLDecoder {
      constructor(iterator, controller) {
        this.iterator = iterator;
        this.controller = controller;
      }
      async *decoder() {
        const lineDecoder = new LineDecoder();
        for await (const chunk of this.iterator) {
          for (const line of lineDecoder.decode(chunk)) {
            yield JSON.parse(line);
          }
        }
        for (const line of lineDecoder.flush()) {
          yield JSON.parse(line);
        }
      }
      [Symbol.asyncIterator]() {
        return this.decoder();
      }
      static fromResponse(response, controller) {
        if (!response.body) {
          controller.abort();
          if (typeof globalThis.navigator !== "undefined" && globalThis.navigator.product === "ReactNative") {
            throw new AnthropicError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
          }
          throw new AnthropicError(`Attempted to iterate over a response with no body`);
        }
        return new _JSONLDecoder(ReadableStreamToAsyncIterable(response.body), controller);
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/messages/batches.mjs
var Batches;
var init_batches = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/messages/batches.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_jsonl();
    init_error2();
    init_path();
    Batches = class extends APIResource {
      /**
       * Send a batch of Message creation requests.
       *
       * The Message Batches API can be used to process multiple Messages API requests at
       * once. Once a Message Batch is created, it begins processing immediately. Batches
       * can take up to 24 hours to complete.
       *
       * Learn more about the Message Batches API in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
       *
       * @example
       * ```ts
       * const betaMessageBatch =
       *   await client.beta.messages.batches.create({
       *     requests: [
       *       {
       *         custom_id: 'my-custom-id-1',
       *         params: {
       *           max_tokens: 1024,
       *           messages: [
       *             { content: 'Hello, world', role: 'user' },
       *           ],
       *           model: 'claude-opus-4-6',
       *         },
       *       },
       *     ],
       *   });
       * ```
       */
      create(params, options) {
        const { betas, ...body } = params;
        return this._client.post("/v1/messages/batches?beta=true", {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * This endpoint is idempotent and can be used to poll for Message Batch
       * completion. To access the results of a Message Batch, make a request to the
       * `results_url` field in the response.
       *
       * Learn more about the Message Batches API in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
       *
       * @example
       * ```ts
       * const betaMessageBatch =
       *   await client.beta.messages.batches.retrieve(
       *     'message_batch_id',
       *   );
       * ```
       */
      retrieve(messageBatchID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.get(path`/v1/messages/batches/${messageBatchID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List all Message Batches within a Workspace. Most recently created batches are
       * returned first.
       *
       * Learn more about the Message Batches API in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaMessageBatch of client.beta.messages.batches.list()) {
       *   // ...
       * }
       * ```
       */
      list(params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList("/v1/messages/batches?beta=true", Page, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Delete a Message Batch.
       *
       * Message Batches can only be deleted once they've finished processing. If you'd
       * like to delete an in-progress batch, you must first cancel it.
       *
       * Learn more about the Message Batches API in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
       *
       * @example
       * ```ts
       * const betaDeletedMessageBatch =
       *   await client.beta.messages.batches.delete(
       *     'message_batch_id',
       *   );
       * ```
       */
      delete(messageBatchID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.delete(path`/v1/messages/batches/${messageBatchID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Batches may be canceled any time before processing ends. Once cancellation is
       * initiated, the batch enters a `canceling` state, at which time the system may
       * complete any in-progress, non-interruptible requests before finalizing
       * cancellation.
       *
       * The number of canceled requests is specified in `request_counts`. To determine
       * which requests were canceled, check the individual results within the batch.
       * Note that cancellation may not result in any canceled requests if they were
       * non-interruptible.
       *
       * Learn more about the Message Batches API in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
       *
       * @example
       * ```ts
       * const betaMessageBatch =
       *   await client.beta.messages.batches.cancel(
       *     'message_batch_id',
       *   );
       * ```
       */
      cancel(messageBatchID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.post(path`/v1/messages/batches/${messageBatchID}/cancel?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Streams the results of a Message Batch as a `.jsonl` file.
       *
       * Each line in the file is a JSON object containing the result of a single request
       * in the Message Batch. Results are not guaranteed to be in the same order as
       * requests. Use the `custom_id` field to match results to requests.
       *
       * Learn more about the Message Batches API in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
       *
       * @example
       * ```ts
       * const betaMessageBatchIndividualResponse =
       *   await client.beta.messages.batches.results(
       *     'message_batch_id',
       *   );
       * ```
       */
      async results(messageBatchID, params = {}, options) {
        const batch = await this.retrieve(messageBatchID);
        if (!batch.results_url) {
          throw new AnthropicError(`No batch \`results_url\`; Has it finished processing? ${batch.processing_status} - ${batch.id}`);
        }
        const { betas } = params ?? {};
        return this._client.get(batch.results_url, {
          ...options,
          headers: buildHeaders([
            {
              "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString(),
              Accept: "application/binary"
            },
            options?.headers
          ]),
          stream: true,
          __binaryResponse: true
        })._thenUnwrap((_, props) => JSONLDecoder.fromResponse(props.response, props.controller));
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/internal/constants.mjs
var MODEL_NONSTREAMING_TOKENS;
var init_constants = __esm({
  "node_modules/@anthropic-ai/sdk/internal/constants.mjs"() {
    MODEL_NONSTREAMING_TOKENS = {
      "claude-opus-4-20250514": 8192,
      "claude-opus-4-0": 8192,
      "claude-4-opus-20250514": 8192,
      "anthropic.claude-opus-4-20250514-v1:0": 8192,
      "claude-opus-4@20250514": 8192,
      "claude-opus-4-1-20250805": 8192,
      "anthropic.claude-opus-4-1-20250805-v1:0": 8192,
      "claude-opus-4-1@20250805": 8192
    };
  }
});

// node_modules/@anthropic-ai/sdk/lib/beta-parser.mjs
function getOutputFormat(params) {
  return params?.output_format ?? params?.output_config?.format;
}
function maybeParseBetaMessage(message, params, opts) {
  const outputFormat = getOutputFormat(params);
  if (!params || !("parse" in (outputFormat ?? {}))) {
    return {
      ...message,
      content: message.content.map((block) => {
        if (block.type === "text") {
          const parsedBlock = Object.defineProperty({ ...block }, "parsed_output", {
            value: null,
            enumerable: false
          });
          return Object.defineProperty(parsedBlock, "parsed", {
            get() {
              opts.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead.");
              return null;
            },
            enumerable: false
          });
        }
        return block;
      }),
      parsed_output: null
    };
  }
  return parseBetaMessage(message, params, opts);
}
function parseBetaMessage(message, params, opts) {
  let firstParsedOutput = null;
  const content = message.content.map((block) => {
    if (block.type === "text") {
      const parsedOutput = parseBetaOutputFormat(params, block.text);
      if (firstParsedOutput === null) {
        firstParsedOutput = parsedOutput;
      }
      const parsedBlock = Object.defineProperty({ ...block }, "parsed_output", {
        value: parsedOutput,
        enumerable: false
      });
      return Object.defineProperty(parsedBlock, "parsed", {
        get() {
          opts.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead.");
          return parsedOutput;
        },
        enumerable: false
      });
    }
    return block;
  });
  return {
    ...message,
    content,
    parsed_output: firstParsedOutput
  };
}
function parseBetaOutputFormat(params, content) {
  const outputFormat = getOutputFormat(params);
  if (outputFormat?.type !== "json_schema") {
    return null;
  }
  try {
    if ("parse" in outputFormat) {
      return outputFormat.parse(content);
    }
    return JSON.parse(content);
  } catch (error) {
    throw new AnthropicError(`Failed to parse structured output: ${error}`);
  }
}
var init_beta_parser = __esm({
  "node_modules/@anthropic-ai/sdk/lib/beta-parser.mjs"() {
    init_error();
  }
});

// node_modules/@anthropic-ai/sdk/_vendor/partial-json-parser/parser.mjs
var tokenize, strip, unstrip, generate, partialParse;
var init_parser = __esm({
  "node_modules/@anthropic-ai/sdk/_vendor/partial-json-parser/parser.mjs"() {
    tokenize = (input) => {
      let current = 0;
      let tokens = [];
      while (current < input.length) {
        let char = input[current];
        if (char === "\\") {
          current++;
          continue;
        }
        if (char === "{") {
          tokens.push({
            type: "brace",
            value: "{"
          });
          current++;
          continue;
        }
        if (char === "}") {
          tokens.push({
            type: "brace",
            value: "}"
          });
          current++;
          continue;
        }
        if (char === "[") {
          tokens.push({
            type: "paren",
            value: "["
          });
          current++;
          continue;
        }
        if (char === "]") {
          tokens.push({
            type: "paren",
            value: "]"
          });
          current++;
          continue;
        }
        if (char === ":") {
          tokens.push({
            type: "separator",
            value: ":"
          });
          current++;
          continue;
        }
        if (char === ",") {
          tokens.push({
            type: "delimiter",
            value: ","
          });
          current++;
          continue;
        }
        if (char === '"') {
          let value = "";
          let danglingQuote = false;
          char = input[++current];
          while (char !== '"') {
            if (current === input.length) {
              danglingQuote = true;
              break;
            }
            if (char === "\\") {
              current++;
              if (current === input.length) {
                danglingQuote = true;
                break;
              }
              value += char + input[current];
              char = input[++current];
            } else {
              value += char;
              char = input[++current];
            }
          }
          char = input[++current];
          if (!danglingQuote) {
            tokens.push({
              type: "string",
              value
            });
          }
          continue;
        }
        let WHITESPACE = /\s/;
        if (char && WHITESPACE.test(char)) {
          current++;
          continue;
        }
        let NUMBERS = /[0-9]/;
        if (char && NUMBERS.test(char) || char === "-" || char === ".") {
          let value = "";
          if (char === "-") {
            value += char;
            char = input[++current];
          }
          while (char && NUMBERS.test(char) || char === ".") {
            value += char;
            char = input[++current];
          }
          tokens.push({
            type: "number",
            value
          });
          continue;
        }
        let LETTERS = /[a-z]/i;
        if (char && LETTERS.test(char)) {
          let value = "";
          while (char && LETTERS.test(char)) {
            if (current === input.length) {
              break;
            }
            value += char;
            char = input[++current];
          }
          if (value == "true" || value == "false" || value === "null") {
            tokens.push({
              type: "name",
              value
            });
          } else {
            current++;
            continue;
          }
          continue;
        }
        current++;
      }
      return tokens;
    };
    strip = (tokens) => {
      if (tokens.length === 0) {
        return tokens;
      }
      let lastToken = tokens[tokens.length - 1];
      switch (lastToken.type) {
        case "separator":
          tokens = tokens.slice(0, tokens.length - 1);
          return strip(tokens);
          break;
        case "number":
          let lastCharacterOfLastToken = lastToken.value[lastToken.value.length - 1];
          if (lastCharacterOfLastToken === "." || lastCharacterOfLastToken === "-") {
            tokens = tokens.slice(0, tokens.length - 1);
            return strip(tokens);
          }
        case "string":
          let tokenBeforeTheLastToken = tokens[tokens.length - 2];
          if (tokenBeforeTheLastToken?.type === "delimiter") {
            tokens = tokens.slice(0, tokens.length - 1);
            return strip(tokens);
          } else if (tokenBeforeTheLastToken?.type === "brace" && tokenBeforeTheLastToken.value === "{") {
            tokens = tokens.slice(0, tokens.length - 1);
            return strip(tokens);
          }
          break;
        case "delimiter":
          tokens = tokens.slice(0, tokens.length - 1);
          return strip(tokens);
          break;
      }
      return tokens;
    };
    unstrip = (tokens) => {
      let tail = [];
      tokens.map((token) => {
        if (token.type === "brace") {
          if (token.value === "{") {
            tail.push("}");
          } else {
            tail.splice(tail.lastIndexOf("}"), 1);
          }
        }
        if (token.type === "paren") {
          if (token.value === "[") {
            tail.push("]");
          } else {
            tail.splice(tail.lastIndexOf("]"), 1);
          }
        }
      });
      if (tail.length > 0) {
        tail.reverse().map((item) => {
          if (item === "}") {
            tokens.push({
              type: "brace",
              value: "}"
            });
          } else if (item === "]") {
            tokens.push({
              type: "paren",
              value: "]"
            });
          }
        });
      }
      return tokens;
    };
    generate = (tokens) => {
      let output = "";
      tokens.map((token) => {
        switch (token.type) {
          case "string":
            output += '"' + token.value + '"';
            break;
          default:
            output += token.value;
            break;
        }
      });
      return output;
    };
    partialParse = (input) => JSON.parse(generate(unstrip(strip(tokenize(input)))));
  }
});

// node_modules/@anthropic-ai/sdk/streaming.mjs
var init_streaming2 = __esm({
  "node_modules/@anthropic-ai/sdk/streaming.mjs"() {
    init_streaming();
  }
});

// node_modules/@anthropic-ai/sdk/lib/BetaMessageStream.mjs
function tracksToolInput(content) {
  return content.type === "tool_use" || content.type === "server_tool_use" || content.type === "mcp_tool_use";
}
function checkNever(x) {
}
var _BetaMessageStream_instances, _BetaMessageStream_currentMessageSnapshot, _BetaMessageStream_params, _BetaMessageStream_connectedPromise, _BetaMessageStream_resolveConnectedPromise, _BetaMessageStream_rejectConnectedPromise, _BetaMessageStream_endPromise, _BetaMessageStream_resolveEndPromise, _BetaMessageStream_rejectEndPromise, _BetaMessageStream_listeners, _BetaMessageStream_ended, _BetaMessageStream_errored, _BetaMessageStream_aborted, _BetaMessageStream_catchingPromiseCreated, _BetaMessageStream_response, _BetaMessageStream_request_id, _BetaMessageStream_logger, _BetaMessageStream_getFinalMessage, _BetaMessageStream_getFinalText, _BetaMessageStream_handleError, _BetaMessageStream_beginRequest, _BetaMessageStream_addStreamEvent, _BetaMessageStream_endRequest, _BetaMessageStream_accumulateMessage, JSON_BUF_PROPERTY, BetaMessageStream;
var init_BetaMessageStream = __esm({
  "node_modules/@anthropic-ai/sdk/lib/BetaMessageStream.mjs"() {
    init_tslib();
    init_parser();
    init_error2();
    init_errors();
    init_streaming2();
    init_beta_parser();
    JSON_BUF_PROPERTY = "__json_buf";
    BetaMessageStream = class _BetaMessageStream {
      constructor(params, opts) {
        _BetaMessageStream_instances.add(this);
        this.messages = [];
        this.receivedMessages = [];
        _BetaMessageStream_currentMessageSnapshot.set(this, void 0);
        _BetaMessageStream_params.set(this, null);
        this.controller = new AbortController();
        _BetaMessageStream_connectedPromise.set(this, void 0);
        _BetaMessageStream_resolveConnectedPromise.set(this, () => {
        });
        _BetaMessageStream_rejectConnectedPromise.set(this, () => {
        });
        _BetaMessageStream_endPromise.set(this, void 0);
        _BetaMessageStream_resolveEndPromise.set(this, () => {
        });
        _BetaMessageStream_rejectEndPromise.set(this, () => {
        });
        _BetaMessageStream_listeners.set(this, {});
        _BetaMessageStream_ended.set(this, false);
        _BetaMessageStream_errored.set(this, false);
        _BetaMessageStream_aborted.set(this, false);
        _BetaMessageStream_catchingPromiseCreated.set(this, false);
        _BetaMessageStream_response.set(this, void 0);
        _BetaMessageStream_request_id.set(this, void 0);
        _BetaMessageStream_logger.set(this, void 0);
        _BetaMessageStream_handleError.set(this, (error) => {
          __classPrivateFieldSet(this, _BetaMessageStream_errored, true, "f");
          if (isAbortError(error)) {
            error = new APIUserAbortError();
          }
          if (error instanceof APIUserAbortError) {
            __classPrivateFieldSet(this, _BetaMessageStream_aborted, true, "f");
            return this._emit("abort", error);
          }
          if (error instanceof AnthropicError) {
            return this._emit("error", error);
          }
          if (error instanceof Error) {
            const anthropicError = new AnthropicError(error.message);
            anthropicError.cause = error;
            return this._emit("error", anthropicError);
          }
          return this._emit("error", new AnthropicError(String(error)));
        });
        __classPrivateFieldSet(this, _BetaMessageStream_connectedPromise, new Promise((resolve9, reject) => {
          __classPrivateFieldSet(this, _BetaMessageStream_resolveConnectedPromise, resolve9, "f");
          __classPrivateFieldSet(this, _BetaMessageStream_rejectConnectedPromise, reject, "f");
        }), "f");
        __classPrivateFieldSet(this, _BetaMessageStream_endPromise, new Promise((resolve9, reject) => {
          __classPrivateFieldSet(this, _BetaMessageStream_resolveEndPromise, resolve9, "f");
          __classPrivateFieldSet(this, _BetaMessageStream_rejectEndPromise, reject, "f");
        }), "f");
        __classPrivateFieldGet(this, _BetaMessageStream_connectedPromise, "f").catch(() => {
        });
        __classPrivateFieldGet(this, _BetaMessageStream_endPromise, "f").catch(() => {
        });
        __classPrivateFieldSet(this, _BetaMessageStream_params, params, "f");
        __classPrivateFieldSet(this, _BetaMessageStream_logger, opts?.logger ?? console, "f");
      }
      get response() {
        return __classPrivateFieldGet(this, _BetaMessageStream_response, "f");
      }
      get request_id() {
        return __classPrivateFieldGet(this, _BetaMessageStream_request_id, "f");
      }
      /**
       * Returns the `MessageStream` data, the raw `Response` instance and the ID of the request,
       * returned vie the `request-id` header which is useful for debugging requests and resporting
       * issues to Anthropic.
       *
       * This is the same as the `APIPromise.withResponse()` method.
       *
       * This method will raise an error if you created the stream using `MessageStream.fromReadableStream`
       * as no `Response` is available.
       */
      async withResponse() {
        __classPrivateFieldSet(this, _BetaMessageStream_catchingPromiseCreated, true, "f");
        const response = await __classPrivateFieldGet(this, _BetaMessageStream_connectedPromise, "f");
        if (!response) {
          throw new Error("Could not resolve a `Response` object");
        }
        return {
          data: this,
          response,
          request_id: response.headers.get("request-id")
        };
      }
      /**
       * Intended for use on the frontend, consuming a stream produced with
       * `.toReadableStream()` on the backend.
       *
       * Note that messages sent to the model do not appear in `.on('message')`
       * in this context.
       */
      static fromReadableStream(stream) {
        const runner = new _BetaMessageStream(null);
        runner._run(() => runner._fromReadableStream(stream));
        return runner;
      }
      static createMessage(messages, params, options, { logger } = {}) {
        const runner = new _BetaMessageStream(params, { logger });
        for (const message of params.messages) {
          runner._addMessageParam(message);
        }
        __classPrivateFieldSet(runner, _BetaMessageStream_params, { ...params, stream: true }, "f");
        runner._run(() => runner._createMessage(messages, { ...params, stream: true }, { ...options, headers: { ...options?.headers, "X-Stainless-Helper-Method": "stream" } }));
        return runner;
      }
      _run(executor) {
        executor().then(() => {
          this._emitFinal();
          this._emit("end");
        }, __classPrivateFieldGet(this, _BetaMessageStream_handleError, "f"));
      }
      _addMessageParam(message) {
        this.messages.push(message);
      }
      _addMessage(message, emit = true) {
        this.receivedMessages.push(message);
        if (emit) {
          this._emit("message", message);
        }
      }
      async _createMessage(messages, params, options) {
        const signal = options?.signal;
        let abortHandler;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          abortHandler = this.controller.abort.bind(this.controller);
          signal.addEventListener("abort", abortHandler);
        }
        try {
          __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_beginRequest).call(this);
          const { response, data: stream } = await messages.create({ ...params, stream: true }, { ...options, signal: this.controller.signal }).withResponse();
          this._connected(response);
          for await (const event of stream) {
            __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_addStreamEvent).call(this, event);
          }
          if (stream.controller.signal?.aborted) {
            throw new APIUserAbortError();
          }
          __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_endRequest).call(this);
        } finally {
          if (signal && abortHandler) {
            signal.removeEventListener("abort", abortHandler);
          }
        }
      }
      _connected(response) {
        if (this.ended)
          return;
        __classPrivateFieldSet(this, _BetaMessageStream_response, response, "f");
        __classPrivateFieldSet(this, _BetaMessageStream_request_id, response?.headers.get("request-id"), "f");
        __classPrivateFieldGet(this, _BetaMessageStream_resolveConnectedPromise, "f").call(this, response);
        this._emit("connect");
      }
      get ended() {
        return __classPrivateFieldGet(this, _BetaMessageStream_ended, "f");
      }
      get errored() {
        return __classPrivateFieldGet(this, _BetaMessageStream_errored, "f");
      }
      get aborted() {
        return __classPrivateFieldGet(this, _BetaMessageStream_aborted, "f");
      }
      abort() {
        this.controller.abort();
      }
      /**
       * Adds the listener function to the end of the listeners array for the event.
       * No checks are made to see if the listener has already been added. Multiple calls passing
       * the same combination of event and listener will result in the listener being added, and
       * called, multiple times.
       * @returns this MessageStream, so that calls can be chained
       */
      on(event, listener) {
        const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = []);
        listeners.push({ listener });
        return this;
      }
      /**
       * Removes the specified listener from the listener array for the event.
       * off() will remove, at most, one instance of a listener from the listener array. If any single
       * listener has been added multiple times to the listener array for the specified event, then
       * off() must be called multiple times to remove each instance.
       * @returns this MessageStream, so that calls can be chained
       */
      off(event, listener) {
        const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event];
        if (!listeners)
          return this;
        const index = listeners.findIndex((l) => l.listener === listener);
        if (index >= 0)
          listeners.splice(index, 1);
        return this;
      }
      /**
       * Adds a one-time listener function for the event. The next time the event is triggered,
       * this listener is removed and then invoked.
       * @returns this MessageStream, so that calls can be chained
       */
      once(event, listener) {
        const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = []);
        listeners.push({ listener, once: true });
        return this;
      }
      /**
       * This is similar to `.once()`, but returns a Promise that resolves the next time
       * the event is triggered, instead of calling a listener callback.
       * @returns a Promise that resolves the next time given event is triggered,
       * or rejects if an error is emitted.  (If you request the 'error' event,
       * returns a promise that resolves with the error).
       *
       * Example:
       *
       *   const message = await stream.emitted('message') // rejects if the stream errors
       */
      emitted(event) {
        return new Promise((resolve9, reject) => {
          __classPrivateFieldSet(this, _BetaMessageStream_catchingPromiseCreated, true, "f");
          if (event !== "error")
            this.once("error", reject);
          this.once(event, resolve9);
        });
      }
      async done() {
        __classPrivateFieldSet(this, _BetaMessageStream_catchingPromiseCreated, true, "f");
        await __classPrivateFieldGet(this, _BetaMessageStream_endPromise, "f");
      }
      get currentMessage() {
        return __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
      }
      /**
       * @returns a promise that resolves with the the final assistant Message response,
       * or rejects if an error occurred or the stream ended prematurely without producing a Message.
       * If structured outputs were used, this will be a ParsedMessage with a `parsed` field.
       */
      async finalMessage() {
        await this.done();
        return __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalMessage).call(this);
      }
      /**
       * @returns a promise that resolves with the the final assistant Message's text response, concatenated
       * together if there are more than one text blocks.
       * Rejects if an error occurred or the stream ended prematurely without producing a Message.
       */
      async finalText() {
        await this.done();
        return __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalText).call(this);
      }
      _emit(event, ...args) {
        if (__classPrivateFieldGet(this, _BetaMessageStream_ended, "f"))
          return;
        if (event === "end") {
          __classPrivateFieldSet(this, _BetaMessageStream_ended, true, "f");
          __classPrivateFieldGet(this, _BetaMessageStream_resolveEndPromise, "f").call(this);
        }
        const listeners = __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event];
        if (listeners) {
          __classPrivateFieldGet(this, _BetaMessageStream_listeners, "f")[event] = listeners.filter((l) => !l.once);
          listeners.forEach(({ listener }) => listener(...args));
        }
        if (event === "abort") {
          const error = args[0];
          if (!__classPrivateFieldGet(this, _BetaMessageStream_catchingPromiseCreated, "f") && !listeners?.length) {
            Promise.reject(error);
          }
          __classPrivateFieldGet(this, _BetaMessageStream_rejectConnectedPromise, "f").call(this, error);
          __classPrivateFieldGet(this, _BetaMessageStream_rejectEndPromise, "f").call(this, error);
          this._emit("end");
          return;
        }
        if (event === "error") {
          const error = args[0];
          if (!__classPrivateFieldGet(this, _BetaMessageStream_catchingPromiseCreated, "f") && !listeners?.length) {
            Promise.reject(error);
          }
          __classPrivateFieldGet(this, _BetaMessageStream_rejectConnectedPromise, "f").call(this, error);
          __classPrivateFieldGet(this, _BetaMessageStream_rejectEndPromise, "f").call(this, error);
          this._emit("end");
        }
      }
      _emitFinal() {
        const finalMessage = this.receivedMessages.at(-1);
        if (finalMessage) {
          this._emit("finalMessage", __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_getFinalMessage).call(this));
        }
      }
      async _fromReadableStream(readableStream, options) {
        const signal = options?.signal;
        let abortHandler;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          abortHandler = this.controller.abort.bind(this.controller);
          signal.addEventListener("abort", abortHandler);
        }
        try {
          __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_beginRequest).call(this);
          this._connected(null);
          const stream = Stream.fromReadableStream(readableStream, this.controller);
          for await (const event of stream) {
            __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_addStreamEvent).call(this, event);
          }
          if (stream.controller.signal?.aborted) {
            throw new APIUserAbortError();
          }
          __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_endRequest).call(this);
        } finally {
          if (signal && abortHandler) {
            signal.removeEventListener("abort", abortHandler);
          }
        }
      }
      [(_BetaMessageStream_currentMessageSnapshot = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_params = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_connectedPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_endPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_listeners = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_ended = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_errored = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_aborted = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_response = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_request_id = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_logger = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_handleError = /* @__PURE__ */ new WeakMap(), _BetaMessageStream_instances = /* @__PURE__ */ new WeakSet(), _BetaMessageStream_getFinalMessage = function _BetaMessageStream_getFinalMessage2() {
        if (this.receivedMessages.length === 0) {
          throw new AnthropicError("stream ended without producing a Message with role=assistant");
        }
        return this.receivedMessages.at(-1);
      }, _BetaMessageStream_getFinalText = function _BetaMessageStream_getFinalText2() {
        if (this.receivedMessages.length === 0) {
          throw new AnthropicError("stream ended without producing a Message with role=assistant");
        }
        const textBlocks = this.receivedMessages.at(-1).content.filter((block) => block.type === "text").map((block) => block.text);
        if (textBlocks.length === 0) {
          throw new AnthropicError("stream ended without producing a content block with type=text");
        }
        return textBlocks.join(" ");
      }, _BetaMessageStream_beginRequest = function _BetaMessageStream_beginRequest2() {
        if (this.ended)
          return;
        __classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, void 0, "f");
      }, _BetaMessageStream_addStreamEvent = function _BetaMessageStream_addStreamEvent2(event) {
        if (this.ended)
          return;
        const messageSnapshot = __classPrivateFieldGet(this, _BetaMessageStream_instances, "m", _BetaMessageStream_accumulateMessage).call(this, event);
        this._emit("streamEvent", event, messageSnapshot);
        switch (event.type) {
          case "content_block_delta": {
            const content = messageSnapshot.content.at(-1);
            switch (event.delta.type) {
              case "text_delta": {
                if (content.type === "text") {
                  this._emit("text", event.delta.text, content.text || "");
                }
                break;
              }
              case "citations_delta": {
                if (content.type === "text") {
                  this._emit("citation", event.delta.citation, content.citations ?? []);
                }
                break;
              }
              case "input_json_delta": {
                if (tracksToolInput(content) && content.input) {
                  this._emit("inputJson", event.delta.partial_json, content.input);
                }
                break;
              }
              case "thinking_delta": {
                if (content.type === "thinking") {
                  this._emit("thinking", event.delta.thinking, content.thinking);
                }
                break;
              }
              case "signature_delta": {
                if (content.type === "thinking") {
                  this._emit("signature", content.signature);
                }
                break;
              }
              case "compaction_delta": {
                if (content.type === "compaction" && content.content) {
                  this._emit("compaction", content.content);
                }
                break;
              }
              default:
                checkNever(event.delta);
            }
            break;
          }
          case "message_stop": {
            this._addMessageParam(messageSnapshot);
            this._addMessage(maybeParseBetaMessage(messageSnapshot, __classPrivateFieldGet(this, _BetaMessageStream_params, "f"), { logger: __classPrivateFieldGet(this, _BetaMessageStream_logger, "f") }), true);
            break;
          }
          case "content_block_stop": {
            this._emit("contentBlock", messageSnapshot.content.at(-1));
            break;
          }
          case "message_start": {
            __classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, messageSnapshot, "f");
            break;
          }
          case "content_block_start":
          case "message_delta":
            break;
        }
      }, _BetaMessageStream_endRequest = function _BetaMessageStream_endRequest2() {
        if (this.ended) {
          throw new AnthropicError(`stream has ended, this shouldn't happen`);
        }
        const snapshot = __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
        if (!snapshot) {
          throw new AnthropicError(`request ended without sending any chunks`);
        }
        __classPrivateFieldSet(this, _BetaMessageStream_currentMessageSnapshot, void 0, "f");
        return maybeParseBetaMessage(snapshot, __classPrivateFieldGet(this, _BetaMessageStream_params, "f"), { logger: __classPrivateFieldGet(this, _BetaMessageStream_logger, "f") });
      }, _BetaMessageStream_accumulateMessage = function _BetaMessageStream_accumulateMessage2(event) {
        let snapshot = __classPrivateFieldGet(this, _BetaMessageStream_currentMessageSnapshot, "f");
        if (event.type === "message_start") {
          if (snapshot) {
            throw new AnthropicError(`Unexpected event order, got ${event.type} before receiving "message_stop"`);
          }
          return event.message;
        }
        if (!snapshot) {
          throw new AnthropicError(`Unexpected event order, got ${event.type} before "message_start"`);
        }
        switch (event.type) {
          case "message_stop":
            return snapshot;
          case "message_delta":
            snapshot.container = event.delta.container;
            snapshot.stop_reason = event.delta.stop_reason;
            snapshot.stop_sequence = event.delta.stop_sequence;
            snapshot.usage.output_tokens = event.usage.output_tokens;
            snapshot.context_management = event.context_management;
            if (event.usage.input_tokens != null) {
              snapshot.usage.input_tokens = event.usage.input_tokens;
            }
            if (event.usage.cache_creation_input_tokens != null) {
              snapshot.usage.cache_creation_input_tokens = event.usage.cache_creation_input_tokens;
            }
            if (event.usage.cache_read_input_tokens != null) {
              snapshot.usage.cache_read_input_tokens = event.usage.cache_read_input_tokens;
            }
            if (event.usage.server_tool_use != null) {
              snapshot.usage.server_tool_use = event.usage.server_tool_use;
            }
            if (event.usage.iterations != null) {
              snapshot.usage.iterations = event.usage.iterations;
            }
            return snapshot;
          case "content_block_start":
            snapshot.content.push(event.content_block);
            return snapshot;
          case "content_block_delta": {
            const snapshotContent = snapshot.content.at(event.index);
            switch (event.delta.type) {
              case "text_delta": {
                if (snapshotContent?.type === "text") {
                  snapshot.content[event.index] = {
                    ...snapshotContent,
                    text: (snapshotContent.text || "") + event.delta.text
                  };
                }
                break;
              }
              case "citations_delta": {
                if (snapshotContent?.type === "text") {
                  snapshot.content[event.index] = {
                    ...snapshotContent,
                    citations: [...snapshotContent.citations ?? [], event.delta.citation]
                  };
                }
                break;
              }
              case "input_json_delta": {
                if (snapshotContent && tracksToolInput(snapshotContent)) {
                  let jsonBuf = snapshotContent[JSON_BUF_PROPERTY] || "";
                  jsonBuf += event.delta.partial_json;
                  const newContent = { ...snapshotContent };
                  Object.defineProperty(newContent, JSON_BUF_PROPERTY, {
                    value: jsonBuf,
                    enumerable: false,
                    writable: true
                  });
                  if (jsonBuf) {
                    try {
                      newContent.input = partialParse(jsonBuf);
                    } catch (err) {
                      const error = new AnthropicError(`Unable to parse tool parameter JSON from model. Please retry your request or adjust your prompt. Error: ${err}. JSON: ${jsonBuf}`);
                      __classPrivateFieldGet(this, _BetaMessageStream_handleError, "f").call(this, error);
                    }
                  }
                  snapshot.content[event.index] = newContent;
                }
                break;
              }
              case "thinking_delta": {
                if (snapshotContent?.type === "thinking") {
                  snapshot.content[event.index] = {
                    ...snapshotContent,
                    thinking: snapshotContent.thinking + event.delta.thinking
                  };
                }
                break;
              }
              case "signature_delta": {
                if (snapshotContent?.type === "thinking") {
                  snapshot.content[event.index] = {
                    ...snapshotContent,
                    signature: event.delta.signature
                  };
                }
                break;
              }
              case "compaction_delta": {
                if (snapshotContent?.type === "compaction") {
                  snapshot.content[event.index] = {
                    ...snapshotContent,
                    content: (snapshotContent.content || "") + event.delta.content
                  };
                }
                break;
              }
              default:
                checkNever(event.delta);
            }
            return snapshot;
          }
          case "content_block_stop":
            return snapshot;
        }
      }, Symbol.asyncIterator)]() {
        const pushQueue = [];
        const readQueue2 = [];
        let done = false;
        this.on("streamEvent", (event) => {
          const reader = readQueue2.shift();
          if (reader) {
            reader.resolve(event);
          } else {
            pushQueue.push(event);
          }
        });
        this.on("end", () => {
          done = true;
          for (const reader of readQueue2) {
            reader.resolve(void 0);
          }
          readQueue2.length = 0;
        });
        this.on("abort", (err) => {
          done = true;
          for (const reader of readQueue2) {
            reader.reject(err);
          }
          readQueue2.length = 0;
        });
        this.on("error", (err) => {
          done = true;
          for (const reader of readQueue2) {
            reader.reject(err);
          }
          readQueue2.length = 0;
        });
        return {
          next: async () => {
            if (!pushQueue.length) {
              if (done) {
                return { value: void 0, done: true };
              }
              return new Promise((resolve9, reject) => readQueue2.push({ resolve: resolve9, reject })).then((chunk2) => chunk2 ? { value: chunk2, done: false } : { value: void 0, done: true });
            }
            const chunk = pushQueue.shift();
            return { value: chunk, done: false };
          },
          return: async () => {
            this.abort();
            return { value: void 0, done: true };
          }
        };
      }
      toReadableStream() {
        const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
        return stream.toReadableStream();
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/lib/tools/CompactionControl.mjs
var DEFAULT_TOKEN_THRESHOLD, DEFAULT_SUMMARY_PROMPT;
var init_CompactionControl = __esm({
  "node_modules/@anthropic-ai/sdk/lib/tools/CompactionControl.mjs"() {
    DEFAULT_TOKEN_THRESHOLD = 1e5;
    DEFAULT_SUMMARY_PROMPT = `You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:
1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified
2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced
3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)
4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain
5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user
Be concise but complete\u2014err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.
Wrap your summary in <summary></summary> tags.`;
  }
});

// node_modules/@anthropic-ai/sdk/lib/tools/BetaToolRunner.mjs
async function generateToolResponse(params, lastMessage = params.messages.at(-1), requestOptions) {
  if (!lastMessage || lastMessage.role !== "assistant" || !lastMessage.content || typeof lastMessage.content === "string") {
    return null;
  }
  const toolUseBlocks = lastMessage.content.filter((content) => content.type === "tool_use");
  if (toolUseBlocks.length === 0) {
    return null;
  }
  const toolResults = await Promise.all(toolUseBlocks.map(async (toolUse) => {
    const tool = params.tools.find((t) => ("name" in t ? t.name : t.mcp_server_name) === toolUse.name);
    if (!tool || !("run" in tool)) {
      return {
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: `Error: Tool '${toolUse.name}' not found`,
        is_error: true
      };
    }
    try {
      let input = toolUse.input;
      if ("parse" in tool && tool.parse) {
        input = tool.parse(input);
      }
      const result = await tool.run(input, {
        toolUse,
        toolUseBlock: toolUse,
        signal: requestOptions?.signal
      });
      return {
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: result
      };
    } catch (error) {
      return {
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: error instanceof ToolError ? error.content : `Error: ${error instanceof Error ? error.message : String(error)}`,
        is_error: true
      };
    }
  }));
  return {
    role: "user",
    content: toolResults
  };
}
var _BetaToolRunner_instances, _BetaToolRunner_consumed, _BetaToolRunner_mutated, _BetaToolRunner_state, _BetaToolRunner_options, _BetaToolRunner_message, _BetaToolRunner_toolResponse, _BetaToolRunner_completion, _BetaToolRunner_iterationCount, _BetaToolRunner_checkAndCompact, _BetaToolRunner_generateToolResponse, BetaToolRunner;
var init_BetaToolRunner = __esm({
  "node_modules/@anthropic-ai/sdk/lib/tools/BetaToolRunner.mjs"() {
    init_tslib();
    init_ToolError();
    init_error();
    init_headers();
    init_promise();
    init_CompactionControl();
    init_stainless_helper_header();
    BetaToolRunner = class {
      constructor(client, params, options) {
        _BetaToolRunner_instances.add(this);
        this.client = client;
        _BetaToolRunner_consumed.set(this, false);
        _BetaToolRunner_mutated.set(this, false);
        _BetaToolRunner_state.set(this, void 0);
        _BetaToolRunner_options.set(this, void 0);
        _BetaToolRunner_message.set(this, void 0);
        _BetaToolRunner_toolResponse.set(this, void 0);
        _BetaToolRunner_completion.set(this, void 0);
        _BetaToolRunner_iterationCount.set(this, 0);
        __classPrivateFieldSet(this, _BetaToolRunner_state, {
          params: {
            // You can't clone the entire params since there are functions as handlers.
            // You also don't really need to clone params.messages, but it probably will prevent a foot gun
            // somewhere.
            ...params,
            messages: structuredClone(params.messages)
          }
        }, "f");
        const helpers = collectStainlessHelpers(params.tools, params.messages);
        const helperValue = ["BetaToolRunner", ...helpers].join(", ");
        __classPrivateFieldSet(this, _BetaToolRunner_options, {
          ...options,
          headers: buildHeaders([{ "x-stainless-helper": helperValue }, options?.headers])
        }, "f");
        __classPrivateFieldSet(this, _BetaToolRunner_completion, promiseWithResolvers(), "f");
        if (params.compactionControl?.enabled) {
          console.warn('Anthropic: The `compactionControl` parameter is deprecated and will be removed in a future version. Use server-side compaction instead by passing `edits: [{ type: "compact_20260112" }]` in the params passed to `toolRunner()`. See https://platform.claude.com/docs/en/build-with-claude/compaction');
        }
      }
      async *[(_BetaToolRunner_consumed = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_mutated = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_state = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_options = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_message = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_toolResponse = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_completion = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_iterationCount = /* @__PURE__ */ new WeakMap(), _BetaToolRunner_instances = /* @__PURE__ */ new WeakSet(), _BetaToolRunner_checkAndCompact = async function _BetaToolRunner_checkAndCompact2() {
        const compactionControl = __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.compactionControl;
        if (!compactionControl || !compactionControl.enabled) {
          return false;
        }
        let tokensUsed = 0;
        if (__classPrivateFieldGet(this, _BetaToolRunner_message, "f") !== void 0) {
          try {
            const message = await __classPrivateFieldGet(this, _BetaToolRunner_message, "f");
            const totalInputTokens = message.usage.input_tokens + (message.usage.cache_creation_input_tokens ?? 0) + (message.usage.cache_read_input_tokens ?? 0);
            tokensUsed = totalInputTokens + message.usage.output_tokens;
          } catch {
            return false;
          }
        }
        const threshold = compactionControl.contextTokenThreshold ?? DEFAULT_TOKEN_THRESHOLD;
        if (tokensUsed < threshold) {
          return false;
        }
        const model = compactionControl.model ?? __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.model;
        const summaryPrompt = compactionControl.summaryPrompt ?? DEFAULT_SUMMARY_PROMPT;
        const messages = __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages;
        if (messages[messages.length - 1].role === "assistant") {
          const lastMessage = messages[messages.length - 1];
          if (Array.isArray(lastMessage.content)) {
            const nonToolBlocks = lastMessage.content.filter((block) => block.type !== "tool_use");
            if (nonToolBlocks.length === 0) {
              messages.pop();
            } else {
              lastMessage.content = nonToolBlocks;
            }
          }
        }
        const response = await this.client.beta.messages.create({
          model,
          messages: [
            ...messages,
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: summaryPrompt
                }
              ]
            }
          ],
          max_tokens: __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.max_tokens
        }, {
          signal: __classPrivateFieldGet(this, _BetaToolRunner_options, "f").signal,
          headers: buildHeaders([__classPrivateFieldGet(this, _BetaToolRunner_options, "f").headers, { "x-stainless-helper": "compaction" }])
        });
        if (response.content[0]?.type !== "text") {
          throw new AnthropicError("Expected text response for compaction");
        }
        __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages = [
          {
            role: "user",
            content: response.content
          }
        ];
        return true;
      }, Symbol.asyncIterator)]() {
        var _a2;
        if (__classPrivateFieldGet(this, _BetaToolRunner_consumed, "f")) {
          throw new AnthropicError("Cannot iterate over a consumed stream");
        }
        __classPrivateFieldSet(this, _BetaToolRunner_consumed, true, "f");
        __classPrivateFieldSet(this, _BetaToolRunner_mutated, true, "f");
        __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, void 0, "f");
        try {
          while (true) {
            let stream;
            try {
              if (__classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.max_iterations && __classPrivateFieldGet(this, _BetaToolRunner_iterationCount, "f") >= __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.max_iterations) {
                break;
              }
              __classPrivateFieldSet(this, _BetaToolRunner_mutated, false, "f");
              __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, void 0, "f");
              __classPrivateFieldSet(this, _BetaToolRunner_iterationCount, (_a2 = __classPrivateFieldGet(this, _BetaToolRunner_iterationCount, "f"), _a2++, _a2), "f");
              __classPrivateFieldSet(this, _BetaToolRunner_message, void 0, "f");
              const { max_iterations, compactionControl, ...params } = __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params;
              if (params.stream) {
                stream = this.client.beta.messages.stream({ ...params }, __classPrivateFieldGet(this, _BetaToolRunner_options, "f"));
                __classPrivateFieldSet(this, _BetaToolRunner_message, stream.finalMessage(), "f");
                __classPrivateFieldGet(this, _BetaToolRunner_message, "f").catch(() => {
                });
                yield stream;
              } else {
                __classPrivateFieldSet(this, _BetaToolRunner_message, this.client.beta.messages.create({ ...params, stream: false }, __classPrivateFieldGet(this, _BetaToolRunner_options, "f")), "f");
                yield __classPrivateFieldGet(this, _BetaToolRunner_message, "f");
              }
              const isCompacted = await __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_checkAndCompact).call(this);
              if (!isCompacted) {
                if (!__classPrivateFieldGet(this, _BetaToolRunner_mutated, "f")) {
                  const { role, content } = await __classPrivateFieldGet(this, _BetaToolRunner_message, "f");
                  __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages.push({ role, content });
                }
                const toolMessage = await __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_generateToolResponse).call(this, __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages.at(-1));
                if (toolMessage) {
                  __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params.messages.push(toolMessage);
                } else if (!__classPrivateFieldGet(this, _BetaToolRunner_mutated, "f")) {
                  break;
                }
              }
            } finally {
              if (stream) {
                stream.abort();
              }
            }
          }
          if (!__classPrivateFieldGet(this, _BetaToolRunner_message, "f")) {
            throw new AnthropicError("ToolRunner concluded without a message from the server");
          }
          __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").resolve(await __classPrivateFieldGet(this, _BetaToolRunner_message, "f"));
        } catch (error) {
          __classPrivateFieldSet(this, _BetaToolRunner_consumed, false, "f");
          __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").promise.catch(() => {
          });
          __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").reject(error);
          __classPrivateFieldSet(this, _BetaToolRunner_completion, promiseWithResolvers(), "f");
          throw error;
        }
      }
      setMessagesParams(paramsOrMutator) {
        if (typeof paramsOrMutator === "function") {
          __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params = paramsOrMutator(__classPrivateFieldGet(this, _BetaToolRunner_state, "f").params);
        } else {
          __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params = paramsOrMutator;
        }
        __classPrivateFieldSet(this, _BetaToolRunner_mutated, true, "f");
        __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, void 0, "f");
      }
      setRequestOptions(optionsOrMutator) {
        if (typeof optionsOrMutator === "function") {
          __classPrivateFieldSet(this, _BetaToolRunner_options, optionsOrMutator(__classPrivateFieldGet(this, _BetaToolRunner_options, "f")), "f");
        } else {
          __classPrivateFieldSet(this, _BetaToolRunner_options, { ...__classPrivateFieldGet(this, _BetaToolRunner_options, "f"), ...optionsOrMutator }, "f");
        }
      }
      /**
       * Get the tool response for the last message from the assistant.
       * Avoids redundant tool executions by caching results.
       *
       * @returns A promise that resolves to a BetaMessageParam containing tool results, or null if no tools need to be executed
       *
       * @example
       * const toolResponse = await runner.generateToolResponse();
       * if (toolResponse) {
       *   console.log('Tool results:', toolResponse.content);
       * }
       */
      async generateToolResponse(signal = __classPrivateFieldGet(this, _BetaToolRunner_options, "f").signal) {
        const message = await __classPrivateFieldGet(this, _BetaToolRunner_message, "f") ?? this.params.messages.at(-1);
        if (!message) {
          return null;
        }
        return __classPrivateFieldGet(this, _BetaToolRunner_instances, "m", _BetaToolRunner_generateToolResponse).call(this, message, signal);
      }
      /**
       * Wait for the async iterator to complete. This works even if the async iterator hasn't yet started, and
       * will wait for an instance to start and go to completion.
       *
       * @returns A promise that resolves to the final BetaMessage when the iterator completes
       *
       * @example
       * // Start consuming the iterator
       * for await (const message of runner) {
       *   console.log('Message:', message.content);
       * }
       *
       * // Meanwhile, wait for completion from another part of the code
       * const finalMessage = await runner.done();
       * console.log('Final response:', finalMessage.content);
       */
      done() {
        return __classPrivateFieldGet(this, _BetaToolRunner_completion, "f").promise;
      }
      /**
       * Returns a promise indicating that the stream is done. Unlike .done(), this will eagerly read the stream:
       * * If the iterator has not been consumed, consume the entire iterator and return the final message from the
       * assistant.
       * * If the iterator has been consumed, waits for it to complete and returns the final message.
       *
       * @returns A promise that resolves to the final BetaMessage from the conversation
       * @throws {AnthropicError} If no messages were processed during the conversation
       *
       * @example
       * const finalMessage = await runner.runUntilDone();
       * console.log('Final response:', finalMessage.content);
       */
      async runUntilDone() {
        if (!__classPrivateFieldGet(this, _BetaToolRunner_consumed, "f")) {
          for await (const _ of this) {
          }
        }
        return this.done();
      }
      /**
       * Get the current parameters being used by the ToolRunner.
       *
       * @returns A readonly view of the current ToolRunnerParams
       *
       * @example
       * const currentParams = runner.params;
       * console.log('Current model:', currentParams.model);
       * console.log('Message count:', currentParams.messages.length);
       */
      get params() {
        return __classPrivateFieldGet(this, _BetaToolRunner_state, "f").params;
      }
      /**
       * Add one or more messages to the conversation history.
       *
       * @param messages - One or more BetaMessageParam objects to add to the conversation
       *
       * @example
       * runner.pushMessages(
       *   { role: 'user', content: 'Also, what about the weather in NYC?' }
       * );
       *
       * @example
       * // Adding multiple messages
       * runner.pushMessages(
       *   { role: 'user', content: 'What about NYC?' },
       *   { role: 'user', content: 'And Boston?' }
       * );
       */
      pushMessages(...messages) {
        this.setMessagesParams((params) => ({
          ...params,
          messages: [...params.messages, ...messages]
        }));
      }
      /**
       * Makes the ToolRunner directly awaitable, equivalent to calling .runUntilDone()
       * This allows using `await runner` instead of `await runner.runUntilDone()`
       */
      then(onfulfilled, onrejected) {
        return this.runUntilDone().then(onfulfilled, onrejected);
      }
    };
    _BetaToolRunner_generateToolResponse = async function _BetaToolRunner_generateToolResponse2(lastMessage, signal = __classPrivateFieldGet(this, _BetaToolRunner_options, "f").signal) {
      if (__classPrivateFieldGet(this, _BetaToolRunner_toolResponse, "f") !== void 0) {
        return __classPrivateFieldGet(this, _BetaToolRunner_toolResponse, "f");
      }
      __classPrivateFieldSet(this, _BetaToolRunner_toolResponse, generateToolResponse(__classPrivateFieldGet(this, _BetaToolRunner_state, "f").params, lastMessage, {
        ...__classPrivateFieldGet(this, _BetaToolRunner_options, "f"),
        signal
      }), "f");
      return __classPrivateFieldGet(this, _BetaToolRunner_toolResponse, "f");
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/messages/messages.mjs
function transformOutputFormat(params) {
  if (!params.output_format) {
    return params;
  }
  if (params.output_config?.format) {
    throw new AnthropicError("Both output_format and output_config.format were provided. Please use only output_config.format (output_format is deprecated).");
  }
  const { output_format, ...rest } = params;
  return {
    ...rest,
    output_config: {
      ...params.output_config,
      format: output_format
    }
  };
}
var DEPRECATED_MODELS, MODELS_TO_WARN_WITH_THINKING_ENABLED, Messages;
var init_messages = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/messages/messages.mjs"() {
    init_error2();
    init_batches();
    init_resource();
    init_constants();
    init_headers();
    init_stainless_helper_header();
    init_beta_parser();
    init_BetaMessageStream();
    init_BetaToolRunner();
    init_ToolError();
    init_batches();
    init_BetaToolRunner();
    init_ToolError();
    DEPRECATED_MODELS = {
      "claude-1.3": "November 6th, 2024",
      "claude-1.3-100k": "November 6th, 2024",
      "claude-instant-1.1": "November 6th, 2024",
      "claude-instant-1.1-100k": "November 6th, 2024",
      "claude-instant-1.2": "November 6th, 2024",
      "claude-3-sonnet-20240229": "July 21st, 2025",
      "claude-3-opus-20240229": "January 5th, 2026",
      "claude-2.1": "July 21st, 2025",
      "claude-2.0": "July 21st, 2025",
      "claude-3-7-sonnet-latest": "February 19th, 2026",
      "claude-3-7-sonnet-20250219": "February 19th, 2026"
    };
    MODELS_TO_WARN_WITH_THINKING_ENABLED = ["claude-mythos-preview", "claude-opus-4-6"];
    Messages = class extends APIResource {
      constructor() {
        super(...arguments);
        this.batches = new Batches(this._client);
      }
      create(params, options) {
        const modifiedParams = transformOutputFormat(params);
        const { betas, ...body } = modifiedParams;
        if (body.model in DEPRECATED_MODELS) {
          console.warn(`The model '${body.model}' is deprecated and will reach end-of-life on ${DEPRECATED_MODELS[body.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
        }
        if (MODELS_TO_WARN_WITH_THINKING_ENABLED.includes(body.model) && body.thinking && body.thinking.type === "enabled") {
          console.warn(`Using Claude with ${body.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
        }
        let timeout = this._client._options.timeout;
        if (!body.stream && timeout == null) {
          const maxNonstreamingTokens = MODEL_NONSTREAMING_TOKENS[body.model] ?? void 0;
          timeout = this._client.calculateNonstreamingTimeout(body.max_tokens, maxNonstreamingTokens);
        }
        const helperHeader = stainlessHelperHeader(body.tools, body.messages);
        return this._client.post("/v1/messages?beta=true", {
          body,
          timeout: timeout ?? 6e5,
          ...options,
          headers: buildHeaders([
            { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
            helperHeader,
            options?.headers
          ]),
          stream: modifiedParams.stream ?? false
        });
      }
      /**
       * Send a structured list of input messages with text and/or image content, along with an expected `output_format` and
       * the response will be automatically parsed and available in the `parsed_output` property of the message.
       *
       * @example
       * ```ts
       * const message = await client.beta.messages.parse({
       *   model: 'claude-3-5-sonnet-20241022',
       *   max_tokens: 1024,
       *   messages: [{ role: 'user', content: 'What is 2+2?' }],
       *   output_format: zodOutputFormat(z.object({ answer: z.number() }), 'math'),
       * });
       *
       * console.log(message.parsed_output?.answer); // 4
       * ```
       */
      parse(params, options) {
        options = {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...params.betas ?? [], "structured-outputs-2025-12-15"].toString() },
            options?.headers
          ])
        };
        return this.create(params, options).then((message) => parseBetaMessage(message, params, { logger: this._client.logger ?? console }));
      }
      /**
       * Create a Message stream
       */
      stream(body, options) {
        return BetaMessageStream.createMessage(this, body, options);
      }
      /**
       * Count the number of tokens in a Message.
       *
       * The Token Count API can be used to count the number of tokens in a Message,
       * including tools, images, and documents, without creating it.
       *
       * Learn more about token counting in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/token-counting)
       *
       * @example
       * ```ts
       * const betaMessageTokensCount =
       *   await client.beta.messages.countTokens({
       *     messages: [{ content: 'Hello, world', role: 'user' }],
       *     model: 'claude-opus-4-6',
       *   });
       * ```
       */
      countTokens(params, options) {
        const modifiedParams = transformOutputFormat(params);
        const { betas, ...body } = modifiedParams;
        return this._client.post("/v1/messages/count_tokens?beta=true", {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "token-counting-2024-11-01"].toString() },
            options?.headers
          ])
        });
      }
      toolRunner(body, options) {
        return new BetaToolRunner(this._client, body, options);
      }
    };
    Messages.Batches = Batches;
    Messages.BetaToolRunner = BetaToolRunner;
    Messages.ToolError = ToolError;
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/sessions/events.mjs
var Events;
var init_events = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/sessions/events.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_path();
    init_SessionToolRunner();
    init_SessionToolRunner();
    Events = class extends APIResource {
      /**
       * List Events
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaManagedAgentsSessionEvent of client.beta.sessions.events.list(
       *   'sesn_011CZkZAtmR3yMPDzynEDxu7',
       * )) {
       *   // ...
       * }
       * ```
       */
      list(sessionID, params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList(path`/v1/sessions/${sessionID}/events?beta=true`, PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Send Events
       *
       * @example
       * ```ts
       * const betaManagedAgentsSendSessionEvents =
       *   await client.beta.sessions.events.send(
       *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
       *     {
       *       events: [
       *         {
       *           content: [
       *             {
       *               text: 'Where is my order #1234?',
       *               type: 'text',
       *             },
       *           ],
       *           type: 'user.message',
       *         },
       *       ],
       *     },
       *   );
       * ```
       */
      send(sessionID, params, options) {
        const { betas, ...body } = params;
        return this._client.post(path`/v1/sessions/${sessionID}/events?beta=true`, {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Stream Events
       *
       * @example
       * ```ts
       * const betaManagedAgentsStreamSessionEvents =
       *   await client.beta.sessions.events.stream(
       *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
       *   );
       * ```
       */
      stream(sessionID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.get(path`/v1/sessions/${sessionID}/events/stream?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ]),
          stream: true
        });
      }
      /**
       * Attach to a session and dispatch every incoming `agent.tool_use` and
       * `agent.custom_tool_use` event to a local tool registry, sending the matching
       * result back (`user.tool_result` / `user.custom_tool_result`). The
       * sessions-side counterpart to `client.beta.messages.toolRunner`: yields one
       * entry per completed tool call so callers can observe each dispatch (and
       * `break` to abort cleanly).
       *
       * @example
       * ```ts
       * import { betaAgentToolset20260401 } from '@anthropic-ai/sdk/tools/agent-toolset/node';
       *
       * for await (const call of client.beta.sessions.events.toolRunner(work.data.id, {
       *   tools: [...betaAgentToolset20260401({ workdir }), myTool],
       * })) {
       *   console.log(`${call.name} -> ${call.isError ? 'error' : 'ok'}`);
       * }
       * ```
       */
      toolRunner(sessionID, opts) {
        return new SessionToolRunner(sessionID, { ...opts, client: this._client });
      }
    };
    Events.SessionToolRunner = SessionToolRunner;
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/sessions/resources.mjs
var Resources;
var init_resources = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/sessions/resources.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_path();
    Resources = class extends APIResource {
      /**
       * Get Session Resource
       *
       * @example
       * ```ts
       * const resource =
       *   await client.beta.sessions.resources.retrieve(
       *     'sesrsc_011CZkZBJq5dWxk9fVLNcPht',
       *     { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
       *   );
       * ```
       */
      retrieve(resourceID, params, options) {
        const { session_id, betas } = params;
        return this._client.get(path`/v1/sessions/${session_id}/resources/${resourceID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Update Session Resource
       *
       * @example
       * ```ts
       * const resource =
       *   await client.beta.sessions.resources.update(
       *     'sesrsc_011CZkZBJq5dWxk9fVLNcPht',
       *     {
       *       session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7',
       *       authorization_token: 'ghp_exampletoken',
       *     },
       *   );
       * ```
       */
      update(resourceID, params, options) {
        const { session_id, betas, ...body } = params;
        return this._client.post(path`/v1/sessions/${session_id}/resources/${resourceID}?beta=true`, {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List Session Resources
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaManagedAgentsSessionResource of client.beta.sessions.resources.list(
       *   'sesn_011CZkZAtmR3yMPDzynEDxu7',
       * )) {
       *   // ...
       * }
       * ```
       */
      list(sessionID, params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList(path`/v1/sessions/${sessionID}/resources?beta=true`, PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Delete Session Resource
       *
       * @example
       * ```ts
       * const betaManagedAgentsDeleteSessionResource =
       *   await client.beta.sessions.resources.delete(
       *     'sesrsc_011CZkZBJq5dWxk9fVLNcPht',
       *     { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
       *   );
       * ```
       */
      delete(resourceID, params, options) {
        const { session_id, betas } = params;
        return this._client.delete(path`/v1/sessions/${session_id}/resources/${resourceID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Add Session Resource
       *
       * @example
       * ```ts
       * const betaManagedAgentsFileResource =
       *   await client.beta.sessions.resources.add(
       *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
       *     {
       *       file_id: 'file_011CNha8iCJcU1wXNR6q4V8w',
       *       type: 'file',
       *     },
       *   );
       * ```
       */
      add(sessionID, params, options) {
        const { betas, ...body } = params;
        return this._client.post(path`/v1/sessions/${sessionID}/resources?beta=true`, {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/sessions/threads/events.mjs
var Events2;
var init_events2 = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/sessions/threads/events.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_path();
    Events2 = class extends APIResource {
      /**
       * List Session Thread Events
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaManagedAgentsSessionEvent of client.beta.sessions.threads.events.list(
       *   'sthr_011CZkZVWa6oIjw0rgXZpnBt',
       *   { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
       * )) {
       *   // ...
       * }
       * ```
       */
      list(threadID, params, options) {
        const { session_id, betas, ...query } = params;
        return this._client.getAPIList(path`/v1/sessions/${session_id}/threads/${threadID}/events?beta=true`, PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Stream Session Thread Events
       *
       * @example
       * ```ts
       * const betaManagedAgentsStreamSessionThreadEvents =
       *   await client.beta.sessions.threads.events.stream(
       *     'sthr_011CZkZVWa6oIjw0rgXZpnBt',
       *     { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
       *   );
       * ```
       */
      stream(threadID, params, options) {
        const { session_id, betas } = params;
        return this._client.get(path`/v1/sessions/${session_id}/threads/${threadID}/stream?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ]),
          stream: true
        });
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/sessions/threads/threads.mjs
var Threads;
var init_threads = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/sessions/threads/threads.mjs"() {
    init_resource();
    init_events2();
    init_events2();
    init_pagination();
    init_headers();
    init_path();
    Threads = class extends APIResource {
      constructor() {
        super(...arguments);
        this.events = new Events2(this._client);
      }
      /**
       * Get Session Thread
       *
       * @example
       * ```ts
       * const betaManagedAgentsSessionThread =
       *   await client.beta.sessions.threads.retrieve(
       *     'sthr_011CZkZVWa6oIjw0rgXZpnBt',
       *     { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
       *   );
       * ```
       */
      retrieve(threadID, params, options) {
        const { session_id, betas } = params;
        return this._client.get(path`/v1/sessions/${session_id}/threads/${threadID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List Session Threads
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaManagedAgentsSessionThread of client.beta.sessions.threads.list(
       *   'sesn_011CZkZAtmR3yMPDzynEDxu7',
       * )) {
       *   // ...
       * }
       * ```
       */
      list(sessionID, params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList(path`/v1/sessions/${sessionID}/threads?beta=true`, PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Archive Session Thread
       *
       * @example
       * ```ts
       * const betaManagedAgentsSessionThread =
       *   await client.beta.sessions.threads.archive(
       *     'sthr_011CZkZVWa6oIjw0rgXZpnBt',
       *     { session_id: 'sesn_011CZkZAtmR3yMPDzynEDxu7' },
       *   );
       * ```
       */
      archive(threadID, params, options) {
        const { session_id, betas } = params;
        return this._client.post(path`/v1/sessions/${session_id}/threads/${threadID}/archive?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
    };
    Threads.Events = Events2;
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/sessions/sessions.mjs
var Sessions;
var init_sessions = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/sessions/sessions.mjs"() {
    init_resource();
    init_events();
    init_events();
    init_resources();
    init_resources();
    init_threads();
    init_threads();
    init_pagination();
    init_headers();
    init_path();
    Sessions = class extends APIResource {
      constructor() {
        super(...arguments);
        this.events = new Events(this._client);
        this.resources = new Resources(this._client);
        this.threads = new Threads(this._client);
      }
      /**
       * Create Session
       *
       * @example
       * ```ts
       * const betaManagedAgentsSession =
       *   await client.beta.sessions.create({
       *     agent: 'agent_011CZkYpogX7uDKUyvBTophP',
       *     environment_id: 'env_011CZkZ9X2dpNyB7HsEFoRfW',
       *   });
       * ```
       */
      create(params, options) {
        const { betas, ...body } = params;
        return this._client.post("/v1/sessions?beta=true", {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Get Session
       *
       * @example
       * ```ts
       * const betaManagedAgentsSession =
       *   await client.beta.sessions.retrieve(
       *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
       *   );
       * ```
       */
      retrieve(sessionID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.get(path`/v1/sessions/${sessionID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Update Session
       *
       * @example
       * ```ts
       * const betaManagedAgentsSession =
       *   await client.beta.sessions.update(
       *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
       *   );
       * ```
       */
      update(sessionID, params, options) {
        const { betas, ...body } = params;
        return this._client.post(path`/v1/sessions/${sessionID}?beta=true`, {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List Sessions
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaManagedAgentsSession of client.beta.sessions.list()) {
       *   // ...
       * }
       * ```
       */
      list(params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList("/v1/sessions?beta=true", PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Delete Session
       *
       * @example
       * ```ts
       * const betaManagedAgentsDeletedSession =
       *   await client.beta.sessions.delete(
       *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
       *   );
       * ```
       */
      delete(sessionID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.delete(path`/v1/sessions/${sessionID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Archive Session
       *
       * @example
       * ```ts
       * const betaManagedAgentsSession =
       *   await client.beta.sessions.archive(
       *     'sesn_011CZkZAtmR3yMPDzynEDxu7',
       *   );
       * ```
       */
      archive(sessionID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.post(path`/v1/sessions/${sessionID}/archive?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
    };
    Sessions.Events = Events;
    Sessions.Resources = Resources;
    Sessions.Threads = Threads;
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/skills/versions.mjs
var Versions2;
var init_versions2 = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/skills/versions.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_uploads();
    init_path();
    Versions2 = class extends APIResource {
      /**
       * Create Skill Version
       *
       * @example
       * ```ts
       * const version = await client.beta.skills.versions.create(
       *   'skill_id',
       * );
       * ```
       */
      create(skillID, params = {}, options) {
        const { betas, ...body } = params ?? {};
        return this._client.post(path`/v1/skills/${skillID}/versions?beta=true`, multipartFormRequestOptions({
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
            options?.headers
          ])
        }, this._client));
      }
      /**
       * Get Skill Version
       *
       * @example
       * ```ts
       * const version = await client.beta.skills.versions.retrieve(
       *   'version',
       *   { skill_id: 'skill_id' },
       * );
       * ```
       */
      retrieve(version, params, options) {
        const { skill_id, betas } = params;
        return this._client.get(path`/v1/skills/${skill_id}/versions/${version}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List Skill Versions
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const versionListResponse of client.beta.skills.versions.list(
       *   'skill_id',
       * )) {
       *   // ...
       * }
       * ```
       */
      list(skillID, params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList(path`/v1/skills/${skillID}/versions?beta=true`, PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Delete Skill Version
       *
       * @example
       * ```ts
       * const version = await client.beta.skills.versions.delete(
       *   'version',
       *   { skill_id: 'skill_id' },
       * );
       * ```
       */
      delete(version, params, options) {
        const { skill_id, betas } = params;
        return this._client.delete(path`/v1/skills/${skill_id}/versions/${version}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Download a skill version's content as a zip archive.
       *
       * @example
       * ```ts
       * const response = await client.beta.skills.versions.download(
       *   'version',
       *   { skill_id: 'skill_id' },
       * );
       *
       * const content = await response.blob();
       * console.log(content);
       * ```
       */
      download(version, params, options) {
        const { skill_id, betas } = params;
        return this._client.get(path`/v1/skills/${skill_id}/versions/${version}/content?beta=true`, {
          ...options,
          headers: buildHeaders([
            {
              "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString(),
              Accept: "application/binary"
            },
            options?.headers
          ]),
          __binaryResponse: true
        });
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/skills/skills.mjs
var Skills;
var init_skills2 = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/skills/skills.mjs"() {
    init_resource();
    init_versions2();
    init_versions2();
    init_pagination();
    init_headers();
    init_uploads();
    init_path();
    Skills = class extends APIResource {
      constructor() {
        super(...arguments);
        this.versions = new Versions2(this._client);
      }
      /**
       * Create Skill
       *
       * @example
       * ```ts
       * const skill = await client.beta.skills.create();
       * ```
       */
      create(params = {}, options) {
        const { betas, ...body } = params ?? {};
        return this._client.post("/v1/skills?beta=true", multipartFormRequestOptions({
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
            options?.headers
          ])
        }, this._client, false));
      }
      /**
       * Get Skill
       *
       * @example
       * ```ts
       * const skill = await client.beta.skills.retrieve('skill_id');
       * ```
       */
      retrieve(skillID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.get(path`/v1/skills/${skillID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List Skills
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const skillListResponse of client.beta.skills.list()) {
       *   // ...
       * }
       * ```
       */
      list(params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList("/v1/skills?beta=true", PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Delete Skill
       *
       * @example
       * ```ts
       * const skill = await client.beta.skills.delete('skill_id');
       * ```
       */
      delete(skillID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.delete(path`/v1/skills/${skillID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "skills-2025-10-02"].toString() },
            options?.headers
          ])
        });
      }
    };
    Skills.Versions = Versions2;
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/vaults/credentials.mjs
var Credentials;
var init_credentials2 = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/vaults/credentials.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_path();
    Credentials = class extends APIResource {
      /**
       * Create Credential
       *
       * @example
       * ```ts
       * const betaManagedAgentsCredential =
       *   await client.beta.vaults.credentials.create(
       *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
       *     {
       *       auth: {
       *         token: 'bearer_exampletoken',
       *         mcp_server_url:
       *           'https://example-server.modelcontextprotocol.io/sse',
       *         type: 'static_bearer',
       *       },
       *     },
       *   );
       * ```
       */
      create(vaultID, params, options) {
        const { betas, ...body } = params;
        return this._client.post(path`/v1/vaults/${vaultID}/credentials?beta=true`, {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Get Credential
       *
       * @example
       * ```ts
       * const betaManagedAgentsCredential =
       *   await client.beta.vaults.credentials.retrieve(
       *     'vcrd_011CZkZEMt8gZan2iYOQfSkw',
       *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
       *   );
       * ```
       */
      retrieve(credentialID, params, options) {
        const { vault_id, betas } = params;
        return this._client.get(path`/v1/vaults/${vault_id}/credentials/${credentialID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Update Credential
       *
       * @example
       * ```ts
       * const betaManagedAgentsCredential =
       *   await client.beta.vaults.credentials.update(
       *     'vcrd_011CZkZEMt8gZan2iYOQfSkw',
       *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
       *   );
       * ```
       */
      update(credentialID, params, options) {
        const { vault_id, betas, ...body } = params;
        return this._client.post(path`/v1/vaults/${vault_id}/credentials/${credentialID}?beta=true`, {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List Credentials
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaManagedAgentsCredential of client.beta.vaults.credentials.list(
       *   'vlt_011CZkZDLs7fYzm1hXNPeRjv',
       * )) {
       *   // ...
       * }
       * ```
       */
      list(vaultID, params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList(path`/v1/vaults/${vaultID}/credentials?beta=true`, PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Delete Credential
       *
       * @example
       * ```ts
       * const betaManagedAgentsDeletedCredential =
       *   await client.beta.vaults.credentials.delete(
       *     'vcrd_011CZkZEMt8gZan2iYOQfSkw',
       *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
       *   );
       * ```
       */
      delete(credentialID, params, options) {
        const { vault_id, betas } = params;
        return this._client.delete(path`/v1/vaults/${vault_id}/credentials/${credentialID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Archive Credential
       *
       * @example
       * ```ts
       * const betaManagedAgentsCredential =
       *   await client.beta.vaults.credentials.archive(
       *     'vcrd_011CZkZEMt8gZan2iYOQfSkw',
       *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
       *   );
       * ```
       */
      archive(credentialID, params, options) {
        const { vault_id, betas } = params;
        return this._client.post(path`/v1/vaults/${vault_id}/credentials/${credentialID}/archive?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Validate Credential
       *
       * @example
       * ```ts
       * const betaManagedAgentsCredentialValidation =
       *   await client.beta.vaults.credentials.mcpOAuthValidate(
       *     'vcrd_011CZkZEMt8gZan2iYOQfSkw',
       *     { vault_id: 'vlt_011CZkZDLs7fYzm1hXNPeRjv' },
       *   );
       * ```
       */
      mcpOAuthValidate(credentialID, params, options) {
        const { vault_id, betas } = params;
        return this._client.post(path`/v1/vaults/${vault_id}/credentials/${credentialID}/mcp_oauth_validate?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/vaults/vaults.mjs
var Vaults;
var init_vaults = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/vaults/vaults.mjs"() {
    init_resource();
    init_credentials2();
    init_credentials2();
    init_pagination();
    init_headers();
    init_path();
    Vaults = class extends APIResource {
      constructor() {
        super(...arguments);
        this.credentials = new Credentials(this._client);
      }
      /**
       * Create Vault
       *
       * @example
       * ```ts
       * const betaManagedAgentsVault =
       *   await client.beta.vaults.create({
       *     display_name: 'Example vault',
       *   });
       * ```
       */
      create(params, options) {
        const { betas, ...body } = params;
        return this._client.post("/v1/vaults?beta=true", {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Get Vault
       *
       * @example
       * ```ts
       * const betaManagedAgentsVault =
       *   await client.beta.vaults.retrieve(
       *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
       *   );
       * ```
       */
      retrieve(vaultID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.get(path`/v1/vaults/${vaultID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Update Vault
       *
       * @example
       * ```ts
       * const betaManagedAgentsVault =
       *   await client.beta.vaults.update(
       *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
       *   );
       * ```
       */
      update(vaultID, params, options) {
        const { betas, ...body } = params;
        return this._client.post(path`/v1/vaults/${vaultID}?beta=true`, {
          body,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * List Vaults
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const betaManagedAgentsVault of client.beta.vaults.list()) {
       *   // ...
       * }
       * ```
       */
      list(params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList("/v1/vaults?beta=true", PageCursor, {
          query,
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Delete Vault
       *
       * @example
       * ```ts
       * const betaManagedAgentsDeletedVault =
       *   await client.beta.vaults.delete(
       *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
       *   );
       * ```
       */
      delete(vaultID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.delete(path`/v1/vaults/${vaultID}?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
      /**
       * Archive Vault
       *
       * @example
       * ```ts
       * const betaManagedAgentsVault =
       *   await client.beta.vaults.archive(
       *     'vlt_011CZkZDLs7fYzm1hXNPeRjv',
       *   );
       * ```
       */
      archive(vaultID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.post(path`/v1/vaults/${vaultID}/archive?beta=true`, {
          ...options,
          headers: buildHeaders([
            { "anthropic-beta": [...betas ?? [], "managed-agents-2026-04-01"].toString() },
            options?.headers
          ])
        });
      }
    };
    Vaults.Credentials = Credentials;
  }
});

// node_modules/@anthropic-ai/sdk/resources/beta/beta.mjs
var Beta;
var init_beta = __esm({
  "node_modules/@anthropic-ai/sdk/resources/beta/beta.mjs"() {
    init_resource();
    init_files();
    init_files();
    init_models();
    init_models();
    init_user_profiles();
    init_user_profiles();
    init_webhooks();
    init_webhooks();
    init_agents();
    init_agents();
    init_environments();
    init_environments();
    init_memory_stores();
    init_memory_stores();
    init_messages();
    init_messages();
    init_sessions();
    init_sessions();
    init_skills2();
    init_skills2();
    init_vaults();
    init_vaults();
    Beta = class extends APIResource {
      constructor() {
        super(...arguments);
        this.models = new Models(this._client);
        this.messages = new Messages(this._client);
        this.agents = new Agents(this._client);
        this.environments = new Environments(this._client);
        this.sessions = new Sessions(this._client);
        this.vaults = new Vaults(this._client);
        this.memoryStores = new MemoryStores(this._client);
        this.files = new Files(this._client);
        this.skills = new Skills(this._client);
        this.webhooks = new Webhooks(this._client);
        this.userProfiles = new UserProfiles(this._client);
      }
    };
    Beta.Models = Models;
    Beta.Messages = Messages;
    Beta.Agents = Agents;
    Beta.Environments = Environments;
    Beta.Sessions = Sessions;
    Beta.Vaults = Vaults;
    Beta.MemoryStores = MemoryStores;
    Beta.Files = Files;
    Beta.Skills = Skills;
    Beta.Webhooks = Webhooks;
    Beta.UserProfiles = UserProfiles;
  }
});

// node_modules/@anthropic-ai/sdk/resources/completions.mjs
var Completions;
var init_completions = __esm({
  "node_modules/@anthropic-ai/sdk/resources/completions.mjs"() {
    init_resource();
    init_headers();
    Completions = class extends APIResource {
      create(params, options) {
        const { betas, ...body } = params;
        return this._client.post("/v1/complete", {
          body,
          timeout: this._client._options.timeout ?? 6e5,
          ...options,
          headers: buildHeaders([
            { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
            options?.headers
          ]),
          stream: params.stream ?? false
        });
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/lib/parser.mjs
function getOutputFormat2(params) {
  return params?.output_config?.format;
}
function maybeParseMessage(message, params, opts) {
  const outputFormat = getOutputFormat2(params);
  if (!params || !("parse" in (outputFormat ?? {}))) {
    return {
      ...message,
      content: message.content.map((block) => {
        if (block.type === "text") {
          const parsedBlock = Object.defineProperty({ ...block }, "parsed_output", {
            value: null,
            enumerable: false
          });
          return parsedBlock;
        }
        return block;
      }),
      parsed_output: null
    };
  }
  return parseMessage(message, params, opts);
}
function parseMessage(message, params, opts) {
  let firstParsedOutput = null;
  const content = message.content.map((block) => {
    if (block.type === "text") {
      const parsedOutput = parseOutputFormat(params, block.text);
      if (firstParsedOutput === null) {
        firstParsedOutput = parsedOutput;
      }
      const parsedBlock = Object.defineProperty({ ...block }, "parsed_output", {
        value: parsedOutput,
        enumerable: false
      });
      return parsedBlock;
    }
    return block;
  });
  return {
    ...message,
    content,
    parsed_output: firstParsedOutput
  };
}
function parseOutputFormat(params, content) {
  const outputFormat = getOutputFormat2(params);
  if (outputFormat?.type !== "json_schema") {
    return null;
  }
  try {
    if ("parse" in outputFormat) {
      return outputFormat.parse(content);
    }
    return JSON.parse(content);
  } catch (error) {
    throw new AnthropicError(`Failed to parse structured output: ${error}`);
  }
}
var init_parser2 = __esm({
  "node_modules/@anthropic-ai/sdk/lib/parser.mjs"() {
    init_error();
  }
});

// node_modules/@anthropic-ai/sdk/lib/MessageStream.mjs
function tracksToolInput2(content) {
  return content.type === "tool_use" || content.type === "server_tool_use";
}
function checkNever2(x) {
}
var _MessageStream_instances, _MessageStream_currentMessageSnapshot, _MessageStream_params, _MessageStream_connectedPromise, _MessageStream_resolveConnectedPromise, _MessageStream_rejectConnectedPromise, _MessageStream_endPromise, _MessageStream_resolveEndPromise, _MessageStream_rejectEndPromise, _MessageStream_listeners, _MessageStream_ended, _MessageStream_errored, _MessageStream_aborted, _MessageStream_catchingPromiseCreated, _MessageStream_response, _MessageStream_request_id, _MessageStream_logger, _MessageStream_getFinalMessage, _MessageStream_getFinalText, _MessageStream_handleError, _MessageStream_beginRequest, _MessageStream_addStreamEvent, _MessageStream_endRequest, _MessageStream_accumulateMessage, JSON_BUF_PROPERTY2, MessageStream;
var init_MessageStream = __esm({
  "node_modules/@anthropic-ai/sdk/lib/MessageStream.mjs"() {
    init_tslib();
    init_errors();
    init_error2();
    init_streaming2();
    init_parser();
    init_parser2();
    JSON_BUF_PROPERTY2 = "__json_buf";
    MessageStream = class _MessageStream {
      constructor(params, opts) {
        _MessageStream_instances.add(this);
        this.messages = [];
        this.receivedMessages = [];
        _MessageStream_currentMessageSnapshot.set(this, void 0);
        _MessageStream_params.set(this, null);
        this.controller = new AbortController();
        _MessageStream_connectedPromise.set(this, void 0);
        _MessageStream_resolveConnectedPromise.set(this, () => {
        });
        _MessageStream_rejectConnectedPromise.set(this, () => {
        });
        _MessageStream_endPromise.set(this, void 0);
        _MessageStream_resolveEndPromise.set(this, () => {
        });
        _MessageStream_rejectEndPromise.set(this, () => {
        });
        _MessageStream_listeners.set(this, {});
        _MessageStream_ended.set(this, false);
        _MessageStream_errored.set(this, false);
        _MessageStream_aborted.set(this, false);
        _MessageStream_catchingPromiseCreated.set(this, false);
        _MessageStream_response.set(this, void 0);
        _MessageStream_request_id.set(this, void 0);
        _MessageStream_logger.set(this, void 0);
        _MessageStream_handleError.set(this, (error) => {
          __classPrivateFieldSet(this, _MessageStream_errored, true, "f");
          if (isAbortError(error)) {
            error = new APIUserAbortError();
          }
          if (error instanceof APIUserAbortError) {
            __classPrivateFieldSet(this, _MessageStream_aborted, true, "f");
            return this._emit("abort", error);
          }
          if (error instanceof AnthropicError) {
            return this._emit("error", error);
          }
          if (error instanceof Error) {
            const anthropicError = new AnthropicError(error.message);
            anthropicError.cause = error;
            return this._emit("error", anthropicError);
          }
          return this._emit("error", new AnthropicError(String(error)));
        });
        __classPrivateFieldSet(this, _MessageStream_connectedPromise, new Promise((resolve9, reject) => {
          __classPrivateFieldSet(this, _MessageStream_resolveConnectedPromise, resolve9, "f");
          __classPrivateFieldSet(this, _MessageStream_rejectConnectedPromise, reject, "f");
        }), "f");
        __classPrivateFieldSet(this, _MessageStream_endPromise, new Promise((resolve9, reject) => {
          __classPrivateFieldSet(this, _MessageStream_resolveEndPromise, resolve9, "f");
          __classPrivateFieldSet(this, _MessageStream_rejectEndPromise, reject, "f");
        }), "f");
        __classPrivateFieldGet(this, _MessageStream_connectedPromise, "f").catch(() => {
        });
        __classPrivateFieldGet(this, _MessageStream_endPromise, "f").catch(() => {
        });
        __classPrivateFieldSet(this, _MessageStream_params, params, "f");
        __classPrivateFieldSet(this, _MessageStream_logger, opts?.logger ?? console, "f");
      }
      get response() {
        return __classPrivateFieldGet(this, _MessageStream_response, "f");
      }
      get request_id() {
        return __classPrivateFieldGet(this, _MessageStream_request_id, "f");
      }
      /**
       * Returns the `MessageStream` data, the raw `Response` instance and the ID of the request,
       * returned vie the `request-id` header which is useful for debugging requests and resporting
       * issues to Anthropic.
       *
       * This is the same as the `APIPromise.withResponse()` method.
       *
       * This method will raise an error if you created the stream using `MessageStream.fromReadableStream`
       * as no `Response` is available.
       */
      async withResponse() {
        __classPrivateFieldSet(this, _MessageStream_catchingPromiseCreated, true, "f");
        const response = await __classPrivateFieldGet(this, _MessageStream_connectedPromise, "f");
        if (!response) {
          throw new Error("Could not resolve a `Response` object");
        }
        return {
          data: this,
          response,
          request_id: response.headers.get("request-id")
        };
      }
      /**
       * Intended for use on the frontend, consuming a stream produced with
       * `.toReadableStream()` on the backend.
       *
       * Note that messages sent to the model do not appear in `.on('message')`
       * in this context.
       */
      static fromReadableStream(stream) {
        const runner = new _MessageStream(null);
        runner._run(() => runner._fromReadableStream(stream));
        return runner;
      }
      static createMessage(messages, params, options, { logger } = {}) {
        const runner = new _MessageStream(params, { logger });
        for (const message of params.messages) {
          runner._addMessageParam(message);
        }
        __classPrivateFieldSet(runner, _MessageStream_params, { ...params, stream: true }, "f");
        runner._run(() => runner._createMessage(messages, { ...params, stream: true }, { ...options, headers: { ...options?.headers, "X-Stainless-Helper-Method": "stream" } }));
        return runner;
      }
      _run(executor) {
        executor().then(() => {
          this._emitFinal();
          this._emit("end");
        }, __classPrivateFieldGet(this, _MessageStream_handleError, "f"));
      }
      _addMessageParam(message) {
        this.messages.push(message);
      }
      _addMessage(message, emit = true) {
        this.receivedMessages.push(message);
        if (emit) {
          this._emit("message", message);
        }
      }
      async _createMessage(messages, params, options) {
        const signal = options?.signal;
        let abortHandler;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          abortHandler = this.controller.abort.bind(this.controller);
          signal.addEventListener("abort", abortHandler);
        }
        try {
          __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_beginRequest).call(this);
          const { response, data: stream } = await messages.create({ ...params, stream: true }, { ...options, signal: this.controller.signal }).withResponse();
          this._connected(response);
          for await (const event of stream) {
            __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_addStreamEvent).call(this, event);
          }
          if (stream.controller.signal?.aborted) {
            throw new APIUserAbortError();
          }
          __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_endRequest).call(this);
        } finally {
          if (signal && abortHandler) {
            signal.removeEventListener("abort", abortHandler);
          }
        }
      }
      _connected(response) {
        if (this.ended)
          return;
        __classPrivateFieldSet(this, _MessageStream_response, response, "f");
        __classPrivateFieldSet(this, _MessageStream_request_id, response?.headers.get("request-id"), "f");
        __classPrivateFieldGet(this, _MessageStream_resolveConnectedPromise, "f").call(this, response);
        this._emit("connect");
      }
      get ended() {
        return __classPrivateFieldGet(this, _MessageStream_ended, "f");
      }
      get errored() {
        return __classPrivateFieldGet(this, _MessageStream_errored, "f");
      }
      get aborted() {
        return __classPrivateFieldGet(this, _MessageStream_aborted, "f");
      }
      abort() {
        this.controller.abort();
      }
      /**
       * Adds the listener function to the end of the listeners array for the event.
       * No checks are made to see if the listener has already been added. Multiple calls passing
       * the same combination of event and listener will result in the listener being added, and
       * called, multiple times.
       * @returns this MessageStream, so that calls can be chained
       */
      on(event, listener) {
        const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] = []);
        listeners.push({ listener });
        return this;
      }
      /**
       * Removes the specified listener from the listener array for the event.
       * off() will remove, at most, one instance of a listener from the listener array. If any single
       * listener has been added multiple times to the listener array for the specified event, then
       * off() must be called multiple times to remove each instance.
       * @returns this MessageStream, so that calls can be chained
       */
      off(event, listener) {
        const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event];
        if (!listeners)
          return this;
        const index = listeners.findIndex((l) => l.listener === listener);
        if (index >= 0)
          listeners.splice(index, 1);
        return this;
      }
      /**
       * Adds a one-time listener function for the event. The next time the event is triggered,
       * this listener is removed and then invoked.
       * @returns this MessageStream, so that calls can be chained
       */
      once(event, listener) {
        const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] = []);
        listeners.push({ listener, once: true });
        return this;
      }
      /**
       * This is similar to `.once()`, but returns a Promise that resolves the next time
       * the event is triggered, instead of calling a listener callback.
       * @returns a Promise that resolves the next time given event is triggered,
       * or rejects if an error is emitted.  (If you request the 'error' event,
       * returns a promise that resolves with the error).
       *
       * Example:
       *
       *   const message = await stream.emitted('message') // rejects if the stream errors
       */
      emitted(event) {
        return new Promise((resolve9, reject) => {
          __classPrivateFieldSet(this, _MessageStream_catchingPromiseCreated, true, "f");
          if (event !== "error")
            this.once("error", reject);
          this.once(event, resolve9);
        });
      }
      async done() {
        __classPrivateFieldSet(this, _MessageStream_catchingPromiseCreated, true, "f");
        await __classPrivateFieldGet(this, _MessageStream_endPromise, "f");
      }
      get currentMessage() {
        return __classPrivateFieldGet(this, _MessageStream_currentMessageSnapshot, "f");
      }
      /**
       * @returns a promise that resolves with the the final assistant Message response,
       * or rejects if an error occurred or the stream ended prematurely without producing a Message.
       * If structured outputs were used, this will be a ParsedMessage with a `parsed_output` field.
       */
      async finalMessage() {
        await this.done();
        return __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_getFinalMessage).call(this);
      }
      /**
       * @returns a promise that resolves with the the final assistant Message's text response, concatenated
       * together if there are more than one text blocks.
       * Rejects if an error occurred or the stream ended prematurely without producing a Message.
       */
      async finalText() {
        await this.done();
        return __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_getFinalText).call(this);
      }
      _emit(event, ...args) {
        if (__classPrivateFieldGet(this, _MessageStream_ended, "f"))
          return;
        if (event === "end") {
          __classPrivateFieldSet(this, _MessageStream_ended, true, "f");
          __classPrivateFieldGet(this, _MessageStream_resolveEndPromise, "f").call(this);
        }
        const listeners = __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event];
        if (listeners) {
          __classPrivateFieldGet(this, _MessageStream_listeners, "f")[event] = listeners.filter((l) => !l.once);
          listeners.forEach(({ listener }) => listener(...args));
        }
        if (event === "abort") {
          const error = args[0];
          if (!__classPrivateFieldGet(this, _MessageStream_catchingPromiseCreated, "f") && !listeners?.length) {
            Promise.reject(error);
          }
          __classPrivateFieldGet(this, _MessageStream_rejectConnectedPromise, "f").call(this, error);
          __classPrivateFieldGet(this, _MessageStream_rejectEndPromise, "f").call(this, error);
          this._emit("end");
          return;
        }
        if (event === "error") {
          const error = args[0];
          if (!__classPrivateFieldGet(this, _MessageStream_catchingPromiseCreated, "f") && !listeners?.length) {
            Promise.reject(error);
          }
          __classPrivateFieldGet(this, _MessageStream_rejectConnectedPromise, "f").call(this, error);
          __classPrivateFieldGet(this, _MessageStream_rejectEndPromise, "f").call(this, error);
          this._emit("end");
        }
      }
      _emitFinal() {
        const finalMessage = this.receivedMessages.at(-1);
        if (finalMessage) {
          this._emit("finalMessage", __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_getFinalMessage).call(this));
        }
      }
      async _fromReadableStream(readableStream, options) {
        const signal = options?.signal;
        let abortHandler;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          abortHandler = this.controller.abort.bind(this.controller);
          signal.addEventListener("abort", abortHandler);
        }
        try {
          __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_beginRequest).call(this);
          this._connected(null);
          const stream = Stream.fromReadableStream(readableStream, this.controller);
          for await (const event of stream) {
            __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_addStreamEvent).call(this, event);
          }
          if (stream.controller.signal?.aborted) {
            throw new APIUserAbortError();
          }
          __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_endRequest).call(this);
        } finally {
          if (signal && abortHandler) {
            signal.removeEventListener("abort", abortHandler);
          }
        }
      }
      [(_MessageStream_currentMessageSnapshot = /* @__PURE__ */ new WeakMap(), _MessageStream_params = /* @__PURE__ */ new WeakMap(), _MessageStream_connectedPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_endPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _MessageStream_listeners = /* @__PURE__ */ new WeakMap(), _MessageStream_ended = /* @__PURE__ */ new WeakMap(), _MessageStream_errored = /* @__PURE__ */ new WeakMap(), _MessageStream_aborted = /* @__PURE__ */ new WeakMap(), _MessageStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _MessageStream_response = /* @__PURE__ */ new WeakMap(), _MessageStream_request_id = /* @__PURE__ */ new WeakMap(), _MessageStream_logger = /* @__PURE__ */ new WeakMap(), _MessageStream_handleError = /* @__PURE__ */ new WeakMap(), _MessageStream_instances = /* @__PURE__ */ new WeakSet(), _MessageStream_getFinalMessage = function _MessageStream_getFinalMessage2() {
        if (this.receivedMessages.length === 0) {
          throw new AnthropicError("stream ended without producing a Message with role=assistant");
        }
        return this.receivedMessages.at(-1);
      }, _MessageStream_getFinalText = function _MessageStream_getFinalText2() {
        if (this.receivedMessages.length === 0) {
          throw new AnthropicError("stream ended without producing a Message with role=assistant");
        }
        const textBlocks = this.receivedMessages.at(-1).content.filter((block) => block.type === "text").map((block) => block.text);
        if (textBlocks.length === 0) {
          throw new AnthropicError("stream ended without producing a content block with type=text");
        }
        return textBlocks.join(" ");
      }, _MessageStream_beginRequest = function _MessageStream_beginRequest2() {
        if (this.ended)
          return;
        __classPrivateFieldSet(this, _MessageStream_currentMessageSnapshot, void 0, "f");
      }, _MessageStream_addStreamEvent = function _MessageStream_addStreamEvent2(event) {
        if (this.ended)
          return;
        const messageSnapshot = __classPrivateFieldGet(this, _MessageStream_instances, "m", _MessageStream_accumulateMessage).call(this, event);
        this._emit("streamEvent", event, messageSnapshot);
        switch (event.type) {
          case "content_block_delta": {
            const content = messageSnapshot.content.at(-1);
            switch (event.delta.type) {
              case "text_delta": {
                if (content.type === "text") {
                  this._emit("text", event.delta.text, content.text || "");
                }
                break;
              }
              case "citations_delta": {
                if (content.type === "text") {
                  this._emit("citation", event.delta.citation, content.citations ?? []);
                }
                break;
              }
              case "input_json_delta": {
                if (tracksToolInput2(content) && content.input) {
                  this._emit("inputJson", event.delta.partial_json, content.input);
                }
                break;
              }
              case "thinking_delta": {
                if (content.type === "thinking") {
                  this._emit("thinking", event.delta.thinking, content.thinking);
                }
                break;
              }
              case "signature_delta": {
                if (content.type === "thinking") {
                  this._emit("signature", content.signature);
                }
                break;
              }
              default:
                checkNever2(event.delta);
            }
            break;
          }
          case "message_stop": {
            this._addMessageParam(messageSnapshot);
            this._addMessage(maybeParseMessage(messageSnapshot, __classPrivateFieldGet(this, _MessageStream_params, "f"), { logger: __classPrivateFieldGet(this, _MessageStream_logger, "f") }), true);
            break;
          }
          case "content_block_stop": {
            this._emit("contentBlock", messageSnapshot.content.at(-1));
            break;
          }
          case "message_start": {
            __classPrivateFieldSet(this, _MessageStream_currentMessageSnapshot, messageSnapshot, "f");
            break;
          }
          case "content_block_start":
          case "message_delta":
            break;
        }
      }, _MessageStream_endRequest = function _MessageStream_endRequest2() {
        if (this.ended) {
          throw new AnthropicError(`stream has ended, this shouldn't happen`);
        }
        const snapshot = __classPrivateFieldGet(this, _MessageStream_currentMessageSnapshot, "f");
        if (!snapshot) {
          throw new AnthropicError(`request ended without sending any chunks`);
        }
        __classPrivateFieldSet(this, _MessageStream_currentMessageSnapshot, void 0, "f");
        return maybeParseMessage(snapshot, __classPrivateFieldGet(this, _MessageStream_params, "f"), { logger: __classPrivateFieldGet(this, _MessageStream_logger, "f") });
      }, _MessageStream_accumulateMessage = function _MessageStream_accumulateMessage2(event) {
        let snapshot = __classPrivateFieldGet(this, _MessageStream_currentMessageSnapshot, "f");
        if (event.type === "message_start") {
          if (snapshot) {
            throw new AnthropicError(`Unexpected event order, got ${event.type} before receiving "message_stop"`);
          }
          return event.message;
        }
        if (!snapshot) {
          throw new AnthropicError(`Unexpected event order, got ${event.type} before "message_start"`);
        }
        switch (event.type) {
          case "message_stop":
            return snapshot;
          case "message_delta":
            snapshot.stop_reason = event.delta.stop_reason;
            snapshot.stop_sequence = event.delta.stop_sequence;
            snapshot.usage.output_tokens = event.usage.output_tokens;
            if (event.usage.input_tokens != null) {
              snapshot.usage.input_tokens = event.usage.input_tokens;
            }
            if (event.usage.cache_creation_input_tokens != null) {
              snapshot.usage.cache_creation_input_tokens = event.usage.cache_creation_input_tokens;
            }
            if (event.usage.cache_read_input_tokens != null) {
              snapshot.usage.cache_read_input_tokens = event.usage.cache_read_input_tokens;
            }
            if (event.usage.server_tool_use != null) {
              snapshot.usage.server_tool_use = event.usage.server_tool_use;
            }
            return snapshot;
          case "content_block_start":
            snapshot.content.push({ ...event.content_block });
            return snapshot;
          case "content_block_delta": {
            const snapshotContent = snapshot.content.at(event.index);
            switch (event.delta.type) {
              case "text_delta": {
                if (snapshotContent?.type === "text") {
                  snapshot.content[event.index] = {
                    ...snapshotContent,
                    text: (snapshotContent.text || "") + event.delta.text
                  };
                }
                break;
              }
              case "citations_delta": {
                if (snapshotContent?.type === "text") {
                  snapshot.content[event.index] = {
                    ...snapshotContent,
                    citations: [...snapshotContent.citations ?? [], event.delta.citation]
                  };
                }
                break;
              }
              case "input_json_delta": {
                if (snapshotContent && tracksToolInput2(snapshotContent)) {
                  let jsonBuf = snapshotContent[JSON_BUF_PROPERTY2] || "";
                  jsonBuf += event.delta.partial_json;
                  const newContent = { ...snapshotContent };
                  Object.defineProperty(newContent, JSON_BUF_PROPERTY2, {
                    value: jsonBuf,
                    enumerable: false,
                    writable: true
                  });
                  if (jsonBuf) {
                    newContent.input = partialParse(jsonBuf);
                  }
                  snapshot.content[event.index] = newContent;
                }
                break;
              }
              case "thinking_delta": {
                if (snapshotContent?.type === "thinking") {
                  snapshot.content[event.index] = {
                    ...snapshotContent,
                    thinking: snapshotContent.thinking + event.delta.thinking
                  };
                }
                break;
              }
              case "signature_delta": {
                if (snapshotContent?.type === "thinking") {
                  snapshot.content[event.index] = {
                    ...snapshotContent,
                    signature: event.delta.signature
                  };
                }
                break;
              }
              default:
                checkNever2(event.delta);
            }
            return snapshot;
          }
          case "content_block_stop":
            return snapshot;
        }
      }, Symbol.asyncIterator)]() {
        const pushQueue = [];
        const readQueue2 = [];
        let done = false;
        this.on("streamEvent", (event) => {
          const reader = readQueue2.shift();
          if (reader) {
            reader.resolve(event);
          } else {
            pushQueue.push(event);
          }
        });
        this.on("end", () => {
          done = true;
          for (const reader of readQueue2) {
            reader.resolve(void 0);
          }
          readQueue2.length = 0;
        });
        this.on("abort", (err) => {
          done = true;
          for (const reader of readQueue2) {
            reader.reject(err);
          }
          readQueue2.length = 0;
        });
        this.on("error", (err) => {
          done = true;
          for (const reader of readQueue2) {
            reader.reject(err);
          }
          readQueue2.length = 0;
        });
        return {
          next: async () => {
            if (!pushQueue.length) {
              if (done) {
                return { value: void 0, done: true };
              }
              return new Promise((resolve9, reject) => readQueue2.push({ resolve: resolve9, reject })).then((chunk2) => chunk2 ? { value: chunk2, done: false } : { value: void 0, done: true });
            }
            const chunk = pushQueue.shift();
            return { value: chunk, done: false };
          },
          return: async () => {
            this.abort();
            return { value: void 0, done: true };
          }
        };
      }
      toReadableStream() {
        const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
        return stream.toReadableStream();
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/messages/batches.mjs
var Batches2;
var init_batches2 = __esm({
  "node_modules/@anthropic-ai/sdk/resources/messages/batches.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_jsonl();
    init_error2();
    init_path();
    Batches2 = class extends APIResource {
      /**
       * Send a batch of Message creation requests.
       *
       * The Message Batches API can be used to process multiple Messages API requests at
       * once. Once a Message Batch is created, it begins processing immediately. Batches
       * can take up to 24 hours to complete.
       *
       * Learn more about the Message Batches API in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
       *
       * @example
       * ```ts
       * const messageBatch = await client.messages.batches.create({
       *   requests: [
       *     {
       *       custom_id: 'my-custom-id-1',
       *       params: {
       *         max_tokens: 1024,
       *         messages: [
       *           { content: 'Hello, world', role: 'user' },
       *         ],
       *         model: 'claude-opus-4-6',
       *       },
       *     },
       *   ],
       * });
       * ```
       */
      create(body, options) {
        return this._client.post("/v1/messages/batches", { body, ...options });
      }
      /**
       * This endpoint is idempotent and can be used to poll for Message Batch
       * completion. To access the results of a Message Batch, make a request to the
       * `results_url` field in the response.
       *
       * Learn more about the Message Batches API in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
       *
       * @example
       * ```ts
       * const messageBatch = await client.messages.batches.retrieve(
       *   'message_batch_id',
       * );
       * ```
       */
      retrieve(messageBatchID, options) {
        return this._client.get(path`/v1/messages/batches/${messageBatchID}`, options);
      }
      /**
       * List all Message Batches within a Workspace. Most recently created batches are
       * returned first.
       *
       * Learn more about the Message Batches API in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const messageBatch of client.messages.batches.list()) {
       *   // ...
       * }
       * ```
       */
      list(query = {}, options) {
        return this._client.getAPIList("/v1/messages/batches", Page, { query, ...options });
      }
      /**
       * Delete a Message Batch.
       *
       * Message Batches can only be deleted once they've finished processing. If you'd
       * like to delete an in-progress batch, you must first cancel it.
       *
       * Learn more about the Message Batches API in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
       *
       * @example
       * ```ts
       * const deletedMessageBatch =
       *   await client.messages.batches.delete('message_batch_id');
       * ```
       */
      delete(messageBatchID, options) {
        return this._client.delete(path`/v1/messages/batches/${messageBatchID}`, options);
      }
      /**
       * Batches may be canceled any time before processing ends. Once cancellation is
       * initiated, the batch enters a `canceling` state, at which time the system may
       * complete any in-progress, non-interruptible requests before finalizing
       * cancellation.
       *
       * The number of canceled requests is specified in `request_counts`. To determine
       * which requests were canceled, check the individual results within the batch.
       * Note that cancellation may not result in any canceled requests if they were
       * non-interruptible.
       *
       * Learn more about the Message Batches API in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
       *
       * @example
       * ```ts
       * const messageBatch = await client.messages.batches.cancel(
       *   'message_batch_id',
       * );
       * ```
       */
      cancel(messageBatchID, options) {
        return this._client.post(path`/v1/messages/batches/${messageBatchID}/cancel`, options);
      }
      /**
       * Streams the results of a Message Batch as a `.jsonl` file.
       *
       * Each line in the file is a JSON object containing the result of a single request
       * in the Message Batch. Results are not guaranteed to be in the same order as
       * requests. Use the `custom_id` field to match results to requests.
       *
       * Learn more about the Message Batches API in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/batch-processing)
       *
       * @example
       * ```ts
       * const messageBatchIndividualResponse =
       *   await client.messages.batches.results('message_batch_id');
       * ```
       */
      async results(messageBatchID, options) {
        const batch = await this.retrieve(messageBatchID);
        if (!batch.results_url) {
          throw new AnthropicError(`No batch \`results_url\`; Has it finished processing? ${batch.processing_status} - ${batch.id}`);
        }
        return this._client.get(batch.results_url, {
          ...options,
          headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
          stream: true,
          __binaryResponse: true
        })._thenUnwrap((_, props) => JSONLDecoder.fromResponse(props.response, props.controller));
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/messages/messages.mjs
var Messages2, DEPRECATED_MODELS2, MODELS_TO_WARN_WITH_THINKING_ENABLED2;
var init_messages2 = __esm({
  "node_modules/@anthropic-ai/sdk/resources/messages/messages.mjs"() {
    init_resource();
    init_headers();
    init_stainless_helper_header();
    init_MessageStream();
    init_parser2();
    init_batches2();
    init_batches2();
    init_constants();
    Messages2 = class extends APIResource {
      constructor() {
        super(...arguments);
        this.batches = new Batches2(this._client);
      }
      create(body, options) {
        if (body.model in DEPRECATED_MODELS2) {
          console.warn(`The model '${body.model}' is deprecated and will reach end-of-life on ${DEPRECATED_MODELS2[body.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
        }
        if (MODELS_TO_WARN_WITH_THINKING_ENABLED2.includes(body.model) && body.thinking && body.thinking.type === "enabled") {
          console.warn(`Using Claude with ${body.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);
        }
        let timeout = this._client._options.timeout;
        if (!body.stream && timeout == null) {
          const maxNonstreamingTokens = MODEL_NONSTREAMING_TOKENS[body.model] ?? void 0;
          timeout = this._client.calculateNonstreamingTimeout(body.max_tokens, maxNonstreamingTokens);
        }
        const helperHeader = stainlessHelperHeader(body.tools, body.messages);
        return this._client.post("/v1/messages", {
          body,
          timeout: timeout ?? 6e5,
          ...options,
          headers: buildHeaders([helperHeader, options?.headers]),
          stream: body.stream ?? false
        });
      }
      /**
       * Send a structured list of input messages with text and/or image content, along with an expected `output_config.format` and
       * the response will be automatically parsed and available in the `parsed_output` property of the message.
       *
       * @example
       * ```ts
       * const message = await client.messages.parse({
       *   model: 'claude-sonnet-4-5-20250929',
       *   max_tokens: 1024,
       *   messages: [{ role: 'user', content: 'What is 2+2?' }],
       *   output_config: {
       *     format: zodOutputFormat(z.object({ answer: z.number() })),
       *   },
       * });
       *
       * console.log(message.parsed_output?.answer); // 4
       * ```
       */
      parse(params, options) {
        return this.create(params, options).then((message) => parseMessage(message, params, { logger: this._client.logger ?? console }));
      }
      /**
       * Create a Message stream.
       *
       * If `output_config.format` is provided with a parseable format (like `zodOutputFormat()`),
       * the final message will include a `parsed_output` property with the parsed content.
       *
       * @example
       * ```ts
       * const stream = client.messages.stream({
       *   model: 'claude-sonnet-4-5-20250929',
       *   max_tokens: 1024,
       *   messages: [{ role: 'user', content: 'What is 2+2?' }],
       *   output_config: {
       *     format: zodOutputFormat(z.object({ answer: z.number() })),
       *   },
       * });
       *
       * const message = await stream.finalMessage();
       * console.log(message.parsed_output?.answer); // 4
       * ```
       */
      stream(body, options) {
        return MessageStream.createMessage(this, body, options, { logger: this._client.logger ?? console });
      }
      /**
       * Count the number of tokens in a Message.
       *
       * The Token Count API can be used to count the number of tokens in a Message,
       * including tools, images, and documents, without creating it.
       *
       * Learn more about token counting in our
       * [user guide](https://docs.claude.com/en/docs/build-with-claude/token-counting)
       *
       * @example
       * ```ts
       * const messageTokensCount =
       *   await client.messages.countTokens({
       *     messages: [{ content: 'Hello, world', role: 'user' }],
       *     model: 'claude-opus-4-6',
       *   });
       * ```
       */
      countTokens(body, options) {
        return this._client.post("/v1/messages/count_tokens", { body, ...options });
      }
    };
    DEPRECATED_MODELS2 = {
      "claude-1.3": "November 6th, 2024",
      "claude-1.3-100k": "November 6th, 2024",
      "claude-instant-1.1": "November 6th, 2024",
      "claude-instant-1.1-100k": "November 6th, 2024",
      "claude-instant-1.2": "November 6th, 2024",
      "claude-3-sonnet-20240229": "July 21st, 2025",
      "claude-3-opus-20240229": "January 5th, 2026",
      "claude-2.1": "July 21st, 2025",
      "claude-2.0": "July 21st, 2025",
      "claude-3-7-sonnet-latest": "February 19th, 2026",
      "claude-3-7-sonnet-20250219": "February 19th, 2026",
      "claude-3-5-haiku-latest": "February 19th, 2026",
      "claude-3-5-haiku-20241022": "February 19th, 2026",
      "claude-opus-4-0": "June 15th, 2026",
      "claude-opus-4-20250514": "June 15th, 2026",
      "claude-sonnet-4-0": "June 15th, 2026",
      "claude-sonnet-4-20250514": "June 15th, 2026"
    };
    MODELS_TO_WARN_WITH_THINKING_ENABLED2 = ["claude-mythos-preview", "claude-opus-4-6"];
    Messages2.Batches = Batches2;
  }
});

// node_modules/@anthropic-ai/sdk/resources/models.mjs
var Models2;
var init_models2 = __esm({
  "node_modules/@anthropic-ai/sdk/resources/models.mjs"() {
    init_resource();
    init_pagination();
    init_headers();
    init_path();
    Models2 = class extends APIResource {
      /**
       * Get a specific model.
       *
       * The Models API response can be used to determine information about a specific
       * model or resolve a model alias to a model ID.
       */
      retrieve(modelID, params = {}, options) {
        const { betas } = params ?? {};
        return this._client.get(path`/v1/models/${modelID}`, {
          ...options,
          headers: buildHeaders([
            { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
            options?.headers
          ])
        });
      }
      /**
       * List available models.
       *
       * The Models API response can be used to determine which models are available for
       * use in the API. More recently released models are listed first.
       */
      list(params = {}, options) {
        const { betas, ...query } = params ?? {};
        return this._client.getAPIList("/v1/models", Page, {
          query,
          ...options,
          headers: buildHeaders([
            { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
            options?.headers
          ])
        });
      }
    };
  }
});

// node_modules/@anthropic-ai/sdk/resources/index.mjs
var init_resources2 = __esm({
  "node_modules/@anthropic-ai/sdk/resources/index.mjs"() {
    init_shared();
    init_beta();
    init_completions();
    init_messages2();
    init_models2();
  }
});

// node_modules/@anthropic-ai/sdk/client.mjs
var _BaseAnthropic_instances, _a, _BaseAnthropic_encoder, _BaseAnthropic_baseURLOverridden, HUMAN_PROMPT, AI_PROMPT, BaseAnthropic, Anthropic;
var init_client = __esm({
  "node_modules/@anthropic-ai/sdk/client.mjs"() {
    init_tslib();
    init_uuid();
    init_values();
    init_sleep();
    init_errors();
    init_detect_platform();
    init_shims();
    init_request_options();
    init_query();
    init_version();
    init_error();
    init_types();
    init_token_cache();
    init_credential_chain();
    init_pagination();
    init_uploads2();
    init_resources2();
    init_api_promise();
    init_completions();
    init_models2();
    init_beta();
    init_messages2();
    init_detect_platform();
    init_headers();
    init_env();
    init_log();
    init_values();
    HUMAN_PROMPT = "\\n\\nHuman:";
    AI_PROMPT = "\\n\\nAssistant:";
    BaseAnthropic = class {
      /**
       * The active credential provider. Default credential resolution runs once
       * at construction time. If it fails, the error is surfaced on every
       * request and the client must be reconstructed — there is no retry path.
       *
       * Clones returned by {@link withOptions} share the parent's auth state
       * (provider, token cache, pending resolution, and any resolution error)
       * unless the caller passes an explicit `apiKey`, `authToken`,
       * `credentials`, `config`, or `profile` override.
       */
      get credentials() {
        return this._authState.provider;
      }
      /**
       * API Client for interfacing with the Anthropic API.
       *
       * @param {string | null | undefined} [opts.apiKey=process.env['ANTHROPIC_API_KEY'] ?? null]
       * @param {string | null | undefined} [opts.authToken=process.env['ANTHROPIC_AUTH_TOKEN'] ?? null]
       * @param {string | null | undefined} [opts.webhookKey=process.env['ANTHROPIC_WEBHOOK_SIGNING_KEY'] ?? null]
       * @param {string} [opts.baseURL=process.env['ANTHROPIC_BASE_URL'] ?? https://api.anthropic.com] - Override the default base URL for the API.
       * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
       * @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
       * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
       * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
       * @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
       * @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
       * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
       */
      constructor({ baseURL = readEnv("ANTHROPIC_BASE_URL"), apiKey, authToken, webhookKey = readEnv("ANTHROPIC_WEBHOOK_SIGNING_KEY") ?? null, ...opts } = {}) {
        _BaseAnthropic_instances.add(this);
        this._requestAuthFlags = /* @__PURE__ */ new WeakMap();
        _BaseAnthropic_encoder.set(this, void 0);
        if (apiKey === void 0) {
          apiKey = opts.profile != null ? null : readEnv("ANTHROPIC_API_KEY") ?? null;
        }
        if (authToken === void 0) {
          authToken = opts.profile != null ? null : readEnv("ANTHROPIC_AUTH_TOKEN") ?? null;
        }
        if (opts.profile != null && (opts.credentials != null || opts.config != null)) {
          throw new TypeError("Pass at most one of `profile`, `credentials`, or `config`.");
        }
        const options = {
          apiKey,
          authToken,
          webhookKey,
          ...opts,
          baseURL: baseURL || `https://api.anthropic.com`
        };
        if (!options.dangerouslyAllowBrowser && isRunningInBrowser()) {
          throw new AnthropicError("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew Anthropic({ apiKey, dangerouslyAllowBrowser: true });\n");
        }
        this.baseURL = options.baseURL;
        this._baseURLIsExplicit = opts.__baseURLIsExplicit ?? !!baseURL;
        this.timeout = options.timeout ?? _a.DEFAULT_TIMEOUT;
        this.logger = options.logger ?? console;
        const defaultLogLevel = "warn";
        this.logLevel = defaultLogLevel;
        this.logLevel = parseLogLevel(options.logLevel, "ClientOptions.logLevel", this) ?? parseLogLevel(readEnv("ANTHROPIC_LOG"), "process.env['ANTHROPIC_LOG']", this) ?? defaultLogLevel;
        this.fetchOptions = options.fetchOptions;
        this.maxRetries = options.maxRetries ?? 2;
        this.fetch = options.fetch ?? getDefaultFetch();
        __classPrivateFieldSet(this, _BaseAnthropic_encoder, FallbackEncoder, "f");
        const customHeadersEnv = readEnv("ANTHROPIC_CUSTOM_HEADERS");
        if (customHeadersEnv) {
          const parsed = {};
          for (const line of customHeadersEnv.split("\n")) {
            const colon = line.indexOf(":");
            if (colon >= 0) {
              parsed[line.substring(0, colon).trim()] = line.substring(colon + 1).trim();
            }
          }
          options.defaultHeaders = { ...parsed, ...options.defaultHeaders };
        }
        const inherited = opts.__auth;
        delete options.__auth;
        delete options.__baseURLIsExplicit;
        this._options = options;
        this.apiKey = typeof apiKey === "string" ? apiKey : null;
        this.authToken = authToken;
        this.webhookKey = webhookKey;
        if (inherited) {
          this._authState = inherited;
          if (!this._baseURLIsExplicit && inherited.baseURL) {
            this.baseURL = inherited.baseURL;
          }
        } else {
          this._authState = { provider: null, tokenCache: null, resolution: null, error: null, extraHeaders: {} };
          if (this.apiKey == null && this.authToken == null) {
            const credentials = options.credentials ?? null;
            if (credentials) {
              this._authState.provider = credentials;
              this._authState.tokenCache = this._makeTokenCache(credentials);
            } else if (options.config != null) {
              const result = resolveCredentialsFromConfig(options.config, this._credentialResolverOptions());
              this._authState.provider = result.provider;
              this._authState.tokenCache = this._makeTokenCache(result.provider);
              this._authState.extraHeaders = result.extraHeaders;
              this._applyCredentialBaseURL(result.baseURL);
            } else if (options.profile != null) {
              this._authState.resolution = this._resolveDefaultCredentials(options.profile);
            } else {
              this._authState.resolution = this._resolveDefaultCredentials();
            }
          }
        }
      }
      /**
       * Stores a profile/config-supplied base URL on the shared auth state and, if
       * the caller did not pin `baseURL` via constructor option or env, adopts it
       * as this client's outbound API host. Precedence: ctor opt > env > profile >
       * hardcoded default.
       */
      _applyCredentialBaseURL(baseURL) {
        if (!baseURL)
          return;
        const normalized = baseURL.replace(/\/+$/, "");
        this._authState.baseURL = normalized;
        if (!this._baseURLIsExplicit) {
          this.baseURL = normalized;
        }
      }
      /**
       * Options bag passed into the credential chain. `baseURL` here is only the
       * fallback host for the token-exchange POST when the config itself omits
       * `base_url`; the chain returns the config's own `base_url` (if any) on
       * {@link CredentialResult.baseURL}, which {@link _applyCredentialBaseURL}
       * then adopts for outbound API requests. The two are deliberately decoupled
       * so this fallback never round-trips into precedence.
       */
      _credentialResolverOptions() {
        return {
          baseURL: this.baseURL,
          fetch: this.fetch,
          userAgent: this.getUserAgent(),
          onCacheWriteError: (err) => {
            loggerFor(this).debug("credential cache write failed (best-effort)", err);
          },
          onSafetyWarning: (msg) => {
            loggerFor(this).warn(msg);
          }
        };
      }
      _makeTokenCache(provider) {
        return new TokenCache(provider, (err) => {
          loggerFor(this).debug("advisory token refresh failed; serving cached token", err);
        });
      }
      /**
       * Create a new client instance re-using the same options given to the current client with optional overriding.
       */
      withOptions(options) {
        const overridesStructuredAuth = "credentials" in options || "config" in options || "profile" in options;
        const overridesAuth = "apiKey" in options || "authToken" in options || overridesStructuredAuth;
        const internal = {
          ...this._options,
          // Only forward baseURL when the caller (or env) explicitly chose it.
          // For a non-explicit parent, this.baseURL may have been mutated to the
          // profile-resolved host; pinning that as the clone's options.baseURL
          // would make _options on the clone misreport caller intent and would
          // leave the clone stuck on the parent's host across an auth override.
          // The clone instead receives the construction-time value via
          // ...this._options above and re-adopts the profile host through the
          // shared _authState.baseURL + __baseURLIsExplicit=false path.
          ...this._baseURLIsExplicit ? { baseURL: this.baseURL } : {},
          maxRetries: this.maxRetries,
          timeout: this.timeout,
          logger: this.logger,
          logLevel: this.logLevel,
          fetch: this.fetch,
          fetchOptions: this.fetchOptions,
          apiKey: this.apiKey,
          authToken: this.authToken,
          webhookKey: this.webhookKey,
          // credentials: this.credentials is a no-op when __auth is shared (the
          // ctor takes the inherited path and ignores options.credentials); when
          // overridesAuth is true via apiKey/authToken only, it lets the clone
          // build a fresh TokenCache around the parent's provider.
          credentials: this.credentials,
          // When the caller passes a structured-credential override, drop inherited
          // structured-credential options so only `...options` supplies them —
          // otherwise an inherited `credentials`/`config`/`profile` would trip the
          // mutual-exclusion check or precedence over the override.
          ...overridesStructuredAuth ? { credentials: void 0, config: void 0, profile: void 0 } : {},
          ...options,
          // Always set __auth so any stale value from ...this._options is
          // overwritten. undefined means "build fresh auth from these options".
          __auth: overridesAuth ? void 0 : this._authState,
          __baseURLIsExplicit: "baseURL" in options ? true : this._baseURLIsExplicit
        };
        return new this.constructor(internal);
      }
      /**
       * Lazily resolves credentials from config files or environment variables.
       * Called once from the constructor when no explicit auth is provided, or
       * when an explicit `profile` was passed (in which case a missing/unresolved
       * profile is surfaced as an error instead of falling through to "no auth").
       * The returned promise is stored and awaited on the first request.
       */
      async _resolveDefaultCredentials(profile) {
        try {
          const result = await defaultCredentials(this._credentialResolverOptions(), profile);
          if (result) {
            this._authState.provider = result.provider;
            this._authState.tokenCache = this._makeTokenCache(result.provider);
            this._authState.extraHeaders = result.extraHeaders;
            this._applyCredentialBaseURL(result.baseURL);
          } else if (profile != null) {
            throw new AnthropicError(`Profile "${profile}" could not be resolved (no <config_dir>/configs/${profile}.json found).`);
          }
        } catch (err) {
          this._authState.error = err;
        } finally {
          this._authState.resolution = null;
        }
      }
      defaultQuery() {
        return this._options.defaultQuery;
      }
      validateHeaders({ values, nulls }) {
        if (values.get("x-api-key") || values.get("authorization")) {
          return;
        }
        if (this._authState.error) {
          throw this._authState.error;
        }
        if (this._authState.tokenCache || this._authState.resolution) {
          return;
        }
        if (this.apiKey && values.get("x-api-key")) {
          return;
        }
        if (nulls.has("x-api-key")) {
          return;
        }
        if (this.authToken && values.get("authorization")) {
          return;
        }
        if (nulls.has("authorization")) {
          return;
        }
        throw new Error('Could not resolve authentication method. Expected one of apiKey, authToken, credentials, config, or profile to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted');
      }
      _authFlags(opts) {
        let flags = this._requestAuthFlags.get(opts);
        if (!flags) {
          flags = { usedTokenCache: false, didRefreshFor401: false };
          this._requestAuthFlags.set(opts, flags);
        }
        return flags;
      }
      async authHeaders(opts) {
        if (this._authState.resolution) {
          await this._authState.resolution;
        }
        if (this._authState.error) {
          return void 0;
        }
        if (this._authState.tokenCache && this.apiKey == null) {
          const token = await this._authState.tokenCache.getToken();
          this._authFlags(opts).usedTokenCache = true;
          return buildHeaders([{ Authorization: `Bearer ${token}` }]);
        }
        return buildHeaders([await this.apiKeyAuth(opts), await this.bearerAuth(opts)]);
      }
      async apiKeyAuth(opts) {
        if (this.apiKey == null) {
          return void 0;
        }
        return buildHeaders([{ "X-Api-Key": this.apiKey }]);
      }
      async bearerAuth(opts) {
        if (this.authToken == null) {
          return void 0;
        }
        return buildHeaders([{ Authorization: `Bearer ${this.authToken}` }]);
      }
      stringifyQuery(query) {
        return stringifyQuery(query);
      }
      getUserAgent() {
        return `${this.constructor.name}/JS ${VERSION}`;
      }
      defaultIdempotencyKey() {
        return `stainless-node-retry-${uuid4()}`;
      }
      makeStatusError(status, error, message, headers) {
        return APIError.generate(status, error, message, headers);
      }
      buildURL(path5, query, defaultBaseURL) {
        const baseURL = !__classPrivateFieldGet(this, _BaseAnthropic_instances, "m", _BaseAnthropic_baseURLOverridden).call(this) && defaultBaseURL || this.baseURL;
        const url = isAbsoluteURL(path5) ? new URL(path5) : new URL(baseURL + (baseURL.endsWith("/") && path5.startsWith("/") ? path5.slice(1) : path5));
        const defaultQuery = this.defaultQuery();
        const pathQuery = Object.fromEntries(url.searchParams);
        if (!isEmptyObj(defaultQuery) || !isEmptyObj(pathQuery)) {
          query = { ...pathQuery, ...defaultQuery, ...query };
        }
        if (typeof query === "object" && query && !Array.isArray(query)) {
          url.search = this.stringifyQuery(query);
        }
        return url.toString();
      }
      _calculateNonstreamingTimeout(maxTokens) {
        const defaultTimeout = 10 * 60;
        const expectedTimeout = 60 * 60 * maxTokens / 128e3;
        if (expectedTimeout > defaultTimeout) {
          throw new AnthropicError("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#streaming-responses for more details");
        }
        return defaultTimeout * 1e3;
      }
      /**
       * Used as a callback for mutating the given `FinalRequestOptions` object.
       */
      async prepareOptions(options) {
      }
      /**
       * Used as a callback for mutating the given `RequestInit` object.
       *
       * This is useful for cases where you want to add certain headers based off of
       * the request properties, e.g. `method` or `url`.
       */
      async prepareRequest(request, { url, options }) {
        if (this._authState.tokenCache && this.apiKey == null) {
          const headers = request.headers instanceof Headers ? request.headers : new Headers(request.headers);
          for (const [k, v] of Object.entries(this._authState.extraHeaders)) {
            if (!headers.has(k))
              headers.set(k, v);
          }
          const existing = headers.get("anthropic-beta")?.split(",").map((s) => s.trim());
          if (!existing?.includes(OAUTH_API_BETA_HEADER)) {
            headers.append("anthropic-beta", OAUTH_API_BETA_HEADER);
          }
          request.headers = headers;
        }
      }
      get(path5, opts) {
        return this.methodRequest("get", path5, opts);
      }
      post(path5, opts) {
        return this.methodRequest("post", path5, opts);
      }
      patch(path5, opts) {
        return this.methodRequest("patch", path5, opts);
      }
      put(path5, opts) {
        return this.methodRequest("put", path5, opts);
      }
      delete(path5, opts) {
        return this.methodRequest("delete", path5, opts);
      }
      methodRequest(method, path5, opts) {
        return this.request(Promise.resolve(opts).then((opts2) => {
          return { method, path: path5, ...opts2 };
        }));
      }
      request(options, remainingRetries = null) {
        return new APIPromise(this, this.makeRequest(options, remainingRetries, void 0));
      }
      async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
        const options = await optionsInput;
        const maxRetries = options.maxRetries ?? this.maxRetries;
        if (retriesRemaining == null) {
          retriesRemaining = maxRetries;
          this._requestAuthFlags.delete(options);
        }
        await this.prepareOptions(options);
        const { req, url, timeout } = await this.buildRequest(options, {
          retryCount: maxRetries - retriesRemaining
        });
        await this.prepareRequest(req, { url, options });
        const requestLogID = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0");
        const retryLogStr = retryOfRequestLogID === void 0 ? "" : `, retryOf: ${retryOfRequestLogID}`;
        const startTime = Date.now();
        loggerFor(this).debug(`[${requestLogID}] sending request`, formatRequestDetails({
          retryOfRequestLogID,
          method: options.method,
          url,
          options,
          headers: req.headers
        }));
        if (options.signal?.aborted) {
          throw new APIUserAbortError();
        }
        const controller = new AbortController();
        const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
        const headersTime = Date.now();
        if (response instanceof globalThis.Error) {
          const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
          if (options.signal?.aborted) {
            throw new APIUserAbortError();
          }
          const isTimeout = isAbortError(response) || /timed? ?out/i.test(String(response) + ("cause" in response ? String(response.cause) : ""));
          if (retriesRemaining) {
            loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - ${retryMessage}`);
            loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (${retryMessage})`, formatRequestDetails({
              retryOfRequestLogID,
              url,
              durationMs: headersTime - startTime,
              message: response.message
            }));
            return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
          }
          loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - error; no more retries left`);
          loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (error; no more retries left)`, formatRequestDetails({
            retryOfRequestLogID,
            url,
            durationMs: headersTime - startTime,
            message: response.message
          }));
          if (isTimeout) {
            throw new APIConnectionTimeoutError();
          }
          throw new APIConnectionError({ cause: response });
        }
        const specialHeaders = [...response.headers.entries()].filter(([name]) => name === "request-id").map(([name, value]) => ", " + name + ": " + JSON.stringify(value)).join("");
        const responseInfo = `[${requestLogID}${retryLogStr}${specialHeaders}] ${req.method} ${url} ${response.ok ? "succeeded" : "failed"} with status ${response.status} in ${headersTime - startTime}ms`;
        if (!response.ok) {
          const shouldRetry = await this.shouldRetry(response, options);
          if (retriesRemaining && shouldRetry) {
            const retryMessage2 = `retrying, ${retriesRemaining} attempts remaining`;
            await CancelReadableStream(response.body);
            loggerFor(this).info(`${responseInfo} - ${retryMessage2}`);
            loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage2})`, formatRequestDetails({
              retryOfRequestLogID,
              url: response.url,
              status: response.status,
              headers: response.headers,
              durationMs: headersTime - startTime
            }));
            return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID, response.headers);
          }
          const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;
          loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
          const errText = await response.text().catch((err2) => castToError(err2).message);
          const errJSON = safeJSON(errText);
          const errMessage = errJSON ? void 0 : errText;
          loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
            retryOfRequestLogID,
            url: response.url,
            status: response.status,
            headers: response.headers,
            message: errMessage,
            durationMs: Date.now() - startTime
          }));
          const err = this.makeStatusError(response.status, errJSON, errMessage, response.headers);
          throw err;
        }
        loggerFor(this).info(responseInfo);
        loggerFor(this).debug(`[${requestLogID}] response start`, formatRequestDetails({
          retryOfRequestLogID,
          url: response.url,
          status: response.status,
          headers: response.headers,
          durationMs: headersTime - startTime
        }));
        return { response, options, controller, requestLogID, retryOfRequestLogID, startTime };
      }
      getAPIList(path5, Page2, opts) {
        return this.requestAPIList(Page2, opts && "then" in opts ? opts.then((opts2) => ({ method: "get", path: path5, ...opts2 })) : { method: "get", path: path5, ...opts });
      }
      requestAPIList(Page2, options) {
        const request = this.makeRequest(options, null, void 0);
        return new PagePromise(this, request, Page2);
      }
      async fetchWithTimeout(url, init, ms, controller) {
        const { signal, method, ...options } = init || {};
        const abort = this._makeAbort(controller);
        if (signal)
          signal.addEventListener("abort", abort, { once: true });
        const timeout = setTimeout(abort, ms);
        const isReadableBody = globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream || typeof options.body === "object" && options.body !== null && Symbol.asyncIterator in options.body;
        const fetchOptions = {
          signal: controller.signal,
          ...isReadableBody ? { duplex: "half" } : {},
          method: "GET",
          ...options
        };
        if (method) {
          fetchOptions.method = method.toUpperCase();
        }
        try {
          return await this.fetch.call(void 0, url, fetchOptions);
        } finally {
          clearTimeout(timeout);
        }
      }
      async shouldRetry(response, options) {
        const flags = this._authFlags(options);
        if (response.status === 401 && this._authState.tokenCache && flags.usedTokenCache && !flags.didRefreshFor401) {
          flags.didRefreshFor401 = true;
          this._authState.tokenCache.invalidate();
          return true;
        }
        const shouldRetryHeader = response.headers.get("x-should-retry");
        if (shouldRetryHeader === "true")
          return true;
        if (shouldRetryHeader === "false")
          return false;
        if (response.status === 408)
          return true;
        if (response.status === 409)
          return true;
        if (response.status === 429)
          return true;
        if (response.status >= 500)
          return true;
        return false;
      }
      async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
        let timeoutMillis;
        const retryAfterMillisHeader = responseHeaders?.get("retry-after-ms");
        if (retryAfterMillisHeader) {
          const timeoutMs = parseFloat(retryAfterMillisHeader);
          if (!Number.isNaN(timeoutMs)) {
            timeoutMillis = timeoutMs;
          }
        }
        const retryAfterHeader = responseHeaders?.get("retry-after");
        if (retryAfterHeader && !timeoutMillis) {
          const timeoutSeconds = parseFloat(retryAfterHeader);
          if (!Number.isNaN(timeoutSeconds)) {
            timeoutMillis = timeoutSeconds * 1e3;
          } else {
            timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
          }
        }
        if (timeoutMillis === void 0) {
          const maxRetries = options.maxRetries ?? this.maxRetries;
          timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
        }
        await sleep3(timeoutMillis);
        return this.makeRequest(options, retriesRemaining - 1, requestLogID);
      }
      calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
        const initialRetryDelay = 0.5;
        const maxRetryDelay = 8;
        const numRetries = maxRetries - retriesRemaining;
        const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
        const jitter2 = 1 - Math.random() * 0.25;
        return sleepSeconds * jitter2 * 1e3;
      }
      calculateNonstreamingTimeout(maxTokens, maxNonstreamingTokens) {
        const maxTime = 60 * 60 * 1e3;
        const defaultTime = 60 * 10 * 1e3;
        const expectedTime = maxTime * maxTokens / 128e3;
        if (expectedTime > defaultTime || maxNonstreamingTokens != null && maxTokens > maxNonstreamingTokens) {
          throw new AnthropicError("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");
        }
        return defaultTime;
      }
      async buildRequest(inputOptions, { retryCount = 0 } = {}) {
        const options = { ...inputOptions };
        const { method, path: path5, query, defaultBaseURL } = options;
        if (this._authState.resolution) {
          await this._authState.resolution;
        }
        if (!this._baseURLIsExplicit && this._authState.baseURL && this.baseURL !== this._authState.baseURL) {
          this.baseURL = this._authState.baseURL;
        }
        const url = this.buildURL(path5, query, defaultBaseURL);
        if ("timeout" in options)
          validatePositiveInteger("timeout", options.timeout);
        options.timeout = options.timeout ?? this.timeout;
        const { bodyHeaders, body } = this.buildBody({ options });
        const reqHeaders = await this.buildHeaders({ options: inputOptions, method, bodyHeaders, retryCount });
        const req = {
          method,
          headers: reqHeaders,
          ...options.signal && { signal: options.signal },
          ...globalThis.ReadableStream && body instanceof globalThis.ReadableStream && { duplex: "half" },
          ...body && { body },
          ...this.fetchOptions ?? {},
          ...options.fetchOptions ?? {}
        };
        return { req, url, timeout: options.timeout };
      }
      async buildHeaders({ options, method, bodyHeaders, retryCount }) {
        let idempotencyHeaders = {};
        if (this.idempotencyHeader && method !== "get") {
          if (!options.idempotencyKey)
            options.idempotencyKey = this.defaultIdempotencyKey();
          idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
        }
        const headers = buildHeaders([
          idempotencyHeaders,
          {
            Accept: "application/json",
            "User-Agent": this.getUserAgent(),
            "X-Stainless-Retry-Count": String(retryCount),
            ...options.timeout ? { "X-Stainless-Timeout": String(Math.trunc(options.timeout / 1e3)) } : {},
            ...getPlatformHeaders(),
            ...this._options.dangerouslyAllowBrowser ? { "anthropic-dangerous-direct-browser-access": "true" } : void 0,
            "anthropic-version": "2023-06-01"
          },
          await this.authHeaders(options),
          this._options.defaultHeaders,
          bodyHeaders,
          options.headers
        ]);
        this.validateHeaders(headers);
        return headers.values;
      }
      _makeAbort(controller) {
        return () => controller.abort();
      }
      buildBody({ options: { body, headers: rawHeaders } }) {
        if (!body) {
          return { bodyHeaders: void 0, body: void 0 };
        }
        const headers = buildHeaders([rawHeaders]);
        if (
          // Pass raw type verbatim
          ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof DataView || typeof body === "string" && // Preserve legacy string encoding behavior for now
          headers.values.has("content-type") || // `Blob` is superset of `File`
          globalThis.Blob && body instanceof globalThis.Blob || // `FormData` -> `multipart/form-data`
          body instanceof FormData || // `URLSearchParams` -> `application/x-www-form-urlencoded`
          body instanceof URLSearchParams || // Send chunked stream (each chunk has own `length`)
          globalThis.ReadableStream && body instanceof globalThis.ReadableStream
        ) {
          return { bodyHeaders: void 0, body };
        } else if (typeof body === "object" && (Symbol.asyncIterator in body || Symbol.iterator in body && "next" in body && typeof body.next === "function")) {
          return { bodyHeaders: void 0, body: ReadableStreamFrom(body) };
        } else if (typeof body === "object" && headers.values.get("content-type") === "application/x-www-form-urlencoded") {
          return {
            bodyHeaders: { "content-type": "application/x-www-form-urlencoded" },
            body: this.stringifyQuery(body)
          };
        } else {
          return __classPrivateFieldGet(this, _BaseAnthropic_encoder, "f").call(this, { body, headers });
        }
      }
    };
    _a = BaseAnthropic, _BaseAnthropic_encoder = /* @__PURE__ */ new WeakMap(), _BaseAnthropic_instances = /* @__PURE__ */ new WeakSet(), _BaseAnthropic_baseURLOverridden = function _BaseAnthropic_baseURLOverridden2() {
      return this.baseURL !== "https://api.anthropic.com";
    };
    BaseAnthropic.Anthropic = _a;
    BaseAnthropic.HUMAN_PROMPT = HUMAN_PROMPT;
    BaseAnthropic.AI_PROMPT = AI_PROMPT;
    BaseAnthropic.DEFAULT_TIMEOUT = 6e5;
    BaseAnthropic.AnthropicError = AnthropicError;
    BaseAnthropic.APIError = APIError;
    BaseAnthropic.APIConnectionError = APIConnectionError;
    BaseAnthropic.APIConnectionTimeoutError = APIConnectionTimeoutError;
    BaseAnthropic.APIUserAbortError = APIUserAbortError;
    BaseAnthropic.NotFoundError = NotFoundError;
    BaseAnthropic.ConflictError = ConflictError;
    BaseAnthropic.RateLimitError = RateLimitError;
    BaseAnthropic.BadRequestError = BadRequestError;
    BaseAnthropic.AuthenticationError = AuthenticationError;
    BaseAnthropic.InternalServerError = InternalServerError;
    BaseAnthropic.PermissionDeniedError = PermissionDeniedError;
    BaseAnthropic.UnprocessableEntityError = UnprocessableEntityError;
    BaseAnthropic.toFile = toFile;
    Anthropic = class extends BaseAnthropic {
      constructor() {
        super(...arguments);
        this.completions = new Completions(this);
        this.messages = new Messages2(this);
        this.models = new Models2(this);
        this.beta = new Beta(this);
      }
    };
    Anthropic.Completions = Completions;
    Anthropic.Messages = Messages2;
    Anthropic.Models = Models2;
    Anthropic.Beta = Beta;
  }
});

// node_modules/@anthropic-ai/sdk/index.mjs
var sdk_exports = {};
__export(sdk_exports, {
  AI_PROMPT: () => AI_PROMPT,
  APIConnectionError: () => APIConnectionError,
  APIConnectionTimeoutError: () => APIConnectionTimeoutError,
  APIError: () => APIError,
  APIPromise: () => APIPromise,
  APIUserAbortError: () => APIUserAbortError,
  Anthropic: () => Anthropic,
  AnthropicError: () => AnthropicError,
  AuthenticationError: () => AuthenticationError,
  BadRequestError: () => BadRequestError,
  BaseAnthropic: () => BaseAnthropic,
  ConflictError: () => ConflictError,
  HUMAN_PROMPT: () => HUMAN_PROMPT,
  InternalServerError: () => InternalServerError,
  NotFoundError: () => NotFoundError,
  PagePromise: () => PagePromise,
  PermissionDeniedError: () => PermissionDeniedError,
  RateLimitError: () => RateLimitError,
  UnprocessableEntityError: () => UnprocessableEntityError,
  default: () => Anthropic,
  toFile: () => toFile
});
var init_sdk = __esm({
  "node_modules/@anthropic-ai/sdk/index.mjs"() {
    init_client();
    init_uploads2();
    init_api_promise();
    init_client();
    init_pagination();
    init_error();
  }
});

// dist/src/cli/install-claude.js
import { execFileSync } from "node:child_process";
import { existsSync as existsSync2, readFileSync as readFileSync2, writeFileSync as writeFileSync2 } from "node:fs";
import { homedir as homedir2 } from "node:os";
import { join as join2 } from "node:path";

// dist/src/cli/util.js
import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync, symlinkSync, unlinkSync, lstatSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
var HOME = homedir();
function pkgRoot() {
  let dir = fileURLToPath(new URL(".", import.meta.url));
  for (let i = 0; i < 8; i++) {
    try {
      const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf-8"));
      if (pkg.name === "@deeplake/hivemind" || pkg.name === "hivemind")
        return dir;
    } catch {
    }
    const parent = dirname(dir);
    if (parent === dir)
      break;
    dir = parent;
  }
  return fileURLToPath(new URL("..", import.meta.url));
}
function ensureDir(path5, mode = 493) {
  if (!existsSync(path5))
    mkdirSync(path5, { recursive: true, mode });
}
function copyDir(src, dst) {
  cpSync(src, dst, { recursive: true, force: true, dereference: false });
}
function symlinkForce(target, link) {
  ensureDir(dirname(link));
  if (existsSync(link) || isLink(link))
    unlinkSync(link);
  symlinkSync(target, link);
}
function isLink(path5) {
  try {
    return lstatSync(path5).isSymbolicLink();
  } catch {
    return false;
  }
}
function readJson(path5) {
  if (!existsSync(path5))
    return null;
  try {
    return JSON.parse(readFileSync(path5, "utf-8"));
  } catch {
    return null;
  }
}
function writeJson(path5, obj) {
  ensureDir(dirname(path5));
  writeFileSync(path5, JSON.stringify(obj, null, 2) + "\n");
}
function writeVersionStamp(dir, version) {
  ensureDir(dir);
  writeFileSync(join(dir, ".hivemind_version"), version);
}
var PLATFORM_MARKERS = [
  { id: "claude", markerDir: join(HOME, ".claude") },
  { id: "codex", markerDir: join(HOME, ".codex") },
  { id: "claw", markerDir: join(HOME, ".openclaw") },
  { id: "cursor", markerDir: join(HOME, ".cursor") },
  { id: "hermes", markerDir: join(HOME, ".hermes") },
  // pi (badlogic/pi-mono coding-agent) — config at ~/.pi/agent/. pi exposes
  // a rich extension event API (session_start / input / tool_call /
  // tool_result / message_end / session_shutdown / etc.) — Tier 1 capable.
  { id: "pi", markerDir: join(HOME, ".pi") }
];
function detectPlatforms() {
  return PLATFORM_MARKERS.filter((p) => existsSync(p.markerDir));
}
function allPlatformIds() {
  return PLATFORM_MARKERS.map((p) => p.id);
}
function log(msg) {
  process.stdout.write(msg + "\n");
}
function warn(msg) {
  process.stderr.write(msg + "\n");
}
function confirm(message, defaultYes = true) {
  const hint = defaultYes ? "[Y/n]" : "[y/N]";
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((resolve9) => {
    rl.question(`${message} ${hint} `, (answer) => {
      rl.close();
      const a = answer.trim().toLowerCase();
      if (a === "")
        resolve9(defaultYes);
      else
        resolve9(a === "y" || a === "yes");
    });
  });
}
function promptLine(message) {
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((resolve9) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve9(answer.trim());
    });
  });
}

// dist/src/cli/install-claude.js
var MARKETPLACE_NAME = "hivemind";
var MARKETPLACE_SOURCE = "activeloopai/hivemind";
var PLUGIN_KEY = "hivemind@hivemind";
function runClaude(args) {
  try {
    const stdout = execFileSync("claude", args, {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "pipe"]
    });
    return { ok: true, stdout, stderr: "" };
  } catch (err) {
    const e = err;
    return {
      ok: false,
      stdout: e.stdout?.toString() ?? "",
      stderr: e.stderr?.toString() ?? e.message ?? ""
    };
  }
}
function requireClaudeCli() {
  try {
    execFileSync("claude", ["--version"], { stdio: "ignore" });
  } catch {
    throw new Error("Claude Code CLI ('claude') not found on PATH. Install Claude Code first: https://claude.com/claude-code");
  }
}
function marketplaceAlreadyAdded() {
  const r = runClaude(["plugin", "marketplace", "list"]);
  if (!r.ok)
    return false;
  return new RegExp(`(^|\\s)${MARKETPLACE_NAME}(\\s|$)`, "m").test(r.stdout);
}
function pluginAlreadyInstalled() {
  const r = runClaude(["plugin", "list"]);
  if (!r.ok)
    return false;
  return r.stdout.includes(PLUGIN_KEY);
}
var PLUGIN_SCOPES = ["user", "project", "local", "managed"];
function settingsJsonPath() {
  return join2(homedir2(), ".claude", "settings.json");
}
var LEGACY_PATH_FRAGMENT = ".claude/plugins/hivemind/bundle/";
function isBrokenHivemindHookEntry(h) {
  if (typeof h.command !== "string")
    return false;
  const normalized = h.command.replace(/\\/g, "/");
  if (!normalized.includes(LEGACY_PATH_FRAGMENT))
    return false;
  const match = normalized.match(/"([^"]+\.claude\/plugins\/hivemind\/bundle\/[^"]+)"/);
  const filePath = match ? match[1] : null;
  if (!filePath)
    return false;
  return !existsSync2(filePath);
}
function cleanupBrokenSettingsHooks() {
  const settingsPath = settingsJsonPath();
  if (!existsSync2(settingsPath))
    return { removed: 0, events: [] };
  let parsed;
  try {
    parsed = JSON.parse(readFileSync2(settingsPath, "utf-8"));
  } catch {
    return { removed: 0, events: [] };
  }
  if (!parsed || typeof parsed !== "object")
    return { removed: 0, events: [] };
  const settings = parsed;
  if (!settings.hooks || typeof settings.hooks !== "object")
    return { removed: 0, events: [] };
  let removed = 0;
  const touchedEvents = [];
  for (const [event, matchers] of Object.entries(settings.hooks)) {
    if (!Array.isArray(matchers))
      continue;
    const cleanedMatchers = [];
    let eventTouched = false;
    for (const m of matchers) {
      if (!m || !Array.isArray(m.hooks)) {
        cleanedMatchers.push(m);
        continue;
      }
      const keptHooks = m.hooks.filter((h) => {
        const broken = isBrokenHivemindHookEntry(h);
        if (broken) {
          removed += 1;
          eventTouched = true;
        }
        return !broken;
      });
      if (keptHooks.length > 0) {
        cleanedMatchers.push({ ...m, hooks: keptHooks });
      } else if (m.hooks.length > 0) {
        eventTouched = true;
      } else {
        cleanedMatchers.push(m);
      }
    }
    if (eventTouched) {
      settings.hooks[event] = cleanedMatchers;
      touchedEvents.push(event);
    }
  }
  if (removed > 0) {
    writeFileSync2(settingsPath, JSON.stringify(settings, null, 2) + "\n", "utf-8");
  }
  return { removed, events: touchedEvents };
}
function installClaude() {
  requireClaudeCli();
  if (!marketplaceAlreadyAdded()) {
    const add = runClaude(["plugin", "marketplace", "add", MARKETPLACE_SOURCE]);
    if (!add.ok) {
      throw new Error(`Failed to add marketplace '${MARKETPLACE_SOURCE}': ${add.stderr.slice(0, 200)}`);
    }
  }
  if (!pluginAlreadyInstalled()) {
    const inst = runClaude(["plugin", "install", "hivemind"]);
    if (!inst.ok) {
      throw new Error(`Failed to install hivemind plugin: ${inst.stderr.slice(0, 200)}`);
    }
    log(`  Claude Code    installed via marketplace ${MARKETPLACE_SOURCE}`);
  } else {
    runClaude(["plugin", "marketplace", "update", MARKETPLACE_NAME]);
    for (const scope of PLUGIN_SCOPES) {
      runClaude(["plugin", "update", PLUGIN_KEY, "--scope", scope]);
    }
    log(`  Claude Code    refreshed via marketplace ${MARKETPLACE_SOURCE}`);
  }
  runClaude(["plugin", "enable", PLUGIN_KEY]);
  try {
    const cleanup = cleanupBrokenSettingsHooks();
    if (cleanup.removed > 0) {
      log(`  Claude Code    settings.json cleaned: removed ${cleanup.removed} stale hook entr${cleanup.removed === 1 ? "y" : "ies"} (events: ${cleanup.events.join(", ")})`);
    }
  } catch (e) {
    log(`  Claude Code    settings.json cleanup skipped: ${e?.message ?? String(e)}`);
  }
}
function uninstallClaude() {
  try {
    requireClaudeCli();
  } catch {
    log("  Claude Code    skip uninstall \u2014 claude CLI not on PATH");
    return;
  }
  runClaude(["plugin", "disable", PLUGIN_KEY]);
  runClaude(["plugin", "uninstall", PLUGIN_KEY]);
  log("  Claude Code    plugin uninstalled");
}

// dist/src/cli/install-codex.js
import { existsSync as existsSync3, readFileSync as readFileSync4, unlinkSync as unlinkSync2, writeFileSync as writeFileSync3 } from "node:fs";
import { execFileSync as execFileSync2 } from "node:child_process";
import { join as join4 } from "node:path";

// dist/src/cli/version.js
import { readFileSync as readFileSync3 } from "node:fs";
import { join as join3 } from "node:path";
function getVersion() {
  try {
    const pkg = JSON.parse(readFileSync3(join3(pkgRoot(), "package.json"), "utf-8"));
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

// dist/src/cli/install-codex.js
var CODEX_HOME = join4(HOME, ".codex");
var PLUGIN_DIR = join4(CODEX_HOME, "hivemind");
var HOOKS_PATH = join4(CODEX_HOME, "hooks.json");
var AGENTS_SKILLS_DIR = join4(HOME, ".agents", "skills");
var SKILL_LINK = join4(AGENTS_SKILLS_DIR, "hivemind-memory");
function hookCmd(bundleFile, timeout, matcher) {
  const block = {
    hooks: [{
      type: "command",
      command: `node "${join4(PLUGIN_DIR, "bundle", bundleFile)}"`,
      timeout
    }]
  };
  if (matcher)
    block.matcher = matcher;
  return block;
}
function buildHooksJson() {
  return {
    hooks: {
      SessionStart: [hookCmd("session-start.js", 120)],
      UserPromptSubmit: [hookCmd("capture.js", 10)],
      PreToolUse: [hookCmd("pre-tool-use.js", 15, "Bash")],
      PostToolUse: [hookCmd("capture.js", 15)],
      Stop: [hookCmd("stop.js", 30)]
    }
  };
}
var HIVEMIND_BUNDLE_FILES = [
  "session-start.js",
  "session-start-setup.js",
  "capture.js",
  "pre-tool-use.js",
  "stop.js",
  "wiki-worker.js"
];
function isHivemindHookEntry(entry, pluginDir = PLUGIN_DIR) {
  if (!entry || typeof entry !== "object")
    return false;
  const e = entry;
  const hooks = Array.isArray(e.hooks) ? e.hooks : [];
  return hooks.some((h) => {
    if (!h || typeof h !== "object")
      return false;
    const cmd = h.command;
    if (typeof cmd !== "string")
      return false;
    if (cmd.includes(`${pluginDir}/bundle/`))
      return true;
    return HIVEMIND_BUNDLE_FILES.some((f) => cmd.includes(`/bundle/${f}`));
  });
}
function isForeignHivemindHookEntry(entry, pluginDir = PLUGIN_DIR) {
  if (!isHivemindHookEntry(entry, pluginDir))
    return false;
  const e = entry;
  const hooks = Array.isArray(e.hooks) ? e.hooks : [];
  return hooks.every((h) => {
    if (!h || typeof h !== "object")
      return false;
    const cmd = h.command;
    if (typeof cmd !== "string")
      return false;
    return !cmd.includes(`${pluginDir}/bundle/`);
  });
}
function mergeHooks(existing, ours, pluginDir = PLUGIN_DIR) {
  const existingHooks = existing.hooks && typeof existing.hooks === "object" ? existing.hooks : {};
  const ourHooks = ours.hooks;
  const merged = {};
  for (const [event, entries] of Object.entries(existingHooks)) {
    const surviving = (entries ?? []).filter((e) => !isHivemindHookEntry(e, pluginDir));
    if (surviving.length)
      merged[event] = surviving;
  }
  for (const [event, entries] of Object.entries(ourHooks)) {
    merged[event] = [...merged[event] ?? [], ...entries ?? []];
  }
  return { ...existing, hooks: merged };
}
function mergeHooksJson(ours) {
  let existing = {};
  try {
    if (existsSync3(HOOKS_PATH)) {
      const parsed = JSON.parse(readFileSync4(HOOKS_PATH, "utf-8"));
      if (parsed && typeof parsed === "object")
        existing = parsed;
    }
  } catch {
    warn(`  Codex          ${HOOKS_PATH} unparseable \u2014 ignoring prior content`);
  }
  reportForeignHivemindHooks(existing);
  return mergeHooks(existing, ours);
}
function reportForeignHivemindHooks(existing) {
  const existingHooks = existing.hooks && typeof existing.hooks === "object" ? existing.hooks : {};
  const foreign = /* @__PURE__ */ new Set();
  for (const entries of Object.values(existingHooks)) {
    for (const e of entries ?? []) {
      if (!isForeignHivemindHookEntry(e))
        continue;
      const hooks = Array.isArray(e.hooks) ? e.hooks : [];
      for (const h of hooks) {
        const cmd = h?.command;
        if (typeof cmd === "string")
          foreign.add(cmd);
      }
    }
  }
  if (foreign.size === 0)
    return;
  warn(`  Codex          stripping ${foreign.size} hivemind hook(s) from a non-canonical path:`);
  for (const cmd of foreign)
    warn(`                   ${cmd}`);
  warn(`                 (these were probably leftover from a local dev clone \u2014 re-add them manually if intentional)`);
}
function tryEnableCodexHooks() {
  let enabled = false;
  try {
    execFileSync2("codex", ["features", "enable", "hooks"], { stdio: "ignore" });
    enabled = true;
  } catch {
  }
  if (enabled)
    stripLegacyCodexHooksKey();
}
function stripLegacyCodexHooksKey() {
  const cfgPath = join4(CODEX_HOME, "config.toml");
  if (!existsSync3(cfgPath))
    return;
  try {
    const original = readFileSync4(cfgPath, "utf-8");
    const cleaned = original.replace(/^[ \t]*codex_hooks[ \t]*=[^\n]*\r?\n?/gm, "");
    if (cleaned !== original)
      writeFileSync3(cfgPath, cleaned);
  } catch {
  }
}
function installCodex() {
  const srcBundle = join4(pkgRoot(), "codex", "bundle");
  const srcSkills = join4(pkgRoot(), "codex", "skills");
  if (!existsSync3(srcBundle)) {
    throw new Error(`Codex bundle missing at ${srcBundle}. Run 'npm run build' first.`);
  }
  ensureDir(PLUGIN_DIR);
  copyDir(srcBundle, join4(PLUGIN_DIR, "bundle"));
  if (existsSync3(srcSkills))
    copyDir(srcSkills, join4(PLUGIN_DIR, "skills"));
  tryEnableCodexHooks();
  writeJson(HOOKS_PATH, mergeHooksJson(buildHooksJson()));
  ensureDir(AGENTS_SKILLS_DIR);
  const skillTarget = join4(PLUGIN_DIR, "skills", "deeplake-memory");
  if (existsSync3(skillTarget)) {
    symlinkForce(skillTarget, SKILL_LINK);
  } else {
    warn(`  Codex          skill source missing at ${skillTarget}; skipping symlink`);
  }
  writeVersionStamp(PLUGIN_DIR, getVersion());
  log(`  Codex          installed -> ${PLUGIN_DIR}`);
}
function uninstallCodex() {
  if (existsSync3(HOOKS_PATH)) {
    let existing = {};
    try {
      const raw = JSON.parse(readFileSync4(HOOKS_PATH, "utf-8"));
      if (raw && typeof raw === "object")
        existing = raw;
    } catch {
      unlinkSync2(HOOKS_PATH);
      log(`  Codex          removed unparseable ${HOOKS_PATH}`);
      existing = {};
    }
    if (Object.keys(existing).length > 0) {
      const stripped = mergeHooks(existing, { hooks: {} });
      const survivingHooks = stripped.hooks ?? {};
      const otherTopLevelKeys = Object.keys(stripped).filter((k) => k !== "hooks");
      if (Object.keys(survivingHooks).length === 0 && otherTopLevelKeys.length === 0) {
        unlinkSync2(HOOKS_PATH);
        log(`  Codex          removed ${HOOKS_PATH}`);
      } else {
        writeJson(HOOKS_PATH, stripped);
        log(`  Codex          stripped hivemind hooks from ${HOOKS_PATH}`);
      }
    }
  }
  if (existsSync3(SKILL_LINK)) {
    unlinkSync2(SKILL_LINK);
    log(`  Codex          removed ${SKILL_LINK}`);
  }
  log(`  Codex          plugin files kept at ${PLUGIN_DIR}`);
}

// dist/src/cli/install-openclaw.js
import { existsSync as existsSync5, copyFileSync, rmSync } from "node:fs";
import { join as join6 } from "node:path";

// dist/openclaw/src/setup-config.js
import { existsSync as existsSync4, readFileSync as readFileSync5, writeFileSync as writeFileSync4, renameSync } from "node:fs";
import { homedir as homedir3 } from "node:os";
import { join as join5 } from "node:path";
var HIVEMIND_TOOL_NAMES = ["hivemind_search", "hivemind_read", "hivemind_index"];
function getOpenclawConfigPath() {
  return join5(homedir3(), ".openclaw", "openclaw.json");
}
function isAllowlistCoveringHivemind(alsoAllow) {
  if (!Array.isArray(alsoAllow))
    return false;
  for (const entry of alsoAllow) {
    if (typeof entry !== "string")
      continue;
    const normalized = entry.trim().toLowerCase();
    if (normalized === "hivemind")
      return true;
    if (normalized === "group:plugins")
      return true;
    if (HIVEMIND_TOOL_NAMES.includes(normalized))
      return true;
  }
  return false;
}
function isPluginsAllowMissingHivemind(allow) {
  return Array.isArray(allow) && allow.length > 0 && !allow.includes("hivemind");
}
function ensureHivemindAllowlisted() {
  const configPath2 = getOpenclawConfigPath();
  if (!existsSync4(configPath2)) {
    return { status: "error", configPath: configPath2, error: "openclaw config file not found" };
  }
  let parsed;
  try {
    const raw = readFileSync5(configPath2, "utf-8");
    parsed = JSON.parse(raw);
  } catch (e) {
    return { status: "error", configPath: configPath2, error: `could not read/parse config: ${e instanceof Error ? e.message : String(e)}` };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { status: "error", configPath: configPath2, error: "openclaw config is not a JSON object" };
  }
  const plugins = parsed.plugins ?? {};
  const pluginsAllowRaw = plugins.allow;
  const tools = parsed.tools ?? {};
  const alsoAllowRaw = tools.alsoAllow;
  const pluginsAllowNeedsPatch = isPluginsAllowMissingHivemind(pluginsAllowRaw);
  const toolsAlsoAllowNeedsPatch = Array.isArray(alsoAllowRaw) && alsoAllowRaw.length > 0 && !isAllowlistCoveringHivemind(alsoAllowRaw);
  if (!pluginsAllowNeedsPatch && !toolsAlsoAllowNeedsPatch) {
    return { status: "already-set", configPath: configPath2 };
  }
  const updated = { ...parsed };
  if (pluginsAllowNeedsPatch) {
    updated.plugins = {
      ...plugins,
      // Cast safe — isPluginsAllowMissingHivemind guarantees Array.
      allow: [...pluginsAllowRaw, "hivemind"]
    };
  }
  if (toolsAlsoAllowNeedsPatch) {
    updated.tools = {
      ...tools,
      // Cast safe — the needs-patch check above guarantees Array.
      alsoAllow: [...alsoAllowRaw, "hivemind"]
    };
  }
  const backupPath = `${configPath2}.bak-hivemind-${Date.now()}`;
  const tmpPath = `${configPath2}.tmp-hivemind-${process.pid}`;
  try {
    writeFileSync4(backupPath, readFileSync5(configPath2, "utf-8"));
    writeFileSync4(tmpPath, JSON.stringify(updated, null, 2) + "\n");
    renameSync(tmpPath, configPath2);
  } catch (e) {
    return { status: "error", configPath: configPath2, error: `could not write config: ${e instanceof Error ? e.message : String(e)}` };
  }
  return {
    status: "added",
    configPath: configPath2,
    backupPath,
    delta: {
      pluginsAllow: pluginsAllowNeedsPatch,
      toolsAlsoAllow: toolsAlsoAllowNeedsPatch
    }
  };
}

// dist/src/cli/install-openclaw.js
var PLUGIN_DIR2 = join6(HOME, ".openclaw", "extensions", "hivemind");
function installOpenclaw() {
  const srcDist = join6(pkgRoot(), "openclaw", "dist");
  const srcManifest = join6(pkgRoot(), "openclaw", "openclaw.plugin.json");
  const srcPkg = join6(pkgRoot(), "openclaw", "package.json");
  const srcSkills = join6(pkgRoot(), "openclaw", "skills");
  if (!existsSync5(srcDist)) {
    throw new Error(`OpenClaw bundle missing at ${srcDist}. Run 'npm run build' first.`);
  }
  ensureDir(PLUGIN_DIR2);
  rmSync(join6(PLUGIN_DIR2, "dist"), { recursive: true, force: true });
  copyDir(srcDist, join6(PLUGIN_DIR2, "dist"));
  if (existsSync5(srcManifest))
    copyFileSync(srcManifest, join6(PLUGIN_DIR2, "openclaw.plugin.json"));
  if (existsSync5(srcPkg))
    copyFileSync(srcPkg, join6(PLUGIN_DIR2, "package.json"));
  if (existsSync5(srcSkills))
    copyDir(srcSkills, join6(PLUGIN_DIR2, "skills"));
  writeVersionStamp(PLUGIN_DIR2, getVersion());
  log(`  OpenClaw       installed -> ${PLUGIN_DIR2}`);
  const result = ensureHivemindAllowlisted();
  if (result.status === "added") {
    const touched = [];
    if (result.delta.pluginsAllow)
      touched.push("plugins.allow");
    if (result.delta.toolsAlsoAllow)
      touched.push("tools.alsoAllow");
    log(`  OpenClaw       patched ${touched.join(" + ")} in ${result.configPath}`);
    log(`  OpenClaw       backup: ${result.backupPath}`);
    log(`  OpenClaw       restart the gateway to activate: systemctl --user restart openclaw-gateway.service`);
    log(`  OpenClaw       capture starts on the NEXT turn \u2014 earlier turns are NOT backfilled`);
  } else if (result.status === "already-set") {
    log(`  OpenClaw       allowlist already covers hivemind in ${result.configPath}`);
  } else if (result.status === "error") {
    if (result.error === "openclaw config file not found") {
      log(`  OpenClaw       openclaw.json not present at ${result.configPath} \u2014 run openclaw once, then \`hivemind claw install\` again`);
    } else {
      warn(`  OpenClaw       could not patch allowlist in ${result.configPath}: ${result.error}`);
    }
  }
}
function uninstallOpenclaw() {
  if (existsSync5(PLUGIN_DIR2)) {
    rmSync(PLUGIN_DIR2, { recursive: true, force: true });
    log(`  OpenClaw       removed ${PLUGIN_DIR2}`);
  } else {
    log(`  OpenClaw       nothing to remove`);
  }
}

// dist/src/cli/install-cursor.js
import { existsSync as existsSync6, unlinkSync as unlinkSync3 } from "node:fs";
import { join as join7 } from "node:path";
var CURSOR_HOME = join7(HOME, ".cursor");
var PLUGIN_DIR3 = join7(CURSOR_HOME, "hivemind");
var HOOKS_PATH2 = join7(CURSOR_HOME, "hooks.json");
var HIVEMIND_MARKER_KEY = "_hivemindManaged";
function buildHookCmd(bundleFile, timeout) {
  return {
    type: "command",
    command: `node "${join7(PLUGIN_DIR3, "bundle", bundleFile)}"`,
    timeout
  };
}
function buildHookCmdShellMatcher(bundleFile, timeout) {
  return {
    type: "command",
    command: `node "${join7(PLUGIN_DIR3, "bundle", bundleFile)}"`,
    timeout,
    matcher: "Shell"
  };
}
function buildHookConfig() {
  return {
    sessionStart: [buildHookCmd("session-start.js", 30)],
    beforeSubmitPrompt: [buildHookCmd("capture.js", 10)],
    // preToolUse with Shell matcher rewrites grep/rg against ~/.deeplake/memory/
    // into a single SQL fast-path call, matching Claude Code / Codex accuracy.
    preToolUse: [buildHookCmdShellMatcher("pre-tool-use.js", 30)],
    postToolUse: [buildHookCmd("capture.js", 15)],
    afterAgentResponse: [buildHookCmd("capture.js", 15)],
    stop: [buildHookCmd("capture.js", 15)],
    sessionEnd: [buildHookCmd("session-end.js", 30)]
  };
}
function isHivemindEntry(entry) {
  if (!entry || typeof entry !== "object")
    return false;
  const cmd = entry.command;
  return typeof cmd === "string" && cmd.includes("/.cursor/hivemind/bundle/");
}
function mergeHooks2(existing) {
  const root = existing ?? { version: 1, hooks: {} };
  if (!root.version)
    root.version = 1;
  if (!root.hooks)
    root.hooks = {};
  const ours = buildHookConfig();
  for (const [event, entries] of Object.entries(ours)) {
    const prior = Array.isArray(root.hooks[event]) ? root.hooks[event] : [];
    const stripped = prior.filter((e) => !isHivemindEntry(e));
    root.hooks[event] = [...stripped, ...entries];
  }
  root[HIVEMIND_MARKER_KEY] = { version: getVersion() };
  return root;
}
function stripHooksFromConfig(existing) {
  if (!existing)
    return null;
  const root = existing;
  if (root.hooks) {
    for (const event of Object.keys(root.hooks)) {
      root.hooks[event] = (root.hooks[event] ?? []).filter((e) => !isHivemindEntry(e));
      if (root.hooks[event].length === 0)
        delete root.hooks[event];
    }
    if (Object.keys(root.hooks).length === 0)
      delete root.hooks;
  }
  delete existing[HIVEMIND_MARKER_KEY];
  return existing;
}
function installCursor() {
  const srcBundle = join7(pkgRoot(), "cursor", "bundle");
  if (!existsSync6(srcBundle)) {
    throw new Error(`Cursor bundle missing at ${srcBundle}. Run 'npm run build' first.`);
  }
  ensureDir(PLUGIN_DIR3);
  copyDir(srcBundle, join7(PLUGIN_DIR3, "bundle"));
  const existing = readJson(HOOKS_PATH2);
  const merged = mergeHooks2(existing);
  writeJson(HOOKS_PATH2, merged);
  writeVersionStamp(PLUGIN_DIR3, getVersion());
  log(`  Cursor         installed -> ${PLUGIN_DIR3}`);
}
function uninstallCursor() {
  const existing = readJson(HOOKS_PATH2);
  if (!existing) {
    log("  Cursor         no hooks.json to clean");
    return;
  }
  const stripped = stripHooksFromConfig(existing);
  const meaningfulKeys = stripped ? Object.keys(stripped).filter((k) => k !== "version").length : 0;
  if (!stripped || meaningfulKeys === 0) {
    if (existsSync6(HOOKS_PATH2))
      unlinkSync3(HOOKS_PATH2);
  } else {
    writeJson(HOOKS_PATH2, stripped);
  }
  log(`  Cursor         hooks removed from ${HOOKS_PATH2} (plugin files kept at ${PLUGIN_DIR3})`);
}

// dist/src/cli/install-hermes.js
import { existsSync as existsSync8, writeFileSync as writeFileSync5, readFileSync as readFileSync6, rmSync as rmSync2, unlinkSync as unlinkSync4 } from "node:fs";
import { join as join9 } from "node:path";

// node_modules/js-yaml/dist/js-yaml.mjs
function isNothing(subject) {
  return typeof subject === "undefined" || subject === null;
}
function isObject(subject) {
  return typeof subject === "object" && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count) {
  var result = "", cycle;
  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
var isNothing_1 = isNothing;
var isObject_1 = isObject;
var toArray_1 = toArray;
var repeat_1 = repeat;
var isNegativeZero_1 = isNegativeZero;
var extend_1 = extend;
var common = {
  isNothing: isNothing_1,
  isObject: isObject_1,
  toArray: toArray_1,
  repeat: repeat_1,
  isNegativeZero: isNegativeZero_1,
  extend: extend_1
};
function formatError(exception2, compact) {
  var where = "", message = exception2.reason || "(unknown reason)";
  if (!exception2.mark) return message;
  if (exception2.mark.name) {
    where += 'in "' + exception2.mark.name + '" ';
  }
  where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
  if (!compact && exception2.mark.snippet) {
    where += "\n\n" + exception2.mark.snippet;
  }
  return message + " " + where;
}
function YAMLException$1(reason, mark) {
  Error.call(this);
  this.name = "YAMLException";
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack || "";
  }
}
YAMLException$1.prototype = Object.create(Error.prototype);
YAMLException$1.prototype.constructor = YAMLException$1;
YAMLException$1.prototype.toString = function toString(compact) {
  return this.name + ": " + formatError(this, compact);
};
var exception = YAMLException$1;
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = "";
  var tail = "";
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = " ... ";
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = " ...";
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
    pos: position - lineStart + head.length
    // relative position
  };
}
function padStart(string, max) {
  return common.repeat(" ", max - string.length) + string;
}
function makeSnippet(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer) return null;
  if (!options.maxLength) options.maxLength = 79;
  if (typeof options.indent !== "number") options.indent = 1;
  if (typeof options.linesBefore !== "number") options.linesBefore = 3;
  if (typeof options.linesAfter !== "number") options.linesAfter = 2;
  var re = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0) foundLineNo = lineStarts.length - 1;
  var result = "", i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1; i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo - i],
      lineEnds[foundLineNo - i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
      maxLineLength
    );
    result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
  for (i = 1; i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length) break;
    line = getLine(
      mark.buffer,
      lineStarts[foundLineNo + i],
      lineEnds[foundLineNo + i],
      mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
      maxLineLength
    );
    result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
  }
  return result.replace(/\n$/, "");
}
var snippet = makeSnippet;
var TYPE_CONSTRUCTOR_OPTIONS = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
];
var YAML_NODE_KINDS = [
  "scalar",
  "sequence",
  "mapping"
];
function compileStyleAliases(map2) {
  var result = {};
  if (map2 !== null) {
    Object.keys(map2).forEach(function(style) {
      map2[style].forEach(function(alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$1(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function(name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });
  this.options = options;
  this.tag = tag;
  this.kind = options["kind"] || null;
  this.resolve = options["resolve"] || function() {
    return true;
  };
  this.construct = options["construct"] || function(data) {
    return data;
  };
  this.instanceOf = options["instanceOf"] || null;
  this.predicate = options["predicate"] || null;
  this.represent = options["represent"] || null;
  this.representName = options["representName"] || null;
  this.defaultStyle = options["defaultStyle"] || null;
  this.multi = options["multi"] || false;
  this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
var type = Type$1;
function compileList(schema2, name) {
  var result = [];
  schema2[name].forEach(function(currentType) {
    var newIndex = result.length;
    result.forEach(function(previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap() {
  var result = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, index, length;
  function collectType(type2) {
    if (type2.multi) {
      result.multi[type2.kind].push(type2);
      result.multi["fallback"].push(type2);
    } else {
      result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
    }
  }
  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
Schema$1.prototype.extend = function extend2(definition) {
  var implicit = [];
  var explicit = [];
  if (definition instanceof type) {
    explicit.push(definition);
  } else if (Array.isArray(definition)) {
    explicit = explicit.concat(definition);
  } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
    if (definition.implicit) implicit = implicit.concat(definition.implicit);
    if (definition.explicit) explicit = explicit.concat(definition.explicit);
  } else {
    throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  }
  implicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
    if (type$1.loadKind && type$1.loadKind !== "scalar") {
      throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    }
    if (type$1.multi) {
      throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }
  });
  explicit.forEach(function(type$1) {
    if (!(type$1 instanceof type)) {
      throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    }
  });
  var result = Object.create(Schema$1.prototype);
  result.implicit = (this.implicit || []).concat(implicit);
  result.explicit = (this.explicit || []).concat(explicit);
  result.compiledImplicit = compileList(result, "implicit");
  result.compiledExplicit = compileList(result, "explicit");
  result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
  return result;
};
var schema = Schema$1;
var str = new type("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(data) {
    return data !== null ? data : "";
  }
});
var seq = new type("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(data) {
    return data !== null ? data : [];
  }
});
var map = new type("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(data) {
    return data !== null ? data : {};
  }
});
var failsafe = new schema({
  explicit: [
    str,
    seq,
    map
  ]
});
function resolveYamlNull(data) {
  if (data === null) return true;
  var max = data.length;
  return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
var _null = new type("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
});
function resolveYamlBoolean(data) {
  if (data === null) return false;
  var max = data.length;
  return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === "[object Boolean]";
}
var bool = new type("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function(object) {
      return object ? "true" : "false";
    },
    uppercase: function(object) {
      return object ? "TRUE" : "FALSE";
    },
    camelcase: function(object) {
      return object ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
});
function isHexCode(c) {
  return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
}
function isOctCode(c) {
  return 48 <= c && c <= 55;
}
function isDecCode(c) {
  return 48 <= c && c <= 57;
}
function resolveYamlInteger(data) {
  if (data === null) return false;
  var max = data.length, index = 0, hasDigits = false, ch;
  if (!max) return false;
  ch = data[index];
  if (ch === "-" || ch === "+") {
    ch = data[++index];
  }
  if (ch === "0") {
    if (index + 1 === max) return true;
    ch = data[++index];
    if (ch === "b") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (ch !== "0" && ch !== "1") return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "o") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_") continue;
        if (!isOctCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
  }
  if (ch === "_") return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === "_") continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_") return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data, sign = 1, ch;
  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }
  ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-") sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0") return 0;
  if (ch === "0") {
    if (value[1] === "b") return sign * parseInt(value.slice(2), 2);
    if (value[1] === "x") return sign * parseInt(value.slice(2), 16);
    if (value[1] === "o") return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
}
var int = new type("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary: function(obj) {
      return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
    },
    octal: function(obj) {
      return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
    },
    decimal: function(obj) {
      return obj.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(obj) {
      return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
});
var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function resolveYamlFloat(data) {
  if (data === null) return false;
  if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, "").toLowerCase();
  sign = value[0] === "-" ? -1 : 1;
  if ("+-".indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === ".nan") {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (common.isNegativeZero(object)) {
    return "-0.0";
  }
  res = object.toString(10);
  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
}
var float = new type("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: "lowercase"
});
var json = failsafe.extend({
  implicit: [
    _null,
    bool,
    int,
    float
  ]
});
var core = json;
var YAML_DATE_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
);
var YAML_TIMESTAMP_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null) throw new Error("Date resolve error");
  year = +match[1];
  month = +match[2] - 1;
  day = +match[3];
  if (!match[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      fraction += "0";
    }
    fraction = +fraction;
  }
  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 6e4;
    if (match[9] === "-") delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta) date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object) {
  return object.toISOString();
}
var timestamp = new type("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
var merge = new type("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: resolveYamlMerge
});
var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function resolveYamlBinary(data) {
  if (data === null) return false;
  var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    code = map2.indexOf(data.charAt(idx));
    if (code > 64) continue;
    if (code < 0) return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
  for (idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map2.indexOf(input.charAt(idx));
  }
  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object) {
  var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
  for (idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    }
    bits = (bits << 8) + object[idx];
  }
  tail = max % 3;
  if (tail === 0) {
    result += map2[bits >> 18 & 63];
    result += map2[bits >> 12 & 63];
    result += map2[bits >> 6 & 63];
    result += map2[bits & 63];
  } else if (tail === 2) {
    result += map2[bits >> 10 & 63];
    result += map2[bits >> 4 & 63];
    result += map2[bits << 2 & 63];
    result += map2[64];
  } else if (tail === 1) {
    result += map2[bits >> 2 & 63];
    result += map2[bits << 4 & 63];
    result += map2[64];
    result += map2[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === "[object Uint8Array]";
}
var binary = new type("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});
var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
var _toString$2 = Object.prototype.toString;
function resolveYamlOmap(data) {
  if (data === null) return true;
  var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== "[object Object]") return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }
    if (!pairHasKey) return false;
    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new type("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});
var _toString$1 = Object.prototype.toString;
function resolveYamlPairs(data) {
  if (data === null) return true;
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    if (_toString$1.call(pair) !== "[object Object]") return false;
    keys = Object.keys(pair);
    if (keys.length !== 1) return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null) return [];
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new type("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});
var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
function resolveYamlSet(data) {
  if (data === null) return true;
  var key, object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new type("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: resolveYamlSet,
  construct: constructYamlSet
});
var _default = core.extend({
  implicit: [
    timestamp,
    merge
  ],
  explicit: [
    binary,
    omap,
    pairs,
    set
  ]
});
var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 10 || c === 13;
}
function is_WHITE_SPACE(c) {
  return c === 9 || c === 32;
}
function is_WS_OR_EOL(c) {
  return c === 9 || c === 32 || c === 10 || c === 13;
}
function is_FLOW_INDICATOR(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
  var lc;
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  lc = c | 32;
  if (97 <= lc && lc <= 102) {
    return lc - 97 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) {
    return 2;
  }
  if (c === 117) {
    return 4;
  }
  if (c === 85) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
  if (c <= 65535) {
    return String.fromCharCode(c);
  }
  return String.fromCharCode(
    (c - 65536 >> 10) + 55296,
    (c - 65536 & 1023) + 56320
  );
}
function setProperty(object, key, value) {
  if (key === "__proto__") {
    Object.defineProperty(object, key, {
      configurable: true,
      enumerable: true,
      writable: true,
      value
    });
  } else {
    object[key] = value;
  }
}
var simpleEscapeCheck = new Array(256);
var simpleEscapeMap = new Array(256);
for (i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
var i;
function State$1(input, options) {
  this.input = input;
  this.filename = options["filename"] || null;
  this.schema = options["schema"] || _default;
  this.onWarning = options["onWarning"] || null;
  this.legacy = options["legacy"] || false;
  this.json = options["json"] || false;
  this.listener = options["listener"] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;
  this.firstTabInLine = -1;
  this.documents = [];
}
function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    // omit trailing \0
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = snippet(mark);
  return new exception(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
var directiveHandlers = {
  YAML: function handleYamlDirective(state, name, args) {
    var match, major, minor;
    if (state.version !== null) {
      throwError(state, "duplication of %YAML directive");
    }
    if (args.length !== 1) {
      throwError(state, "YAML directive accepts exactly one argument");
    }
    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      throwError(state, "ill-formed argument of the YAML directive");
    }
    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);
    if (major !== 1) {
      throwError(state, "unacceptable YAML version of the document");
    }
    state.version = args[0];
    state.checkLineBreaks = minor < 2;
    if (minor !== 1 && minor !== 2) {
      throwWarning(state, "unsupported YAML version of the document");
    }
  },
  TAG: function handleTagDirective(state, name, args) {
    var handle, prefix;
    if (args.length !== 2) {
      throwError(state, "TAG directive accepts exactly two arguments");
    }
    handle = args[0];
    prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
    }
    if (_hasOwnProperty$1.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
    }
    try {
      prefix = decodeURIComponent(prefix);
    } catch (err) {
      throwError(state, "tag prefix is malformed: " + prefix);
    }
    state.tagMap[handle] = prefix;
  }
};
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
          throwError(state, "expected valid JSON character");
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, "the stream contains non-printable characters");
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common.isObject(source)) {
    throwError(state, "cannot merge mappings; the provided source object is unacceptable");
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      setProperty(destination, key, source[key]);
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, "nested arrays are not supported inside keys");
      }
      if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
        keyNode[index] = "[object Object]";
      }
    }
  }
  if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
    keyNode = "[object Object]";
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === "tag:yaml.org,2002:merge") {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, "duplicated mapping key");
    }
    setProperty(_result, keyNode, valueNode);
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 10) {
    state.position++;
  } else if (ch === 13) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 10) {
      state.position++;
    }
  } else {
    throwError(state, "a line break is expected");
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 9 && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 10 && ch !== 13 && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, "deficient indentation");
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position, ch;
  ch = state.input.charCodeAt(_position);
  if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += " ";
  } else if (count > 1) {
    state.result += common.repeat("\n", count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
    return false;
  }
  if (ch === 63 || ch === 45) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = "scalar";
  state.result = "";
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 58) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 35) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 39) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 39) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 39) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a single quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 34) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 34) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 92) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, "expected hexadecimal character");
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, "unknown escape sequence");
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a double quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 91) {
    terminator = 93;
    isMapping = false;
    _result = [];
  } else if (ch === 123) {
    terminator = 125;
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? "mapping" : "sequence";
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, "missed comma between flow collection entries");
    } else if (ch === 44) {
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 63) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line;
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 58) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 44) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state, nodeIndent) {
  var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 124) {
    folding = false;
  } else if (ch === 62) {
    folding = true;
  } else {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 43 || ch === 45) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, "repeat of a chomping mode identifier");
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, "repeat of an indentation width identifier");
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }
    if (state.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          state.result += "\n";
        }
      }
      break;
    }
    if (folding) {
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat("\n", emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) {
          state.result += " ";
        }
      } else {
        state.result += common.repeat("\n", emptyLines);
      }
    } else {
      state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    if (ch !== 45) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a sequence entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "sequence";
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
  if (state.firstTabInLine !== -1) return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line;
    if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
      if (ch === 63) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
      }
      state.position += 1;
      ch = following;
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 58) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, "can not read an implicit mapping pair; a colon is missed");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      } else if (detected) {
        throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true;
      }
    }
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a mapping entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "mapping";
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 33) return false;
  if (state.tag !== null) {
    throwError(state, "duplication of a tag property");
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = "!";
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 62);
    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, "unexpected end of the stream within a verbatim tag");
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 33) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, "named tag handle cannot contain such characters");
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, "tag suffix cannot contain exclamation marks");
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, "tag suffix cannot contain flow indicator characters");
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, "tag name cannot contain such characters: " + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, "tag name is malformed: " + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === "!") {
    state.tag = "!" + tagName;
  } else if (tagHandle === "!!") {
    state.tag = "tag:yaml.org,2002:" + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 38) return false;
  if (state.anchor !== null) {
    throwError(state, "duplication of an anchor property");
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an anchor node must contain at least one character");
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 42) return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an alias node must contain at least one character");
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
  if (state.listener !== null) {
    state.listener("open", state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, "alias node should not have any properties");
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = "?";
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === "?") {
    if (state.result !== null && state.kind !== "scalar") {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
      type2 = state.implicitTypes[typeIndex];
      if (type2.resolve(state.result)) {
        state.result = type2.construct(state.result);
        state.tag = type2.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== "!") {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
      type2 = state.typeMap[state.kind || "fallback"][state.tag];
    } else {
      type2 = null;
      typeList = state.typeMap.multi[state.kind || "fallback"];
      for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type2 = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type2) {
      throwError(state, "unknown tag !<" + state.tag + ">");
    }
    if (state.result !== null && type2.kind !== state.kind) {
      throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
    }
    if (!type2.resolve(state.result, state.tag)) {
      throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
    } else {
      state.result = type2.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener("close", state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = /* @__PURE__ */ Object.create(null);
  state.anchorMap = /* @__PURE__ */ Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 37) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, "directive name must not be less than one character in length");
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch)) break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0) readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, "directives end mark is expected");
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, "non-ASCII line breaks are interpreted as content");
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 46) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, "end of the stream or a document separator is expected");
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
      input += "\n";
    }
    if (input.charCodeAt(0) === 65279) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf("\0");
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, "null byte is not allowed in input");
  }
  state.input += "\0";
  while (state.input.charCodeAt(state.position) === 32) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll$1(input, iterator, options) {
  if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== "function") {
    return documents;
  }
  for (var index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load$1(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    return void 0;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new exception("expected a single document in the stream, but found more");
}
var loadAll_1 = loadAll$1;
var load_1 = load$1;
var loader = {
  loadAll: loadAll_1,
  load: load_1
};
var _toString = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var CHAR_BOM = 65279;
var CHAR_TAB = 9;
var CHAR_LINE_FEED = 10;
var CHAR_CARRIAGE_RETURN = 13;
var CHAR_SPACE = 32;
var CHAR_EXCLAMATION = 33;
var CHAR_DOUBLE_QUOTE = 34;
var CHAR_SHARP = 35;
var CHAR_PERCENT = 37;
var CHAR_AMPERSAND = 38;
var CHAR_SINGLE_QUOTE = 39;
var CHAR_ASTERISK = 42;
var CHAR_COMMA = 44;
var CHAR_MINUS = 45;
var CHAR_COLON = 58;
var CHAR_EQUALS = 61;
var CHAR_GREATER_THAN = 62;
var CHAR_QUESTION = 63;
var CHAR_COMMERCIAL_AT = 64;
var CHAR_LEFT_SQUARE_BRACKET = 91;
var CHAR_RIGHT_SQUARE_BRACKET = 93;
var CHAR_GRAVE_ACCENT = 96;
var CHAR_LEFT_CURLY_BRACKET = 123;
var CHAR_VERTICAL_LINE = 124;
var CHAR_RIGHT_CURLY_BRACKET = 125;
var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0] = "\\0";
ESCAPE_SEQUENCES[7] = "\\a";
ESCAPE_SEQUENCES[8] = "\\b";
ESCAPE_SEQUENCES[9] = "\\t";
ESCAPE_SEQUENCES[10] = "\\n";
ESCAPE_SEQUENCES[11] = "\\v";
ESCAPE_SEQUENCES[12] = "\\f";
ESCAPE_SEQUENCES[13] = "\\r";
ESCAPE_SEQUENCES[27] = "\\e";
ESCAPE_SEQUENCES[34] = '\\"';
ESCAPE_SEQUENCES[92] = "\\\\";
ESCAPE_SEQUENCES[133] = "\\N";
ESCAPE_SEQUENCES[160] = "\\_";
ESCAPE_SEQUENCES[8232] = "\\L";
ESCAPE_SEQUENCES[8233] = "\\P";
var DEPRECATED_BOOLEANS_SYNTAX = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
];
var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function compileStyleMap(schema2, map2) {
  var result, keys, index, length, tag, style, type2;
  if (map2 === null) return {};
  result = {};
  keys = Object.keys(map2);
  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map2[tag]);
    if (tag.slice(0, 2) === "!!") {
      tag = "tag:yaml.org,2002:" + tag.slice(2);
    }
    type2 = schema2.compiledTypeMap["fallback"][tag];
    if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
      style = type2.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string, handle, length;
  string = character.toString(16).toUpperCase();
  if (character <= 255) {
    handle = "x";
    length = 2;
  } else if (character <= 65535) {
    handle = "u";
    length = 4;
  } else if (character <= 4294967295) {
    handle = "U";
    length = 8;
  } else {
    throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
  }
  return "\\" + handle + common.repeat("0", length - string.length) + string;
}
var QUOTING_TYPE_SINGLE = 1;
var QUOTING_TYPE_DOUBLE = 2;
function State(options) {
  this.schema = options["schema"] || _default;
  this.indent = Math.max(1, options["indent"] || 2);
  this.noArrayIndent = options["noArrayIndent"] || false;
  this.skipInvalid = options["skipInvalid"] || false;
  this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
  this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
  this.sortKeys = options["sortKeys"] || false;
  this.lineWidth = options["lineWidth"] || 80;
  this.noRefs = options["noRefs"] || false;
  this.noCompatMode = options["noCompatMode"] || false;
  this.condenseFlow = options["condenseFlow"] || false;
  this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options["forceQuotes"] || false;
  this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = "";
  this.duplicates = [];
  this.usedDuplicates = null;
}
function indentString(string, spaces) {
  var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
  while (position < length) {
    next = string.indexOf("\n", position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== "\n") result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return "\n" + common.repeat(" ", state.indent * level);
}
function testImplicitResolving(state, str3) {
  var index, length, type2;
  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type2 = state.implicitTypes[index];
    if (type2.resolve(str3)) {
      return true;
    }
  }
  return false;
}
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}
function isPrintable(c) {
  return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
}
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (
    // ns-plain-safe
    (inblock ? (
      // c = flow-in
      cIsNsCharOrWhitespace
    ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
  );
}
function isPlainSafeFirst(c) {
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}
function isPlainSafeLast(c) {
  return !isWhitespace(c) && c !== CHAR_COLON;
}
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
var STYLE_PLAIN = 1;
var STYLE_SINGLE = 2;
var STYLE_LITERAL = 3;
var STYLE_FOLDED = 4;
var STYLE_DOUBLE = 5;
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false;
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1;
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
  }
  if (!hasLineBreak && !hasFoldableLine) {
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = (function() {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state.indent * Math.max(1, level);
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
    var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string2) {
      return testImplicitResolving(state, string2);
    }
    switch (chooseScalarStyle(
      string,
      singleLineOnly,
      state.indent,
      lineWidth,
      testAmbiguity,
      state.quotingType,
      state.forceQuotes && !iskey,
      inblock
    )) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new exception("impossible error: invalid scalar style");
    }
  })();
}
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
  var clip = string[string.length - 1] === "\n";
  var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
  var chomp = keep ? "+" : clip ? "" : "-";
  return indentIndicator + chomp + "\n";
}
function dropEndingNewline(string) {
  return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
}
function foldString(string, width) {
  var lineRe = /(\n+)([^\n]*)/g;
  var result = (function() {
    var nextLF = string.indexOf("\n");
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  })();
  var prevMoreIndented = string[0] === "\n" || string[0] === " ";
  var moreIndented;
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1], line = match[2];
    moreIndented = line[0] === " ";
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
function foldLine(line, width) {
  if (line === "" || line[0] === " ") return line;
  var breakRe = / [^ ]/g;
  var match;
  var start = 0, end, curr = 0, next = 0;
  var result = "";
  while (match = breakRe.exec(line)) {
    next = match.index;
    if (next - start > width) {
      end = curr > start ? curr : next;
      result += "\n" + line.slice(start, end);
      start = end + 1;
    }
    curr = next;
  }
  result += "\n";
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1);
}
function escapeString(string) {
  var result = "";
  var char = 0;
  var escapeSeq;
  for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
    char = codePointAt(string, i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i];
      if (char >= 65536) result += string[i + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
      if (_result !== "") _result += "," + (!state.condenseFlow ? " " : "");
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = "[" + _result + "]";
}
function writeBlockSequence(state, level, object, compact) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length; index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== "") {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += "-";
      } else {
        _result += "- ";
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || "[]";
}
function writeFlowMapping(state, level, object) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (_result !== "") pairBuffer += ", ";
    if (state.condenseFlow) pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue;
    }
    if (state.dump.length > 1024) pairBuffer += "? ";
    pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
    if (!writeNode(state, level, objectValue, false, false)) {
      continue;
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = "{" + _result + "}";
}
function writeBlockMapping(state, level, object, compact) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
  if (state.sortKeys === true) {
    objectKeyList.sort();
  } else if (typeof state.sortKeys === "function") {
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    throw new exception("sortKeys must be a boolean or a function");
  }
  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (!compact || _result !== "") {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue;
    }
    explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += "?";
      } else {
        pairBuffer += "? ";
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue;
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ":";
    } else {
      pairBuffer += ": ";
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || "{}";
}
function detectType(state, object, explicit) {
  var _result, typeList, index, length, type2, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index = 0, length = typeList.length; index < length; index += 1) {
    type2 = typeList[index];
    if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
      if (explicit) {
        if (type2.multi && type2.representName) {
          state.tag = type2.representName(object);
        } else {
          state.tag = type2.tag;
        }
      } else {
        state.tag = "?";
      }
      if (type2.represent) {
        style = state.styleMap[type2.tag] || type2.defaultStyle;
        if (_toString.call(type2.represent) === "[object Function]") {
          _result = type2.represent(object, style);
        } else if (_hasOwnProperty.call(type2.represent, style)) {
          _result = type2.represent[style](object, style);
        } else {
          throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type2 = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = "*ref_" + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type2 === "[object Object]") {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object Array]") {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object String]") {
      if (state.tag !== "?") {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type2 === "[object Undefined]") {
      return false;
    } else {
      if (state.skipInvalid) return false;
      throw new exception("unacceptable kind of an object to dump " + type2);
    }
    if (state.tag !== null && state.tag !== "?") {
      tagStr = encodeURI(
        state.tag[0] === "!" ? state.tag.slice(1) : state.tag
      ).replace(/!/g, "%21");
      if (state.tag[0] === "!") {
        tagStr = "!" + tagStr;
      } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
        tagStr = "!!" + tagStr.slice(18);
      } else {
        tagStr = "!<" + tagStr + ">";
      }
      state.dump = tagStr + " " + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [], duplicatesIndexes = [], index, length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object !== null && typeof object === "object") {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump$1(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs) getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({ "": value }, "", value);
  }
  if (writeNode(state, 0, value, true, true)) return state.dump + "\n";
  return "";
}
var dump_1 = dump$1;
var dumper = {
  dump: dump_1
};
function renamed(from, to) {
  return function() {
    throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
  };
}
var load = loader.load;
var loadAll = loader.loadAll;
var dump = dumper.dump;
var safeLoad = renamed("safeLoad", "load");
var safeLoadAll = renamed("safeLoadAll", "loadAll");
var safeDump = renamed("safeDump", "dump");

// dist/src/cli/install-mcp-shared.js
import { existsSync as existsSync7 } from "node:fs";
import { join as join8 } from "node:path";
var HIVEMIND_DIR = join8(HOME, ".hivemind");
var MCP_DIR = join8(HIVEMIND_DIR, "mcp");
var MCP_SERVER_PATH = join8(MCP_DIR, "server.js");
var MCP_PACKAGE_JSON = join8(MCP_DIR, "package.json");
function ensureMcpServerInstalled() {
  const srcDir = join8(pkgRoot(), "mcp", "bundle");
  if (!existsSync7(srcDir)) {
    throw new Error(`MCP server bundle missing at ${srcDir}. Run 'npm run build' to produce it before installing Tier B consumers.`);
  }
  ensureDir(MCP_DIR);
  copyDir(srcDir, MCP_DIR);
  writeVersionStamp(HIVEMIND_DIR, getVersion());
  log(`  hivemind-mcp   server installed -> ${MCP_SERVER_PATH}`);
}

// dist/src/cli/install-hermes.js
var HERMES_HOME = join9(HOME, ".hermes");
var SKILLS_DIR = join9(HERMES_HOME, "skills", "hivemind-memory");
var HIVEMIND_DIR2 = join9(HERMES_HOME, "hivemind");
var BUNDLE_DIR = join9(HIVEMIND_DIR2, "bundle");
var CONFIG_PATH = join9(HERMES_HOME, "config.yaml");
var SERVER_KEY = "hivemind";
var SKILL_BODY = `---
name: hivemind-memory
description: Global team and org memory powered by Activeloop. ALWAYS check BOTH built-in memory AND Hivemind memory when recalling information.
---

# Hivemind Memory

You have persistent memory at \`~/.deeplake/memory/\` \u2014 global memory shared across all sessions, users, and agents in the org.

## Hivemind tools (preferred)

When you need to recall org memory, prefer calling the hivemind MCP tools \u2014 one tool call returns ranked hits across all summaries and sessions in a single SQL query:

- \`hivemind_search { query, limit? }\` \u2014 keyword/regex search across summaries + sessions
- \`hivemind_read { path }\` \u2014 read full content at a Hivemind memory path (e.g. \`/summaries/alice/abc.md\`)
- \`hivemind_index { prefix?, limit? }\` \u2014 list summary entries

Different paths under \`/summaries/<username>/\` are different users \u2014 do NOT merge or alias them.

## Direct filesystem fallback

If MCP tools are unavailable for some reason, fall back to reading the virtual filesystem at \`~/.deeplake/memory/\`:

\`\`\`
~/.deeplake/memory/
\u251C\u2500\u2500 index.md                          \u2190 START HERE \u2014 table of all sessions
\u251C\u2500\u2500 summaries/
\u2502   \u251C\u2500\u2500 session-abc.md                \u2190 AI-generated wiki summary
\u2502   \u2514\u2500\u2500 session-xyz.md
\u2514\u2500\u2500 sessions/
    \u2514\u2500\u2500 username/
        \u251C\u2500\u2500 user_org_ws_slug1.jsonl   \u2190 raw session data
        \u2514\u2500\u2500 user_org_ws_slug2.jsonl
\`\`\`

1. **First**: Read \`~/.deeplake/memory/index.md\`
2. **If you need details**: Read the specific summary at \`~/.deeplake/memory/summaries/<session>.md\`
3. **If you need raw data**: Read the session JSONL at \`~/.deeplake/memory/sessions/<user>/<file>.jsonl\`
4. **Keyword search**: \`grep -r "keyword" ~/.deeplake/memory/\` (use \`grep\`, NOT \`rg\`/ripgrep \u2014 \`rg\` may not be installed)

Do NOT jump straight to reading raw JSONL files. Always start with index.md and summaries.

## Important Constraints

- Use \`grep\` (NOT \`rg\`/ripgrep) for keyword search \u2014 \`rg\` may not be installed on the host system.
- Only use these bash builtins to interact with \`~/.deeplake/memory/\`: \`cat\`, \`ls\`, \`grep\`, \`echo\`, \`jq\`, \`head\`, \`tail\`, \`sed\`, \`awk\`, \`wc\`, \`sort\`, \`find\`. The memory filesystem does NOT support \`rg\`, \`python\`, \`python3\`, \`node\`, or \`curl\`.
- If a file returns empty after 2 attempts, skip it and move on. Report what you found rather than retrying exhaustively.
`;
function isHivemindHook(entry) {
  if (!entry || typeof entry !== "object")
    return false;
  const cmd = entry.command;
  return typeof cmd === "string" && cmd.includes("/.hermes/hivemind/bundle/");
}
function buildHookEntry(bundleFile, timeout, matcher) {
  const entry = {
    command: `node ${join9(BUNDLE_DIR, bundleFile)}`,
    timeout
  };
  if (matcher)
    entry.matcher = matcher;
  return entry;
}
function buildHooksBlock() {
  return {
    on_session_start: [buildHookEntry("session-start.js", 30)],
    // pre_tool_call (matcher: terminal) intercepts grep/rg against
    // ~/.deeplake/memory/ and replies with a single SQL fast-path result.
    // Belt-and-suspenders alongside the hivemind_search MCP tool — if the
    // agent ignores the skill guidance and runs a terminal grep, accuracy
    // still matches Tier 1 (Claude / Codex / Cursor).
    pre_tool_call: [buildHookEntry("pre-tool-use.js", 30, "terminal")],
    pre_llm_call: [buildHookEntry("capture.js", 10)],
    post_tool_call: [buildHookEntry("capture.js", 15)],
    post_llm_call: [buildHookEntry("capture.js", 15)],
    on_session_end: [buildHookEntry("session-end.js", 30)]
  };
}
function mergeHooks3(existing) {
  const merged = { ...existing ?? {} };
  const ours = buildHooksBlock();
  for (const [event, entries] of Object.entries(ours)) {
    const prior = Array.isArray(merged[event]) ? merged[event] : [];
    const stripped = prior.filter((e) => !isHivemindHook(e));
    merged[event] = [...stripped, ...entries];
  }
  return merged;
}
function stripHivemindHooks(existing) {
  if (!existing)
    return void 0;
  const out = {};
  for (const [event, entries] of Object.entries(existing)) {
    const kept = (entries ?? []).filter((e) => !isHivemindHook(e));
    if (kept.length > 0)
      out[event] = kept;
  }
  return Object.keys(out).length > 0 ? out : void 0;
}
function readConfig() {
  if (!existsSync8(CONFIG_PATH))
    return {};
  try {
    const raw = readFileSync6(CONFIG_PATH, "utf-8");
    const parsed = load(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}
function writeConfig(cfg) {
  ensureDir(HERMES_HOME);
  const dumped = dump(cfg, { lineWidth: 100, noRefs: true });
  writeFileSync5(CONFIG_PATH, dumped);
}
function installHermes() {
  ensureDir(SKILLS_DIR);
  writeFileSync5(join9(SKILLS_DIR, "SKILL.md"), SKILL_BODY);
  writeVersionStamp(SKILLS_DIR, getVersion());
  log(`  Hermes         skill installed -> ${SKILLS_DIR}`);
  const srcBundle = join9(pkgRoot(), "hermes", "bundle");
  if (!existsSync8(srcBundle)) {
    throw new Error(`Hermes bundle missing at ${srcBundle}. Run 'npm run build' first.`);
  }
  ensureDir(HIVEMIND_DIR2);
  copyDir(srcBundle, BUNDLE_DIR);
  writeVersionStamp(HIVEMIND_DIR2, getVersion());
  log(`  Hermes         bundle installed -> ${BUNDLE_DIR}`);
  ensureMcpServerInstalled();
  const cfg = readConfig();
  if (!cfg.mcp_servers || typeof cfg.mcp_servers !== "object")
    cfg.mcp_servers = {};
  cfg.mcp_servers[SERVER_KEY] = {
    command: "node",
    args: [MCP_SERVER_PATH]
  };
  cfg.hooks = mergeHooks3(cfg.hooks);
  cfg.hooks_auto_accept = true;
  writeConfig(cfg);
  log(`  Hermes         config updated -> ${CONFIG_PATH} (mcp_servers + hooks + hooks_auto_accept)`);
}
function uninstallHermes() {
  if (existsSync8(SKILLS_DIR)) {
    rmSync2(SKILLS_DIR, { recursive: true, force: true });
    log(`  Hermes         removed ${SKILLS_DIR}`);
  }
  if (existsSync8(HIVEMIND_DIR2)) {
    rmSync2(HIVEMIND_DIR2, { recursive: true, force: true });
    log(`  Hermes         removed ${HIVEMIND_DIR2}`);
  }
  if (existsSync8(CONFIG_PATH)) {
    const cfg = readConfig();
    let touched = false;
    if (cfg.mcp_servers && typeof cfg.mcp_servers === "object" && SERVER_KEY in cfg.mcp_servers) {
      delete cfg.mcp_servers[SERVER_KEY];
      if (Object.keys(cfg.mcp_servers).length === 0)
        delete cfg.mcp_servers;
      touched = true;
    }
    const stripped = stripHivemindHooks(cfg.hooks);
    if (cfg.hooks && (!stripped || Object.keys(stripped).length !== Object.keys(cfg.hooks).length)) {
      if (stripped)
        cfg.hooks = stripped;
      else
        delete cfg.hooks;
      touched = true;
    }
    if ("hooks_auto_accept" in cfg) {
      delete cfg.hooks_auto_accept;
      touched = true;
    }
    if (touched) {
      if (Object.keys(cfg).length === 0) {
        unlinkSync4(CONFIG_PATH);
      } else {
        writeConfig(cfg);
      }
      log(`  Hermes         hivemind entries removed from ${CONFIG_PATH}`);
    }
  }
}

// dist/src/cli/install-pi.js
import { existsSync as existsSync9, writeFileSync as writeFileSync6, rmSync as rmSync3, readFileSync as readFileSync7, copyFileSync as copyFileSync2 } from "node:fs";
import { join as join10 } from "node:path";
var PI_AGENT_DIR = join10(HOME, ".pi", "agent");
var AGENTS_MD = join10(PI_AGENT_DIR, "AGENTS.md");
var LEGACY_SKILL_DIR = join10(PI_AGENT_DIR, "skills", "hivemind-memory");
var EXTENSIONS_DIR = join10(PI_AGENT_DIR, "extensions");
var EXTENSION_PATH = join10(EXTENSIONS_DIR, "hivemind.ts");
var VERSION_DIR = join10(PI_AGENT_DIR, ".hivemind");
var WIKI_WORKER_DIR = join10(PI_AGENT_DIR, "hivemind");
var WIKI_WORKER_PATH = join10(WIKI_WORKER_DIR, "wiki-worker.js");
var SKILLIFY_WORKER_PATH = join10(WIKI_WORKER_DIR, "skillify-worker.js");
var AUTOPULL_WORKER_PATH = join10(WIKI_WORKER_DIR, "autopull-worker.js");
var HIVEMIND_BLOCK_START = "<!-- BEGIN hivemind-memory -->";
var HIVEMIND_BLOCK_END = "<!-- END hivemind-memory -->";
var HIVEMIND_BLOCK_BODY = `${HIVEMIND_BLOCK_START}
## Hivemind Memory

You have access to global org memory at \`~/.deeplake/memory/\`. Always check both
your local context AND Hivemind memory when the user asks you to recall, look up,
or remember anything.

- Three hivemind tools are registered: \`hivemind_search\`, \`hivemind_read\`, \`hivemind_index\`. **Prefer these** \u2014 one call returns ranked hits in a single SQL query.
- Fall back to direct filesystem if the tools fail:
- Start with \`~/.deeplake/memory/index.md\` (table of all sessions)
- Then read specific summaries at \`~/.deeplake/memory/summaries/<user>/<session>.md\`
- Only fall back to raw \`~/.deeplake/memory/sessions/<user>/*.jsonl\` if summaries don't have enough detail
- Search: use \`grep\` (NOT \`rg\`/ripgrep \u2014 \`rg\` is not always installed). Example: \`grep -ri "keyword" ~/.deeplake/memory/\`

Use only bash builtins (cat, ls, grep, jq, head, tail, sed, awk, wc, sort, find) to read this filesystem \u2014
rg/ripgrep, node, python, curl are not available there.
${HIVEMIND_BLOCK_END}`;
function upsertHivemindBlock(existing) {
  const block = HIVEMIND_BLOCK_BODY;
  if (!existing)
    return `${block}
`;
  const startIdx = existing.indexOf(HIVEMIND_BLOCK_START);
  if (startIdx === -1)
    return `${existing.trimEnd()}

${block}
`;
  const endIdx = existing.indexOf(HIVEMIND_BLOCK_END, startIdx);
  if (endIdx === -1) {
    return `${existing.trimEnd()}

${block}
`;
  }
  const before = existing.slice(0, startIdx).trimEnd();
  const after = existing.slice(endIdx + HIVEMIND_BLOCK_END.length).replace(/^\n+/, "");
  const rest = after ? `

${after}` : "";
  return `${before ? before + "\n\n" : ""}${block}
${rest}`;
}
function stripHivemindBlock(existing) {
  const startIdx = existing.indexOf(HIVEMIND_BLOCK_START);
  if (startIdx === -1)
    return existing;
  const endIdx = existing.indexOf(HIVEMIND_BLOCK_END, startIdx);
  if (endIdx === -1)
    return existing;
  const before = existing.slice(0, startIdx).trimEnd();
  const after = existing.slice(endIdx + HIVEMIND_BLOCK_END.length).replace(/^\n+/, "");
  if (!before && !after)
    return "";
  if (!before)
    return after;
  if (!after)
    return `${before}
`;
  return `${before}

${after}`;
}
function installPi() {
  ensureDir(PI_AGENT_DIR);
  if (existsSync9(LEGACY_SKILL_DIR)) {
    rmSync3(LEGACY_SKILL_DIR, { recursive: true, force: true });
  }
  const prior = existsSync9(AGENTS_MD) ? readFileSync7(AGENTS_MD, "utf-8") : null;
  const next = upsertHivemindBlock(prior);
  writeFileSync6(AGENTS_MD, next);
  const srcExtension = join10(pkgRoot(), "pi", "extension-source", "hivemind.ts");
  if (!existsSync9(srcExtension)) {
    throw new Error(`pi extension source missing at ${srcExtension}. Reinstall the @deeplake/hivemind package.`);
  }
  ensureDir(EXTENSIONS_DIR);
  copyFileSync2(srcExtension, EXTENSION_PATH);
  const srcWorker = join10(pkgRoot(), "pi", "bundle", "wiki-worker.js");
  if (existsSync9(srcWorker)) {
    ensureDir(WIKI_WORKER_DIR);
    copyFileSync2(srcWorker, WIKI_WORKER_PATH);
  }
  const srcSkillifyWorker = join10(pkgRoot(), "pi", "bundle", "skillify-worker.js");
  if (existsSync9(srcSkillifyWorker)) {
    ensureDir(WIKI_WORKER_DIR);
    copyFileSync2(srcSkillifyWorker, SKILLIFY_WORKER_PATH);
  }
  const srcAutopullWorker = join10(pkgRoot(), "pi", "bundle", "autopull-worker.js");
  if (existsSync9(srcAutopullWorker)) {
    ensureDir(WIKI_WORKER_DIR);
    copyFileSync2(srcAutopullWorker, AUTOPULL_WORKER_PATH);
  }
  ensureDir(VERSION_DIR);
  writeVersionStamp(VERSION_DIR, getVersion());
  log(`  pi             AGENTS.md updated -> ${AGENTS_MD}`);
  log(`  pi             extension installed -> ${EXTENSION_PATH}`);
  if (existsSync9(WIKI_WORKER_PATH)) {
    log(`  pi             wiki-worker installed -> ${WIKI_WORKER_PATH}`);
  }
  if (existsSync9(SKILLIFY_WORKER_PATH)) {
    log(`  pi             skillify-worker installed -> ${SKILLIFY_WORKER_PATH}`);
  }
  if (existsSync9(AUTOPULL_WORKER_PATH)) {
    log(`  pi             autopull-worker installed -> ${AUTOPULL_WORKER_PATH}`);
  }
}
function uninstallPi() {
  if (existsSync9(LEGACY_SKILL_DIR)) {
    rmSync3(LEGACY_SKILL_DIR, { recursive: true, force: true });
    log(`  pi             removed ${LEGACY_SKILL_DIR}`);
  }
  if (existsSync9(EXTENSION_PATH)) {
    rmSync3(EXTENSION_PATH, { force: true });
    log(`  pi             removed extension ${EXTENSION_PATH}`);
  }
  if (existsSync9(WIKI_WORKER_DIR)) {
    rmSync3(WIKI_WORKER_DIR, { recursive: true, force: true });
    log(`  pi             removed wiki-worker dir ${WIKI_WORKER_DIR}`);
  }
  if (existsSync9(AGENTS_MD)) {
    const prior = readFileSync7(AGENTS_MD, "utf-8");
    const stripped = stripHivemindBlock(prior);
    if (stripped.trim().length === 0) {
      rmSync3(AGENTS_MD, { force: true });
      log(`  pi             removed empty ${AGENTS_MD}`);
    } else {
      writeFileSync6(AGENTS_MD, stripped);
      log(`  pi             stripped hivemind block from ${AGENTS_MD}`);
    }
  }
  if (existsSync9(VERSION_DIR)) {
    rmSync3(VERSION_DIR, { recursive: true, force: true });
  }
}

// dist/src/cli/embeddings.js
import { copyFileSync as copyFileSync3, chmodSync, existsSync as existsSync11, lstatSync as lstatSync2, readdirSync, readFileSync as readFileSync9, readlinkSync, rmSync as rmSync4, statSync, unlinkSync as unlinkSync5 } from "node:fs";
import { execFileSync as execFileSync3, spawnSync } from "node:child_process";
import { userInfo } from "node:os";
import { join as join12 } from "node:path";

// dist/src/embeddings/protocol.js
var DEFAULT_SOCKET_DIR = "/tmp";
var DEFAULT_IDLE_TIMEOUT_MS = 10 * 60 * 1e3;
function socketPathFor(uid, dir = DEFAULT_SOCKET_DIR) {
  return `${dir}/hivemind-embed-${uid}.sock`;
}
function pidPathFor(uid, dir = DEFAULT_SOCKET_DIR) {
  return `${dir}/hivemind-embed-${uid}.pid`;
}

// dist/src/user-config.js
import { existsSync as existsSync10, mkdirSync as mkdirSync2, readFileSync as readFileSync8, renameSync as renameSync2, writeFileSync as writeFileSync7 } from "node:fs";
import { homedir as homedir4 } from "node:os";
import { dirname as dirname2, join as join11 } from "node:path";
var _configPath = () => process.env.HIVEMIND_CONFIG_PATH ?? join11(homedir4(), ".deeplake", "config.json");
var _cache = null;
var _migrated = false;
function readUserConfig() {
  if (_cache !== null)
    return _cache;
  const path5 = _configPath();
  if (!existsSync10(path5)) {
    _cache = {};
    return _cache;
  }
  try {
    const raw = readFileSync8(path5, "utf-8");
    const parsed = JSON.parse(raw);
    _cache = isPlainObject(parsed) ? parsed : {};
  } catch {
    _cache = {};
  }
  return _cache;
}
function writeUserConfig(patch) {
  const current = readUserConfig();
  const merged = deepMerge(current, patch);
  const path5 = _configPath();
  const dir = dirname2(path5);
  if (!existsSync10(dir))
    mkdirSync2(dir, { recursive: true });
  const tmp = `${path5}.tmp.${process.pid}`;
  writeFileSync7(tmp, JSON.stringify(merged, null, 2) + "\n", "utf-8");
  renameSync2(tmp, path5);
  _cache = merged;
  return merged;
}
function getEmbeddingsEnabled() {
  const cfg = readUserConfig();
  if (cfg.embeddings && typeof cfg.embeddings.enabled === "boolean") {
    return cfg.embeddings.enabled;
  }
  if (_migrated) {
    return migrationValueFromEnv();
  }
  _migrated = true;
  const enabled = migrationValueFromEnv();
  try {
    writeUserConfig({ embeddings: { enabled } });
  } catch {
    _cache = { ...cfg ?? {}, embeddings: { ...cfg?.embeddings ?? {}, enabled } };
  }
  return enabled;
}
function migrationValueFromEnv() {
  const raw = process.env.HIVEMIND_EMBEDDINGS;
  if (raw === void 0)
    return false;
  if (raw === "false")
    return false;
  return true;
}
function setEmbeddingsEnabled(enabled) {
  writeUserConfig({ embeddings: { enabled } });
}
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function deepMerge(base, patch) {
  const out = { ...base };
  for (const key of Object.keys(patch)) {
    const patchVal = patch[key];
    const baseVal = base[key];
    if (isPlainObject(patchVal) && isPlainObject(baseVal)) {
      out[key] = { ...baseVal, ...patchVal };
    } else if (patchVal !== void 0) {
      out[key] = patchVal;
    }
  }
  return out;
}

// dist/src/cli/embeddings.js
var SHARED_DIR = join12(HOME, ".hivemind", "embed-deps");
var SHARED_NODE_MODULES = join12(SHARED_DIR, "node_modules");
var SHARED_DAEMON_PATH = join12(SHARED_DIR, "embed-daemon.js");
var TRANSFORMERS_PKG = "@huggingface/transformers";
var TRANSFORMERS_RANGE = "^3.0.0";
function findHivemindInstalls(home = HOME) {
  const out = [];
  const fixed = [
    { id: "codex", pluginDir: join12(home, ".codex", "hivemind") },
    { id: "cursor", pluginDir: join12(home, ".cursor", "hivemind") },
    { id: "hermes", pluginDir: join12(home, ".hermes", "hivemind") }
  ];
  for (const inst of fixed) {
    if (existsSync11(join12(inst.pluginDir, "bundle")))
      out.push(inst);
  }
  const ccCache = join12(home, ".claude", "plugins", "cache", "hivemind", "hivemind");
  if (existsSync11(ccCache)) {
    let entries = [];
    try {
      entries = readdirSync(ccCache);
    } catch {
    }
    for (const ver of entries) {
      const dir = join12(ccCache, ver);
      try {
        if (!statSync(dir).isDirectory())
          continue;
      } catch {
        continue;
      }
      const candidates = [join12(dir, "bundle"), join12(dir, "claude-code", "bundle")];
      if (candidates.some((p) => existsSync11(p))) {
        out.push({ id: `claude (${ver})`, pluginDir: dir });
      }
    }
  }
  return out;
}
function isSharedDepsInstalled(sharedNodeModules = SHARED_NODE_MODULES) {
  return existsSync11(join12(sharedNodeModules, TRANSFORMERS_PKG));
}
function isSymlinkToSharedDeps(linkPath, sharedNodeModules) {
  if (!existsSync11(linkPath))
    return false;
  try {
    if (!lstatSync2(linkPath).isSymbolicLink())
      return false;
    return readlinkSync(linkPath) === sharedNodeModules;
  } catch {
    return false;
  }
}
function linkStateFor(install, sharedNodeModules = SHARED_NODE_MODULES) {
  const link = join12(install.pluginDir, "node_modules");
  if (!existsSync11(link) && !isSymbolicLink(link))
    return { kind: "no-node-modules" };
  try {
    if (lstatSync2(link).isSymbolicLink()) {
      const target = readlinkSync(link);
      return target === sharedNodeModules ? { kind: "linked-to-shared" } : { kind: "linked-elsewhere", target };
    }
  } catch {
    return { kind: "no-node-modules" };
  }
  return { kind: "owns-own-node-modules" };
}
function isSymbolicLink(path5) {
  try {
    return lstatSync2(path5).isSymbolicLink();
  } catch {
    return false;
  }
}
function ensureSharedDeps() {
  if (!isSharedDepsInstalled()) {
    log(`  Embeddings     installing ${TRANSFORMERS_PKG}@${TRANSFORMERS_RANGE} into ${SHARED_DIR}`);
    log(`                 (~600 MB; first install only \u2014 every agent will share this)`);
    ensureDir(SHARED_DIR);
    writeJson(join12(SHARED_DIR, "package.json"), {
      name: "hivemind-embed-deps",
      version: "1.0.0",
      private: true,
      dependencies: { [TRANSFORMERS_PKG]: TRANSFORMERS_RANGE }
    });
    execFileSync3("npm", ["install", "--omit=dev", "--no-package-lock", "--no-audit", "--no-fund"], {
      cwd: SHARED_DIR,
      stdio: "inherit"
    });
  } else {
    log(`  Embeddings     shared deps already present at ${SHARED_DIR}`);
  }
  ensureDir(SHARED_DIR);
  const src = join12(pkgRoot(), "embeddings", "embed-daemon.js");
  if (existsSync11(src)) {
    copyFileSync3(src, SHARED_DAEMON_PATH);
    chmodSync(SHARED_DAEMON_PATH, 493);
  } else {
    warn(`  Embeddings     standalone daemon bundle missing at ${src} (run 'npm run build' first)`);
  }
}
function linkAgent(install) {
  const link = join12(install.pluginDir, "node_modules");
  const state = linkStateFor(install);
  if (state.kind === "owns-own-node-modules") {
    warn(`  Embeddings     ${install.id.padEnd(20)} owns its own node_modules \u2014 skipping symlink (status: owns-own-node-modules)`);
    return;
  }
  symlinkForce(SHARED_NODE_MODULES, link);
  log(`  Embeddings     linked ${install.id.padEnd(20)} -> shared deps`);
}
function installEmbeddings() {
  ensureSharedDeps();
  const installs = findHivemindInstalls();
  if (installs.length === 0) {
    warn("  Embeddings     no hivemind installs detected \u2014 run `hivemind install` first");
    warn("                 (the shared deps are in place; subsequent agent installs will pick them up if you re-run `hivemind embeddings install`)");
  } else {
    for (const inst of installs)
      linkAgent(inst);
  }
  setEmbeddingsEnabled(true);
  log(`  Embeddings     enabled in ~/.deeplake/config.json`);
  log(`  Embeddings     ready. Restart your agents to pick up.`);
}
function enableEmbeddings() {
  setEmbeddingsEnabled(true);
  log(`  Embeddings     enabled in ~/.deeplake/config.json`);
  if (!isSharedDepsInstalled()) {
    warn(`  Embeddings     shared deps not installed yet \u2014 run \`hivemind embeddings install\` to download them`);
  } else {
    log(`  Embeddings     shared deps present \u2014 sessions will start producing embeddings on next restart`);
  }
}
function uninstallEmbeddings(opts) {
  const installs = findHivemindInstalls();
  for (const inst of installs) {
    const link = join12(inst.pluginDir, "node_modules");
    if (isSymlinkToSharedDeps(link, SHARED_NODE_MODULES)) {
      unlinkSync5(link);
      log(`  Embeddings     unlinked ${inst.id}`);
    }
  }
  if (opts?.prune && existsSync11(SHARED_DIR)) {
    rmSync4(SHARED_DIR, { recursive: true, force: true });
    log(`  Embeddings     pruned ${SHARED_DIR}`);
  }
  setEmbeddingsEnabled(false);
  killEmbedDaemon();
  log(`  Embeddings     disabled in ~/.deeplake/config.json`);
}
function disableEmbeddings() {
  setEmbeddingsEnabled(false);
  killEmbedDaemon();
  log(`  Embeddings     disabled in ~/.deeplake/config.json`);
  log(`  Embeddings     daemon terminated; shared deps preserved (run \`hivemind embeddings uninstall\` to remove)`);
}
function killEmbedDaemon(socketDir) {
  const uid = typeof process.getuid === "function" ? process.getuid() : userInfo().uid;
  const pidPath = pidPathFor(String(uid), socketDir);
  const sockPath = socketPathFor(String(uid), socketDir);
  let pid = null;
  try {
    pid = Number.parseInt(readFileSync9(pidPath, "utf-8").trim(), 10);
  } catch {
  }
  if (pid !== null && Number.isFinite(pid) && _isDaemonAliveOnSocket(sockPath)) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
    }
  } else if (pid !== null) {
    log(`  Embeddings     pidfile present but socket dead \u2014 skipping SIGTERM on possibly-stale pid ${pid}`);
  }
  try {
    unlinkSync5(sockPath);
  } catch {
  }
  try {
    unlinkSync5(pidPath);
  } catch {
  }
}
function _isDaemonAliveOnSocket(sockPath, timeoutMs = 200) {
  if (!existsSync11(sockPath))
    return false;
  try {
    const child = spawnSync("node", [
      "-e",
      `const n=require("node:net");const s=n.connect(${JSON.stringify(sockPath)});s.once("connect",()=>{s.end();process.exit(0)});s.once("error",()=>process.exit(2));setTimeout(()=>process.exit(3),${timeoutMs});`
    ], { timeout: timeoutMs + 1e3, stdio: "ignore" });
    return child.status === 0;
  } catch {
    return false;
  }
}
function statusEmbeddings() {
  const enabled = getEmbeddingsEnabled();
  log(`Config:        ~/.deeplake/config.json embeddings.enabled = ${enabled}`);
  log(`Shared deps:   ${SHARED_DIR}`);
  log(`Installed:     ${isSharedDepsInstalled() ? "yes" : "no"}`);
  log(`Daemon:        ${existsSync11(SHARED_DAEMON_PATH) ? SHARED_DAEMON_PATH : "(not present)"}`);
  if (!enabled) {
    log("");
    log(`Embeddings are DISABLED in user config. Run \`hivemind embeddings enable\` to opt in,`);
    log(`or \`hivemind embeddings install\` if the shared deps are not yet downloaded.`);
  } else if (!isSharedDepsInstalled()) {
    log("");
    warn(`Embeddings are enabled in config but shared deps are missing.`);
    warn(`Run \`hivemind embeddings install\` to download @huggingface/transformers.`);
  }
  log("");
  log(`Agent installs:`);
  const installs = findHivemindInstalls();
  if (installs.length === 0) {
    log(`  (none detected)`);
    return;
  }
  for (const inst of installs) {
    const state = linkStateFor(inst);
    let label;
    switch (state.kind) {
      case "linked-to-shared":
        label = "\u2713 linked \u2192 shared";
        break;
      case "no-node-modules":
        label = "\u2717 not linked";
        break;
      case "owns-own-node-modules":
        label = "\u25B3 has its own node_modules (not shared)";
        break;
      case "linked-elsewhere":
        label = `\u25B3 linked \u2192 ${state.target}`;
        break;
    }
    log(`  ${inst.id.padEnd(20)} ${label}`);
    log(`  ${" ".repeat(20)}   ${inst.pluginDir}`);
  }
}

// dist/src/cli/auth.js
import { existsSync as existsSync12 } from "node:fs";
import { join as join15 } from "node:path";

// dist/src/commands/auth.js
import { execSync } from "node:child_process";

// dist/src/utils/client-header.js
var DEEPLAKE_CLIENT_HEADER = "X-Deeplake-Client";
function deeplakeClientValue() {
  return "hivemind";
}
function deeplakeClientHeader() {
  return { [DEEPLAKE_CLIENT_HEADER]: deeplakeClientValue() };
}

// dist/src/commands/install-id.js
import { readFileSync as readFileSync10, writeFileSync as writeFileSync8, mkdirSync as mkdirSync3 } from "node:fs";
import { join as join13 } from "node:path";
import { homedir as homedir5 } from "node:os";
import { randomUUID } from "node:crypto";
function configDir() {
  return join13(homedir5(), ".deeplake");
}
function installIDPath() {
  return join13(configDir(), "install-id");
}
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function getOrCreateInstallID() {
  try {
    const value = readFileSync10(installIDPath(), "utf-8").trim();
    if (UUID_RE.test(value))
      return value;
  } catch {
  }
  const id = randomUUID();
  try {
    mkdirSync3(configDir(), { recursive: true, mode: 448 });
    writeFileSync8(installIDPath(), id, { mode: 384 });
    return id;
  } catch {
    return "";
  }
}
function hivemindInstallIDHeader() {
  const id = getOrCreateInstallID();
  if (!id)
    return {};
  return { "X-Hivemind-Install-Id": id };
}

// dist/src/commands/auth-creds.js
import { readFileSync as readFileSync11, writeFileSync as writeFileSync9, mkdirSync as mkdirSync4, unlinkSync as unlinkSync6 } from "node:fs";
import { join as join14 } from "node:path";
import { homedir as homedir6 } from "node:os";
function configDir2() {
  return join14(homedir6(), ".deeplake");
}
function credsPath() {
  return join14(configDir2(), "credentials.json");
}
function loadCredentials() {
  try {
    return JSON.parse(readFileSync11(credsPath(), "utf-8"));
  } catch {
    return null;
  }
}
function saveCredentials(creds) {
  mkdirSync4(configDir2(), { recursive: true, mode: 448 });
  writeFileSync9(credsPath(), JSON.stringify({ ...creds, savedAt: (/* @__PURE__ */ new Date()).toISOString() }, null, 2), { mode: 384 });
}
function deleteCredentials() {
  try {
    unlinkSync6(credsPath());
    return true;
  } catch {
    return false;
  }
}

// dist/src/commands/auth.js
var DEFAULT_API_URL = "https://api.deeplake.ai";
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3)
      return null;
    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4)
      payload += "=";
    return JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
  } catch {
    return null;
  }
}
async function apiGet(path5, token, apiUrl, orgId) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...deeplakeClientHeader()
  };
  if (orgId)
    headers["X-Activeloop-Org-Id"] = orgId;
  const resp = await fetch(`${apiUrl}${path5}`, { headers });
  if (!resp.ok)
    throw new Error(`API ${resp.status}: ${await resp.text().catch(() => "")}`);
  return resp.json();
}
async function apiPost(path5, body, token, apiUrl, orgId) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...deeplakeClientHeader()
  };
  if (orgId)
    headers["X-Activeloop-Org-Id"] = orgId;
  const resp = await fetch(`${apiUrl}${path5}`, { method: "POST", headers, body: JSON.stringify(body) });
  if (!resp.ok)
    throw new Error(`API ${resp.status}: ${await resp.text().catch(() => "")}`);
  return resp.json();
}
async function apiDelete(path5, token, apiUrl, orgId) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...deeplakeClientHeader()
  };
  if (orgId)
    headers["X-Activeloop-Org-Id"] = orgId;
  const resp = await fetch(`${apiUrl}${path5}`, { method: "DELETE", headers });
  if (!resp.ok)
    throw new Error(`API ${resp.status}: ${await resp.text().catch(() => "")}`);
}
async function requestDeviceCode(apiUrl = DEFAULT_API_URL) {
  const resp = await fetch(`${apiUrl}/auth/device/code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...deeplakeClientHeader(),
      ...hivemindInstallIDHeader()
    }
  });
  if (!resp.ok)
    throw new Error(`Device flow unavailable: HTTP ${resp.status}`);
  return resp.json();
}
async function pollForToken(deviceCode, apiUrl = DEFAULT_API_URL) {
  const resp = await fetch(`${apiUrl}/auth/device/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...deeplakeClientHeader(),
      ...hivemindInstallIDHeader()
    },
    body: JSON.stringify({ device_code: deviceCode })
  });
  if (resp.ok)
    return resp.json();
  if (resp.status === 400) {
    const err = await resp.json().catch(() => null);
    if (err?.error === "authorization_pending" || err?.error === "slow_down")
      return null;
    if (err?.error === "expired_token")
      throw new Error("Device code expired. Try again.");
    if (err?.error === "access_denied")
      throw new Error("Authorization denied.");
  }
  throw new Error(`Token polling failed: HTTP ${resp.status}`);
}
function openBrowser(url) {
  try {
    const cmd = process.platform === "darwin" ? `open "${url}"` : process.platform === "win32" ? `start "${url}"` : `xdg-open "${url}" 2>/dev/null`;
    execSync(cmd, { stdio: "ignore", timeout: 5e3 });
    return true;
  } catch {
    return false;
  }
}
async function deviceFlowLogin(apiUrl = DEFAULT_API_URL) {
  const code = await requestDeviceCode(apiUrl);
  const opened = openBrowser(code.verification_uri_complete);
  const msg = [
    "\nDeeplake Authentication",
    "\u2500".repeat(40),
    `
Open this URL: ${code.verification_uri_complete}`,
    `Or visit ${code.verification_uri} and enter code: ${code.user_code}`,
    opened ? "\nBrowser opened. Waiting for sign in..." : "\nWaiting for sign in..."
  ].join("\n");
  process.stderr.write(msg + "\n");
  const interval = Math.max(code.interval || 5, 5) * 1e3;
  const deadline = Date.now() + code.expires_in * 1e3;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, interval));
    const result = await pollForToken(code.device_code, apiUrl);
    if (result) {
      process.stderr.write("\nAuthentication successful!\n");
      return { token: result.access_token, expiresIn: result.expires_in };
    }
  }
  throw new Error("Device code expired.");
}
async function listOrgs(token, apiUrl = DEFAULT_API_URL) {
  const data = await apiGet("/organizations", token, apiUrl);
  return Array.isArray(data) ? data : [];
}
async function switchOrg(orgId, orgName) {
  const creds = loadCredentials();
  if (!creds)
    throw new Error("Not logged in. Run deeplake login first.");
  saveCredentials({ ...creds, orgId, orgName });
}
async function listWorkspaces(token, apiUrl = DEFAULT_API_URL, orgId) {
  const raw = await apiGet("/workspaces", token, apiUrl, orgId);
  const data = raw.data ?? raw;
  return Array.isArray(data) ? data : [];
}
async function switchWorkspace(workspaceId) {
  const creds = loadCredentials();
  if (!creds)
    throw new Error("Not logged in. Run deeplake login first.");
  saveCredentials({ ...creds, workspaceId });
}
async function inviteMember(username, accessMode, token, orgId, apiUrl = DEFAULT_API_URL) {
  await apiPost(`/organizations/${orgId}/members/invite`, { username, access_mode: accessMode }, token, apiUrl, orgId);
}
async function listMembers(token, orgId, apiUrl = DEFAULT_API_URL) {
  const data = await apiGet(`/organizations/${orgId}/members`, token, apiUrl, orgId);
  return data.members ?? [];
}
async function removeMember(userId, token, orgId, apiUrl = DEFAULT_API_URL) {
  await apiDelete(`/organizations/${orgId}/members/${userId}`, token, apiUrl, orgId);
}
async function saveCredentialsFromToken(token, apiUrl, opts = {}) {
  const user = await apiGet("/me", token, apiUrl);
  const userName = user.name || (user.email ? user.email.split("@")[0] : "unknown");
  process.stderr.write(`
Logged in as: ${userName}
`);
  const orgs = await listOrgs(token, apiUrl);
  if (orgs.length === 0)
    throw new Error("No organizations found for this account.");
  const envOrgId = process.env.HIVEMIND_ORG_ID;
  let preferredOrgId = envOrgId;
  if (!preferredOrgId && opts.skipTokenMint) {
    const claims = decodeJwtPayload(token);
    const claimOrg = claims && typeof claims.org_id === "string" ? claims.org_id : void 0;
    if (claimOrg)
      preferredOrgId = claimOrg;
  }
  let orgId;
  let orgName;
  const matched = preferredOrgId ? orgs.find((o) => o.id === preferredOrgId) : void 0;
  if (matched) {
    orgId = matched.id;
    orgName = matched.name;
    process.stderr.write(`Organization: ${orgName}
`);
  } else if (orgs.length === 1) {
    orgId = orgs[0].id;
    orgName = orgs[0].name;
    process.stderr.write(`Organization: ${orgName}
`);
  } else {
    process.stderr.write("\nOrganizations:\n");
    orgs.forEach((org, i) => process.stderr.write(`  ${i + 1}. ${org.name}
`));
    orgId = orgs[0].id;
    orgName = orgs[0].name;
    if (opts.skipTokenMint) {
      process.stderr.write(`
Using: ${orgName} (set HIVEMIND_ORG_ID to override)
`);
    } else {
      process.stderr.write(`
Using: ${orgName}
`);
    }
  }
  let apiToken = token;
  if (!opts.skipTokenMint) {
    const tokenName = `deeplake-plugin-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`;
    const tokenData = await apiPost("/users/me/tokens", {
      name: tokenName,
      duration: 365 * 24 * 3600,
      organization_id: orgId
    }, token, apiUrl);
    apiToken = tokenData.token.token;
  }
  const creds = {
    token: apiToken,
    orgId,
    orgName,
    userName,
    workspaceId: "default",
    apiUrl,
    savedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  saveCredentials(creds);
  return creds;
}
async function login(apiUrl = DEFAULT_API_URL) {
  const { token: authToken } = await deviceFlowLogin(apiUrl);
  return saveCredentialsFromToken(authToken, apiUrl, { skipTokenMint: false });
}

// dist/src/cli/auth.js
var DEFAULT_API_URL2 = "https://api.deeplake.ai";
function resolveApiUrl() {
  return process.env.HIVEMIND_API_URL ?? DEFAULT_API_URL2;
}
var CREDS_PATH = join15(HOME, ".deeplake", "credentials.json");
function isLoggedIn() {
  return existsSync12(CREDS_PATH) && loadCredentials() !== null;
}
async function ensureLoggedIn() {
  if (isLoggedIn())
    return true;
  log("");
  log("No Deeplake credentials found. Starting login...");
  try {
    await login(resolveApiUrl());
  } catch (err) {
    warn(`Login failed: ${err.message}`);
    return false;
  }
  return isLoggedIn();
}
async function loginWithProvidedToken(flagToken) {
  const token = flagToken ?? process.env.HIVEMIND_TOKEN;
  if (!token)
    return false;
  try {
    await saveCredentialsFromToken(token, resolveApiUrl(), { skipTokenMint: true });
    const source = flagToken ? "--token flag" : "HIVEMIND_TOKEN";
    log(`Signed in via ${source}.`);
    return true;
  } catch (err) {
    warn(`Token authentication failed: ${err.message}`);
    return false;
  }
}
async function maybeShowOrgChoice() {
  const creds = loadCredentials();
  if (!creds)
    return;
  try {
    const orgs = await listOrgs(creds.token, creds.apiUrl ?? "https://api.deeplake.ai");
    if (orgs.length <= 1)
      return;
    const activeName = creds.orgName ?? creds.orgId;
    log("");
    log(`You belong to ${orgs.length} orgs. Active: ${activeName}`);
    log(`  Change with: hivemind org switch <name-or-id>`);
  } catch {
  }
}

// dist/src/config.js
import { readFileSync as readFileSync12, existsSync as existsSync13 } from "node:fs";
import { join as join16 } from "node:path";
import { homedir as homedir7, userInfo as userInfo2 } from "node:os";
function loadConfig() {
  const home = homedir7();
  const credPath = join16(home, ".deeplake", "credentials.json");
  let creds = null;
  if (existsSync13(credPath)) {
    try {
      creds = JSON.parse(readFileSync12(credPath, "utf-8"));
    } catch {
      return null;
    }
  }
  const token = process.env.HIVEMIND_TOKEN ?? creds?.token;
  const orgId = process.env.HIVEMIND_ORG_ID ?? creds?.orgId;
  if (!token || !orgId)
    return null;
  return {
    token,
    orgId,
    orgName: creds?.orgName ?? orgId,
    userName: creds?.userName || userInfo2().username || "unknown",
    workspaceId: process.env.HIVEMIND_WORKSPACE_ID ?? creds?.workspaceId ?? "default",
    apiUrl: process.env.HIVEMIND_API_URL ?? creds?.apiUrl ?? "https://api.deeplake.ai",
    tableName: process.env.HIVEMIND_TABLE ?? "memory",
    sessionsTableName: process.env.HIVEMIND_SESSIONS_TABLE ?? "sessions",
    skillsTableName: process.env.HIVEMIND_SKILLS_TABLE ?? "skills",
    // Defaults match the table name written into the SQL — keep aligned
    // with RULES_COLUMNS / TASKS_COLUMNS / TASK_EVENTS_COLUMNS in
    // deeplake-schema.ts and with the e2e test-org override convention
    // (memory_test / sessions_test → goals_test, etc.) documented in
    // CLAUDE.md.
    rulesTableName: process.env.HIVEMIND_RULES_TABLE ?? "hivemind_rules",
    tasksTableName: process.env.HIVEMIND_TASKS_TABLE ?? "hivemind_tasks",
    taskEventsTableName: process.env.HIVEMIND_TASK_EVENTS_TABLE ?? "hivemind_task_events",
    // Goals + KPIs (refined design — VFS path classifier maps
    //   memory/goal/<user>/<status>/<uuid>.md → hivemind_goals row
    //   memory/kpi/<uuid>/<kpi_id>.md → hivemind_kpis row
    // See src/shell/deeplake-fs.ts for the translation logic and
    // GOALS_COLUMNS / KPIS_COLUMNS in deeplake-schema.ts for the
    // table shape.
    goalsTableName: process.env.HIVEMIND_GOALS_TABLE ?? "hivemind_goals",
    kpisTableName: process.env.HIVEMIND_KPIS_TABLE ?? "hivemind_kpis",
    codebaseTableName: process.env.HIVEMIND_CODEBASE_TABLE ?? "codebase",
    memoryPath: process.env.HIVEMIND_MEMORY_PATH ?? join16(home, ".deeplake", "memory")
  };
}

// dist/src/deeplake-api.js
import { randomUUID as randomUUID2 } from "node:crypto";

// dist/src/utils/debug.js
import { appendFileSync } from "node:fs";
import { join as join17 } from "node:path";
import { homedir as homedir8 } from "node:os";
var LOG = join17(homedir8(), ".deeplake", "hook-debug.log");
function isDebug() {
  return process.env.HIVEMIND_DEBUG === "1";
}
function log2(tag, msg) {
  if (!isDebug())
    return;
  appendFileSync(LOG, `${(/* @__PURE__ */ new Date()).toISOString()} [${tag}] ${msg}
`);
}

// dist/src/utils/sql.js
function sqlStr(value) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "''").replace(/\0/g, "").replace(/[\x01-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "");
}
function sqlIdent(name) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Invalid SQL identifier: ${JSON.stringify(name)}`);
  }
  return name;
}

// dist/src/embeddings/columns.js
var SUMMARY_EMBEDDING_COL = "summary_embedding";

// dist/src/deeplake-schema.js
var MEMORY_COLUMNS = Object.freeze([
  { name: "id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "path", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "filename", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "summary", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "summary_embedding", sql: "FLOAT4[]" },
  { name: "author", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "mime_type", sql: "TEXT NOT NULL DEFAULT 'text/plain'" },
  { name: "size_bytes", sql: "BIGINT NOT NULL DEFAULT 0" },
  { name: "project", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "description", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "agent", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "plugin_version", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "creation_date", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "last_update_date", sql: "TEXT NOT NULL DEFAULT ''" }
]);
var SESSIONS_COLUMNS = Object.freeze([
  { name: "id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "path", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "filename", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "message", sql: "JSONB" },
  { name: "message_embedding", sql: "FLOAT4[]" },
  { name: "author", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "mime_type", sql: "TEXT NOT NULL DEFAULT 'application/json'" },
  { name: "size_bytes", sql: "BIGINT NOT NULL DEFAULT 0" },
  { name: "project", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "description", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "agent", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "plugin_version", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "creation_date", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "last_update_date", sql: "TEXT NOT NULL DEFAULT ''" }
]);
var SKILLS_COLUMNS = Object.freeze([
  { name: "id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "name", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "project", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "project_key", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "local_path", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "install", sql: "TEXT NOT NULL DEFAULT 'project'" },
  { name: "source_sessions", sql: "TEXT NOT NULL DEFAULT '[]'" },
  { name: "source_agent", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "scope", sql: "TEXT NOT NULL DEFAULT 'me'" },
  { name: "author", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "contributors", sql: "TEXT NOT NULL DEFAULT '[]'" },
  { name: "description", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "trigger_text", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "body", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "version", sql: "BIGINT NOT NULL DEFAULT 1" },
  { name: "created_at", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "updated_at", sql: "TEXT NOT NULL DEFAULT ''" }
]);
var RULES_COLUMNS = Object.freeze([
  { name: "id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "rule_id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "text", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "scope", sql: "TEXT NOT NULL DEFAULT 'team'" },
  { name: "status", sql: "TEXT NOT NULL DEFAULT 'active'" },
  { name: "assigned_by", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "version", sql: "BIGINT NOT NULL DEFAULT 1" },
  { name: "created_at", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "agent", sql: "TEXT NOT NULL DEFAULT 'manual'" },
  { name: "plugin_version", sql: "TEXT NOT NULL DEFAULT ''" }
]);
var TASKS_COLUMNS = Object.freeze([
  { name: "id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "task_id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "text", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "scope", sql: "TEXT NOT NULL DEFAULT 'me'" },
  { name: "status", sql: "TEXT NOT NULL DEFAULT 'active'" },
  { name: "assigned_to", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "assigned_by", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "kpis", sql: "JSONB" },
  { name: "version", sql: "BIGINT NOT NULL DEFAULT 1" },
  { name: "created_at", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "agent", sql: "TEXT NOT NULL DEFAULT 'manual'" },
  { name: "plugin_version", sql: "TEXT NOT NULL DEFAULT ''" }
]);
var TASK_EVENTS_COLUMNS = Object.freeze([
  { name: "id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "task_id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "task_version", sql: "BIGINT NOT NULL DEFAULT 1" },
  { name: "kpi_id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "value", sql: "BIGINT NOT NULL DEFAULT 0" },
  { name: "note", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "source", sql: "TEXT NOT NULL DEFAULT 'user'" },
  { name: "agent", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "ts", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "plugin_version", sql: "TEXT NOT NULL DEFAULT ''" }
]);
var GOALS_COLUMNS = Object.freeze([
  { name: "id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "goal_id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "owner", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "status", sql: "TEXT NOT NULL DEFAULT 'opened'" },
  { name: "content", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "version", sql: "BIGINT NOT NULL DEFAULT 1" },
  { name: "created_at", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "agent", sql: "TEXT NOT NULL DEFAULT 'manual'" },
  { name: "plugin_version", sql: "TEXT NOT NULL DEFAULT ''" }
]);
var KPIS_COLUMNS = Object.freeze([
  { name: "id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "goal_id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "kpi_id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "content", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "version", sql: "BIGINT NOT NULL DEFAULT 1" },
  { name: "created_at", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "agent", sql: "TEXT NOT NULL DEFAULT 'manual'" },
  { name: "plugin_version", sql: "TEXT NOT NULL DEFAULT ''" }
]);
function validateSchema(label, cols) {
  const seen = /* @__PURE__ */ new Set();
  for (const col of cols) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(col.name)) {
      throw new Error(`${label}: column name "${col.name}" is not a valid SQL identifier`);
    }
    if (seen.has(col.name)) {
      throw new Error(`${label}: duplicate column "${col.name}"`);
    }
    seen.add(col.name);
    const notNull = /\bNOT\s+NULL\b/i.test(col.sql);
    const hasDefault = /\bDEFAULT\b/i.test(col.sql);
    if (notNull && !hasDefault) {
      throw new Error(`${label}: column "${col.name}" is NOT NULL but has no DEFAULT \u2014 ALTER TABLE ADD COLUMN on a populated table would fail.`);
    }
  }
}
var CODEBASE_COLUMNS = Object.freeze([
  // Identity key (matches the PK below)
  { name: "org_id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "workspace_id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "repo_slug", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "user_id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "worktree_id", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "commit_sha", sql: "TEXT NOT NULL DEFAULT ''" },
  // Observation metadata
  { name: "parent_sha", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "branch", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "ts", sql: "TIMESTAMP" },
  { name: "pushed_by", sql: "TEXT NOT NULL DEFAULT ''" },
  // Snapshot payload
  { name: "snapshot_sha256", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "snapshot_jsonb", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "node_count", sql: "BIGINT NOT NULL DEFAULT 0" },
  { name: "edge_count", sql: "BIGINT NOT NULL DEFAULT 0" },
  // Generator metadata (for drift diagnostics — what hivemind version produced this?)
  { name: "generator", sql: "TEXT NOT NULL DEFAULT 'hivemind-graph'" },
  { name: "generator_version", sql: "TEXT NOT NULL DEFAULT ''" },
  { name: "schema_version", sql: "BIGINT NOT NULL DEFAULT 1" }
]);
validateSchema("MEMORY_COLUMNS", MEMORY_COLUMNS);
validateSchema("SESSIONS_COLUMNS", SESSIONS_COLUMNS);
validateSchema("SKILLS_COLUMNS", SKILLS_COLUMNS);
validateSchema("RULES_COLUMNS", RULES_COLUMNS);
validateSchema("TASKS_COLUMNS", TASKS_COLUMNS);
validateSchema("TASK_EVENTS_COLUMNS", TASK_EVENTS_COLUMNS);
validateSchema("GOALS_COLUMNS", GOALS_COLUMNS);
validateSchema("KPIS_COLUMNS", KPIS_COLUMNS);
validateSchema("CODEBASE_COLUMNS", CODEBASE_COLUMNS);
function buildCreateTableSql(tableName, cols) {
  const safe = sqlIdent(tableName);
  const colSql = cols.map((c) => `${c.name} ${c.sql}`).join(", ");
  return `CREATE TABLE IF NOT EXISTS "${safe}" (${colSql}) USING deeplake`;
}
function buildIntrospectionSql(tableName, workspaceId) {
  return `SELECT column_name FROM information_schema.columns WHERE table_name = '${sqlStr(tableName)}' AND table_schema = '${sqlStr(workspaceId)}'`;
}
async function healMissingColumns(args) {
  const safeTable = sqlIdent(args.tableName);
  const introspectSql = buildIntrospectionSql(args.tableName, args.workspaceId);
  const rows = await args.query(introspectSql);
  const existing = /* @__PURE__ */ new Set();
  for (const row of rows) {
    const v = row?.column_name;
    if (typeof v === "string")
      existing.add(v.toLowerCase());
  }
  const missingCols = args.columns.filter((c) => !existing.has(c.name.toLowerCase()));
  const missing = missingCols.map((c) => c.name);
  if (missingCols.length === 0)
    return { missing, altered: [] };
  const altered = [];
  for (const col of missingCols) {
    try {
      await args.query(`ALTER TABLE "${safeTable}" ADD COLUMN ${col.name} ${col.sql}`);
      altered.push(col.name);
      args.log?.(`schema-heal: added "${args.tableName}"."${col.name}"`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!/already exists/i.test(msg))
        throw e;
      const recheck = await args.query(introspectSql);
      const present = recheck.some((r) => {
        const v = r?.column_name;
        return typeof v === "string" && v.toLowerCase() === col.name.toLowerCase();
      });
      if (!present)
        throw e;
      args.log?.(`schema-heal: "${args.tableName}"."${col.name}" appeared via race, treating as success`);
    }
  }
  return { missing, altered };
}
function isMissingTableError(message) {
  if (!message)
    return false;
  if (/permission denied|must be owner/i.test(message))
    return false;
  if (/\bcolumn\b/i.test(message))
    return false;
  return /Table does not exist|relation .* does not exist|no such table/i.test(message);
}

// dist/src/notifications/queue.js
import { readFileSync as readFileSync13, writeFileSync as writeFileSync10, renameSync as renameSync3, mkdirSync as mkdirSync5, openSync, closeSync, unlinkSync as unlinkSync7, statSync as statSync2 } from "node:fs";
import { join as join18, resolve } from "node:path";
import { homedir as homedir9 } from "node:os";
import { setTimeout as sleep } from "node:timers/promises";
var log3 = (msg) => log2("notifications-queue", msg);
var LOCK_RETRY_MAX = 50;
var LOCK_RETRY_BASE_MS = 5;
var LOCK_STALE_MS = 5e3;
function queuePath() {
  return join18(homedir9(), ".deeplake", "notifications-queue.json");
}
function lockPath() {
  return `${queuePath()}.lock`;
}
function readQueue() {
  try {
    const raw = readFileSync13(queuePath(), "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.queue)) {
      log3(`queue malformed \u2192 treating as empty`);
      return { queue: [] };
    }
    return { queue: parsed.queue };
  } catch {
    return { queue: [] };
  }
}
function _isQueuePathInsideHome(path5, home) {
  const r = resolve(path5);
  const h = resolve(home);
  return r.startsWith(h + "/") || r === h;
}
function writeQueue(q) {
  const path5 = queuePath();
  const home = resolve(homedir9());
  if (!_isQueuePathInsideHome(path5, home)) {
    throw new Error(`notifications-queue write blocked: ${path5} is outside ${home}`);
  }
  mkdirSync5(join18(home, ".deeplake"), { recursive: true, mode: 448 });
  const tmp = `${path5}.${process.pid}.tmp`;
  writeFileSync10(tmp, JSON.stringify(q, null, 2), { mode: 384 });
  renameSync3(tmp, path5);
}
async function withQueueLock(fn) {
  const path5 = lockPath();
  mkdirSync5(join18(homedir9(), ".deeplake"), { recursive: true, mode: 448 });
  let fd = null;
  for (let attempt = 0; attempt < LOCK_RETRY_MAX; attempt++) {
    try {
      fd = openSync(path5, "wx", 384);
      break;
    } catch (e) {
      const code = e.code;
      if (code !== "EEXIST")
        throw e;
      try {
        const age = Date.now() - statSync2(path5).mtimeMs;
        if (age > LOCK_STALE_MS) {
          unlinkSync7(path5);
          continue;
        }
      } catch {
      }
      const delay = LOCK_RETRY_BASE_MS * (attempt + 1);
      await sleep(delay);
    }
  }
  if (fd === null) {
    log3(`lock acquisition gave up after ${LOCK_RETRY_MAX} attempts \u2014 proceeding unlocked (last-writer-wins)`);
    return fn();
  }
  try {
    return fn();
  } finally {
    try {
      closeSync(fd);
    } catch {
    }
    try {
      unlinkSync7(path5);
    } catch {
    }
  }
}
function sameDedupKey(a, b) {
  if (a.id !== b.id)
    return false;
  return JSON.stringify(a.dedupKey) === JSON.stringify(b.dedupKey);
}
async function enqueueNotification(n) {
  await withQueueLock(() => {
    const q = readQueue();
    if (q.queue.some((existing) => sameDedupKey(existing, n))) {
      return;
    }
    q.queue.push(n);
    writeQueue(q);
  });
}

// dist/src/deeplake-api.js
var indexMarkerStorePromise = null;
function getIndexMarkerStore() {
  if (!indexMarkerStorePromise)
    indexMarkerStorePromise = Promise.resolve().then(() => (init_index_marker_store(), index_marker_store_exports));
  return indexMarkerStorePromise;
}
var log4 = (msg) => log2("sdk", msg);
function summarizeSql(sql, maxLen = 220) {
  const compact = sql.replace(/\s+/g, " ").trim();
  return compact.length > maxLen ? `${compact.slice(0, maxLen)}...` : compact;
}
function traceSql(msg) {
  const traceEnabled = process.env.HIVEMIND_TRACE_SQL === "1" || process.env.HIVEMIND_DEBUG === "1";
  if (!traceEnabled)
    return;
  process.stderr.write(`[deeplake-sql] ${msg}
`);
  if (process.env.HIVEMIND_DEBUG === "1")
    log4(msg);
}
var _signalledBalanceExhausted = false;
function maybeSignalBalanceExhausted(status, bodyText) {
  if (status !== 402)
    return;
  if (!bodyText.includes("balance_cents"))
    return;
  if (_signalledBalanceExhausted)
    return;
  _signalledBalanceExhausted = true;
  log4(`balance exhausted \u2014 enqueuing session-start banner (body=${bodyText.slice(0, 120)})`);
  enqueueNotification({
    id: "balance-exhausted",
    severity: "warn",
    transient: true,
    title: "Hivemind credits exhausted \u2014 top up to keep capturing",
    body: `Sessions are not being saved and memory recall is returning empty. Top up at ${billingUrl()} to restore capture and recall.`,
    dedupKey: { reason: "balance-zero" }
  }).catch((e) => {
    log4(`enqueue balance-exhausted failed: ${e instanceof Error ? e.message : String(e)}`);
  });
}
function billingUrl() {
  try {
    const c = loadCredentials();
    if (c?.orgName && c?.workspaceId) {
      return `https://deeplake.ai/${encodeURIComponent(c.orgName)}/workspace/${encodeURIComponent(c.workspaceId)}/billing`;
    }
  } catch {
  }
  return "https://deeplake.ai";
}
var RETRYABLE_CODES = /* @__PURE__ */ new Set([429, 500, 502, 503, 504]);
var MAX_RETRIES = 3;
var BASE_DELAY_MS = 500;
var MAX_CONCURRENCY = 5;
function getQueryTimeoutMs() {
  return Number(process.env.HIVEMIND_QUERY_TIMEOUT_MS ?? 1e4);
}
function sleep2(ms) {
  return new Promise((resolve9) => setTimeout(resolve9, ms));
}
function isTimeoutError(error) {
  const name = error instanceof Error ? error.name.toLowerCase() : "";
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return name.includes("timeout") || name === "aborterror" || message.includes("timeout") || message.includes("timed out");
}
function isDuplicateIndexError(error) {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return message.includes("duplicate key value violates unique constraint") || message.includes("pg_class_relname_nsp_index") || message.includes("already exists");
}
function isSessionInsertQuery(sql) {
  return /^\s*insert\s+into\s+"[^"]+"\s*\(\s*id\s*,\s*path\s*,\s*filename\s*,\s*message\s*,/i.test(sql);
}
function isTransientHtml403(text) {
  const body = text.toLowerCase();
  return body.includes("<html") || body.includes("403 forbidden") || body.includes("cloudflare") || body.includes("nginx");
}
var Semaphore = class {
  max;
  waiting = [];
  active = 0;
  constructor(max) {
    this.max = max;
  }
  async acquire() {
    if (this.active < this.max) {
      this.active++;
      return;
    }
    await new Promise((resolve9) => this.waiting.push(resolve9));
  }
  release() {
    this.active--;
    const next = this.waiting.shift();
    if (next) {
      this.active++;
      next();
    }
  }
};
var DeeplakeApi = class {
  token;
  apiUrl;
  orgId;
  workspaceId;
  tableName;
  _pendingRows = [];
  _sem = new Semaphore(MAX_CONCURRENCY);
  _tablesCache = null;
  constructor(token, apiUrl, orgId, workspaceId, tableName) {
    this.token = token;
    this.apiUrl = apiUrl;
    this.orgId = orgId;
    this.workspaceId = workspaceId;
    this.tableName = tableName;
  }
  /** Execute SQL with retry on transient errors and bounded concurrency. */
  async query(sql) {
    const startedAt = Date.now();
    const summary = summarizeSql(sql);
    traceSql(`query start: ${summary}`);
    await this._sem.acquire();
    try {
      const rows = await this._queryWithRetry(sql);
      traceSql(`query ok (${Date.now() - startedAt}ms, rows=${rows.length}): ${summary}`);
      return rows;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      traceSql(`query fail (${Date.now() - startedAt}ms): ${summary} :: ${message}`);
      throw e;
    } finally {
      this._sem.release();
    }
  }
  async _queryWithRetry(sql) {
    let lastError;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      let resp;
      const timeoutMs = getQueryTimeoutMs();
      try {
        const signal = AbortSignal.timeout(timeoutMs);
        resp = await fetch(`${this.apiUrl}/workspaces/${this.workspaceId}/tables/query`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            "X-Activeloop-Org-Id": this.orgId,
            ...deeplakeClientHeader()
          },
          signal,
          body: JSON.stringify({ query: sql })
        });
      } catch (e) {
        if (isTimeoutError(e)) {
          lastError = new Error(`Query timeout after ${timeoutMs}ms`);
          throw lastError;
        }
        lastError = e instanceof Error ? e : new Error(String(e));
        if (attempt < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 200;
          log4(`query retry ${attempt + 1}/${MAX_RETRIES} (fetch error: ${lastError.message}) in ${delay.toFixed(0)}ms`);
          await sleep2(delay);
          continue;
        }
        throw lastError;
      }
      if (resp.ok) {
        const raw = await resp.json();
        if (!raw?.rows || !raw?.columns)
          return [];
        return raw.rows.map((row) => Object.fromEntries(raw.columns.map((col, i) => [col, row[i]])));
      }
      const text = await resp.text().catch(() => "");
      const retryable403 = isSessionInsertQuery(sql) && (resp.status === 401 || resp.status === 403 && (text.length === 0 || isTransientHtml403(text)));
      const alreadyExists = resp.status === 500 && isDuplicateIndexError(text);
      if (!alreadyExists && attempt < MAX_RETRIES && (RETRYABLE_CODES.has(resp.status) || retryable403)) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 200;
        log4(`query retry ${attempt + 1}/${MAX_RETRIES} (${resp.status}) in ${delay.toFixed(0)}ms`);
        await sleep2(delay);
        continue;
      }
      maybeSignalBalanceExhausted(resp.status, text);
      throw new Error(`Query failed: ${resp.status}: ${text.slice(0, 200)}`);
    }
    throw lastError ?? new Error("Query failed: max retries exceeded");
  }
  // ── Writes ──────────────────────────────────────────────────────────────────
  /** Queue rows for writing. Call commit() to flush. */
  appendRows(rows) {
    this._pendingRows.push(...rows);
  }
  /** Flush pending rows via SQL. */
  async commit() {
    if (this._pendingRows.length === 0)
      return;
    const rows = this._pendingRows;
    this._pendingRows = [];
    const CONCURRENCY = 10;
    for (let i = 0; i < rows.length; i += CONCURRENCY) {
      const chunk = rows.slice(i, i + CONCURRENCY);
      await Promise.allSettled(chunk.map((r) => this.upsertRowSql(r)));
    }
    log4(`commit: ${rows.length} rows`);
  }
  async upsertRowSql(row) {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    const cd = row.creationDate ?? ts;
    const lud = row.lastUpdateDate ?? ts;
    const exists = await this.query(`SELECT path FROM "${this.tableName}" WHERE path = '${sqlStr(row.path)}' LIMIT 1`);
    if (exists.length > 0) {
      let setClauses = `summary = E'${sqlStr(row.contentText)}', ${SUMMARY_EMBEDDING_COL} = NULL, mime_type = '${sqlStr(row.mimeType)}', size_bytes = ${row.sizeBytes}, last_update_date = '${lud}'`;
      if (row.project !== void 0)
        setClauses += `, project = '${sqlStr(row.project)}'`;
      if (row.description !== void 0)
        setClauses += `, description = '${sqlStr(row.description)}'`;
      await this.query(`UPDATE "${this.tableName}" SET ${setClauses} WHERE path = '${sqlStr(row.path)}'`);
    } else {
      const id = randomUUID2();
      let cols = `id, path, filename, summary, ${SUMMARY_EMBEDDING_COL}, mime_type, size_bytes, creation_date, last_update_date`;
      let vals = `'${id}', '${sqlStr(row.path)}', '${sqlStr(row.filename)}', E'${sqlStr(row.contentText)}', NULL, '${sqlStr(row.mimeType)}', ${row.sizeBytes}, '${cd}', '${lud}'`;
      if (row.project !== void 0) {
        cols += ", project";
        vals += `, '${sqlStr(row.project)}'`;
      }
      if (row.description !== void 0) {
        cols += ", description";
        vals += `, '${sqlStr(row.description)}'`;
      }
      await this.query(`INSERT INTO "${this.tableName}" (${cols}) VALUES (${vals})`);
    }
  }
  /** Update specific columns on a row by path. */
  async updateColumns(path5, columns) {
    const setClauses = Object.entries(columns).map(([col, val]) => typeof val === "number" ? `${col} = ${val}` : `${col} = '${sqlStr(String(val))}'`).join(", ");
    await this.query(`UPDATE "${this.tableName}" SET ${setClauses} WHERE path = '${sqlStr(path5)}'`);
  }
  // ── Convenience ─────────────────────────────────────────────────────────────
  /** Create a BM25 search index on a column. */
  async createIndex(column) {
    await this.query(`CREATE INDEX IF NOT EXISTS idx_${sqlStr(column)}_bm25 ON "${this.tableName}" USING deeplake_index ("${column}")`);
  }
  buildLookupIndexName(table, suffix) {
    return `idx_${table}_${suffix}`.replace(/[^a-zA-Z0-9_]/g, "_");
  }
  async ensureLookupIndex(table, suffix, columnsSql) {
    const markers = await getIndexMarkerStore();
    const markerPath = markers.buildIndexMarkerPath(this.workspaceId, this.orgId, table, suffix);
    if (markers.hasFreshIndexMarker(markerPath))
      return;
    const indexName = this.buildLookupIndexName(table, suffix);
    try {
      await this.query(`CREATE INDEX IF NOT EXISTS "${indexName}" ON "${table}" ${columnsSql}`);
      markers.writeIndexMarker(markerPath);
    } catch (e) {
      if (isDuplicateIndexError(e)) {
        markers.writeIndexMarker(markerPath);
        return;
      }
      log4(`index "${indexName}" skipped: ${e.message}`);
    }
  }
  /**
   * Heal any missing columns on a table so it matches one of the schema
   * definitions in `deeplake-schema.ts`. One SELECT against
   * `information_schema.columns` per call, then `ALTER TABLE ADD COLUMN`
   * only the genuinely missing ones — never blanket, never `IF NOT
   * EXISTS`.
   *
   * History: an earlier path used a local marker file (`col_<name>` under
   * the index-marker dir) to skip even the SELECT after the first
   * confirmation, plus per-column ALTERs for `summary_embedding`,
   * `message_embedding`, `agent`, `plugin_version`. The marker existed
   * because Deeplake used to expose a ~30s post-ALTER bug where
   * subsequent INSERTs failed, so we wanted to keep ALTER traffic to a
   * minimum. The bug was re-verified on 2026-05-18 against
   * `api.deeplake.ai` (`test_plugin` org) and no longer reproduces
   * (71/71 INSERTs OK, first success 2ms after ALTER). The single SELECT
   * + targeted ALTER pattern survives the marker removal because: each
   * ALTER still costs ~800ms (so blanket sweeps are wasteful) and the
   * diff produces clearer logs than "ALTER all with IF NOT EXISTS".
   */
  async healSchema(table, columns) {
    await healMissingColumns({
      query: (sql) => this.query(sql),
      tableName: table,
      workspaceId: this.workspaceId,
      columns,
      log: log4
    });
  }
  /** List all tables in the workspace (with retry). */
  async listTables(forceRefresh = false) {
    if (!forceRefresh && this._tablesCache)
      return [...this._tablesCache];
    const { tables, cacheable } = await this._fetchTables();
    if (cacheable)
      this._tablesCache = [...tables];
    return tables;
  }
  async _fetchTables() {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const resp = await fetch(`${this.apiUrl}/workspaces/${this.workspaceId}/tables`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "X-Activeloop-Org-Id": this.orgId,
            ...deeplakeClientHeader()
          }
        });
        if (resp.ok) {
          const data = await resp.json();
          return {
            tables: (data.tables ?? []).map((t) => t.table_name),
            cacheable: true
          };
        }
        if (attempt < MAX_RETRIES && RETRYABLE_CODES.has(resp.status)) {
          await sleep2(BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 200);
          continue;
        }
        return { tables: [], cacheable: false };
      } catch {
        if (attempt < MAX_RETRIES) {
          await sleep2(BASE_DELAY_MS * Math.pow(2, attempt));
          continue;
        }
        return { tables: [], cacheable: false };
      }
    }
    return { tables: [], cacheable: false };
  }
  /**
   * Run a `CREATE TABLE` with an extra outer retry budget. The base
   * `query()` already retries 3 times on fetch errors (~3.5s total), but a
   * failed CREATE is permanent corruption — every subsequent SELECT against
   * the missing table fails. Wrapping in an outer loop with longer backoff
   * (2s, 5s, then 10s) gives us ~17s of reach across transient network
   * blips before giving up. Failures still propagate; getApi() resets its
   * cache on init failure (openclaw plugin) so the next call retries the
   * whole init flow.
   */
  async createTableWithRetry(sql, label) {
    const OUTER_BACKOFFS_MS = [2e3, 5e3, 1e4];
    let lastErr = null;
    for (let attempt = 0; attempt <= OUTER_BACKOFFS_MS.length; attempt++) {
      try {
        await this.query(sql);
        return;
      } catch (err) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : String(err);
        log4(`CREATE TABLE "${label}" attempt ${attempt + 1}/${OUTER_BACKOFFS_MS.length + 1} failed: ${msg}`);
        if (attempt < OUTER_BACKOFFS_MS.length) {
          await sleep2(OUTER_BACKOFFS_MS[attempt]);
        }
      }
    }
    throw lastErr;
  }
  /** Create the memory table if it doesn't already exist. Heal missing columns on existing tables. */
  async ensureTable(name) {
    if (!MEMORY_COLUMNS.some((c) => c.name === SUMMARY_EMBEDDING_COL)) {
      throw new Error(`MEMORY_COLUMNS missing "${SUMMARY_EMBEDDING_COL}" (embeddings/columns.ts drift)`);
    }
    const tbl = sqlIdent(name ?? this.tableName);
    const tables = await this.listTables();
    if (!tables.includes(tbl)) {
      log4(`table "${tbl}" not found, creating`);
      await this.createTableWithRetry(buildCreateTableSql(tbl, MEMORY_COLUMNS), tbl);
      log4(`table "${tbl}" created`);
      if (!tables.includes(tbl))
        this._tablesCache = [...tables, tbl];
    }
    await this.healSchema(tbl, MEMORY_COLUMNS);
  }
  /** Create the sessions table (uses JSONB for message since every row is a JSON event). */
  async ensureSessionsTable(name) {
    const safe = sqlIdent(name);
    const tables = await this.listTables();
    if (!tables.includes(safe)) {
      log4(`table "${safe}" not found, creating`);
      await this.createTableWithRetry(buildCreateTableSql(safe, SESSIONS_COLUMNS), safe);
      log4(`table "${safe}" created`);
      if (!tables.includes(safe))
        this._tablesCache = [...tables, safe];
    }
    await this.healSchema(safe, SESSIONS_COLUMNS);
    await this.ensureLookupIndex(safe, "path_creation_date", `("path", "creation_date")`);
  }
  /**
   * Create the skills table.
   *
   * One row per skill version. Workers INSERT a fresh row on every KEEP /
   * MERGE rather than UPDATE-ing in place, so the full version history is
   * recoverable. Uniqueness in the *current* state is by (project_key, name)
   * — newer rows shadow older ones at read time (ORDER BY version DESC).
   * This sidesteps the Deeplake UPDATE-coalescing quirk that bit the wiki
   * worker.
   */
  /**
   * Create the codebase table. One row per (org, workspace, repo, user,
   * worktree, commit) — see CODEBASE_COLUMNS for the schema. Healing
   * + index follow the same pattern as ensureSessionsTable.
   */
  async ensureCodebaseTable(name) {
    const safe = sqlIdent(name);
    const tables = await this.listTables();
    if (!tables.includes(safe)) {
      log4(`table "${safe}" not found, creating`);
      await this.createTableWithRetry(buildCreateTableSql(safe, CODEBASE_COLUMNS), safe);
      log4(`table "${safe}" created`);
      if (!tables.includes(safe))
        this._tablesCache = [...tables, safe];
    }
    await this.healSchema(safe, CODEBASE_COLUMNS);
    await this.ensureLookupIndex(safe, "codebase_identity", `("org_id", "workspace_id", "repo_slug", "user_id", "worktree_id", "commit_sha")`);
  }
  async ensureSkillsTable(name) {
    const safe = sqlIdent(name);
    const tables = await this.listTables();
    if (!tables.includes(safe)) {
      log4(`table "${safe}" not found, creating`);
      await this.createTableWithRetry(buildCreateTableSql(safe, SKILLS_COLUMNS), safe);
      log4(`table "${safe}" created`);
      if (!tables.includes(safe))
        this._tablesCache = [...tables, safe];
    }
    await this.healSchema(safe, SKILLS_COLUMNS);
    await this.ensureLookupIndex(safe, "project_key_name", `("project_key", "name")`);
  }
  /**
   * Create the rules table.
   *
   * One row per rule version (same write pattern as skills): edits INSERT
   * a fresh row with version+1, reads pick latest per rule_id via
   * `ORDER BY version DESC LIMIT 1`. Sidesteps the Deeplake
   * UPDATE-coalescing quirk by never UPDATEing.
   */
  async ensureRulesTable(name) {
    const safe = sqlIdent(name);
    const tables = await this.listTables();
    if (!tables.includes(safe)) {
      log4(`table "${safe}" not found, creating`);
      await this.createTableWithRetry(buildCreateTableSql(safe, RULES_COLUMNS), safe);
      log4(`table "${safe}" created`);
      if (!tables.includes(safe))
        this._tablesCache = [...tables, safe];
    }
    await this.healSchema(safe, RULES_COLUMNS);
    await this.ensureLookupIndex(safe, "rule_id_version", `("rule_id", "version")`);
  }
  /**
   * Create the tasks table.
   *
   * Same write pattern as rules + skills. `kpis` is a nullable JSONB
   * column with the agent's KPI metadata; KPI current values come from
   * `task_events` (SUM(value)), not this snapshot.
   */
  async ensureTasksTable(name) {
    const safe = sqlIdent(name);
    const tables = await this.listTables();
    if (!tables.includes(safe)) {
      log4(`table "${safe}" not found, creating`);
      await this.createTableWithRetry(buildCreateTableSql(safe, TASKS_COLUMNS), safe);
      log4(`table "${safe}" created`);
      if (!tables.includes(safe))
        this._tablesCache = [...tables, safe];
    }
    await this.healSchema(safe, TASKS_COLUMNS);
    await this.ensureLookupIndex(safe, "task_id_version", `("task_id", "version")`);
  }
  /**
   * Create the task-events table.
   *
   * Append-only. Every INSERT is a fresh row; never UPDATE. KPI current
   * value is `SUM(value) WHERE task_id=? AND kpi_id=?`. Index on
   * (task_id, kpi_id) is the canonical aggregation key.
   */
  async ensureTaskEventsTable(name) {
    const safe = sqlIdent(name);
    const tables = await this.listTables();
    if (!tables.includes(safe)) {
      log4(`table "${safe}" not found, creating`);
      await this.createTableWithRetry(buildCreateTableSql(safe, TASK_EVENTS_COLUMNS), safe);
      log4(`table "${safe}" created`);
      if (!tables.includes(safe))
        this._tablesCache = [...tables, safe];
    }
    await this.healSchema(safe, TASK_EVENTS_COLUMNS);
    await this.ensureLookupIndex(safe, "task_id_kpi_id", `("task_id", "kpi_id")`);
  }
  /**
   * Create the goals table.
   *
   * Backed by the VFS path convention memory/goal/<owner>/<status>/<goal_id>.md.
   * INSERT-only version-bumped: rm and mv operations translate to fresh
   * v=N+1 rows (status flips for mv → closed; rm is the same soft-close).
   * The (goal_id, version) index lets the VFS dispatch a cheap latest-row
   * read on cat / Read of a single goal.
   */
  async ensureGoalsTable(name) {
    const safe = sqlIdent(name);
    const tables = await this.listTables();
    if (!tables.includes(safe)) {
      log4(`table "${safe}" not found, creating`);
      await this.createTableWithRetry(buildCreateTableSql(safe, GOALS_COLUMNS), safe);
      log4(`table "${safe}" created`);
      if (!tables.includes(safe))
        this._tablesCache = [...tables, safe];
    }
    await this.healSchema(safe, GOALS_COLUMNS);
    await this.ensureLookupIndex(safe, "goal_id_version", `("goal_id", "version")`);
    await this.ensureLookupIndex(safe, "owner_status", `("owner", "status")`);
  }
  /**
   * Create the kpis table.
   *
   * Backed by memory/kpi/<goal_id>/<kpi_id>.md. KPI rows do NOT carry
   * owner — ownership derives from the parent goal via logical join on
   * goal_id. INSERT-only version-bumped. (goal_id, kpi_id) index is the
   * canonical lookup the VFS uses on Read and Write.
   */
  async ensureKpisTable(name) {
    const safe = sqlIdent(name);
    const tables = await this.listTables();
    if (!tables.includes(safe)) {
      log4(`table "${safe}" not found, creating`);
      await this.createTableWithRetry(buildCreateTableSql(safe, KPIS_COLUMNS), safe);
      log4(`table "${safe}" created`);
      if (!tables.includes(safe))
        this._tablesCache = [...tables, safe];
    }
    await this.healSchema(safe, KPIS_COLUMNS);
    await this.ensureLookupIndex(safe, "goal_id_kpi_id", `("goal_id", "kpi_id")`);
  }
};

// dist/src/commands/session-prune.js
function parseArgs(argv) {
  let before;
  let sessionId;
  let all = false;
  let yes = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--before" && argv[i + 1]) {
      before = argv[++i];
    } else if (arg === "--session-id" && argv[i + 1]) {
      sessionId = argv[++i];
    } else if (arg === "--all") {
      all = true;
    } else if (arg === "--yes" || arg === "-y") {
      yes = true;
    }
  }
  return { before, sessionId, all, yes };
}
function extractSessionId(path5) {
  const m = path5.match(/\/sessions\/[^/]+\/[^/]+_([^.]+)\.jsonl$/);
  return m ? m[1] : path5.split("/").pop()?.replace(/\.jsonl$/, "") ?? path5;
}
async function listSessions(api, sessionsTable, author) {
  const rows = await api.query(`SELECT path, COUNT(*) as cnt, MIN(creation_date) as first_event, MAX(creation_date) as last_event, MAX(project) as project FROM "${sessionsTable}" WHERE author = '${sqlStr(author)}' GROUP BY path ORDER BY first_event DESC`);
  return rows.map((r) => ({
    path: String(r.path),
    rowCount: Number(r.cnt),
    firstEvent: String(r.first_event),
    lastEvent: String(r.last_event),
    project: String(r.project ?? "")
  }));
}
async function deleteSessions(config, sessionPaths) {
  if (sessionPaths.length === 0)
    return { sessionsDeleted: 0, summariesDeleted: 0 };
  const sessionsApi = new DeeplakeApi(config.token, config.apiUrl, config.orgId, config.workspaceId, config.sessionsTableName);
  const memoryApi = new DeeplakeApi(config.token, config.apiUrl, config.orgId, config.workspaceId, config.tableName);
  let sessionsDeleted = 0;
  let summariesDeleted = 0;
  for (const sessionPath of sessionPaths) {
    await sessionsApi.query(`DELETE FROM "${config.sessionsTableName}" WHERE path = '${sqlStr(sessionPath)}'`);
    sessionsDeleted++;
    const sessionId = extractSessionId(sessionPath);
    const summaryPath = `/summaries/${config.userName}/${sessionId}.md`;
    const existing = await memoryApi.query(`SELECT path FROM "${config.tableName}" WHERE path = '${sqlStr(summaryPath)}' LIMIT 1`);
    if (existing.length > 0) {
      await memoryApi.query(`DELETE FROM "${config.tableName}" WHERE path = '${sqlStr(summaryPath)}'`);
      summariesDeleted++;
    }
  }
  return { sessionsDeleted, summariesDeleted };
}
async function sessionPrune(argv) {
  const config = loadConfig();
  if (!config) {
    console.error("Not logged in. Run: deeplake login");
    process.exit(1);
  }
  const { before, sessionId, all, yes } = parseArgs(argv);
  const author = config.userName;
  const sessionsApi = new DeeplakeApi(config.token, config.apiUrl, config.orgId, config.workspaceId, config.sessionsTableName);
  const sessions = await listSessions(sessionsApi, config.sessionsTableName, author);
  if (sessions.length === 0) {
    console.log(`No sessions found for author "${author}".`);
    return;
  }
  let targets;
  if (sessionId) {
    targets = sessions.filter((s) => extractSessionId(s.path) === sessionId);
    if (targets.length === 0) {
      console.error(`Session not found: ${sessionId}`);
      console.error(`
Your sessions:`);
      for (const s of sessions.slice(0, 10)) {
        console.error(`  ${extractSessionId(s.path)}  ${s.firstEvent.slice(0, 10)}  ${s.project}`);
      }
      process.exit(1);
    }
  } else if (before) {
    const cutoff = new Date(before);
    if (isNaN(cutoff.getTime())) {
      console.error(`Invalid date: ${before}`);
      process.exit(1);
    }
    targets = sessions.filter((s) => new Date(s.lastEvent) < cutoff);
  } else if (all) {
    targets = sessions;
  } else {
    console.log(`Sessions for "${author}" (${sessions.length} total):
`);
    console.log("  Session ID".padEnd(42) + "Date".padEnd(14) + "Events".padEnd(10) + "Project");
    console.log("  " + "\u2500".repeat(80));
    for (const s of sessions) {
      const id = extractSessionId(s.path);
      const date = s.firstEvent.slice(0, 10);
      console.log(`  ${id.padEnd(40)}${date.padEnd(14)}${String(s.rowCount).padEnd(10)}${s.project}`);
    }
    console.log(`
To delete, use: --all, --before <date>, or --session-id <id>`);
    return;
  }
  if (targets.length === 0) {
    console.log("No sessions match the given criteria.");
    return;
  }
  console.log(`Will delete ${targets.length} session(s) for "${author}":
`);
  for (const s of targets) {
    const id = extractSessionId(s.path);
    console.log(`  ${id}  ${s.firstEvent.slice(0, 10)}  ${s.rowCount} events  ${s.project}`);
  }
  console.log();
  if (!yes) {
    const ok = await confirm("Proceed with deletion?", false);
    if (!ok) {
      console.log("Aborted.");
      return;
    }
  }
  const { sessionsDeleted, summariesDeleted } = await deleteSessions(config, targets.map((t) => t.path));
  console.log(`Deleted ${sessionsDeleted} session(s) and ${summariesDeleted} summary file(s).`);
}

// dist/src/commands/auth-login.js
async function runAuthCommand(args) {
  const cmd = args[0] ?? "whoami";
  const creds = loadCredentials();
  const apiUrl = creds?.apiUrl ?? "https://api.deeplake.ai";
  switch (cmd) {
    case "login": {
      await login(apiUrl);
      break;
    }
    case "whoami": {
      if (!creds) {
        console.log("Not logged in. Run: hivemind login");
        break;
      }
      console.log(`User org: ${creds.orgName ?? creds.orgId}`);
      console.log(`Workspace: ${creds.workspaceId ?? "default"}`);
      console.log(`API: ${creds.apiUrl ?? "https://api.deeplake.ai"}`);
      break;
    }
    case "org": {
      if (!creds) {
        console.log("Not logged in.");
        process.exit(1);
      }
      const sub = args[1];
      if (sub === "list") {
        const orgs = await listOrgs(creds.token, apiUrl);
        orgs.forEach((o) => console.log(`${o.id}  ${o.name}`));
      } else if (sub === "switch") {
        const target = args[2];
        if (!target) {
          console.log("Usage: org switch <org-name-or-id>");
          process.exit(1);
        }
        const orgs = await listOrgs(creds.token, apiUrl);
        const match = orgs.find((o) => o.id === target || o.name.toLowerCase() === target.toLowerCase());
        if (!match) {
          console.log(`Org not found: ${target}`);
          process.exit(1);
        }
        const prevWs = creds.workspaceId ?? "default";
        const lcPrev = prevWs.toLowerCase();
        const wsList = await listWorkspaces(creds.token, apiUrl, match.id);
        const matchedWs = wsList.find((w) => w.id === prevWs || w.name && w.name.toLowerCase() === lcPrev);
        await switchOrg(match.id, match.name);
        console.log(`Switched to org: ${match.name}`);
        if (!matchedWs) {
          if (prevWs !== "default") {
            await switchWorkspace("default");
            console.log(`Workspace '${prevWs}' is not in org '${match.name}'. Reset workspace to 'default'.`);
            if (wsList.length > 0) {
              console.log(`Available workspaces: ${wsList.map((w) => w.name || w.id).join(", ")}`);
            }
          }
        } else if (matchedWs.id !== prevWs) {
          await switchWorkspace(matchedWs.id);
          console.log(`Workspace name '${prevWs}' resolved to id '${matchedWs.id}' in org '${match.name}'.`);
        }
      } else {
        console.log("Usage: org list | org switch <name-or-id>");
      }
      break;
    }
    case "workspaces": {
      if (!creds) {
        console.log("Not logged in.");
        process.exit(1);
      }
      const ws = await listWorkspaces(creds.token, apiUrl, creds.orgId);
      ws.forEach((w) => console.log(w.name || w.id));
      break;
    }
    case "workspace": {
      if (!creds) {
        console.log("Not logged in.");
        process.exit(1);
      }
      const sub = args[1];
      if (sub === "list") {
        const wsList = await listWorkspaces(creds.token, apiUrl, creds.orgId);
        wsList.forEach((w) => console.log(w.name || w.id));
        break;
      }
      if (sub === "switch") {
        const target = args[2];
        if (!target) {
          console.log("Usage: workspace switch <name-or-id>");
          process.exit(1);
        }
        const wsList = await listWorkspaces(creds.token, apiUrl, creds.orgId);
        const lcTarget = target.toLowerCase();
        const match = wsList.find((w) => w.id === target || w.name && w.name.toLowerCase() === lcTarget);
        if (!match) {
          console.log(`Workspace not found: ${target}`);
          if (wsList.length > 0) {
            console.log(`Available workspaces: ${wsList.map((w) => w.name || w.id).join(", ")}`);
          }
          process.exit(1);
        }
        await switchWorkspace(match.id);
        console.log(`Switched to workspace: ${match.name || match.id}`);
        break;
      }
      console.log("Usage: workspace list | workspace switch <name-or-id>");
      process.exit(1);
    }
    case "invite": {
      if (!creds) {
        console.log("Not logged in.");
        process.exit(1);
      }
      const email = args[1];
      const mode = args[2]?.toUpperCase() ?? "WRITE";
      if (!email) {
        console.log("Usage: invite <email> [ADMIN|WRITE|READ]");
        process.exit(1);
      }
      await inviteMember(email, mode, creds.token, creds.orgId, apiUrl);
      console.log(`Invited ${email} with ${mode} access`);
      break;
    }
    case "members": {
      if (!creds) {
        console.log("Not logged in.");
        process.exit(1);
      }
      const members = await listMembers(creds.token, creds.orgId, apiUrl);
      members.forEach((m) => console.log(`${m.role.padEnd(8)} ${m.email ?? m.name}`));
      break;
    }
    case "remove": {
      if (!creds) {
        console.log("Not logged in.");
        process.exit(1);
      }
      const userId = args[1];
      if (!userId) {
        console.log("Usage: remove <user-id>");
        process.exit(1);
      }
      await removeMember(userId, creds.token, creds.orgId, apiUrl);
      console.log(`Removed user ${userId}`);
      break;
    }
    case "sessions": {
      const sub = args[1];
      if (sub === "prune") {
        await sessionPrune(args.slice(2));
      } else {
        console.log("Usage: sessions prune [--all | --before <date> | --session-id <id>] [--yes]");
      }
      break;
    }
    case "autoupdate": {
      if (!creds) {
        console.log("Not logged in.");
        process.exit(1);
      }
      const val = args[1]?.toLowerCase();
      if (val === "on" || val === "true") {
        saveCredentials({ ...creds, autoupdate: true });
        console.log("Autoupdate enabled. Plugin will update automatically on session start.");
      } else if (val === "off" || val === "false") {
        saveCredentials({ ...creds, autoupdate: false });
        console.log("Autoupdate disabled. You'll see a notice when updates are available.");
      } else {
        const current = creds.autoupdate !== false ? "on" : "off";
        console.log(`Autoupdate is currently: ${current}`);
        console.log("Usage: autoupdate [on|off]");
      }
      break;
    }
    case "logout": {
      if (deleteCredentials()) {
        console.log("Logged out. Credentials removed.");
      } else {
        console.log("Not logged in.");
      }
      break;
    }
    default:
      console.log("Commands: login, logout, whoami, org list, org switch, workspaces, workspace, sessions prune, invite, members, remove, autoupdate");
  }
}
if (process.argv[1] && process.argv[1].endsWith("auth-login.js")) {
  runAuthCommand(process.argv.slice(2)).catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}

// dist/src/commands/graph.js
import { execSync as execSync3 } from "node:child_process";
import { readFileSync as readFileSync20, readdirSync as readdirSync2 } from "node:fs";
import { join as join27, relative, resolve as resolve4, sep } from "node:path";
import { createHash as createHash6 } from "node:crypto";

// dist/src/graph/cache.js
import { createHash } from "node:crypto";
import { existsSync as existsSync15, mkdirSync as mkdirSync7, readFileSync as readFileSync15, renameSync as renameSync4, writeFileSync as writeFileSync12 } from "node:fs";
import { dirname as dirname3, join as join20 } from "node:path";
var CACHE_SCHEMA_VERSION = 1;
function fileContentHash(contents) {
  return createHash("sha256").update(contents).digest("hex");
}
function cacheDir(baseDir) {
  return join20(baseDir, ".cache");
}
function cachePath(baseDir, contentSha256) {
  return join20(cacheDir(baseDir), `${contentSha256}.json`);
}
function readCache(baseDir, contentSha256, relativePath) {
  const path5 = cachePath(baseDir, contentSha256);
  if (!existsSync15(path5))
    return null;
  let raw;
  try {
    raw = readFileSync15(path5, "utf8");
  } catch {
    return null;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (parsed === null || typeof parsed !== "object" || parsed.schema !== CACHE_SCHEMA_VERSION || parsed.content_sha256 !== contentSha256) {
    return null;
  }
  const cached = parsed.extraction;
  if (cached === void 0 || typeof cached !== "object" || !Array.isArray(cached.nodes) || !Array.isArray(cached.edges) || !Array.isArray(cached.parse_errors)) {
    return null;
  }
  if (!validateItems(cached)) {
    return null;
  }
  try {
    return rewriteSourceFile(cached, relativePath);
  } catch {
    return null;
  }
}
function validateItems(ex) {
  if (typeof ex.source_file !== "string")
    return false;
  if (typeof ex.language !== "string")
    return false;
  for (const n of ex.nodes) {
    if (n === null || typeof n !== "object")
      return false;
    if (typeof n.id !== "string")
      return false;
    if (typeof n.label !== "string")
      return false;
    if (typeof n.kind !== "string")
      return false;
    if (typeof n.source_file !== "string")
      return false;
    if (typeof n.source_location !== "string")
      return false;
    if (typeof n.language !== "string")
      return false;
    if (typeof n.exported !== "boolean")
      return false;
  }
  for (const e of ex.edges) {
    if (e === null || typeof e !== "object")
      return false;
    if (typeof e.source !== "string")
      return false;
    if (typeof e.target !== "string")
      return false;
    if (typeof e.relation !== "string")
      return false;
    if (typeof e.confidence !== "string")
      return false;
    if (e.ord !== void 0 && typeof e.ord !== "number")
      return false;
  }
  for (const p of ex.parse_errors) {
    if (p === null || typeof p !== "object")
      return false;
    if (typeof p.source_file !== "string")
      return false;
    if (typeof p.message !== "string")
      return false;
    if (p.location !== void 0 && typeof p.location !== "string")
      return false;
  }
  return true;
}
function writeCache(baseDir, contentSha256, extraction) {
  const entry = {
    schema: CACHE_SCHEMA_VERSION,
    content_sha256: contentSha256,
    extraction
  };
  const path5 = cachePath(baseDir, contentSha256);
  try {
    mkdirSync7(dirname3(path5), { recursive: true });
    const tmp = `${path5}.tmp.${process.pid}.${Date.now()}`;
    writeFileSync12(tmp, JSON.stringify(entry));
    renameSync4(tmp, path5);
  } catch {
  }
}
function rewriteSourceFile(cached, newPath) {
  const oldPath = cached.source_file;
  if (oldPath === newPath) {
    return cached;
  }
  const swap = (id) => {
    if (id.startsWith(`${oldPath}:`))
      return `${newPath}${id.slice(oldPath.length)}`;
    if (id.startsWith(`unresolved:${oldPath}:`)) {
      return `unresolved:${newPath}${id.slice(`unresolved:${oldPath}`.length)}`;
    }
    return id;
  };
  return {
    source_file: newPath,
    language: cached.language,
    // The synthetic module node uses source_file as its `label` (see
    // makeModuleNode in the extractor). On a cache hit after a rename/copy
    // we already rewrite `id` + `source_file`, but were leaving `label`
    // pointing at the OLD path — the snapshot then disagreed with a
    // fresh (non-cached) extraction. Rewrite `label` for module nodes too.
    // CodeRabbit P1.
    nodes: cached.nodes.map((n) => ({
      ...n,
      id: swap(n.id),
      label: n.kind === "module" ? newPath : n.label,
      source_file: newPath
    })),
    edges: cached.edges.map((e) => ({ ...e, source: swap(e.source), target: swap(e.target) })),
    parse_errors: cached.parse_errors.map((p) => ({ ...p, source_file: newPath }))
  };
}

// dist/src/graph/deeplake-push.js
import { createHash as createHash2 } from "node:crypto";
async function pushSnapshot(snapshot, worktreeId, deps = {}) {
  if (process.env.HIVEMIND_GRAPH_PUSH === "0") {
    return { kind: "skipped-disabled" };
  }
  const config = (deps.loadConfig ?? loadConfig)();
  if (config === null) {
    return { kind: "skipped-no-auth" };
  }
  const commitSha = snapshot.graph.commit_sha;
  if (commitSha === null) {
    return { kind: "skipped-no-commit" };
  }
  const api = (deps.makeApi ?? defaultMakeApi)(config);
  try {
    await api.ensureCodebaseTable(config.codebaseTableName);
  } catch (err) {
    return errorOutcome("ensureCodebaseTable", err);
  }
  const snapshotSha256 = computeSnapshotSha256(snapshot);
  const tableId = sqlIdent(config.codebaseTableName);
  const repoSlug = snapshot.graph.repo_key;
  const userId = config.userName;
  const selectSql = `SELECT snapshot_sha256 FROM "${tableId}" WHERE org_id = '${sqlStr(config.orgId)}' AND workspace_id = '${sqlStr(config.workspaceId)}' AND repo_slug = '${sqlStr(repoSlug)}' AND user_id = '${sqlStr(userId)}' AND worktree_id = '${sqlStr(worktreeId)}' AND commit_sha = '${sqlStr(commitSha)}'`;
  let existing;
  try {
    existing = await api.query(selectSql);
  } catch (err) {
    return errorOutcome("SELECT existing", err);
  }
  if (existing.length > 0) {
    const cloudSha = String(existing[0].snapshot_sha256 ?? "");
    if (cloudSha === snapshotSha256) {
      return { kind: "already-current", commitSha };
    }
    return {
      kind: "drift",
      commitSha,
      localSha256: snapshotSha256,
      cloudSha256: cloudSha
    };
  }
  const canonical = canonicalJSON(snapshot);
  const observation = snapshot.observation;
  const insertSql = `INSERT INTO "${tableId}" (org_id, workspace_id, repo_slug, user_id, worktree_id, commit_sha, parent_sha, branch, ts, pushed_by, snapshot_sha256, snapshot_jsonb, node_count, edge_count, generator, generator_version, schema_version) VALUES ('${sqlStr(config.orgId)}', '${sqlStr(config.workspaceId)}', '${sqlStr(repoSlug)}', '${sqlStr(userId)}', '${sqlStr(worktreeId)}', '${sqlStr(commitSha)}', '', '${sqlStr(observation.branch ?? "")}', '${sqlStr(observation.ts)}', '${sqlStr(userId)}', '${sqlStr(snapshotSha256)}', '${sqlStr(canonical)}', ${snapshot.nodes.length}, ${snapshot.links.length}, '${sqlStr(snapshot.graph.generator)}', '${sqlStr(observation.generator_version)}', ${snapshot.graph.schema_version})`;
  try {
    await api.query(insertSql);
  } catch (err) {
    return errorOutcome("INSERT", err);
  }
  try {
    const verify = await api.query(selectSql);
    if (verify.length > 1) {
      return { kind: "inserted-with-duplicate-race", commitSha, rowCount: verify.length };
    }
  } catch {
  }
  return { kind: "inserted", commitSha };
}
function defaultMakeApi(config) {
  return new DeeplakeApi(config.token, config.apiUrl, config.orgId, config.workspaceId, config.tableName);
}
function errorOutcome(stage, err) {
  const message = err instanceof Error ? err.message : String(err);
  return { kind: "error", message: `${stage}: ${message}` };
}
function computeSnapshotSha256(snapshot) {
  const stable = {
    directed: snapshot.directed,
    multigraph: snapshot.multigraph,
    graph: snapshot.graph,
    nodes: snapshot.nodes,
    links: snapshot.links
  };
  return createHash2("sha256").update(canonicalJSON(stable)).digest("hex");
}
function canonicalJSON(value) {
  return JSON.stringify(value, (_key, v) => {
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      const sorted = {};
      for (const k of Object.keys(v).sort()) {
        sorted[k] = v[k];
      }
      return sorted;
    }
    return v;
  });
}

// dist/src/graph/deeplake-pull.js
import { execFileSync as execFileSync4 } from "node:child_process";
import { createHash as createHash5 } from "node:crypto";
import { existsSync as existsSync18, mkdirSync as mkdirSync11, renameSync as renameSync7, writeFileSync as writeFileSync15 } from "node:fs";
import { dirname as dirname7, join as join24 } from "node:path";

// dist/src/utils/repo-identity.js
import { execSync as execSync2 } from "node:child_process";
import { createHash as createHash3 } from "node:crypto";
import { basename, resolve as resolve2 } from "node:path";
var DEFAULT_PORTS = {
  http: "80",
  https: "443",
  ssh: "22",
  git: "9418"
};
function normalizeGitRemoteUrl(url) {
  let s = url.trim();
  const schemeMatch = s.match(/^([a-z][a-z0-9+.-]*):\/\//i);
  const scheme = schemeMatch ? schemeMatch[1].toLowerCase() : null;
  if (schemeMatch)
    s = s.slice(schemeMatch[0].length);
  if (!scheme) {
    const scp = s.match(/^(?:[^@/\s]+@)?([^:/\s]+):(.+)$/);
    if (scp)
      s = `${scp[1]}/${scp[2]}`;
  }
  s = s.replace(/^[^@/]+@/, "");
  if (scheme && DEFAULT_PORTS[scheme]) {
    s = s.replace(new RegExp(`^([^/]+):${DEFAULT_PORTS[scheme]}(/|$)`), "$1$2");
  }
  s = s.replace(/\.git\/?$/i, "");
  s = s.replace(/\/+$/, "");
  return s.toLowerCase();
}
function deriveProjectKey(cwd) {
  const absCwd = resolve2(cwd);
  const project = basename(absCwd) || "unknown";
  let signature = null;
  try {
    const raw = execSync2("git config --get remote.origin.url", {
      cwd: absCwd,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    signature = raw ? normalizeGitRemoteUrl(raw) : null;
  } catch {
  }
  const input = signature ?? absCwd;
  const key = createHash3("sha1").update(input).digest("hex").slice(0, 16);
  return { key, project };
}

// dist/src/graph/last-build.js
import { existsSync as existsSync16, mkdirSync as mkdirSync8, readFileSync as readFileSync16, renameSync as renameSync5, writeFileSync as writeFileSync13 } from "node:fs";
import { dirname as dirname4, join as join21 } from "node:path";
function lastBuildPath(baseDir, worktreeId) {
  if (worktreeId !== void 0) {
    return join21(baseDir, "worktrees", worktreeId, ".last-build.json");
  }
  return join21(baseDir, ".last-build.json");
}
function writeLastBuild(baseDir, state, worktreeId) {
  const path5 = lastBuildPath(baseDir, worktreeId);
  try {
    mkdirSync8(dirname4(path5), { recursive: true });
    const tmp = `${path5}.tmp.${process.pid}.${Date.now()}`;
    writeFileSync13(tmp, JSON.stringify(state));
    renameSync5(tmp, path5);
  } catch {
  }
}
function readLastBuild(baseDir, worktreeId) {
  let path5 = lastBuildPath(baseDir, worktreeId);
  if (!existsSync16(path5)) {
    if (worktreeId === void 0)
      return null;
    const legacy = lastBuildPath(baseDir, void 0);
    if (!existsSync16(legacy))
      return null;
    path5 = legacy;
  }
  let raw;
  try {
    raw = readFileSync16(path5, "utf8");
  } catch {
    return null;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (parsed === null || typeof parsed !== "object")
    return null;
  const o = parsed;
  if (typeof o.ts !== "number" || !Number.isFinite(o.ts))
    return null;
  if (o.commit_sha !== null && typeof o.commit_sha !== "string")
    return null;
  if (typeof o.snapshot_sha256 !== "string")
    return null;
  const out = { ts: o.ts, commit_sha: o.commit_sha, snapshot_sha256: o.snapshot_sha256 };
  if (typeof o.node_count === "number" && Number.isFinite(o.node_count) && o.node_count >= 0) {
    out.node_count = o.node_count;
  }
  if (typeof o.edge_count === "number" && Number.isFinite(o.edge_count) && o.edge_count >= 0) {
    out.edge_count = o.edge_count;
  }
  return out;
}

// dist/src/graph/history.js
import { appendFileSync as appendFileSync2, existsSync as existsSync17, mkdirSync as mkdirSync9, readFileSync as readFileSync17 } from "node:fs";
import { dirname as dirname5, join as join22 } from "node:path";
function historyPath(baseDir) {
  return join22(baseDir, "history.jsonl");
}
function appendHistoryEntry(baseDir, entry) {
  const path5 = historyPath(baseDir);
  try {
    mkdirSync9(dirname5(path5), { recursive: true });
    appendFileSync2(path5, JSON.stringify(entry) + "\n");
  } catch {
  }
}
function entryFromSnapshot(snapshot, snapshot_sha256, trigger) {
  return {
    ts: snapshot.observation.ts,
    commit_sha: snapshot.graph.commit_sha,
    snapshot_sha256,
    node_count: snapshot.nodes.length,
    edge_count: snapshot.links.length,
    trigger
  };
}
function readHistoryTail(baseDir, n) {
  const path5 = historyPath(baseDir);
  if (!existsSync17(path5))
    return [];
  let raw;
  try {
    raw = readFileSync17(path5, "utf8");
  } catch {
    return [];
  }
  const lines = raw.split("\n").filter((l) => l.length > 0);
  const entries = [];
  for (let i = lines.length - 1; i >= 0 && entries.length < n; i--) {
    const parsed = parseLine(lines[i]);
    if (parsed !== null)
      entries.unshift(parsed);
  }
  return entries;
}
function countHistoryEntries(baseDir) {
  const path5 = historyPath(baseDir);
  if (!existsSync17(path5))
    return 0;
  try {
    const raw = readFileSync17(path5, "utf8");
    return raw.split("\n").filter((l) => l.length > 0).length;
  } catch {
    return 0;
  }
}
function parseLine(line) {
  let obj;
  try {
    obj = JSON.parse(line);
  } catch {
    return null;
  }
  if (obj === null || typeof obj !== "object")
    return null;
  const o = obj;
  if (typeof o.ts !== "string")
    return null;
  if (o.commit_sha !== null && typeof o.commit_sha !== "string")
    return null;
  if (typeof o.snapshot_sha256 !== "string")
    return null;
  if (typeof o.node_count !== "number")
    return null;
  if (typeof o.edge_count !== "number")
    return null;
  if (typeof o.trigger !== "string")
    return null;
  return {
    ts: o.ts,
    commit_sha: o.commit_sha,
    snapshot_sha256: o.snapshot_sha256,
    node_count: o.node_count,
    edge_count: o.edge_count,
    trigger: o.trigger
  };
}

// dist/src/graph/snapshot.js
import { createHash as createHash4 } from "node:crypto";
import { mkdirSync as mkdirSync10, renameSync as renameSync6, writeFileSync as writeFileSync14 } from "node:fs";
import { homedir as homedir10 } from "node:os";
import { dirname as dirname6, join as join23 } from "node:path";
function graphsRoot() {
  return process.env.HIVEMIND_GRAPHS_HOME ?? join23(homedir10(), ".hivemind", "graphs");
}
function repoDir(repoKey) {
  return join23(graphsRoot(), repoKey);
}
function buildSnapshot(extractions, metadata, observation) {
  const nodes = [];
  const links = [];
  for (const ex of extractions) {
    for (const n of ex.nodes)
      nodes.push(n);
    for (const e of ex.edges)
      links.push(e);
  }
  nodes.sort(compareNodes);
  links.sort(compareEdges);
  return {
    directed: true,
    multigraph: true,
    graph: metadata,
    observation,
    nodes,
    links
  };
}
function compareNodes(a, b) {
  return cmp(a.id, b.id);
}
function compareEdges(a, b) {
  let c = cmp(a.source, b.source);
  if (c !== 0)
    return c;
  c = cmp(a.target, b.target);
  if (c !== 0)
    return c;
  c = cmp(a.relation, b.relation);
  if (c !== 0)
    return c;
  return (a.ord ?? 0) - (b.ord ?? 0);
}
function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
function canonicalSnapshot(snapshot) {
  return canonicalJSON2(snapshot);
}
function computeSnapshotSha2562(snapshot) {
  const stable = {
    directed: snapshot.directed,
    multigraph: snapshot.multigraph,
    graph: snapshot.graph,
    nodes: snapshot.nodes,
    links: snapshot.links
  };
  return createHash4("sha256").update(canonicalJSON2(stable)).digest("hex");
}
function canonicalJSON2(value) {
  return JSON.stringify(value, (_key, v) => {
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      const sorted = {};
      for (const k of Object.keys(v).sort()) {
        sorted[k] = v[k];
      }
      return sorted;
    }
    return v;
  });
}
function writeSnapshot(snapshot, baseDir, trigger = "unknown", worktreeId) {
  const sha256 = computeSnapshotSha2562(snapshot);
  const commitSha = snapshot.graph.commit_sha;
  const fileBase = commitSha ?? sha256;
  const snapshotsDir = join23(baseDir, "snapshots");
  const snapshotPath = join23(snapshotsDir, `${fileBase}.json`);
  const canonical = canonicalSnapshot(snapshot);
  writeFileAtomic(snapshotPath, canonical);
  const worktreeRoot = worktreeId !== void 0 ? join23(baseDir, "worktrees", worktreeId) : baseDir;
  let latestCommitPath = null;
  if (commitSha !== null) {
    latestCommitPath = join23(worktreeRoot, "latest-commit.txt");
    writeFileAtomic(latestCommitPath, `${commitSha}
`);
  }
  writeLastBuild(baseDir, {
    ts: Date.now(),
    commit_sha: commitSha,
    snapshot_sha256: sha256,
    node_count: snapshot.nodes.length,
    edge_count: snapshot.links.length
  }, worktreeId);
  appendHistoryEntry(baseDir, entryFromSnapshot(snapshot, sha256, trigger));
  return { snapshotPath, latestCommitPath, snapshotSha256: sha256 };
}
function writeFileAtomic(filePath, contents) {
  mkdirSync10(dirname6(filePath), { recursive: true });
  const tmp = `${filePath}.tmp.${process.pid}.${Date.now()}`;
  writeFileSync14(tmp, contents);
  renameSync6(tmp, filePath);
}

// dist/src/graph/deeplake-pull.js
function workTreeIdFor(cwd) {
  return createHash5("sha256").update(cwd).digest("hex").slice(0, 16);
}
async function pullSnapshot(cwd, deps = {}) {
  if (process.env.HIVEMIND_GRAPH_PULL === "0") {
    return { kind: "skipped-disabled" };
  }
  const config = (deps.loadConfig ?? loadConfig)();
  if (config === null) {
    return { kind: "skipped-no-auth" };
  }
  const head = (deps.readHead ?? defaultReadHead)(cwd);
  if (head === null) {
    return { kind: "skipped-no-head" };
  }
  const api = (deps.makeApi ?? defaultMakeApi2)(config);
  try {
    await api.ensureCodebaseTable(config.codebaseTableName);
  } catch (err) {
    return errorOutcome2("ensureCodebaseTable", err);
  }
  const tableId = sqlIdent(config.codebaseTableName);
  const { key: repoKey } = deriveProjectKey(cwd);
  const selectSql = `SELECT snapshot_jsonb, snapshot_sha256, ts, node_count, edge_count, branch, generator_version, worktree_id FROM "${tableId}" WHERE org_id = '${sqlStr(config.orgId)}' AND workspace_id = '${sqlStr(config.workspaceId)}' AND repo_slug = '${sqlStr(repoKey)}' AND user_id = '${sqlStr(config.userName)}' AND commit_sha = '${sqlStr(head)}' ORDER BY ts DESC LIMIT 1`;
  let rows;
  try {
    rows = await api.query(selectSql);
  } catch (err) {
    return errorOutcome2("SELECT cloud row", err);
  }
  if (rows.length === 0) {
    return { kind: "no-cloud-row", commitSha: head };
  }
  const row = rows[0];
  const cloudSha256 = String(row.snapshot_sha256 ?? "").trim();
  const cloudPayload = coerceSnapshotPayload(row.snapshot_jsonb);
  if (cloudPayload === null) {
    return errorOutcome2("SELECT cloud row", new Error("invalid snapshot_jsonb payload"));
  }
  if (cloudSha256 !== "") {
    const computedSha = createHash5("sha256").update(cloudPayload).digest("hex");
    if (cloudSha256 !== computedSha) {
      return errorOutcome2("SELECT cloud row", new Error(`snapshot_sha256 mismatch (expected ${cloudSha256}, got ${computedSha})`));
    }
  }
  const cloudTs = parseTs(row.ts);
  const baseDir = repoDir(repoKey);
  const worktreeId = workTreeIdFor(cwd);
  const local = readLastBuild(baseDir, worktreeId);
  if (local !== null && local.commit_sha === head) {
    if (cloudSha256 !== "" && local.snapshot_sha256 === cloudSha256) {
      return { kind: "up-to-date", commitSha: head, snapshotSha256: cloudSha256 };
    }
    if (local.ts > cloudTs) {
      return {
        kind: "local-newer",
        commitSha: head,
        localTs: local.ts,
        cloudTs
      };
    }
  }
  const snapshotsDir = join24(baseDir, "snapshots");
  const snapshotPath = join24(snapshotsDir, `${head}.json`);
  const worktreeRoot = join24(baseDir, "worktrees", worktreeId);
  try {
    writeFileAtomic2(snapshotPath, cloudPayload);
    writeFileAtomic2(join24(worktreeRoot, "latest-commit.txt"), `${head}
`);
    writeLastBuild(baseDir, {
      ts: cloudTs,
      commit_sha: head,
      snapshot_sha256: cloudSha256,
      node_count: numOrUndefined(row.node_count),
      edge_count: numOrUndefined(row.edge_count)
    }, worktreeId);
    appendHistoryEntry(baseDir, {
      ts: new Date(cloudTs).toISOString(),
      commit_sha: head,
      snapshot_sha256: cloudSha256,
      node_count: Number(row.node_count ?? 0),
      edge_count: Number(row.edge_count ?? 0),
      trigger: "pull"
    });
  } catch (err) {
    return errorOutcome2("write local files", err);
  }
  return {
    kind: "pulled",
    commitSha: head,
    snapshotSha256: cloudSha256,
    bytes: Buffer.byteLength(cloudPayload, "utf8"),
    cloudTs,
    sourceWorktreePath: String(row.worktree_id ?? "")
  };
}
function defaultReadHead(cwd) {
  try {
    return execFileSync4("git", ["rev-parse", "HEAD"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return null;
  }
}
function defaultMakeApi2(config) {
  return new DeeplakeApi(config.token, config.apiUrl, config.orgId, config.workspaceId, config.tableName);
}
function parseTs(raw) {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw < 1e12 ? raw * 1e3 : raw;
  }
  if (typeof raw === "string") {
    const parsed = Date.parse(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}
function numOrUndefined(raw) {
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0)
    return raw;
  if (typeof raw === "string") {
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 0)
      return n;
  }
  return void 0;
}
function coerceSnapshotPayload(raw) {
  if (typeof raw === "string")
    return raw;
  if (raw !== null && typeof raw === "object")
    return JSON.stringify(raw);
  return null;
}
function writeFileAtomic2(filePath, contents) {
  mkdirSync11(dirname7(filePath), { recursive: true });
  const tmp = `${filePath}.tmp.${process.pid}.${Date.now()}`;
  writeFileSync15(tmp, contents);
  renameSync7(tmp, filePath);
}
function errorOutcome2(stage, err) {
  const message = err instanceof Error ? err.message : String(err);
  return { kind: "error", message: `${stage}: ${message}` };
}

// dist/src/graph/diff.js
import { existsSync as existsSync19, readFileSync as readFileSync18 } from "node:fs";
import { join as join25 } from "node:path";
function edgeKey(e) {
  return `${e.source}${e.target}${e.relation}${e.ord ?? 0}`;
}
function diffSnapshots(from, to) {
  const fromNodeIds = new Set(from.nodes.map((n) => n.id));
  const toNodeIds = new Set(to.nodes.map((n) => n.id));
  const nodesAdded = to.nodes.filter((n) => !fromNodeIds.has(n.id));
  const nodesRemoved = from.nodes.filter((n) => !toNodeIds.has(n.id));
  const fromEdgeKeys = new Set(from.links.map(edgeKey));
  const toEdgeKeys = new Set(to.links.map(edgeKey));
  const edgesAdded = to.links.filter((e) => !fromEdgeKeys.has(edgeKey(e)));
  const edgesRemoved = from.links.filter((e) => !toEdgeKeys.has(edgeKey(e)));
  return {
    nodes: { added: nodesAdded, removed: nodesRemoved },
    edges: { added: edgesAdded, removed: edgesRemoved },
    counts: {
      nodes_added: nodesAdded.length,
      nodes_removed: nodesRemoved.length,
      edges_added: edgesAdded.length,
      edges_removed: edgesRemoved.length
    }
  };
}
function loadSnapshotByCommit(baseDir, commitSha) {
  if (!/^[0-9a-f]{4,64}$/i.test(commitSha))
    return null;
  const path5 = join25(baseDir, "snapshots", `${commitSha}.json`);
  if (!existsSync19(path5))
    return null;
  let raw;
  try {
    raw = readFileSync18(path5, "utf8");
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!isGraphSnapshotLike(parsed))
      return null;
    return parsed;
  } catch {
    return null;
  }
}
function isGraphSnapshotLike(v) {
  if (v === null || typeof v !== "object")
    return false;
  const s = v;
  return Array.isArray(s.nodes) && Array.isArray(s.links);
}
function printDiffHuman(diff, sampleSize = 10) {
  const { counts } = diff;
  console.log(`Nodes: +${counts.nodes_added} -${counts.nodes_removed}   Edges: +${counts.edges_added} -${counts.edges_removed}`);
  const showNodes = (label, ns) => {
    if (ns.length === 0)
      return;
    console.log("");
    console.log(`${label} (${ns.length}, showing up to ${sampleSize}):`);
    const sorted = [...ns].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    for (const n of sorted.slice(0, sampleSize)) {
      console.log(`  ${n.id} [${n.kind}]${n.exported ? " (exported)" : ""}  ${n.source_file}:${n.source_location}`);
    }
    if (sorted.length > sampleSize)
      console.log(`  \u2026 and ${sorted.length - sampleSize} more`);
  };
  const showEdges = (label, es) => {
    if (es.length === 0)
      return;
    console.log("");
    console.log(`${label} (${es.length}, showing up to ${sampleSize}):`);
    const sorted = [...es].sort((a, b) => edgeKey(a) < edgeKey(b) ? -1 : edgeKey(a) > edgeKey(b) ? 1 : 0);
    for (const e of sorted.slice(0, sampleSize)) {
      console.log(`  ${e.source} --${e.relation}--> ${e.target}${e.ord !== void 0 ? ` (ord=${e.ord})` : ""}`);
    }
    if (sorted.length > sampleSize)
      console.log(`  \u2026 and ${sorted.length - sampleSize} more`);
  };
  showNodes("Nodes added", diff.nodes.added);
  showNodes("Nodes removed", diff.nodes.removed);
  showEdges("Edges added", diff.edges.added);
  showEdges("Edges removed", diff.edges.removed);
}

// dist/src/graph/extract/typescript.js
import Parser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";
var _typescriptParser = null;
var _tsxParser = null;
function getTypescriptParser() {
  if (_typescriptParser === null) {
    _typescriptParser = new Parser();
    _typescriptParser.setLanguage(TypeScript.typescript);
  }
  return _typescriptParser;
}
function getTsxParser() {
  if (_tsxParser === null) {
    _tsxParser = new Parser();
    _tsxParser.setLanguage(TypeScript.tsx);
  }
  return _tsxParser;
}
function pickParserForPath(relativePath) {
  return relativePath.endsWith(".tsx") || relativePath.endsWith(".jsx") ? getTsxParser() : getTypescriptParser();
}
function extractTypeScript(sourceCode, relativePath) {
  const parser = pickParserForPath(relativePath);
  const CHUNK_BYTES = 16384;
  const tree = parser.parse((index) => {
    if (index >= sourceCode.length)
      return null;
    return sourceCode.slice(index, index + CHUNK_BYTES);
  });
  const root = tree.rootNode;
  const result = {
    source_file: relativePath,
    language: "typescript",
    nodes: [],
    edges: [],
    parse_errors: []
  };
  collectParseErrors(root, relativePath, result.parse_errors);
  const moduleNode = makeModuleNode(relativePath);
  result.nodes.push(moduleNode);
  const declByName = /* @__PURE__ */ new Map();
  extractDeclarations(root, relativePath, result, declByName, moduleNode);
  extractImports(root, relativePath, result, moduleNode);
  extractCalls(root, relativePath, result, declByName);
  return result;
}
function collectParseErrors(node, relativePath, out) {
  if (node.isError || node.isMissing) {
    out.push({
      source_file: relativePath,
      message: node.isMissing ? `missing node: ${node.type}` : `parse error at ${locationStr(node)}`,
      location: locationStr(node)
    });
    return;
  }
  for (let i = 0; i < node.namedChildCount; i++) {
    const child = node.namedChild(i);
    if (child !== null)
      collectParseErrors(child, relativePath, out);
  }
}
function extractDeclarations(node, relativePath, result, declByName, moduleNode) {
  for (let i = 0; i < node.namedChildCount; i++) {
    const child = node.namedChild(i);
    if (child === null)
      continue;
    const { decl, exported } = unwrapExport(child);
    if (decl !== null) {
      handleDeclaration(decl, exported, relativePath, result, declByName, moduleNode);
    }
    if (child.type === "internal_module" || child.type === "module") {
      extractDeclarations(child, relativePath, result, declByName, moduleNode);
    }
  }
}
function unwrapExport(node) {
  if (node.type === "export_statement") {
    const decl = node.childForFieldName("declaration") ?? firstNamedChildOfTypes(node, [
      "function_declaration",
      "class_declaration",
      "interface_declaration",
      "type_alias_declaration",
      "enum_declaration",
      "lexical_declaration"
    ]);
    return { decl, exported: true };
  }
  return { decl: node, exported: false };
}
function handleDeclaration(node, exported, relativePath, result, declByName, moduleNode) {
  switch (node.type) {
    case "function_declaration": {
      const name = textOfField(node, "name");
      if (name === null)
        return;
      const decl = makeNode(relativePath, name, "function", node, exported);
      pushNode(result, declByName, decl);
      return;
    }
    case "class_declaration": {
      const name = textOfField(node, "name");
      if (name === null)
        return;
      const classNode = makeNode(relativePath, name, "class", node, exported);
      pushNode(result, declByName, classNode);
      const heritage = firstNamedChildOfTypes(node, ["class_heritage"]);
      if (heritage !== null) {
        for (let i = 0; i < heritage.namedChildCount; i++) {
          const clause = heritage.namedChild(i);
          if (clause === null)
            continue;
          const relation = clause.type === "extends_clause" ? "extends" : clause.type === "implements_clause" ? "implements" : null;
          if (relation === null)
            continue;
          for (let j = 0; j < clause.namedChildCount; j++) {
            const base = clause.namedChild(j);
            if (base === null)
              continue;
            const baseName = base.text;
            if (baseName.length === 0)
              continue;
            result.edges.push({
              source: classNode.id,
              target: nodeIdUnresolved(relativePath, baseName, relation === "extends" ? "class" : "interface"),
              relation,
              confidence: "EXTRACTED"
            });
          }
        }
      }
      const body = firstNamedChildOfTypes(node, ["class_body"]);
      if (body !== null) {
        for (let i = 0; i < body.namedChildCount; i++) {
          const member = body.namedChild(i);
          if (member === null)
            continue;
          if (member.type === "method_definition") {
            const methodName = textOfField(member, "name");
            if (methodName === null)
              continue;
            const accessibility = firstNamedChildOfTypes(member, ["accessibility_modifier"]);
            const isHardPrivate = firstNamedChildOfTypes(member, ["private_property_identifier"]) !== null;
            const isPublic = !isHardPrivate && (accessibility === null || accessibility.text === "public");
            const methodExported = exported && isPublic;
            const methodKey = `${classNode.label}.${methodName}`;
            const methodNode = makeNodeWithExplicitLabel(relativePath, methodKey, methodName, "method", member, methodExported);
            pushNode(result, declByName, methodNode, methodKey);
            result.edges.push({
              source: classNode.id,
              target: methodNode.id,
              relation: "method_of",
              confidence: "EXTRACTED"
            });
          }
        }
      }
      return;
    }
    case "interface_declaration": {
      const name = textOfField(node, "name");
      if (name === null)
        return;
      const decl = makeNode(relativePath, name, "interface", node, exported);
      pushNode(result, declByName, decl);
      return;
    }
    case "type_alias_declaration": {
      const name = textOfField(node, "name");
      if (name === null)
        return;
      const decl = makeNode(relativePath, name, "type_alias", node, exported);
      pushNode(result, declByName, decl);
      return;
    }
    case "enum_declaration": {
      const name = textOfField(node, "name");
      if (name === null)
        return;
      const decl = makeNode(relativePath, name, "enum", node, exported);
      pushNode(result, declByName, decl);
      return;
    }
    case "lexical_declaration": {
      for (let i = 0; i < node.namedChildCount; i++) {
        const declarator = node.namedChild(i);
        if (declarator === null || declarator.type !== "variable_declarator")
          continue;
        const ident = declarator.childForFieldName("name");
        if (ident === null || ident.type !== "identifier")
          continue;
        const decl = makeNode(relativePath, ident.text, "const", declarator, exported);
        pushNode(result, declByName, decl);
      }
      return;
    }
  }
}
function extractImports(node, relativePath, result, moduleNode) {
  if (node.type === "import_statement") {
    const src = firstNamedChildOfTypes(node, ["string"]);
    if (src !== null) {
      const frag = firstNamedChildOfTypes(src, ["string_fragment"]);
      const specifier = (frag !== null ? frag.text : src.text).replace(/^['"]|['"]$/g, "");
      if (specifier.length > 0) {
        result.edges.push({
          source: moduleNode.id,
          target: `external:${specifier}`,
          relation: "imports",
          confidence: "EXTRACTED"
        });
      }
    }
    return;
  }
  for (let i = 0; i < node.namedChildCount; i++) {
    const child = node.namedChild(i);
    if (child !== null)
      extractImports(child, relativePath, result, moduleNode);
  }
}
function extractCalls(node, relativePath, result, declByName) {
  if (node.type === "call_expression") {
    const callee = node.childForFieldName("function");
    if (callee !== null) {
      const calleeKey = resolveCalleeKey(callee, declByName);
      if (calleeKey !== null) {
        const targetNode = declByName.get(calleeKey);
        if (targetNode !== void 0) {
          const callerNode = findEnclosingDeclaration(node, declByName);
          if (callerNode !== null) {
            result.edges.push({
              source: callerNode.id,
              target: targetNode.id,
              relation: "calls",
              confidence: "EXTRACTED"
            });
          }
        }
      }
    }
  }
  for (let i = 0; i < node.namedChildCount; i++) {
    const child = node.namedChild(i);
    if (child !== null)
      extractCalls(child, relativePath, result, declByName);
  }
}
function resolveCalleeKey(callee, declByName) {
  if (callee.type === "identifier")
    return callee.text;
  if (callee.type === "member_expression") {
    const object = callee.childForFieldName("object");
    const property = callee.childForFieldName("property");
    if (object !== null && object.type === "this" && property !== null && property.type === "property_identifier") {
      const className = findEnclosingClassName(callee);
      if (className !== null)
        return `${className}.${property.text}`;
    }
  }
  return null;
}
function findEnclosingDeclaration(node, declByName) {
  let cur = node.parent;
  while (cur !== null) {
    if (cur.type === "function_declaration") {
      const name = textOfField(cur, "name");
      if (name !== null) {
        const n = declByName.get(name);
        if (n !== void 0)
          return n;
      }
    } else if (cur.type === "method_definition") {
      const methodName = textOfField(cur, "name");
      const className = findEnclosingClassName(cur);
      if (methodName !== null && className !== null) {
        const n = declByName.get(`${className}.${methodName}`);
        if (n !== void 0)
          return n;
      }
    } else if (cur.type === "variable_declarator") {
      const value = cur.childForFieldName("value");
      if (value?.type === "arrow_function" || value?.type === "function_expression") {
        const ident = cur.childForFieldName("name");
        if (ident !== null && ident.type === "identifier") {
          const n = declByName.get(ident.text);
          if (n !== void 0)
            return n;
        }
      }
    }
    cur = cur.parent;
  }
  return null;
}
function findEnclosingClassName(node) {
  let cur = node.parent;
  while (cur !== null) {
    if (cur.type === "class_declaration") {
      return textOfField(cur, "name");
    }
    cur = cur.parent;
  }
  return null;
}
function makeModuleNode(relativePath) {
  return {
    id: `${relativePath}::module`,
    label: relativePath,
    kind: "module",
    source_file: relativePath,
    source_location: "L1",
    language: "typescript",
    exported: false
  };
}
function makeNode(relativePath, name, kind, node, exported) {
  return {
    id: nodeId(relativePath, name, kind),
    label: name,
    kind,
    source_file: relativePath,
    source_location: locationStr(node),
    language: "typescript",
    exported
  };
}
function makeNodeWithExplicitLabel(relativePath, idName, label, kind, node, exported) {
  return {
    id: nodeId(relativePath, idName, kind),
    label,
    kind,
    source_file: relativePath,
    source_location: locationStr(node),
    language: "typescript",
    exported
  };
}
function pushNode(result, declByName, node, lookupKey) {
  if (result.nodes.some((n) => n.id === node.id)) {
    if (!declByName.has(lookupKey ?? node.label)) {
      declByName.set(lookupKey ?? node.label, node);
    }
    return;
  }
  result.nodes.push(node);
  declByName.set(lookupKey ?? node.label, node);
}
function nodeId(relativePath, name, kind) {
  return `${relativePath}:${name}:${kind}`;
}
function nodeIdUnresolved(relativePath, name, kind) {
  return `unresolved:${relativePath}:${name}:${kind}`;
}
function locationStr(node) {
  const start = node.startPosition.row + 1;
  const end = node.endPosition.row + 1;
  return start === end ? `L${start}` : `L${start}-${end}`;
}
function textOfField(node, fieldName) {
  const child = node.childForFieldName(fieldName);
  if (child === null)
    return null;
  const text = child.text;
  return text.length > 0 ? text : null;
}
function firstNamedChildOfTypes(node, types) {
  for (let i = 0; i < node.namedChildCount; i++) {
    const child = node.namedChild(i);
    if (child !== null && types.includes(child.type))
      return child;
  }
  return null;
}

// dist/src/graph/git-hook-install.js
import { chmodSync as chmodSync2, existsSync as existsSync20, mkdirSync as mkdirSync12, readFileSync as readFileSync19, unlinkSync as unlinkSync8, writeFileSync as writeFileSync16 } from "node:fs";
import { dirname as dirname8, join as join26, resolve as resolve3 } from "node:path";
import { execFileSync as execFileSync5 } from "node:child_process";
var HOOK_BEGIN_MARKER = "# HIVEMIND_GRAPH_HOOK_BEGIN \u2014 managed by `hivemind graph init`";
var HOOK_END_MARKER = "# HIVEMIND_GRAPH_HOOK_END";
var SHEBANG = "#!/bin/sh";
function hookBodyLines(hivemindPath) {
  return [
    "# Async-detached so commits never wait. Threshold-gate + cache make",
    "# typical re-runs ~85ms. Logs go to ~/.hivemind/post-commit.log",
    "# mkdir is robust against first-run: $HOME/.hivemind may not exist yet,",
    "# in which case the > redirect would fail and the build would never start.",
    'mkdir -p "$HOME/.hivemind" 2>/dev/null || true',
    `nohup ${quoteForShell(hivemindPath)} graph build --trigger post-commit >> "$HOME/.hivemind/post-commit.log" 2>&1 &`
  ];
}
function quoteForShell(path5) {
  return `'${path5.replace(/'/g, `'\\''`)}'`;
}
function gitHooksDir(cwd) {
  const configured = tryGitConfig(cwd, "core.hooksPath");
  if (configured !== null) {
    const top = tryGitTopLevel(cwd);
    return top !== null ? resolve3(top, configured) : resolve3(cwd, configured);
  }
  try {
    const out = execFileSync5("git", ["rev-parse", "--git-path", "hooks"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    if (out === "")
      return null;
    return resolve3(cwd, out);
  } catch {
    return null;
  }
}
function tryGitConfig(cwd, key) {
  try {
    const out = execFileSync5("git", ["config", "--get", key], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return out === "" ? null : out;
  } catch {
    return null;
  }
}
function tryGitTopLevel(cwd) {
  try {
    const out = execFileSync5("git", ["rev-parse", "--show-toplevel"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return out === "" ? null : out;
  } catch {
    return null;
  }
}
function postCommitHookPath(cwd) {
  const hooksDir = gitHooksDir(cwd);
  return hooksDir === null ? null : join26(hooksDir, "post-commit");
}
function installPostCommitHook(cwd, opts = {}) {
  const path5 = postCommitHookPath(cwd);
  if (path5 === null) {
    return { kind: "foreign-hook", path: "", hint: "not in a git repo (no .git directory found)" };
  }
  const existed = existsSync20(path5);
  if (existed) {
    const content = readFileSync19(path5, "utf8");
    if (containsOurMarkers(content)) {
      return { kind: "already-ours", path: path5 };
    }
    if (!opts.force) {
      return {
        kind: "foreign-hook",
        path: path5,
        hint: `existing hook at ${path5} is not managed by hivemind; pass --force to overwrite, or merge our block manually (between '${HOOK_BEGIN_MARKER}' and '${HOOK_END_MARKER}')`
      };
    }
  }
  const hivemindPath = resolveHivemindPath();
  if (hivemindPath === null) {
    return {
      kind: "foreign-hook",
      path: path5,
      hint: "hivemind binary not found on PATH. Install hivemind globally (`npm install -g @deeplake/hivemind`) before running `hivemind graph init`, so the hook can find a stable absolute path to call."
    };
  }
  mkdirSync12(dirname8(path5), { recursive: true });
  writeFileSync16(path5, buildHookFile(hivemindPath), { mode: 493 });
  try {
    chmodSync2(path5, 493);
  } catch {
  }
  return { kind: "installed", path: path5, wasNew: !existed };
}
function resolveHivemindPath() {
  try {
    const out = execFileSync5("which", ["hivemind"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    if (out !== "" && out.includes("hivemind"))
      return out.split("\n")[0].trim();
  } catch {
  }
  return null;
}
function uninstallPostCommitHook(cwd) {
  const path5 = postCommitHookPath(cwd);
  if (path5 === null) {
    return { kind: "no-hook", path: "" };
  }
  if (!existsSync20(path5)) {
    return { kind: "no-hook", path: path5 };
  }
  const content = readFileSync19(path5, "utf8");
  if (!containsOurMarkers(content)) {
    return {
      kind: "not-ours",
      path: path5,
      hint: `existing hook at ${path5} is not managed by hivemind; remove it manually if you want it gone`
    };
  }
  const stripped = stripOurBlock(content);
  const meaningful = stripped.split("\n").map((l) => l.trim()).filter((l) => l.length > 0 && !l.startsWith("#!"));
  if (meaningful.length === 0) {
    unlinkSync8(path5);
    return { kind: "removed", path: path5, wholeFileDeleted: true };
  }
  writeFileSync16(path5, stripped);
  return { kind: "removed", path: path5, wholeFileDeleted: false };
}
function containsOurMarkers(content) {
  return content.includes(HOOK_BEGIN_MARKER) && content.includes(HOOK_END_MARKER);
}
function stripOurBlock(content) {
  const beginIdx = content.indexOf(HOOK_BEGIN_MARKER);
  const endIdx = content.indexOf(HOOK_END_MARKER);
  if (beginIdx === -1 || endIdx === -1 || endIdx < beginIdx)
    return content;
  const blockEnd = endIdx + HOOK_END_MARKER.length;
  return content.slice(0, beginIdx) + content.slice(blockEnd);
}
function buildHookFile(hivemindPath) {
  return [
    SHEBANG,
    "",
    HOOK_BEGIN_MARKER,
    ...hookBodyLines(hivemindPath),
    HOOK_END_MARKER,
    ""
  ].join("\n");
}

// dist/src/commands/graph.js
var USAGE = `hivemind graph \u2014 codebase-graph commands (Phase 1 \u2014 TypeScript only)

Usage:
  hivemind graph build [--cwd <path>]
      Walk the project for TypeScript source files, extract symbols + edges,
      and write a snapshot to ~/.hivemind/graphs/<repo-key>/snapshots/<commit-sha>.json.
      Also updates ~/.hivemind/graphs/<repo-key>/latest-commit.txt and the
      per-repo .last-build.json (consumed by the SessionEnd auto-build hook).

  hivemind graph diff <sha1> <sha2> [--cwd <path>] [--json] [--limit N]
      Diff two snapshots by their git commit SHA. Prints added/removed
      counts for nodes and edges, plus up to N=10 (default) examples of each.
      --json: emit machine-readable JSON instead of the human format.
      --limit N: cap the per-category examples (human format only).

  hivemind graph history [--cwd <path>] [-n N] [--json]
      Print the last N (default 20) entries from the per-repo history.jsonl,
      newest last. Each entry shows ts, commit_sha (short), snapshot_sha256
      (short), node/edge counts, and the trigger that fired the build.
      --json: emit raw JSONL (one parsed entry per line, full fields).

  hivemind graph init [--cwd <path>] [--force] [--no-initial-build]
      Install a managed block in .git/hooks/post-commit that fires
      \`hivemind graph build --trigger post-commit\` after each commit
      (async, non-blocking, exit 0 always). Idempotent: re-running on
      an already-installed hook is a no-op. Refuses to clobber an
      existing non-managed hook unless --force is passed.
      Also runs an initial \`hivemind graph build\` unless
      --no-initial-build is passed.

  hivemind graph uninstall [--cwd <path>]
      Remove our managed block from .git/hooks/post-commit. If our block
      was the only content, deletes the file; otherwise leaves the rest
      intact. Snapshots and history are NOT touched (\`rm -rf
      ~/.hivemind/graphs/<key>\` if you really want them gone).

  hivemind graph pull [--cwd <path>]
      Download the freshest cloud snapshot for HEAD into the local graph
      dir (any worktree of this user counts). No-op if local already
      matches cloud sha256 or local was built later than cloud. Requires
      \`hivemind login\`. Best-effort: any network/auth failure leaves
      the local files untouched. Disable via HIVEMIND_GRAPH_PULL=0.

  hivemind graph --help
      Show this message.

  Future subcommands (Phase 1.5+): daemon, search, latest, push, pull, prune.
`;
var DEFAULT_IGNORES = /* @__PURE__ */ new Set([
  "node_modules",
  ".git",
  "bundle",
  "dist",
  "coverage",
  ".cache",
  ".nyc_output"
]);
function runGraphCommand(args) {
  const sub = args[0];
  if (sub === void 0 || sub === "--help" || sub === "-h" || sub === "help") {
    console.log(USAGE);
    return;
  }
  if (sub === "build") {
    return runBuildCommand(args.slice(1));
  }
  if (sub === "diff") {
    runDiffCommand(args.slice(1));
    return;
  }
  if (sub === "history") {
    runHistoryCommand(args.slice(1));
    return;
  }
  if (sub === "init") {
    return runInitCommand(args.slice(1));
  }
  if (sub === "uninstall") {
    runUninstallCommand(args.slice(1));
    return;
  }
  if (sub === "pull") {
    return runPullCommand(args.slice(1));
  }
  console.error(`hivemind graph: unknown subcommand '${sub}'`);
  console.error(USAGE);
  process.exit(2);
}
function parseInitArgs(args) {
  let cwd = process.cwd();
  let force = false;
  let initialBuild = true;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--cwd" && i + 1 < args.length) {
      cwd = args[i + 1];
      i += 1;
    } else if (a === "--force") {
      force = true;
    } else if (a === "--no-initial-build") {
      initialBuild = false;
    } else if (a === "--help" || a === "-h") {
      console.log(USAGE);
      process.exit(0);
    } else {
      console.error(`hivemind graph init: unknown argument '${a}'`);
      console.error(USAGE);
      process.exit(2);
    }
  }
  return { cwd, force, initialBuild };
}
async function runInitCommand(args) {
  const opts = parseInitArgs(args);
  const status = installPostCommitHook(opts.cwd, { force: opts.force });
  switch (status.kind) {
    case "installed":
      console.log(`Installed post-commit hook at ${status.path}`);
      break;
    case "already-ours":
      console.log(`Post-commit hook already managed by hivemind (no change): ${status.path}`);
      break;
    case "foreign-hook":
      console.error(`hivemind graph init: ${status.hint}`);
      process.exit(1);
  }
  if (opts.initialBuild) {
    console.log("");
    console.log("Running initial build...");
    await runBuildCommand(["--cwd", opts.cwd, "--trigger", "manual"]);
  } else {
    console.log("");
    console.log("Skipped initial build (--no-initial-build). Run `hivemind graph build` when ready.");
  }
}
function parseUninstallArgs(args) {
  let cwd = process.cwd();
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--cwd" && i + 1 < args.length) {
      cwd = args[i + 1];
      i += 1;
    } else if (a === "--help" || a === "-h") {
      console.log(USAGE);
      process.exit(0);
    } else {
      console.error(`hivemind graph uninstall: unknown argument '${a}'`);
      console.error(USAGE);
      process.exit(2);
    }
  }
  return { cwd };
}
function runUninstallCommand(args) {
  const opts = parseUninstallArgs(args);
  const status = uninstallPostCommitHook(opts.cwd);
  switch (status.kind) {
    case "removed":
      if (status.wholeFileDeleted) {
        console.log(`Removed post-commit hook (file deleted): ${status.path}`);
      } else {
        console.log(`Removed managed block from post-commit hook (other content preserved): ${status.path}`);
      }
      console.log("Local snapshots + history.jsonl are untouched.");
      break;
    case "no-hook":
      console.log(status.path === "" ? "No git repo here (nothing to uninstall)." : `No post-commit hook at ${status.path} (nothing to uninstall).`);
      break;
    case "not-ours":
      console.error(`hivemind graph uninstall: ${status.hint}`);
      process.exit(1);
  }
}
function parseHistoryArgs(args) {
  let cwd = process.cwd();
  let n = 20;
  let json2 = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--cwd" && i + 1 < args.length) {
      cwd = args[i + 1];
      i += 1;
    } else if (a === "-n" && i + 1 < args.length) {
      const raw = args[i + 1];
      if (!/^\d+$/.test(raw)) {
        console.error("hivemind graph history: -n must be a non-negative integer");
        process.exit(2);
      }
      n = Number(raw);
      i += 1;
    } else if (a === "--json") {
      json2 = true;
    } else if (a === "--help" || a === "-h") {
      console.log(USAGE);
      process.exit(0);
    } else {
      console.error(`hivemind graph history: unknown argument '${a}'`);
      console.error(USAGE);
      process.exit(2);
    }
  }
  return { cwd, n, json: json2 };
}
function runHistoryCommand(args) {
  const opts = parseHistoryArgs(args);
  const { key: repoKey } = deriveProjectKey(opts.cwd);
  const baseDir = repoDir(repoKey);
  const total = countHistoryEntries(baseDir);
  const entries = readHistoryTail(baseDir, opts.n);
  if (opts.json) {
    for (const e of entries)
      console.log(JSON.stringify(e));
    return;
  }
  if (total === 0) {
    console.log("No history yet. Run `hivemind graph build` to record one.");
    return;
  }
  console.log(`history.jsonl: ${total} total entries; showing last ${entries.length}`);
  console.log("");
  for (const e of entries) {
    const commit = e.commit_sha === null ? "(no-git)" : e.commit_sha.slice(0, 7);
    const snap = e.snapshot_sha256.slice(0, 7);
    console.log(`  ${e.ts}  commit=${commit}  snap=${snap}  nodes=${e.node_count}  edges=${e.edge_count}  trigger=${e.trigger}`);
  }
}
function parseDiffArgs(args) {
  let cwd = process.cwd();
  let json2 = false;
  let limit2 = 10;
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--cwd" && i + 1 < args.length) {
      cwd = args[i + 1];
      i += 1;
    } else if (a === "--json") {
      json2 = true;
    } else if (a === "--limit" && i + 1 < args.length) {
      const raw = args[i + 1];
      if (!/^\d+$/.test(raw)) {
        console.error("hivemind graph diff: --limit must be a non-negative integer");
        process.exit(2);
      }
      limit2 = Number(raw);
      i += 1;
    } else if (a === "--help" || a === "-h") {
      console.log(USAGE);
      process.exit(0);
    } else if (a !== void 0 && !a.startsWith("--")) {
      positional.push(a);
    } else {
      console.error(`hivemind graph diff: unknown argument '${a}'`);
      console.error(USAGE);
      process.exit(2);
    }
  }
  if (positional.length !== 2) {
    console.error("hivemind graph diff: expected exactly two commit SHAs");
    console.error(USAGE);
    process.exit(2);
  }
  return { cwd, sha1: positional[0], sha2: positional[1], json: json2, limit: limit2 };
}
function runDiffCommand(args) {
  const opts = parseDiffArgs(args);
  const { key: repoKey } = deriveProjectKey(opts.cwd);
  const baseDir = repoDir(repoKey);
  const from = loadSnapshotByCommit(baseDir, opts.sha1);
  if (from === null) {
    console.error(`hivemind graph diff: snapshot not found for ${opts.sha1}`);
    console.error(`  expected: ${baseDir}/snapshots/${opts.sha1}.json`);
    console.error("  hint: run 'hivemind graph build' on the relevant commit, or check the commit sha");
    process.exit(1);
  }
  const to = loadSnapshotByCommit(baseDir, opts.sha2);
  if (to === null) {
    console.error(`hivemind graph diff: snapshot not found for ${opts.sha2}`);
    console.error(`  expected: ${baseDir}/snapshots/${opts.sha2}.json`);
    process.exit(1);
  }
  const diff = diffSnapshots(from, to);
  if (opts.json) {
    console.log(JSON.stringify(diff, null, 2));
    return;
  }
  console.log(`Diff: ${opts.sha1} \u2192 ${opts.sha2}`);
  console.log("");
  printDiffHuman(diff, opts.limit);
}
function parseBuildArgs(args) {
  let cwd = process.cwd();
  let trigger = "manual";
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--cwd" && i + 1 < args.length) {
      cwd = args[i + 1];
      i += 1;
    } else if (a === "--trigger" && i + 1 < args.length) {
      const v = args[i + 1];
      if (v === "manual" || v === "session-end" || v === "post-commit" || v === "unknown") {
        trigger = v;
      } else {
        console.error(`hivemind graph build: --trigger must be one of manual|session-end|post-commit|unknown (got '${v}')`);
        process.exit(2);
      }
      i += 1;
    } else if (a === "--help" || a === "-h") {
      console.log(USAGE);
      process.exit(0);
    } else {
      console.error(`hivemind graph build: unknown argument '${a}'`);
      console.error(USAGE);
      process.exit(2);
    }
  }
  return { cwd, trigger };
}
async function runBuildCommand(args) {
  const opts = parseBuildArgs(args);
  const cwd = resolve4(opts.cwd);
  const { key: repoKey, project } = deriveProjectKey(cwd);
  const baseDir = repoDir(repoKey);
  const commitSha = readGitCommit(cwd);
  const branch = readGitBranch(cwd);
  const version = getVersion();
  console.log(`Building codebase graph for ${project}`);
  console.log(`  repo_key:   ${repoKey}`);
  console.log(`  commit_sha: ${commitSha ?? "(not in a git repo)"}`);
  console.log(`  branch:     ${branch ?? "(none / detached)"}`);
  console.log(`  output:     ${baseDir}`);
  console.log("");
  const sourceFiles = discoverSourceFiles(cwd);
  console.log(`Discovered ${sourceFiles.length} TypeScript source files. Extracting...`);
  const extractions = [];
  let skipped = 0;
  let totalParseErrors = 0;
  let cacheHits = 0;
  for (const abs of sourceFiles) {
    const rel = toForwardSlash(relative(cwd, abs));
    try {
      const content = readFileSync20(abs, "utf8");
      const contentSha = fileContentHash(content);
      let extraction = readCache(baseDir, contentSha, rel);
      if (extraction === null) {
        extraction = extractTypeScript(content, rel);
        writeCache(baseDir, contentSha, extraction);
      } else {
        cacheHits += 1;
      }
      if (extraction.parse_errors.length > 0) {
        totalParseErrors += extraction.parse_errors.length;
        for (const err of extraction.parse_errors) {
          console.warn(`  warn: parse issue in ${err.source_file} ${err.location ?? ""}: ${err.message}`);
        }
      }
      extractions.push(extraction);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  warn: skipping ${rel}: ${msg}`);
      skipped += 1;
    }
  }
  const metadata = {
    schema_version: 1,
    generator: "hivemind-graph",
    commit_sha: commitSha,
    repo_key: repoKey
  };
  const observation = {
    ts: (/* @__PURE__ */ new Date()).toISOString(),
    branch,
    worktree_path: cwd,
    repo_project: project,
    generator_version: version,
    source_files_extracted: extractions.length,
    source_files_skipped: skipped
  };
  const snapshot = buildSnapshot(extractions, metadata, observation);
  const worktreeId = workTreeIdFor2(cwd);
  const result = writeSnapshot(snapshot, baseDir, opts.trigger, worktreeId);
  console.log("");
  console.log(`Snapshot:      ${result.snapshotPath}`);
  console.log(`Latest:        ${result.latestCommitPath ?? "(no commit context \u2014 latest-commit.txt not updated)"}`);
  console.log(`SHA-256:       ${result.snapshotSha256}`);
  console.log(`Nodes:         ${snapshot.nodes.length}`);
  console.log(`Edges:         ${snapshot.links.length}`);
  console.log(`Files extracted: ${extractions.length} (skipped: ${skipped}, parse warnings: ${totalParseErrors}, cache hits: ${cacheHits}/${sourceFiles.length})`);
  const pushOutcome = await pushSnapshot(snapshot, worktreeId);
  switch (pushOutcome.kind) {
    case "inserted":
      console.log(`Cloud:         pushed to codebase table (commit ${pushOutcome.commitSha.slice(0, 7)})`);
      break;
    case "inserted-with-duplicate-race":
      console.warn(`Cloud:         pushed (commit ${pushOutcome.commitSha.slice(0, 7)}) but ${pushOutcome.rowCount} rows now share`);
      console.warn(`               this identity key \u2014 a concurrent writer raced. v1.1 adds a server-side`);
      console.warn(`               UNIQUE constraint; until then, the older row(s) should be deleted manually.`);
      break;
    case "already-current":
      console.log(`Cloud:         already up-to-date (commit ${pushOutcome.commitSha.slice(0, 7)})`);
      break;
    case "skipped-no-auth":
      console.log(`Cloud:         skipped (not authenticated; run \`hivemind login\` to enable cloud sync)`);
      break;
    case "skipped-no-commit":
      console.log(`Cloud:         skipped (no commit context \u2014 not in a git repo)`);
      break;
    case "skipped-disabled":
      console.log(`Cloud:         skipped (HIVEMIND_GRAPH_PUSH=0)`);
      break;
    case "drift":
      console.warn(`Cloud:         DRIFT \u2014 commit ${pushOutcome.commitSha.slice(0, 7)} is in cloud with`);
      console.warn(`               sha256=${pushOutcome.cloudSha256.slice(0, 12)}... but local rebuild produced`);
      console.warn(`               sha256=${pushOutcome.localSha256.slice(0, 12)}...`);
      console.warn(`               (probably extractor version drift; investigate before forcing.)`);
      break;
    case "error":
      console.warn(`Cloud:         push error (non-fatal): ${pushOutcome.message}`);
      break;
  }
}
function parsePullArgs(args) {
  let cwd = process.cwd();
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--cwd" && i + 1 < args.length) {
      cwd = args[i + 1];
      i += 1;
    } else if (a === "--help" || a === "-h") {
      console.log(USAGE);
      process.exit(0);
    } else {
      console.error(`hivemind graph pull: unknown argument '${a}'`);
      console.error(USAGE);
      process.exit(2);
    }
  }
  return { cwd };
}
async function runPullCommand(args) {
  const opts = parsePullArgs(args);
  const outcome = await pullSnapshot(opts.cwd);
  switch (outcome.kind) {
    case "pulled":
      console.log(`Pulled commit ${outcome.commitSha.slice(0, 7)}`);
      console.log(`  sha256:  ${outcome.snapshotSha256.slice(0, 12)}...`);
      console.log(`  bytes:   ${outcome.bytes}`);
      console.log(`  origin:  worktree_id=${outcome.sourceWorktreePath}`);
      console.log(`  cloud ts: ${new Date(outcome.cloudTs).toISOString()}`);
      break;
    case "up-to-date":
      console.log(`Already up-to-date (commit ${outcome.commitSha.slice(0, 7)}, sha256 ${outcome.snapshotSha256.slice(0, 12)}...)`);
      break;
    case "local-newer":
      console.log(`Local is newer than cloud \u2014 not pulling.`);
      console.log(`  commit:   ${outcome.commitSha.slice(0, 7)}`);
      console.log(`  local ts: ${new Date(outcome.localTs).toISOString()}`);
      console.log(`  cloud ts: ${new Date(outcome.cloudTs).toISOString()}`);
      break;
    case "no-cloud-row":
      console.log(`No cloud snapshot for commit ${outcome.commitSha.slice(0, 7)} \u2014 run \`hivemind graph build\` to create one.`);
      break;
    case "skipped-no-auth":
      console.log(`Skipped: not authenticated (run \`hivemind login\`).`);
      break;
    case "skipped-disabled":
      console.log(`Skipped: HIVEMIND_GRAPH_PULL=0.`);
      break;
    case "skipped-no-head":
      console.log(`Skipped: not in a git repo (\`git rev-parse HEAD\` failed).`);
      break;
    case "error":
      console.warn(`Pull error (non-fatal): ${outcome.message}`);
      process.exitCode = 1;
      break;
  }
}
function workTreeIdFor2(cwd) {
  return createHash6("sha256").update(cwd).digest("hex").slice(0, 16);
}
function discoverSourceFiles(rootDir) {
  const out = [];
  walk(rootDir, out);
  out.sort();
  return out;
}
function walk(dir, out) {
  let entries;
  try {
    entries = readdirSync2(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (DEFAULT_IGNORES.has(entry.name))
      continue;
    if (entry.name.startsWith("."))
      continue;
    const abs = join27(dir, entry.name);
    if (entry.isDirectory()) {
      walk(abs, out);
    } else if (entry.isFile() && isSourceFile(entry.name)) {
      out.push(abs);
    }
  }
}
function isSourceFile(name) {
  if (name.endsWith(".d.ts"))
    return false;
  return name.endsWith(".ts") || name.endsWith(".tsx");
}
function toForwardSlash(p) {
  return sep === "\\" ? p.replace(/\\/g, "/") : p;
}
function readGitCommit(cwd) {
  try {
    return execSync3("git rev-parse HEAD", {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return null;
  }
}
function readGitBranch(cwd) {
  try {
    const out = execSync3("git rev-parse --abbrev-ref HEAD", {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return out === "" || out === "HEAD" ? null : out;
  } catch {
    return null;
  }
}

// dist/src/commands/dashboard.js
import { mkdirSync as mkdirSync16, writeFileSync as writeFileSync19 } from "node:fs";
import { homedir as homedir15 } from "node:os";
import { dirname as dirname12, join as join35, resolve as resolve5 } from "node:path";

// dist/src/dashboard/data.js
import { existsSync as existsSync25, readFileSync as readFileSync24, readdirSync as readdirSync4, statSync as statSync3 } from "node:fs";
import { homedir as homedir14 } from "node:os";
import { join as join33 } from "node:path";

// dist/src/notifications/sources/org-stats.js
import { existsSync as existsSync21, mkdirSync as mkdirSync13, readFileSync as readFileSync21, writeFileSync as writeFileSync17 } from "node:fs";
import { homedir as homedir11 } from "node:os";
import { dirname as dirname9, join as join28 } from "node:path";
var log5 = (msg) => log2("notifications-org-stats", msg);
var FETCH_TIMEOUT_MS = 1500;
var DEFAULT_API_URL3 = "https://api.deeplake.ai";
var CACHE_TTL_MS = 60 * 60 * 1e3;
function cacheFilePath() {
  return join28(homedir11(), ".deeplake", "hivemind-stats-cache.json");
}
function cacheScopeKey(creds) {
  return JSON.stringify({
    apiUrl: creds.apiUrl ?? DEFAULT_API_URL3,
    orgId: creds.orgId ?? "",
    userName: creds.userName ?? ""
  });
}
function scopeFromServer(s) {
  const n = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : 0;
  return {
    sessionsCount: n(s?.sessions_count),
    memoryRecallCount: n(s?.memory_recall_count),
    memorySearchBytes: n(s?.memory_search_bytes)
  };
}
function readCache2(scopeKey) {
  if (!existsSync21(cacheFilePath()))
    return {};
  try {
    const parsed = JSON.parse(readFileSync21(cacheFilePath(), "utf-8"));
    if (!parsed || typeof parsed !== "object")
      return {};
    if (parsed.scopeKey !== scopeKey)
      return {};
    if (typeof parsed.fetchedAt !== "number")
      return {};
    const age = Date.now() - parsed.fetchedAt;
    const data = parsed.data;
    if (!data || typeof data !== "object" || !data.org || !data.user)
      return {};
    if (age >= 0 && age < CACHE_TTL_MS)
      return { fresh: data };
    return { stale: data };
  } catch (e) {
    log5(`cache read failed: ${e?.message ?? String(e)}`);
    return {};
  }
}
function writeCache2(scopeKey, data) {
  try {
    mkdirSync13(dirname9(cacheFilePath()), { recursive: true });
    const body = { fetchedAt: Date.now(), scopeKey, data };
    writeFileSync17(cacheFilePath(), JSON.stringify(body), "utf-8");
  } catch (e) {
    log5(`cache write failed: ${e?.message ?? String(e)}`);
  }
}
async function fetchOrgStats(creds) {
  if (!creds?.token)
    return null;
  const apiUrl = creds.apiUrl ?? DEFAULT_API_URL3;
  const scopeKey = cacheScopeKey(creds);
  const { fresh, stale } = readCache2(scopeKey);
  if (fresh) {
    log5("cache hit \u2014 returning fresh org stats");
    return fresh;
  }
  const url = `${apiUrl}/me/hivemind-stats`;
  const ctrl = new AbortController();
  const timeoutHandle = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${creds.token}`,
        ...creds.orgId ? { "X-Activeloop-Org-Id": creds.orgId } : {}
      },
      signal: ctrl.signal
    });
    if (!resp.ok) {
      log5(`fetch ${url} returned ${resp.status}`);
      return stale ?? null;
    }
    const body = await resp.json();
    if (!body || typeof body !== "object") {
      log5(`fetch ${url} returned malformed body`);
      return stale ?? null;
    }
    const data = {
      org: scopeFromServer(body.org),
      user: scopeFromServer(body.user)
    };
    writeCache2(scopeKey, data);
    log5(`fetched org stats from ${apiUrl}`);
    return data;
  } catch (e) {
    log5(`fetch ${url} failed: ${e?.message ?? String(e)}`);
    return stale ?? null;
  } finally {
    clearTimeout(timeoutHandle);
  }
}

// dist/src/notifications/usage-tracker.js
import { appendFileSync as appendFileSync3, existsSync as existsSync22, mkdirSync as mkdirSync14, readFileSync as readFileSync22, readdirSync as readdirSync3 } from "node:fs";
import { dirname as dirname10, join as join29 } from "node:path";
import { homedir as homedir12 } from "node:os";
var log6 = (msg) => log2("usage-tracker", msg);
function statsFilePath() {
  return join29(homedir12(), ".deeplake", "usage-stats.jsonl");
}
function readUsageRecords() {
  try {
    if (!existsSync22(statsFilePath()))
      return [];
    const raw = readFileSync22(statsFilePath(), "utf-8");
    const out = [];
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed)
        continue;
      try {
        const rec = JSON.parse(trimmed);
        if (typeof rec.endedAt === "string" && typeof rec.sessionId === "string") {
          out.push({
            endedAt: rec.endedAt,
            sessionId: rec.sessionId,
            memorySearchBytes: typeof rec.memorySearchBytes === "number" ? rec.memorySearchBytes : 0,
            memorySearchCount: typeof rec.memorySearchCount === "number" ? rec.memorySearchCount : 0
          });
        }
      } catch {
      }
    }
    return out;
  } catch (e) {
    log6(`readUsageRecords failed: ${e?.message ?? String(e)}`);
    return [];
  }
}
function sumMetric(records, key) {
  let total = 0;
  for (const r of records) {
    const v = r[key];
    if (typeof v === "number" && Number.isFinite(v))
      total += v;
  }
  return total;
}
function countUserGeneratedSkills(userName) {
  if (!userName)
    return 0;
  const dir = join29(homedir12(), ".claude", "skills");
  if (!existsSync22(dir))
    return 0;
  const suffix = `--${userName}`;
  try {
    let count = 0;
    for (const name of readdirSync3(dir)) {
      const idx = name.lastIndexOf(suffix);
      if (idx > 0 && idx + suffix.length === name.length)
        count += 1;
    }
    return count;
  } catch (e) {
    log6(`countUserGeneratedSkills readdir failed: ${e?.message ?? String(e)}`);
    return 0;
  }
}

// dist/src/skillify/state.js
import { readFileSync as readFileSync23, writeFileSync as writeFileSync18, writeSync, mkdirSync as mkdirSync15, renameSync as renameSync9, rmdirSync, existsSync as existsSync24, lstatSync as lstatSync3, unlinkSync as unlinkSync9, openSync as openSync2, closeSync as closeSync2 } from "node:fs";
import { join as join32 } from "node:path";

// dist/src/skillify/legacy-migration.js
import { existsSync as existsSync23, renameSync as renameSync8 } from "node:fs";
import { dirname as dirname11, join as join31 } from "node:path";

// dist/src/skillify/state-dir.js
import { homedir as homedir13 } from "node:os";
import { join as join30 } from "node:path";
function getStateDir() {
  const override = process.env.HIVEMIND_STATE_DIR?.trim();
  return override && override.length > 0 ? override : join30(homedir13(), ".deeplake", "state", "skillify");
}

// dist/src/skillify/legacy-migration.js
var dlog = (msg) => log2("skillify-migrate", msg);
var attempted = false;
function migrateLegacyStateDir() {
  if (process.env.HIVEMIND_STATE_DIR?.trim())
    return;
  if (attempted)
    return;
  attempted = true;
  const current = getStateDir();
  const legacy = join31(dirname11(current), "skilify");
  if (!existsSync23(legacy))
    return;
  if (existsSync23(current))
    return;
  try {
    renameSync8(legacy, current);
    dlog(`migrated ${legacy} -> ${current}`);
  } catch (err) {
    const code = err.code;
    if (code === "EXDEV" || code === "EPERM" || code === "ENOENT" || code === "EEXIST" || code === "ENOTEMPTY") {
      dlog(`migration skipped (${code}); legacy dir left as-is or another process handled it`);
      return;
    }
    throw err;
  }
}

// dist/src/skillify/state.js
var YIELD_BUF = new Int32Array(new SharedArrayBuffer(4));
var TRIGGER_THRESHOLD = (() => {
  const n = Number(process.env.HIVEMIND_SKILLIFY_EVERY_N_TURNS ?? "");
  return Number.isInteger(n) && n > 0 ? n : 20;
})();

// dist/src/dashboard/data.js
var log7 = (msg) => log2("dashboard-data", msg);
var BYTES_PER_TOKEN = 4;
var SAVINGS_MULTIPLIER = 1.7;
function graphsRoot2() {
  return process.env.HIVEMIND_GRAPHS_HOME ?? join33(homedir14(), ".hivemind", "graphs");
}
function bytesToSavedTokens(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0)
    return 0;
  const delivered = bytes / BYTES_PER_TOKEN;
  return (SAVINGS_MULTIPLIER - 1) * delivered;
}
function resolveSnapshot(repoDir2) {
  const snapshotsDir = join33(repoDir2, "snapshots");
  if (!existsSync25(snapshotsDir))
    return null;
  let snapshotPath = null;
  const pointer = join33(repoDir2, "latest-commit.txt");
  if (existsSync25(pointer)) {
    try {
      const sha = readFileSync24(pointer, "utf-8").trim();
      if (sha) {
        const candidate = join33(snapshotsDir, `${sha}.json`);
        if (existsSync25(candidate))
          snapshotPath = candidate;
        else
          log7(`latest-commit.txt points at missing ${sha}.json \u2014 scanning snapshots/`);
      }
    } catch (e) {
      log7(`latest-commit.txt read failed: ${e?.message ?? String(e)}`);
    }
  }
  if (!snapshotPath) {
    try {
      const candidates = readdirSync4(snapshotsDir).filter((name) => name.endsWith(".json")).map((name) => {
        const full = join33(snapshotsDir, name);
        return { full, mtime: statSync3(full).mtimeMs };
      }).sort((a, b) => b.mtime - a.mtime);
      if (candidates.length > 0)
        snapshotPath = candidates[0].full;
    } catch (e) {
      log7(`snapshots/ scan failed: ${e?.message ?? String(e)}`);
    }
  }
  if (!snapshotPath)
    return null;
  let raw;
  try {
    raw = readFileSync24(snapshotPath, "utf-8");
  } catch (e) {
    log7(`snapshot read failed: ${e?.message ?? String(e)}`);
    return null;
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    log7(`snapshot parse failed: ${e?.message ?? String(e)}`);
    return null;
  }
  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.links)) {
    log7("snapshot shape invalid (missing nodes/links arrays)");
    return null;
  }
  return {
    commitSha: parsed.graph?.commit_sha ?? null,
    snapshotPath,
    nodeCount: parsed.nodes.length,
    edgeCount: parsed.links.length,
    snapshot: parsed
  };
}
async function loadKpis(creds) {
  const userName = creds?.userName;
  const skillsCreated = countUserGeneratedSkills(userName);
  const records = readUsageRecords();
  const localBytes = sumMetric(records, "memorySearchBytes");
  const localCount = sumMetric(records, "memorySearchCount");
  let orgStats = null;
  if (creds?.token) {
    try {
      orgStats = await fetchOrgStats(creds);
    } catch (e) {
      log7(`fetchOrgStats threw: ${e?.message ?? String(e)}`);
    }
  }
  if (orgStats) {
    return {
      tokensSaved: bytesToSavedTokens(orgStats.org.memorySearchBytes),
      tokensSource: "org",
      skillsCreated,
      memorySearches: orgStats.org.memoryRecallCount,
      sessionsCount: orgStats.org.sessionsCount,
      userTokensSaved: bytesToSavedTokens(orgStats.user.memorySearchBytes)
    };
  }
  if (records.length > 0) {
    return {
      tokensSaved: bytesToSavedTokens(localBytes),
      tokensSource: "local",
      skillsCreated,
      memorySearches: localCount,
      sessionsCount: records.length,
      userTokensSaved: bytesToSavedTokens(localBytes)
    };
  }
  return {
    tokensSaved: null,
    tokensSource: "none",
    skillsCreated,
    memorySearches: 0,
    sessionsCount: null,
    userTokensSaved: null
  };
}
async function loadDashboardData(opts = {}) {
  const cwd = opts.cwd ?? process.cwd();
  const { key: repoKey, project: repoProject } = deriveProjectKey(cwd);
  const repoDir2 = join33(opts.graphsHome ?? graphsRoot2(), repoKey);
  const graph = resolveSnapshot(repoDir2);
  const creds = opts.creds === void 0 ? loadCredentials() : opts.creds;
  const kpis = await loadKpis(creds);
  return {
    repoKey,
    repoProject,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    kpis,
    graph
  };
}

// dist/src/dashboard/open.js
import { spawn } from "node:child_process";
import { accessSync, constants as fsConstants, statSync as statSync4 } from "node:fs";
import { platform as nodePlatform } from "node:os";
import { delimiter, join as join34 } from "node:path";
function resolveOpenPlatform() {
  const p = nodePlatform();
  if (p === "linux" || p === "darwin" || p === "win32")
    return p;
  return null;
}
function openCommandFor(p, path5) {
  switch (p) {
    case "linux":
      return { command: "xdg-open", args: [path5] };
    case "darwin":
      return { command: "open", args: [path5] };
    case "win32":
      return { command: "cmd", args: ["/c", "start", "", path5] };
  }
}
function findBinaryOnPath(name) {
  const PATH = process.env.PATH ?? "";
  if (!PATH)
    return null;
  const isWin = nodePlatform() === "win32";
  const exts = isWin ? (process.env.PATHEXT ?? ".COM;.EXE;.BAT;.CMD").split(";").map((e) => e.trim()).filter(Boolean) : [""];
  for (const dir of PATH.split(delimiter)) {
    if (!dir)
      continue;
    for (const ext of exts) {
      const candidate = join34(dir, name + ext);
      try {
        const st = statSync4(candidate);
        if (!st.isFile())
          continue;
        if (isWin)
          return candidate;
        try {
          accessSync(candidate, fsConstants.X_OK);
          return candidate;
        } catch {
        }
      } catch {
      }
    }
  }
  return null;
}
function openInBrowser(path5, opts = {}) {
  const p = opts.platformOverride === void 0 ? resolveOpenPlatform() : opts.platformOverride;
  if (!p)
    return { attempted: false };
  const { command, args } = openCommandFor(p, path5);
  const exists = opts.binaryExists ?? ((cmd) => findBinaryOnPath(cmd) !== null);
  if (!exists(command))
    return { attempted: false };
  const useSpawn = opts.spawner ?? spawn;
  try {
    const child = useSpawn(command, args, { stdio: "ignore", detached: true });
    child.on("error", () => {
    });
    if (typeof child.unref === "function") {
      child.unref();
    }
    return { attempted: true, command };
  } catch {
    return { attempted: false };
  }
}

// dist/src/dashboard/render.js
var VIS_NETWORK_CDN = "https://unpkg.com/vis-network@9.1.9/standalone/umd/vis-network.min.js";
var KIND_COLORS = {
  function: "#7aa2f7",
  // soft blue
  class: "#bb9af7",
  // purple
  method: "#9ece6a",
  // green
  interface: "#e0af68",
  // amber
  type_alias: "#7dcfff",
  // cyan
  enum: "#f7768e",
  // pink
  const: "#9d7cd8",
  // muted purple
  module: "#565f89"
  // slate
};
var DEFAULT_NODE_COLOR = "#565f89";
function isObject2(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
function asString(v) {
  return typeof v === "string" ? v : null;
}
function transformSnapshotToVis(snapshot) {
  if (!isObject2(snapshot))
    return { nodes: [], edges: [] };
  const raw = snapshot;
  const visNodes = [];
  const ids = /* @__PURE__ */ new Set();
  if (Array.isArray(raw.nodes)) {
    for (const n of raw.nodes) {
      if (!isObject2(n))
        continue;
      const node = n;
      const id = asString(node.id);
      if (!id)
        continue;
      if (ids.has(id))
        continue;
      ids.add(id);
      const label = asString(node.label) ?? id;
      const kind = asString(node.kind);
      const sourceFile = asString(node.source_file);
      const sourceLoc = asString(node.source_location);
      const titleParts = [];
      if (kind)
        titleParts.push(kind);
      if (sourceFile) {
        const loc = sourceLoc ? `${sourceFile}:${sourceLoc}` : sourceFile;
        titleParts.push(loc);
      }
      const color = kind && KIND_COLORS[kind] ? KIND_COLORS[kind] : DEFAULT_NODE_COLOR;
      visNodes.push({
        id,
        label,
        title: titleParts.length > 0 ? titleParts.map(escHtml).join(" \xB7 ") : escHtml(id),
        group: kind ?? void 0,
        color: { background: color, border: color }
      });
    }
  }
  const visEdges = [];
  if (Array.isArray(raw.links)) {
    for (const l of raw.links) {
      if (!isObject2(l))
        continue;
      const edge = l;
      const from = asString(edge.source);
      const to = asString(edge.target);
      if (!from || !to)
        continue;
      const relation = asString(edge.relation);
      const confidence = asString(edge.confidence);
      const titleParts = [];
      if (relation)
        titleParts.push(relation);
      if (confidence)
        titleParts.push(`[${confidence}]`);
      visEdges.push({
        from,
        to,
        title: titleParts.length > 0 ? titleParts.map(escHtml).join(" ") : `${escHtml(from)} \u2192 ${escHtml(to)}`
      });
    }
  }
  return { nodes: visNodes, edges: visEdges };
}
function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function safeJsonForScript(value) {
  return JSON.stringify(value).replace(/<\//g, "<\\/").replace(/<!--/g, "<\\u0021--").replace(/-->/g, "--\\u003e");
}
function formatTokensCompact(n) {
  if (!Number.isFinite(n) || n <= 0)
    return "0";
  if (n < 1e3)
    return `${Math.round(n)}`;
  if (n < 1e5)
    return `${(n / 1e3).toFixed(1)}k`;
  if (n < 1e6)
    return `${Math.round(n / 1e3)}k`;
  return `${(n / 1e6).toFixed(1)}M`;
}
function formatInt(n) {
  if (!Number.isFinite(n))
    return "0";
  return Math.round(n).toLocaleString("en-US");
}
function renderKpiCards(kpis) {
  const tokensValue = kpis.tokensSaved == null ? "\u2014" : `~${formatTokensCompact(kpis.tokensSaved)}`;
  const tokensSub = (() => {
    if (kpis.tokensSource === "org") {
      return kpis.userTokensSaved != null ? `Org-wide \xB7 you ~${formatTokensCompact(kpis.userTokensSaved)}` : "Org-wide";
    }
    if (kpis.tokensSource === "local")
      return "Local (this machine)";
    return "Run a session to start tracking";
  })();
  const memoryValue = kpis.memorySearches > 0 ? formatInt(kpis.memorySearches) : kpis.tokensSource === "none" ? "\u2014" : "0";
  const sessionsValue = kpis.sessionsCount == null ? "\u2014" : formatInt(kpis.sessionsCount);
  const cards = [
    {
      label: "Tokens saved",
      value: tokensValue,
      sub: tokensSub
    },
    {
      label: "Skills created",
      value: formatInt(kpis.skillsCreated),
      sub: "~/.claude/skills/"
    },
    {
      label: "Memory recalls",
      value: memoryValue,
      sub: kpis.tokensSource === "org" ? "Org-wide" : kpis.tokensSource === "local" ? "Local" : ""
    },
    {
      label: "Sessions",
      value: sessionsValue,
      sub: kpis.tokensSource === "org" ? "Org-wide" : kpis.tokensSource === "local" ? "Local" : ""
    }
  ];
  return cards.map((c) => `
        <div class="kpi">
          <div class="kpi-label">${escHtml(c.label)}</div>
          <div class="kpi-value">${escHtml(c.value)}</div>
          <div class="kpi-sub">${escHtml(c.sub)}</div>
        </div>`).join("");
}
function renderGraphSection(data) {
  if (data.graph == null) {
    return `
      <div class="graph-card">
        <h2>Codebase graph</h2>
        <div class="empty">
          No graph snapshot yet for this repo.<br>
          Run <code>hivemind graph build</code> to generate one.
        </div>
      </div>`;
  }
  const visPayload = transformSnapshotToVis(data.graph.snapshot);
  const commitLabel = data.graph.commitSha ? `commit ${data.graph.commitSha.slice(0, 12)}` : "no commit (loose dir)";
  const meta = `${formatInt(data.graph.nodeCount)} nodes \xB7 ${formatInt(data.graph.edgeCount)} edges \xB7 ${commitLabel}`;
  return `
      <div class="graph-card">
        <h2>Codebase graph</h2>
        <div class="graph-meta">${escHtml(meta)}</div>
        <div id="graph"></div>
      </div>
      <script type="application/json" id="hm-graph-data">${safeJsonForScript(visPayload)}</script>
      <script src="${VIS_NETWORK_CDN}"></script>
      <script>
        (function () {
          var holder = document.getElementById('hm-graph-data');
          var container = document.getElementById('graph');
          if (!holder || !container || typeof vis === 'undefined') return;
          var payload;
          try { payload = JSON.parse(holder.textContent); }
          catch (e) { container.textContent = 'graph payload parse failed'; return; }
          if (!payload || !Array.isArray(payload.nodes) || payload.nodes.length === 0) {
            container.textContent = 'snapshot has no nodes';
            return;
          }
          new vis.Network(container, payload, {
            nodes: {
              shape: 'dot',
              size: 9,
              font: { color: '#e8eaed', size: 11, face: 'system-ui, sans-serif' },
              borderWidth: 1,
            },
            edges: {
              color: { color: 'rgba(120, 130, 150, 0.45)', highlight: '#f5b80a', hover: '#e8eaed' },
              arrows: { to: { enabled: true, scaleFactor: 0.45 } },
              smooth: { enabled: true, type: 'continuous', roundness: 0.2 },
              width: 1,
            },
            physics: {
              stabilization: { iterations: 120 },
              barnesHut: { gravitationalConstant: -2200, springLength: 80, springConstant: 0.04 },
            },
            interaction: { hover: true, dragNodes: true, tooltipDelay: 120 },
          });
        }());
      </script>`;
}
var STYLES = `
        :root {
          color-scheme: dark;
          --bg: #0b0d10;
          --fg: #e8eaed;
          --muted: #8b9099;
          --accent: #f5b80a;
          --card: #15181d;
          --border: #22272e;
        }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        body {
          font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: var(--bg);
          color: var(--fg);
          padding: 24px;
        }
        .header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
        .brand { font-weight: 600; font-size: 18px; }
        .brand .bee { color: var(--accent); margin-right: 4px; }
        .brand .repo { color: var(--muted); font-weight: 400; margin-left: 8px; }
        .header .ts { color: var(--muted); font-size: 12px; }
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .kpi { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; }
        .kpi-label { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }
        .kpi-value { font-size: 28px; font-weight: 600; margin-top: 6px; line-height: 1.1; }
        .kpi-sub { color: var(--muted); font-size: 12px; margin-top: 4px; }
        .graph-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
        .graph-card h2 { margin: 0 0 8px; font-size: 15px; font-weight: 500; }
        .graph-meta { color: var(--muted); font-size: 12px; margin-bottom: 12px; }
        #graph { height: 70vh; border: 1px solid var(--border); border-radius: 4px; background: #0e1116; }
        .empty { padding: 48px 16px; text-align: center; color: var(--muted); }
        .empty code { background: #1c2128; padding: 2px 6px; border-radius: 3px; color: var(--fg); font-family: ui-monospace, "SFMono-Regular", monospace; }
        .footer { color: var(--muted); font-size: 11px; margin-top: 24px; text-align: right; }
`;
function renderDashboardHtml(data) {
  const title = `Hivemind Dashboard \xB7 ${data.repoProject}`;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escHtml(title)}</title>
    <style>${STYLES}</style>
  </head>
  <body>
    <div class="header">
      <div class="brand">
        <span class="bee">\u{1F41D}</span>hivemind dashboard
        <span class="repo">/ ${escHtml(data.repoProject)}</span>
      </div>
      <div class="ts">${escHtml(data.generatedAt)}</div>
    </div>
    <div class="kpi-grid">${renderKpiCards(data.kpis)}
    </div>
    ${renderGraphSection(data)}
    <div class="footer">repo_key ${escHtml(data.repoKey)}</div>
  </body>
</html>
`;
}

// dist/src/dashboard/serve.js
import { createServer } from "node:http";
var DEFAULT_PORT = 8123;
var DEFAULT_HOST = "127.0.0.1";
function handleRequest(html) {
  return (req, res) => {
    const url = req.url ?? "/";
    const path5 = url.split("?")[0];
    if (req.method === "GET" && (path5 === "/" || path5 === "/index.html")) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.end(html);
      return;
    }
    if (req.method === "GET" && path5 === "/health") {
      res.statusCode = 204;
      res.end();
      return;
    }
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Not found. The dashboard lives at /.\n");
  };
}
function tryListen(server, host, port) {
  return new Promise((resolve9, reject) => {
    const onError = (err) => {
      server.off("listening", onListening);
      reject(err);
    };
    const onListening = () => {
      server.off("error", onError);
      const addr = server.address();
      if (!addr || typeof addr === "string") {
        reject(new Error("server bound to a non-IP address"));
        return;
      }
      resolve9(addr.port);
    };
    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(port, host);
  });
}
async function serveDashboardHtml(opts) {
  const host = opts.host ?? DEFAULT_HOST;
  const requested = opts.port === void 0 || !Number.isFinite(opts.port) || opts.port < 0 ? DEFAULT_PORT : opts.port;
  const server = createServer(handleRequest(opts.html));
  let bound;
  try {
    bound = await tryListen(server, host, requested);
  } catch (e) {
    if (e?.code !== "EADDRINUSE")
      throw e;
    const fallback = createServer(handleRequest(opts.html));
    bound = await tryListen(fallback, host, 0);
    server.removeAllListeners();
    return makeHandle(fallback, host, bound);
  }
  return makeHandle(server, host, bound);
}
function makeHandle(server, host, port) {
  let resolveStopped;
  const stopped = new Promise((resolve9) => {
    resolveStopped = resolve9;
  });
  server.on("close", () => resolveStopped());
  return {
    host,
    port,
    stopped,
    close: () => new Promise((resolve9, reject) => {
      server.close((err) => err ? reject(err) : resolve9());
    })
  };
}

// dist/src/commands/dashboard.js
var USAGE2 = `hivemind dashboard \u2014 codebase graph + KPI dashboard (HTML)

Usage:
  hivemind dashboard [--cwd <path>] [--out <path>] [--no-open]
                     [--serve] [--port <n>]
      Build a self-contained HTML dashboard for this repo, write it
      to disk, and either open it in the default browser or serve
      it over loopback HTTP for headless / SSH workflows.

      --cwd <path>   Use a different project root (defaults to cwd).
      --out <path>   Write to a custom path (defaults to
                     ~/.hivemind/dashboards/<repo-key>/index.html).
      --no-open      Don't open the browser. Combine with --serve
                     to start the server without auto-launching.
      --serve        Start a loopback HTTP server (127.0.0.1) so the
                     dashboard is reachable at a URL. Stays alive
                     until Ctrl+C. Ideal for VS Code / Cursor
                     Remote-SSH (auto-forwards the port \u2192 click to
                     open in the integrated browser tab).
      --port <n>     Port for --serve (default 8123). Falls back to
                     a kernel-assigned port if <n> is in use.

  hivemind dashboard --help
      Show this message.

Data sources (all read-only):
  - Graph snapshot at ~/.hivemind/graphs/<repo-key>/   (produced by
    \`hivemind graph build\`; the dashboard works without it and shows
    an empty-state until the producer has run)
  - KPIs via the org stats endpoint (cached) with a local fallback
    to ~/.deeplake/usage-stats.jsonl
  - Skills created from ~/.claude/skills/<name>--<author>/ directories
`;
function parsePort(raw) {
  if (raw === void 0 || raw === "")
    return { error: "--port requires a value" };
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > 65535) {
    return { error: `--port must be an integer in [0, 65535], got '${raw}'` };
  }
  return n;
}
function parseDashboardArgs(args) {
  let cwd;
  let outPath = "";
  let open3 = true;
  let serve = false;
  let port;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--help" || a === "-h")
      return { help: true };
    if (a === "--no-open") {
      open3 = false;
      continue;
    }
    if (a === "--serve") {
      serve = true;
      continue;
    }
    if (a === "--cwd") {
      const v = args[++i];
      if (v === void 0 || v.startsWith("-")) {
        return { error: "--cwd requires a value" };
      }
      cwd = v;
      continue;
    }
    if (a.startsWith("--cwd=")) {
      cwd = a.slice("--cwd=".length);
      continue;
    }
    if (a === "--out") {
      const v = args[++i];
      if (v === void 0 || v.startsWith("-")) {
        return { error: "--out requires a value" };
      }
      outPath = v;
      continue;
    }
    if (a.startsWith("--out=")) {
      outPath = a.slice("--out=".length);
      continue;
    }
    if (a === "--port") {
      const v = args[++i];
      if (v === void 0 || v.startsWith("-")) {
        return { error: "--port requires a value" };
      }
      const parsed = parsePort(v);
      if (typeof parsed === "object")
        return { error: parsed.error };
      port = parsed;
      continue;
    }
    if (a.startsWith("--port=")) {
      const parsed = parsePort(a.slice("--port=".length));
      if (typeof parsed === "object")
        return { error: parsed.error };
      port = parsed;
      continue;
    }
    return { error: `unknown arg '${a}'` };
  }
  if (port !== void 0 && !serve) {
    return { error: "--port requires --serve" };
  }
  return {
    args: {
      cwd: cwd ?? process.cwd(),
      outPath,
      open: open3,
      serve,
      port
    }
  };
}
function defaultDashboardOutPath(repoKey) {
  return join35(homedir15(), ".hivemind", "dashboards", repoKey, "index.html");
}
async function runDashboardCommand(rawArgs, runOpts = {}) {
  const out = runOpts.out ?? ((s) => {
    process.stdout.write(s);
  });
  const err = runOpts.err ?? ((s) => {
    process.stderr.write(s);
  });
  const opener = runOpts.opener ?? openInBrowser;
  const parsed = parseDashboardArgs(rawArgs);
  if (parsed.help) {
    out(USAGE2);
    return 0;
  }
  if (parsed.error || !parsed.args) {
    err(`hivemind dashboard: ${parsed.error ?? "invalid arguments"}
`);
    err(USAGE2);
    return 2;
  }
  const { cwd, outPath, open: open3 } = parsed.args;
  let data;
  try {
    data = await loadDashboardData({ cwd });
  } catch (e) {
    err(`hivemind dashboard: failed to load data: ${e?.message ?? String(e)}
`);
    return 1;
  }
  const html = renderDashboardHtml(data);
  const finalOut = outPath || defaultDashboardOutPath(data.repoKey);
  const absOut = resolve5(finalOut);
  try {
    mkdirSync16(dirname12(absOut), { recursive: true });
    writeFileSync19(absOut, html, "utf-8");
  } catch (e) {
    err(`hivemind dashboard: failed to write ${absOut}: ${e?.message ?? String(e)}
`);
    return 1;
  }
  out(`Wrote ${absOut}
`);
  if (data.graph == null) {
    out(`(no codebase graph yet \u2014 run 'hivemind graph build' to populate)
`);
  }
  if (parsed.args.serve) {
    return await runServeLoop(html, parsed.args, runOpts, out, err);
  }
  if (open3) {
    const result = opener(absOut);
    if (result.attempted) {
      out(`Opening via ${result.command}
`);
    } else {
      out(`(no opener for this platform; open the file above manually)
`);
    }
  }
  return 0;
}
async function runServeLoop(html, args, runOpts, out, err) {
  const server = runOpts.server ?? serveDashboardHtml;
  const opener = runOpts.opener ?? openInBrowser;
  const onSignal = runOpts.onSignal ?? defaultOnSignal;
  let handle;
  try {
    handle = await server({ html, port: args.port });
  } catch (e) {
    err(`hivemind dashboard: failed to start server: ${e?.message ?? String(e)}
`);
    return 1;
  }
  const url = `http://${handle.host}:${handle.port}/`;
  out(`Serving dashboard at ${url}  (Ctrl+C to stop)
`);
  if (args.open) {
    const result = opener(url);
    if (result.attempted) {
      out(`Opening via ${result.command}
`);
    } else {
      out(`(no opener for this platform; click the URL above or open it manually)
`);
    }
  }
  let resolveDone;
  const done = new Promise((r) => {
    resolveDone = r;
  });
  const shutdown = async () => {
    try {
      await handle.close();
    } catch {
    }
    resolveDone(0);
  };
  const offInt = onSignal("SIGINT", shutdown);
  const offTerm = onSignal("SIGTERM", shutdown);
  handle.stopped.then(() => resolveDone(0));
  try {
    return await done;
  } finally {
    offInt();
    offTerm();
  }
}
function defaultOnSignal(signal, handler) {
  process.on(signal, handler);
  return () => process.off(signal, handler);
}

// dist/src/commands/skillify.js
import { readdirSync as readdirSync8, existsSync as existsSync36, readFileSync as readFileSync32, mkdirSync as mkdirSync23, renameSync as renameSync12 } from "node:fs";
import { homedir as homedir24 } from "node:os";
import { dirname as dirname17, join as join46 } from "node:path";

// dist/src/skillify/scope-config.js
import { existsSync as existsSync26, mkdirSync as mkdirSync17, readFileSync as readFileSync25, writeFileSync as writeFileSync20 } from "node:fs";
import { join as join36 } from "node:path";
function configPath() {
  return join36(getStateDir(), "config.json");
}
var DEFAULT = { scope: "me", team: [], install: "project" };
function loadScopeConfig() {
  migrateLegacyStateDir();
  const CONFIG_PATH2 = configPath();
  if (!existsSync26(CONFIG_PATH2))
    return DEFAULT;
  try {
    const raw = JSON.parse(readFileSync25(CONFIG_PATH2, "utf-8"));
    const scope = raw.scope === "team" ? "team" : raw.scope === "org" ? "team" : "me";
    const team = Array.isArray(raw.team) ? raw.team.filter((s) => typeof s === "string") : [];
    const install = raw.install === "global" ? "global" : "project";
    return { scope, team, install };
  } catch {
    return DEFAULT;
  }
}
function saveScopeConfig(cfg) {
  migrateLegacyStateDir();
  mkdirSync17(getStateDir(), { recursive: true });
  writeFileSync20(configPath(), JSON.stringify(cfg, null, 2));
}

// dist/src/skillify/pull.js
import { existsSync as existsSync30, readFileSync as readFileSync28, writeFileSync as writeFileSync23, mkdirSync as mkdirSync20, renameSync as renameSync11, lstatSync as lstatSync5, readlinkSync as readlinkSync2, symlinkSync as symlinkSync2, unlinkSync as unlinkSync11 } from "node:fs";
import { homedir as homedir18 } from "node:os";
import { dirname as dirname14, join as join40 } from "node:path";

// dist/src/skillify/skill-writer.js
import { existsSync as existsSync27, mkdirSync as mkdirSync18, readFileSync as readFileSync26, readdirSync as readdirSync5, statSync as statSync5, writeFileSync as writeFileSync21 } from "node:fs";
import { homedir as homedir16 } from "node:os";
import { join as join37 } from "node:path";
function assertValidSkillName(name) {
  if (typeof name !== "string" || name.length === 0) {
    throw new Error(`invalid skill name: empty or non-string`);
  }
  if (name.length > 100) {
    throw new Error(`invalid skill name: too long (${name.length} chars)`);
  }
  if (name.includes("/") || name.includes("\\") || name.includes("..")) {
    throw new Error(`invalid skill name: contains path separator or '..': ${name}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`invalid skill name: must be kebab-case (lowercase a-z, 0-9, hyphen): ${name}`);
  }
}
function skillDir(skillsRoot, name) {
  return join37(skillsRoot, name);
}
function skillPath(skillsRoot, name) {
  return join37(skillDir(skillsRoot, name), "SKILL.md");
}
function renderFrontmatter(fm) {
  const lines = ["---"];
  lines.push(`name: ${fm.name}`);
  lines.push(`description: ${JSON.stringify(fm.description)}`);
  if (fm.trigger)
    lines.push(`trigger: ${JSON.stringify(fm.trigger)}`);
  if (fm.author)
    lines.push(`author: ${fm.author}`);
  lines.push(`source_sessions:`);
  for (const s of fm.source_sessions)
    lines.push(`  - ${s}`);
  if (fm.contributors && fm.contributors.length > 0) {
    lines.push(`contributors:`);
    for (const c of fm.contributors)
      lines.push(`  - ${c}`);
  }
  lines.push(`version: ${fm.version}`);
  lines.push(`created_by_agent: ${fm.created_by_agent}`);
  lines.push(`created_at: ${fm.created_at}`);
  lines.push(`updated_at: ${fm.updated_at}`);
  lines.push("---");
  return lines.join("\n");
}
function parseFrontmatter(text) {
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n"))
    return null;
  const end = text.indexOf("\n---", 4);
  if (end < 0)
    return null;
  const head = text.slice(4, end).trim();
  const body = text.slice(end + 4).replace(/^\r?\n/, "");
  const fm = { source_sessions: [] };
  let arrayKey = null;
  for (const raw of head.split(/\r?\n/)) {
    if (arrayKey) {
      const m2 = raw.match(/^\s+-\s+(.+)$/);
      if (m2) {
        const arr = fm[arrayKey] ?? [];
        arr.push(m2[1].trim());
        fm[arrayKey] = arr;
        continue;
      }
      arrayKey = null;
    }
    if (raw.startsWith("source_sessions:")) {
      arrayKey = "source_sessions";
      continue;
    }
    if (raw.startsWith("contributors:")) {
      arrayKey = "contributors";
      fm.contributors = [];
      continue;
    }
    const m = raw.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!m)
      continue;
    const [, k, v] = m;
    let val = v;
    if (v.startsWith('"') && v.endsWith('"')) {
      try {
        val = JSON.parse(v);
      } catch {
      }
    } else if (k === "version") {
      const n = parseInt(v, 10);
      if (Number.isFinite(n))
        val = n;
    }
    fm[k] = val;
  }
  return { fm, body };
}
function writeNewSkill(args) {
  assertValidSkillName(args.name);
  const dir = skillDir(args.skillsRoot, args.name);
  const path5 = skillPath(args.skillsRoot, args.name);
  if (existsSync27(path5)) {
    throw new Error(`skill already exists at ${path5}; use mergeSkill`);
  }
  mkdirSync18(dir, { recursive: true });
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const author = args.author && args.author.length > 0 ? args.author : void 0;
  const contributors = author ? [author] : [];
  const fm = {
    name: args.name,
    description: args.description,
    trigger: args.trigger,
    author,
    source_sessions: args.sourceSessions,
    contributors,
    version: 1,
    created_by_agent: args.agent,
    created_at: now,
    updated_at: now
  };
  const text = `${renderFrontmatter(fm)}

${args.body.trim()}
`;
  writeFileSync21(path5, text);
  return {
    path: path5,
    action: "created",
    version: 1,
    createdAt: now,
    updatedAt: now,
    author,
    contributors
  };
}
function listSkills(skillsRoot) {
  if (!existsSync27(skillsRoot))
    return [];
  const out = [];
  for (const name of readdirSync5(skillsRoot)) {
    const skillFile = join37(skillsRoot, name, "SKILL.md");
    if (existsSync27(skillFile) && statSync5(skillFile).isFile()) {
      out.push({ name, body: readFileSync26(skillFile, "utf-8") });
    }
  }
  return out;
}
function resolveSkillsRoot(install, cwd) {
  if (install === "global") {
    return join37(homedir16(), ".claude", "skills");
  }
  return join37(cwd, ".claude", "skills");
}

// dist/src/skillify/manifest.js
import { existsSync as existsSync28, lstatSync as lstatSync4, mkdirSync as mkdirSync19, readFileSync as readFileSync27, renameSync as renameSync10, unlinkSync as unlinkSync10, writeFileSync as writeFileSync22 } from "node:fs";
import { dirname as dirname13, join as join38 } from "node:path";
function emptyManifest() {
  return { version: 1, entries: [] };
}
function manifestPath() {
  return join38(getStateDir(), "pulled.json");
}
function loadManifest(path5 = manifestPath()) {
  migrateLegacyStateDir();
  if (!existsSync28(path5))
    return emptyManifest();
  let raw;
  try {
    raw = readFileSync27(path5, "utf-8");
  } catch {
    return emptyManifest();
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object")
      return emptyManifest();
    if (parsed.version !== 1 || !Array.isArray(parsed.entries))
      return emptyManifest();
    const entries = [];
    for (const e of parsed.entries) {
      if (!e || typeof e !== "object")
        continue;
      if (typeof e.dirName !== "string" || !e.dirName)
        continue;
      if (e.dirName.includes("/") || e.dirName.includes("\\") || e.dirName.includes(".."))
        continue;
      if (typeof e.name !== "string" || !e.name)
        continue;
      if (typeof e.author !== "string")
        continue;
      if (typeof e.installRoot !== "string" || !e.installRoot)
        continue;
      if (e.install !== "global" && e.install !== "project")
        continue;
      const symlinks = Array.isArray(e.symlinks) ? e.symlinks.filter((p) => typeof p === "string" && p.length > 0 && (p.startsWith("/") || /^[A-Za-z]:[\\/]/.test(p)) && // absolute (POSIX or Windows)
      !p.includes("..")) : [];
      entries.push({
        dirName: e.dirName,
        name: e.name,
        author: e.author,
        projectKey: typeof e.projectKey === "string" ? e.projectKey : "",
        remoteVersion: typeof e.remoteVersion === "number" ? e.remoteVersion : 1,
        install: e.install,
        installRoot: e.installRoot,
        pulledAt: typeof e.pulledAt === "string" ? e.pulledAt : (/* @__PURE__ */ new Date()).toISOString(),
        symlinks
      });
    }
    return { version: 1, entries };
  } catch {
    return emptyManifest();
  }
}
function saveManifest(m, path5 = manifestPath()) {
  migrateLegacyStateDir();
  mkdirSync19(dirname13(path5), { recursive: true });
  const tmp = `${path5}.tmp`;
  writeFileSync22(tmp, JSON.stringify(m, null, 2) + "\n", { mode: 384 });
  renameSync10(tmp, path5);
}
function recordPull(entry, path5 = manifestPath()) {
  const m = loadManifest(path5);
  const idx = m.entries.findIndex((e) => e.install === entry.install && e.installRoot === entry.installRoot && e.dirName === entry.dirName);
  if (idx >= 0)
    m.entries[idx] = entry;
  else
    m.entries.push(entry);
  saveManifest(m, path5);
}
function removePullEntry(install, installRoot, dirName, path5 = manifestPath()) {
  const m = loadManifest(path5);
  const before = m.entries.length;
  m.entries = m.entries.filter((e) => !(e.install === install && e.installRoot === installRoot && e.dirName === dirName));
  if (m.entries.length !== before)
    saveManifest(m, path5);
}
function entriesForRoot(m, install, installRoot) {
  return m.entries.filter((e) => e.install === install && e.installRoot === installRoot);
}
function unlinkSymlinks(paths) {
  for (const path5 of paths) {
    let st;
    try {
      st = lstatSync4(path5);
    } catch {
      continue;
    }
    if (!st.isSymbolicLink())
      continue;
    try {
      unlinkSync10(path5);
    } catch {
    }
  }
}
function pruneOrphanedEntries(path5 = manifestPath()) {
  const m = loadManifest(path5);
  const live = [];
  let pruned = 0;
  for (const e of m.entries) {
    if (existsSync28(join38(e.installRoot, e.dirName))) {
      live.push(e);
      continue;
    }
    unlinkSymlinks(e.symlinks);
    pruned++;
  }
  if (pruned > 0)
    saveManifest({ version: 1, entries: live }, path5);
  return pruned;
}

// dist/src/skillify/agent-roots.js
import { existsSync as existsSync29 } from "node:fs";
import { homedir as homedir17 } from "node:os";
import { join as join39 } from "node:path";
function resolveDetected(home) {
  const out = [];
  const codexInstalled = existsSync29(join39(home, ".codex"));
  const piInstalled = existsSync29(join39(home, ".pi", "agent"));
  const hermesInstalled = existsSync29(join39(home, ".hermes"));
  if (codexInstalled || piInstalled) {
    out.push(join39(home, ".agents", "skills"));
  }
  if (hermesInstalled) {
    out.push(join39(home, ".hermes", "skills"));
  }
  if (piInstalled) {
    out.push(join39(home, ".pi", "agent", "skills"));
  }
  return out;
}
function detectAgentSkillsRoots(canonicalRoot, home = homedir17()) {
  return resolveDetected(home).filter((p) => p !== canonicalRoot);
}

// dist/src/skillify/pull.js
function assertValidAuthor(author) {
  if (!author)
    throw new Error("author is empty");
  if (author.length > 64)
    throw new Error(`author too long (${author.length}): ${author.slice(0, 32)}\u2026`);
  if (!/^[A-Za-z0-9_.\-@]+$/.test(author)) {
    throw new Error(`author contains invalid characters: ${author}`);
  }
}
function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/'/g, "''").replace(/[\x01-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "");
}
function buildPullSql(args) {
  const where = [];
  if (args.users.length > 0) {
    const list = args.users.map((u) => `'${esc(u)}'`).join(", ");
    where.push(`author IN (${list})`);
  }
  if (args.skillName) {
    where.push(`name = '${esc(args.skillName)}'`);
  }
  const whereClause = where.length > 0 ? ` WHERE ${where.join(" AND ")}` : "";
  const contributorsCol = args.includeContributors === false ? "" : "contributors, ";
  return `SELECT name, project, project_key, body, version, source_agent, scope, author, ${contributorsCol}description, trigger_text, source_sessions, install, created_at, updated_at FROM "${args.tableName}"${whereClause} ORDER BY project_key ASC, name ASC, version DESC`;
}
function isMissingContributorsColumnError(message) {
  if (!message)
    return false;
  return /contributors.*(?:does not exist|not found|unknown)/i.test(message) || /(?:does not exist|unknown column).*contributors/i.test(message);
}
function isMissingTableError2(message) {
  if (!message)
    return false;
  if (/\bcolumn\b/i.test(message))
    return false;
  return /Table does not exist|relation .* does not exist|no such table/i.test(message);
}
function resolvePullDestination(install, cwd) {
  if (install === "global")
    return join40(homedir18(), ".claude", "skills");
  if (!cwd)
    throw new Error("install=project requires a cwd");
  return join40(cwd, ".claude", "skills");
}
function fanOutSymlinks(canonicalDir, dirName, agentRoots) {
  const out = [];
  for (const root of agentRoots) {
    const link = join40(root, dirName);
    let existing;
    try {
      existing = lstatSync5(link);
    } catch {
      existing = null;
    }
    if (existing) {
      if (!existing.isSymbolicLink()) {
        continue;
      }
      let current;
      try {
        current = readlinkSync2(link);
      } catch {
        current = null;
      }
      if (current === canonicalDir) {
        out.push(link);
        continue;
      }
      try {
        unlinkSync11(link);
      } catch {
        continue;
      }
    }
    try {
      mkdirSync20(dirname14(link), { recursive: true });
      symlinkSync2(canonicalDir, link, "dir");
      out.push(link);
    } catch {
    }
  }
  return out;
}
function backfillSymlinks(installRoot) {
  const manifest = loadManifest();
  const entries = entriesForRoot(manifest, "global", installRoot);
  if (entries.length === 0)
    return;
  const detected = detectAgentSkillsRoots(installRoot);
  for (const entry of entries) {
    const canonical = join40(entry.installRoot, entry.dirName);
    if (!existsSync30(canonical))
      continue;
    const fresh = fanOutSymlinks(canonical, entry.dirName, detected);
    if (sameSorted(fresh, entry.symlinks))
      continue;
    try {
      recordPull({ ...entry, symlinks: fresh });
    } catch {
    }
  }
}
function sameSorted(a, b) {
  if (a.length !== b.length)
    return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  for (let i = 0; i < sa.length; i++)
    if (sa[i] !== sb[i])
      return false;
  return true;
}
function selectLatestPerName(rows) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const r of rows) {
    const name = String(r.name ?? "");
    const projectKey = String(r.project_key ?? "");
    if (!name)
      continue;
    const key = `${projectKey}\0${name}`;
    if (seen.has(key))
      continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}
function renderSkillFile(row) {
  const sources = parseSourceSessions(row.source_sessions);
  const author = typeof row.author === "string" && row.author.length > 0 ? row.author : void 0;
  const contributors = parseContributors(row.contributors);
  const renderedContributors = contributors.length > 0 ? contributors : author ? [author] : [];
  const fm = {
    name: String(row.name ?? ""),
    description: String(row.description ?? ""),
    trigger: typeof row.trigger_text === "string" && row.trigger_text.length > 0 ? String(row.trigger_text) : void 0,
    author,
    source_sessions: sources,
    contributors: renderedContributors,
    version: Number(row.version ?? 1),
    created_by_agent: String(row.source_agent ?? "unknown"),
    created_at: String(row.created_at ?? (/* @__PURE__ */ new Date()).toISOString()),
    updated_at: String(row.updated_at ?? (/* @__PURE__ */ new Date()).toISOString())
  };
  const body = String(row.body ?? "").trim();
  return `${renderFrontmatter2(fm)}

${body}
`;
}
function parseSourceSessions(v) {
  if (Array.isArray(v))
    return v.map(String);
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed))
        return parsed.map(String);
    } catch {
    }
  }
  return [];
}
function parseContributors(v) {
  if (Array.isArray(v))
    return v.map(String);
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed))
        return parsed.map(String);
    } catch {
    }
  }
  return [];
}
function renderFrontmatter2(fm) {
  const lines = ["---"];
  lines.push(`name: ${fm.name}`);
  lines.push(`description: ${JSON.stringify(fm.description)}`);
  if (fm.trigger)
    lines.push(`trigger: ${JSON.stringify(fm.trigger)}`);
  if (fm.author)
    lines.push(`author: ${fm.author}`);
  lines.push(`source_sessions:`);
  for (const s of fm.source_sessions)
    lines.push(`  - ${s}`);
  if (fm.contributors && fm.contributors.length > 0) {
    lines.push(`contributors:`);
    for (const c of fm.contributors)
      lines.push(`  - ${c}`);
  }
  lines.push(`version: ${fm.version}`);
  lines.push(`created_by_agent: ${fm.created_by_agent}`);
  lines.push(`created_at: ${fm.created_at}`);
  lines.push(`updated_at: ${fm.updated_at}`);
  lines.push("---");
  return lines.join("\n");
}
function readLocalVersion(path5) {
  if (!existsSync30(path5))
    return null;
  try {
    const text = readFileSync28(path5, "utf-8");
    const parsed = parseFrontmatter(text);
    if (!parsed)
      return null;
    const v = parsed.fm.version;
    return typeof v === "number" ? v : null;
  } catch {
    return null;
  }
}
function decideAction(args) {
  const shouldWrite = args.localVersion === null || args.remoteVersion > args.localVersion || args.force;
  if (!shouldWrite)
    return "skipped";
  return args.dryRun ? "dryrun" : "wrote";
}
async function runPull(opts) {
  if (!opts.dryRun)
    pruneOrphanedEntries();
  const sql = buildPullSql({
    tableName: opts.tableName,
    users: opts.users,
    skillName: opts.skillName
  });
  let rows = [];
  try {
    rows = await opts.query(sql);
  } catch (e) {
    if (isMissingTableError2(e?.message)) {
      rows = [];
    } else if (isMissingContributorsColumnError(e?.message)) {
      const legacySql = buildPullSql({
        tableName: opts.tableName,
        users: opts.users,
        skillName: opts.skillName,
        includeContributors: false
      });
      rows = await opts.query(legacySql);
    } else {
      throw e;
    }
  }
  const latest = selectLatestPerName(rows);
  const root = resolvePullDestination(opts.install, opts.cwd);
  const summary = { scanned: latest.length, wrote: 0, skipped: 0, dryrun: 0, entries: [] };
  for (const row of latest) {
    const name = String(row.name ?? "");
    if (!name)
      continue;
    try {
      assertValidSkillName(name);
    } catch (e) {
      summary.entries.push({
        name,
        remoteVersion: Number(row.version ?? 1),
        localVersion: null,
        action: "skipped",
        destination: "(invalid name \u2014 skipped)",
        author: String(row.author ?? ""),
        sourceAgent: String(row.source_agent ?? "")
      });
      summary.skipped++;
      continue;
    }
    const author = String(row.author ?? "");
    if (!author) {
      summary.entries.push({
        name,
        remoteVersion: Number(row.version ?? 1),
        localVersion: null,
        action: "skipped",
        destination: "(empty author \u2014 skipped)",
        author: "",
        sourceAgent: String(row.source_agent ?? "")
      });
      summary.skipped++;
      continue;
    }
    let dirName;
    try {
      assertValidAuthor(author);
      dirName = `${name}--${author}`;
    } catch (e) {
      summary.entries.push({
        name,
        remoteVersion: Number(row.version ?? 1),
        localVersion: null,
        action: "skipped",
        destination: `(invalid author '${author}' \u2014 skipped)`,
        author,
        sourceAgent: String(row.source_agent ?? "")
      });
      summary.skipped++;
      continue;
    }
    const skillDir2 = join40(root, dirName);
    const skillFile = join40(skillDir2, "SKILL.md");
    const remoteVersion = Number(row.version ?? 1);
    const localVersion = readLocalVersion(skillFile);
    const action = decideAction({
      remoteVersion,
      localVersion,
      force: opts.force ?? false,
      dryRun: opts.dryRun ?? false
    });
    let manifestError;
    if (action === "wrote") {
      mkdirSync20(skillDir2, { recursive: true });
      if (existsSync30(skillFile)) {
        try {
          renameSync11(skillFile, `${skillFile}.bak`);
        } catch {
        }
      }
      writeFileSync23(skillFile, renderSkillFile(row));
      const symlinks = opts.install === "global" ? fanOutSymlinks(skillDir2, dirName, detectAgentSkillsRoots(root)) : [];
      try {
        recordPull({
          dirName,
          name,
          author,
          projectKey: String(row.project_key ?? ""),
          remoteVersion,
          install: opts.install,
          installRoot: root,
          pulledAt: (/* @__PURE__ */ new Date()).toISOString(),
          symlinks
        });
      } catch (e) {
        manifestError = e?.message ?? String(e);
      }
    }
    summary.entries.push({
      name,
      remoteVersion,
      localVersion,
      action,
      destination: skillFile,
      author: String(row.author ?? ""),
      sourceAgent: String(row.source_agent ?? ""),
      manifestError
    });
    if (action === "wrote")
      summary.wrote++;
    else if (action === "dryrun")
      summary.dryrun++;
    else
      summary.skipped++;
  }
  if (!opts.dryRun && opts.install === "global") {
    backfillSymlinks(root);
  }
  return summary;
}

// dist/src/skillify/unpull.js
import { existsSync as existsSync31, readdirSync as readdirSync6, rmSync as rmSync5, statSync as statSync6 } from "node:fs";
import { homedir as homedir19 } from "node:os";
import { join as join41 } from "node:path";
function resolveUnpullRoot(install, cwd) {
  if (install === "global")
    return join41(homedir19(), ".claude", "skills");
  if (!cwd)
    throw new Error("cwd required when install === 'project'");
  return join41(cwd, ".claude", "skills");
}
function runUnpull(opts) {
  const root = resolveUnpullRoot(opts.install, opts.cwd);
  const summary = {
    scanned: 0,
    removed: 0,
    wouldRemove: 0,
    kept: 0,
    manifestPruned: 0,
    entries: []
  };
  const userFilter = new Set(opts.users.filter((u) => u.length > 0));
  const haveUserFilter = userFilter.size > 0;
  if ((opts.all || opts.legacyCleanup) && (haveUserFilter || opts.notMine)) {
    const flags = [opts.all && "--all", opts.legacyCleanup && "--legacy-cleanup"].filter(Boolean).join(" / ");
    const filters = [haveUserFilter && "--user/--users", opts.notMine && "--not-mine"].filter(Boolean).join(" / ");
    throw new Error(`${flags} cannot be combined with ${filters}: entries removed by ${flags} are not in the manifest and have no author metadata, so the filter would silently fail to apply. Run the filtered unpull first, then ${flags} as a separate invocation.`);
  }
  const manifest = loadManifest();
  const entries = entriesForRoot(manifest, opts.install, root);
  for (const entry of entries) {
    summary.scanned++;
    const path5 = join41(root, entry.dirName);
    if (!existsSync31(path5)) {
      if (!opts.dryRun) {
        unlinkSymlinks(entry.symlinks);
        removePullEntry(opts.install, entry.installRoot, entry.dirName);
      }
      summary.entries.push({
        dirName: entry.dirName,
        kind: "manifest-orphan",
        author: entry.author,
        name: entry.name,
        action: opts.dryRun ? "kept-policy" : "manifest-pruned",
        reason: opts.dryRun ? "would-prune (orphan, dir missing)" : "directory was already missing",
        path: ""
      });
      if (!opts.dryRun)
        summary.manifestPruned++;
      else
        summary.kept++;
      continue;
    }
    const decision = decideTargetForManifestEntry(entry, opts, userFilter, haveUserFilter);
    const result = {
      dirName: entry.dirName,
      kind: "pulled-manifest",
      author: entry.author,
      name: entry.name,
      action: "kept-policy",
      path: path5
    };
    if (!decision.shouldRemove) {
      result.reason = decision.reason;
      summary.kept++;
      summary.entries.push(result);
      continue;
    }
    if (opts.dryRun) {
      result.action = "would-remove";
      summary.wouldRemove++;
    } else {
      try {
        rmSync5(path5, { recursive: true, force: true });
        unlinkSymlinks(entry.symlinks);
        removePullEntry(opts.install, entry.installRoot, entry.dirName);
        result.action = "removed";
        summary.removed++;
      } catch (e) {
        result.action = "kept-policy";
        result.reason = `rm failed: ${e?.message ?? e}`;
        summary.kept++;
      }
    }
    summary.entries.push(result);
  }
  if (existsSync31(root) && (opts.all || opts.legacyCleanup)) {
    const manifestDirNames = new Set(entries.map((e) => e.dirName));
    for (const dirName of readdirSync6(root)) {
      if (manifestDirNames.has(dirName))
        continue;
      const path5 = join41(root, dirName);
      let st;
      try {
        st = statSync6(path5);
      } catch {
        continue;
      }
      if (!st.isDirectory())
        continue;
      const isLegacyProjectKey = /^[0-9a-f]{16}$/.test(dirName);
      const isLocallyMined = !isLegacyProjectKey && /^[A-Za-z0-9_.-]+$/.test(dirName) && !dirName.includes("--");
      let kind;
      let shouldRemove = false;
      let reason;
      if (isLegacyProjectKey) {
        kind = "legacy-projectkey";
        if (opts.legacyCleanup)
          shouldRemove = true;
        else
          reason = "legacy project_key dir (use --legacy-cleanup)";
      } else if (isLocallyMined) {
        kind = "locally-mined";
        if (opts.all)
          shouldRemove = true;
        else
          reason = "locally-mined (use --all to remove)";
      } else {
        continue;
      }
      summary.scanned++;
      const result = {
        dirName,
        kind,
        author: null,
        name: kind === "locally-mined" ? dirName : null,
        action: "kept-policy",
        path: path5,
        reason
      };
      if (!shouldRemove) {
        summary.kept++;
        summary.entries.push(result);
        continue;
      }
      if (opts.dryRun) {
        result.action = "would-remove";
        summary.wouldRemove++;
      } else {
        try {
          rmSync5(path5, { recursive: true, force: true });
          result.action = "removed";
          summary.removed++;
        } catch (e) {
          result.action = "kept-policy";
          result.reason = `rm failed: ${e?.message ?? e}`;
          summary.kept++;
        }
      }
      summary.entries.push(result);
    }
  }
  return summary;
}
function decideTargetForManifestEntry(entry, opts, userFilter, haveUserFilter) {
  if (haveUserFilter && !userFilter.has(entry.author)) {
    return { shouldRemove: false, reason: `author '${entry.author}' not in filter` };
  }
  if (opts.notMine) {
    if (!opts.myUsername)
      return { shouldRemove: false, reason: "--not-mine requires myUsername" };
    if (entry.author === opts.myUsername) {
      return { shouldRemove: false, reason: "your own pull (--not-mine excludes self)" };
    }
  }
  return { shouldRemove: true };
}

// dist/src/commands/mine-local.js
import { spawn as spawn2 } from "node:child_process";
import { existsSync as existsSync35, mkdirSync as mkdirSync22, readFileSync as readFileSync31, writeFileSync as writeFileSync25 } from "node:fs";
import { homedir as homedir23 } from "node:os";
import { basename as basename2, dirname as dirname16, join as join45 } from "node:path";

// dist/src/skillify/local-source.js
import { readdirSync as readdirSync7, readFileSync as readFileSync29, existsSync as existsSync32, statSync as statSync7 } from "node:fs";
import { homedir as homedir20 } from "node:os";
import { join as join42 } from "node:path";
var HOME2 = homedir20();
function encodeCwdClaudeCode(cwd) {
  return cwd.replace(/[/_]/g, "-");
}
function detectInstalledAgents() {
  const installs = [];
  const claudeRoot = join42(HOME2, ".claude", "projects");
  if (existsSync32(claudeRoot)) {
    installs.push({
      agent: "claude_code",
      sessionRoot: claudeRoot,
      encodeCwd: encodeCwdClaudeCode
    });
  }
  const codexRoot = join42(HOME2, ".codex", "sessions");
  if (existsSync32(codexRoot)) {
    installs.push({
      agent: "codex",
      sessionRoot: codexRoot,
      encodeCwd: () => "__cwd_unknown__"
    });
  }
  return installs;
}
function detectHostAgent() {
  if (process.env.CLAUDECODE === "1" || process.env.CLAUDE_CODE_ENTRYPOINT)
    return "claude_code";
  if (process.env.CODEX_HOME || process.env.CODEX_SESSION_ID)
    return "codex";
  return null;
}
function listLocalSessions(installs, cwd) {
  const out = [];
  for (const install of installs) {
    const cwdEncoded = install.encodeCwd(cwd);
    let subdirs = [];
    try {
      subdirs = readdirSync7(install.sessionRoot);
    } catch {
      continue;
    }
    for (const sub of subdirs) {
      const subdirPath = join42(install.sessionRoot, sub);
      try {
        if (!statSync7(subdirPath).isDirectory())
          continue;
      } catch {
        continue;
      }
      const inCwd = sub === cwdEncoded;
      let files = [];
      try {
        files = readdirSync7(subdirPath);
      } catch {
        continue;
      }
      for (const f of files) {
        if (!f.endsWith(".jsonl"))
          continue;
        const fullPath = join42(subdirPath, f);
        let stats;
        try {
          stats = statSync7(fullPath);
        } catch {
          continue;
        }
        if (!stats.isFile())
          continue;
        const sessionId = f.replace(/\.jsonl$/, "");
        out.push({
          agent: install.agent,
          path: fullPath,
          mtime: stats.mtimeMs,
          inCwd,
          sessionId
        });
      }
    }
  }
  return out;
}
function pickSessions(candidates, opts) {
  const { n, epsilon } = opts;
  if (n <= 0 || candidates.length === 0)
    return [];
  const sorted = [...candidates].sort((a, b) => b.mtime - a.mtime);
  const cwdQuota = Math.ceil((1 - epsilon) * n);
  const globalQuota = Math.floor(epsilon * n);
  const picked = [];
  const taken = /* @__PURE__ */ new Set();
  for (const s of sorted) {
    if (picked.length >= cwdQuota)
      break;
    if (s.inCwd && !taken.has(s.path)) {
      picked.push(s);
      taken.add(s.path);
    }
  }
  const cap2 = picked.length + globalQuota;
  for (const s of sorted) {
    if (picked.length >= cap2)
      break;
    if (!taken.has(s.path)) {
      picked.push(s);
      taken.add(s.path);
    }
  }
  for (const s of sorted) {
    if (picked.length >= n)
      break;
    if (!taken.has(s.path)) {
      picked.push(s);
      taken.add(s.path);
    }
  }
  return picked;
}
function nativeJsonlToRows(filePath, sessionId, agent) {
  let raw;
  try {
    raw = readFileSync29(filePath, "utf-8");
  } catch {
    return [];
  }
  const rows = [];
  let pendingAsstText;
  let pendingAsstTs;
  const flushAssistant = () => {
    if (pendingAsstText && pendingAsstText.trim().length > 0) {
      rows.push({
        type: "assistant_message",
        content: pendingAsstText,
        creation_date: pendingAsstTs,
        session_id: sessionId,
        agent
      });
    }
    pendingAsstText = void 0;
    pendingAsstTs = void 0;
  };
  for (const line of raw.split(/\n/)) {
    if (!line)
      continue;
    let obj;
    try {
      obj = JSON.parse(line);
    } catch {
      continue;
    }
    const t = obj?.type;
    const ts = obj?.timestamp ?? obj?.created_at;
    if (t === "user") {
      const c = obj?.message?.content;
      if (typeof c === "string" && c.trim().length > 0) {
        flushAssistant();
        rows.push({
          type: "user_message",
          content: c,
          creation_date: ts,
          session_id: sessionId,
          agent
        });
      }
    } else if (t === "assistant") {
      const c = obj?.message?.content;
      if (Array.isArray(c)) {
        const text = c.filter((b) => b?.type === "text" && typeof b.text === "string").map((b) => b.text).join("\n\n");
        if (text.trim().length > 0) {
          pendingAsstText = text;
          pendingAsstTs = ts;
        }
      }
    }
  }
  flushAssistant();
  return rows;
}

// dist/src/skillify/extractors/index.js
function extractPairs(rows) {
  const pairs2 = [];
  let pendingPrompt = null;
  let pendingAnswer = [];
  function flush() {
    if (pendingPrompt && pendingAnswer.length > 0) {
      pairs2.push({
        sessionId: pendingPrompt.row.session_id ?? "",
        agent: pendingPrompt.row.agent ?? null,
        date: pendingPrompt.row.creation_date ?? null,
        prompt: pendingPrompt.content,
        answer: pendingAnswer.join("\n\n")
      });
    }
    pendingPrompt = null;
    pendingAnswer = [];
  }
  for (const r of rows) {
    if (r.type === "user_message" && typeof r.content === "string") {
      flush();
      pendingPrompt = { content: r.content, row: r };
    } else if (r.type === "assistant_message" && typeof r.content === "string" && pendingPrompt) {
      if (r.content.trim().length > 0)
        pendingAnswer.push(r.content);
    }
  }
  flush();
  return pairs2;
}

// dist/src/skillify/gate-runner.js
import { existsSync as existsSync33 } from "node:fs";
import { createRequire } from "node:module";
import { homedir as homedir21 } from "node:os";
import { join as join43 } from "node:path";
var requireForCp = createRequire(import.meta.url);
var { execFileSync: runChildProcess } = requireForCp("node:child_process");
var inheritedEnv = process;
function firstExistingPath(candidates) {
  for (const c of candidates) {
    if (existsSync33(c))
      return c;
  }
  return null;
}
function findAgentBin(agent) {
  const home = homedir21();
  switch (agent) {
    // /usr/bin/<name> is included in every candidate list — that's the
    // common Linux package-manager install path (apt, dnf, pacman). Old
    // code used `which` which always checked it; the static-scan fix
    // dropped `which`, so /usr/bin needs to be explicit. CodeRabbit on
    // #170 caught the gap.
    case "claude_code":
      return firstExistingPath([
        join43(home, ".claude", "local", "claude"),
        "/usr/local/bin/claude",
        "/usr/bin/claude",
        join43(home, ".npm-global", "bin", "claude"),
        join43(home, ".local", "bin", "claude"),
        "/opt/homebrew/bin/claude"
      ]) ?? join43(home, ".claude", "local", "claude");
    case "codex":
      return firstExistingPath([
        "/usr/local/bin/codex",
        "/usr/bin/codex",
        join43(home, ".npm-global", "bin", "codex"),
        join43(home, ".local", "bin", "codex"),
        "/opt/homebrew/bin/codex"
      ]) ?? "/usr/local/bin/codex";
    case "cursor":
      return firstExistingPath([
        "/usr/local/bin/cursor-agent",
        "/usr/bin/cursor-agent",
        join43(home, ".npm-global", "bin", "cursor-agent"),
        join43(home, ".local", "bin", "cursor-agent"),
        "/opt/homebrew/bin/cursor-agent"
      ]) ?? "/usr/local/bin/cursor-agent";
    case "hermes":
      return firstExistingPath([
        join43(home, ".local", "bin", "hermes"),
        "/usr/local/bin/hermes",
        "/usr/bin/hermes",
        join43(home, ".npm-global", "bin", "hermes"),
        "/opt/homebrew/bin/hermes"
      ]) ?? join43(home, ".local", "bin", "hermes");
    case "pi":
      return firstExistingPath([
        join43(home, ".local", "bin", "pi"),
        "/usr/local/bin/pi",
        "/usr/bin/pi",
        join43(home, ".npm-global", "bin", "pi"),
        "/opt/homebrew/bin/pi"
      ]) ?? join43(home, ".local", "bin", "pi");
  }
}

// dist/src/skillify/gate-parser.js
function extractJsonBlock(s) {
  const trimmed = s.trim();
  if (!trimmed)
    return null;
  const fenced = trimmed.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
  if (fenced)
    return fenced[1].trim();
  const start = trimmed.indexOf("{");
  if (start < 0)
    return null;
  let depth = 0;
  for (let i = start; i < trimmed.length; i++) {
    const c = trimmed[i];
    if (c === "{")
      depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0)
        return trimmed.slice(start, i + 1);
    }
  }
  return null;
}

// dist/src/skillify/local-manifest.js
import { existsSync as existsSync34, mkdirSync as mkdirSync21, readFileSync as readFileSync30, writeFileSync as writeFileSync24 } from "node:fs";
import { homedir as homedir22 } from "node:os";
import { dirname as dirname15, join as join44 } from "node:path";
var LOCAL_MANIFEST_PATH = join44(homedir22(), ".claude", "hivemind", "local-mined.json");
var LOCAL_MINE_LOCK_PATH = join44(homedir22(), ".claude", "hivemind", "local-mined.lock");
function readLocalManifest(path5 = LOCAL_MANIFEST_PATH) {
  if (!existsSync34(path5))
    return null;
  try {
    return JSON.parse(readFileSync30(path5, "utf-8"));
  } catch {
    return null;
  }
}
function writeLocalManifest(m, path5 = LOCAL_MANIFEST_PATH) {
  mkdirSync21(dirname15(path5), { recursive: true });
  writeFileSync24(path5, JSON.stringify(m, null, 2));
}
var LATEST_RUN_WINDOW_MS = 5 * 60 * 1e3;

// dist/src/commands/mine-local.js
import { unlinkSync as unlinkSync12 } from "node:fs";
var EPSILON = 0.3;
var DEFAULT_N = 8;
var PAIR_CHAR_CAP = 4e3;
var PER_SESSION_PAIR_CAP = 30;
var PER_SESSION_PROMPT_CAP = 12e4;
var GATE_CONCURRENCY = 4;
var IN_FLIGHT_MAX_AGE_MS = 6e4;
var GATE_TIMEOUT_MS = 24e4;
var MANIFEST_PATH = LOCAL_MANIFEST_PATH;
function runGateViaStdin(opts) {
  return new Promise((resolve9) => {
    if (opts.agent !== "claude_code") {
      resolve9({
        stdout: "",
        stderr: "",
        errored: true,
        errorMessage: `stdin gate runner only supports claude_code (got ${opts.agent}); for other agents the prompt must fit in argv`
      });
      return;
    }
    if (!existsSync35(opts.bin)) {
      resolve9({
        stdout: "",
        stderr: "",
        errored: true,
        errorMessage: `agent binary not found at ${opts.bin}`
      });
      return;
    }
    const args = [
      "-p",
      "--no-session-persistence",
      "--model",
      "haiku",
      "--permission-mode",
      "bypassPermissions"
    ];
    const child = spawn2(opts.bin, args, {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, HIVEMIND_WIKI_WORKER: "1", HIVEMIND_CAPTURE: "false" }
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const finish = (r) => {
      if (settled)
        return;
      settled = true;
      resolve9(r);
    };
    const timer = setTimeout(() => {
      try {
        child.kill("SIGKILL");
      } catch {
      }
      finish({
        stdout,
        stderr,
        errored: true,
        errorMessage: `gate timed out after ${opts.timeoutMs}ms`
      });
    }, opts.timeoutMs);
    child.stdout.on("data", (b) => {
      stdout += b.toString("utf-8");
    });
    child.stderr.on("data", (b) => {
      stderr += b.toString("utf-8");
    });
    child.on("error", (e) => {
      clearTimeout(timer);
      finish({ stdout, stderr, errored: true, errorMessage: e.message });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      finish({
        stdout,
        stderr,
        errored: code !== 0,
        errorMessage: code !== 0 ? `claude_code CLI exited with code ${code}` : void 0
      });
    });
    child.stdin.on("error", (e) => {
      clearTimeout(timer);
      finish({ stdout, stderr, errored: true, errorMessage: `stdin write failed: ${e.message}` });
    });
    child.stdin.end(opts.prompt);
  });
}
var loadManifest2 = readLocalManifest;
var saveManifest2 = writeLocalManifest;
function truncate(s, max) {
  if (s.length <= max)
    return s;
  return s.slice(0, max) + `
[\u2026truncated ${s.length - max} chars]`;
}
function renderPairsBlock(pairs2) {
  let total = 0;
  const out = [];
  for (const [i, p] of pairs2.entries()) {
    const block = `--- exchange ${i + 1} ---
USER:
${truncate(p.prompt, PAIR_CHAR_CAP)}

ASSISTANT:
${truncate(p.answer, PAIR_CHAR_CAP)}
`;
    if (total + block.length > PER_SESSION_PROMPT_CAP) {
      out.push(`[\u2026${pairs2.length - i} more exchanges omitted to stay under budget]`);
      break;
    }
    out.push(block);
    total += block.length;
  }
  return out.join("\n");
}
function buildSessionPrompt(pairs2, session, verdictPath) {
  return [
    `You are a skill curator examining ONE session of recent agent activity.`,
    `Your job: identify up to 3 distinct, non-overlapping reusable skills hiding in this session.`,
    `Distinct = different problem domains. Empty list is fine if nothing qualifies.`,
    ``,
    `Session: ${session.sessionId} (agent: ${session.agent})`,
    ``,
    `RULES:`,
    `- A skill qualifies if it captures a concrete, repeatable workflow OR a non-obvious`,
    `  constraint/gotcha a future engineer would benefit from knowing. Intra-session is fine \u2014`,
    `  one deep dive yielding a generalizable takeaway counts.`,
    `- Especially valuable: REPEATABLE-MISTAKE patterns. Cases where the assistant declared`,
    `  work "done"/"fixed"/"verified" and the user came back to the same problem later; where`,
    `  the same class of mistake recurs (forgot to run tests, mishandled async state,`,
    `  hallucinated function/file existence, re-asked for confirmation on already-authorized`,
    `  work, jumped to plans without checking with the user, etc.); where the user manually`,
    `  corrected the same kind of error >1 time. These are the highest-value catches.`,
    `- Skip patterns that are obvious from reading the codebase or already in CLAUDE.md.`,
    `- Each body uses short sections (When to use, Workflow, Anti-patterns), concrete commands`,
    `  / paths / snippets drawn from the exchanges below, no marketing, no emojis.`,
    `- Each body under ~3000 characters.`,
    `- Skill names are kebab-case slugs (lowercase letters/digits/hyphens only).`,
    `- For each skill, also emit a one-line "insight": a concrete, quantified, second-person`,
    `  sentence describing what hivemind found that prompted the skill. Examples:`,
    `    "You revisited 4 merged PRs in the last month because the assistant declared 'done'`,
    `     before checking test output."`,
    `    "You corrected the same env-mismatch (beta vs prod) twice in the same week before`,
    `     deciding to switch deployment targets."`,
    `  The insight is what users will see at next SessionStart, so it must be honest \u2014 only`,
    `  assert counts and patterns you can ground in THIS session's exchanges. Omit the field`,
    `  if you cannot write a concrete, quantified line.`,
    ``,
    `=== EXCHANGES (user prompts + assistant final answers, tool calls stripped) ===`,
    renderPairsBlock(pairs2),
    ``,
    `=== YOUR TASK ===`,
    `Output a single JSON object. You may either:`,
    `  (a) Write the JSON to this exact path using the Write tool: ${verdictPath}`,
    `  (b) Print the JSON object to stdout as your final message, nothing else.`,
    `Pick whichever you prefer. Do not do both.`,
    ``,
    `Required shape:`,
    `{`,
    `  "reason": "<one-line justification>",`,
    `  "skills": [`,
    `    {`,
    `      "name": "<kebab-case>",`,
    `      "description": "<one-line>",`,
    `      "trigger": "<short trigger>",`,
    `      "body": "<full SKILL.md body without frontmatter>",`,
    `      "insight": "<one-line, concrete + quantified + second person; OPTIONAL>"`,
    `    },`,
    `    ... up to 3 entries, or [] if nothing qualifies`,
    `  ]`,
    `}`,
    ``,
    `If you print to stdout, do not include any prose before or after the JSON.`
  ].join("\n");
}
function parseMultiVerdict(raw) {
  const block = extractJsonBlock(raw);
  if (!block)
    return null;
  let parsed;
  try {
    parsed = JSON.parse(block);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object")
    return null;
  const skills = parsed.skills;
  if (!Array.isArray(skills))
    return null;
  const out = [];
  for (const s of skills) {
    if (!s || typeof s !== "object")
      continue;
    const name = typeof s.name === "string" ? s.name.trim() : "";
    const description = typeof s.description === "string" ? s.description.trim() : "";
    const body = typeof s.body === "string" ? s.body.trim() : "";
    const trigger = typeof s.trigger === "string" ? s.trigger.trim() : void 0;
    const rawInsight = typeof s.insight === "string" ? s.insight : "";
    const normalizedInsight = rawInsight.replace(/\s+/g, " ").trim();
    const insight = normalizedInsight.length > 0 ? normalizedInsight.slice(0, 280) : void 0;
    if (!name || !body)
      continue;
    out.push({ name, description, body, trigger, insight });
  }
  return { reason: typeof parsed.reason === "string" ? parsed.reason : void 0, skills: out };
}
function gateAgentFor(host, fallback, installs) {
  const installed = new Set(installs.map((i) => i.agent));
  if (installed.has("claude_code"))
    return "claude_code";
  return host ?? fallback;
}
async function parallelMap(items, concurrency, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = [];
  for (let w = 0; w < Math.min(concurrency, items.length); w++) {
    workers.push((async () => {
      while (true) {
        const i = cursor++;
        if (i >= items.length)
          return;
        results[i] = await fn(items[i], i);
      }
    })());
  }
  await Promise.all(workers);
  return results;
}
var SUMMARY_STOPWORDS = /* @__PURE__ */ new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "into",
  "via",
  "this",
  "that",
  "your",
  "you",
  "are",
  "was",
  "were",
  "use",
  "using",
  "uses",
  "used",
  "skill",
  "when",
  "what",
  "where",
  "which",
  "while",
  "how",
  "non",
  "any",
  "all",
  "code",
  "file",
  "files",
  "way",
  "ways",
  "via"
]);
function summaryTokens(s) {
  return new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 3 && !SUMMARY_STOPWORDS.has(t)));
}
function jaccard(a, b) {
  if (a.size === 0 || b.size === 0)
    return 0;
  let intersection = 0;
  for (const t of a)
    if (b.has(t))
      intersection++;
  return intersection / (a.size + b.size - intersection);
}
var OVERLAP_THRESHOLD = 0.4;
function findOverlap(candidateDesc, others) {
  const ct = summaryTokens(candidateDesc);
  let best = null;
  for (const e of others) {
    const score = jaccard(ct, summaryTokens(e.desc));
    if (score >= OVERLAP_THRESHOLD && (!best || score > best.score)) {
      best = { name: e.name, score };
    }
  }
  return best;
}
function loadExistingSummaries(skillsRoot) {
  const out = [];
  for (const s of listSkills(skillsRoot)) {
    const parsed = parseFrontmatter(s.body);
    const desc = parsed?.fm.description ?? "";
    if (desc)
      out.push({ name: s.name, desc });
  }
  return out;
}
function takeFlagValue(args, flag) {
  const idx = args.indexOf(flag);
  if (idx < 0)
    return null;
  const v = args[idx + 1];
  if (v === void 0 || v.startsWith("--")) {
    console.error(`${flag} requires a value`);
    process.exit(1);
  }
  args.splice(idx, 2);
  return v;
}
function takeBoolFlag(args, flag) {
  const idx = args.indexOf(flag);
  if (idx < 0)
    return false;
  args.splice(idx, 1);
  return true;
}
async function runMineLocal(args) {
  let lockReleased = false;
  const releaseLock2 = () => {
    if (lockReleased)
      return;
    lockReleased = true;
    try {
      unlinkSync12(LOCAL_MINE_LOCK_PATH);
    } catch {
    }
  };
  process.on("exit", releaseLock2);
  try {
    return await runMineLocalImpl(args);
  } finally {
    releaseLock2();
  }
}
async function runMineLocalImpl(args) {
  const work = [...args];
  const force = takeBoolFlag(work, "--force");
  const dryRun = takeBoolFlag(work, "--dry-run");
  const nRaw = takeFlagValue(work, "--n");
  if (loadManifest2() && !force) {
    console.error(`Local skills have already been mined on this machine.`);
    console.error(`Manifest: ${MANIFEST_PATH}`);
    console.error(`Pass --force to re-mine.`);
    process.exit(1);
  }
  const installs = detectInstalledAgents();
  if (installs.length === 0) {
    console.error(`No agent session directories detected. Run a session first.`);
    process.exit(1);
  }
  console.log(`Detected installed agents: ${installs.map((i) => i.agent).join(", ")}`);
  const host = detectHostAgent();
  const fallback = installs[0].agent;
  const gateAgent = gateAgentFor(host, fallback, installs);
  if (gateAgent !== "claude_code") {
    console.error(`mine-local v1 requires the Claude Code CLI as its LLM gate.`);
    console.error(`Detected gate agent: ${gateAgent} (no claude_code session dir found at ~/.claude/projects/).`);
    console.error(`Install Claude Code, or run a Claude Code session once, then re-run.`);
    process.exit(1);
  }
  const gateBin = findAgentBin(gateAgent);
  console.log(`Gate CLI: ${gateAgent} (${gateBin})${host ? " \u2014 host-agent detected" : ""}`);
  const cwd = process.cwd();
  const rawSessions = listLocalSessions(installs, cwd);
  const now = Date.now();
  const allSessions = rawSessions.filter((s) => now - s.mtime >= IN_FLIGHT_MAX_AGE_MS);
  const dropped = rawSessions.length - allSessions.length;
  const cwdCount = allSessions.filter((s) => s.inCwd).length;
  console.log(`Found ${allSessions.length} local session(s) (${cwdCount} in cwd${dropped > 0 ? `, ${dropped} in-flight skipped` : ""})`);
  if (allSessions.length === 0) {
    console.error(`No mineable session files (all were modified within the last ${IN_FLIGHT_MAX_AGE_MS / 1e3}s).`);
    process.exit(1);
  }
  const n = nRaw === "all" ? allSessions.length : nRaw ? Math.max(1, parseInt(nRaw, 10) || DEFAULT_N) : DEFAULT_N;
  const picked = pickSessions(allSessions, { n, epsilon: EPSILON });
  console.log(`Picking ${picked.length} session(s) (\u03B5=${EPSILON}, N=${n}): ${picked.map((s) => s.sessionId.slice(0, 8)).join(", ")}`);
  if (dryRun) {
    console.log(`Dry-run: would invoke ${gateAgent} gate on ${picked.length} session(s) in parallel (concurrency=${GATE_CONCURRENCY}).`);
    return;
  }
  const tmpDir = join45(homedir23(), ".claude", "hivemind", `mine-local-${Date.now()}`);
  mkdirSync22(tmpDir, { recursive: true });
  console.log(`Running ${picked.length} gate call(s) in parallel (concurrency=${GATE_CONCURRENCY}, timeout=${GATE_TIMEOUT_MS / 1e3}s each)...`);
  const results = await parallelMap(picked, GATE_CONCURRENCY, async (s) => {
    const shortId = s.sessionId.slice(0, 8);
    const rows = nativeJsonlToRows(s.path, s.sessionId, s.agent);
    const pairs2 = extractPairs(rows);
    if (pairs2.length === 0) {
      console.log(`  [${shortId}] no usable pairs \u2014 skipped`);
      return { session: s, skills: [], reason: "no pairs", error: null };
    }
    const tail = pairs2.slice(-PER_SESSION_PAIR_CAP);
    const sessionTmp = join45(tmpDir, `s-${shortId}`);
    mkdirSync22(sessionTmp, { recursive: true });
    const verdictPath = join45(sessionTmp, "verdict.json");
    const prompt = buildSessionPrompt(tail, s, verdictPath);
    writeFileSync25(join45(sessionTmp, "prompt.txt"), prompt);
    const gate = await runGateViaStdin({ agent: gateAgent, bin: gateBin, prompt, timeoutMs: GATE_TIMEOUT_MS });
    try {
      writeFileSync25(join45(sessionTmp, "gate-stdout.txt"), gate.stdout);
      if (gate.stderr)
        writeFileSync25(join45(sessionTmp, "gate-stderr.txt"), gate.stderr);
    } catch {
    }
    if (gate.errored) {
      console.log(`  [${shortId}] gate failed: ${gate.errorMessage}`);
      return { session: s, skills: [], reason: null, error: gate.errorMessage ?? "gate failed" };
    }
    const verdictText = existsSync35(verdictPath) ? readFileSync31(verdictPath, "utf-8") : gate.stdout;
    const mv = parseMultiVerdict(verdictText);
    if (!mv) {
      console.log(`  [${shortId}] unparseable verdict (kept at ${sessionTmp})`);
      return { session: s, skills: [], reason: null, error: "unparseable verdict" };
    }
    console.log(`  [${shortId}] ${mv.skills.length} skill candidate(s) \u2014 ${mv.reason ?? "no reason given"}`);
    return { session: s, skills: mv.skills, reason: mv.reason ?? null, error: null };
  });
  const skillsRoot = resolveSkillsRoot("global", cwd);
  const totalCandidates = results.reduce((sum, r) => sum + r.skills.length, 0);
  const existingSummaries = loadExistingSummaries(skillsRoot);
  console.log("");
  console.log(`Got ${totalCandidates} candidate(s) across ${picked.length} session(s). Checking overlap against ${existingSummaries.length} installed skill(s) + each new write.`);
  if (totalCandidates === 0) {
    const existing = loadManifest2();
    saveManifest2({
      created_at: existing?.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
      entries: existing?.entries ?? []
    });
    console.log(`No skills to write.`);
    console.log(`tmp dir kept for inspection: ${tmpDir}`);
    return;
  }
  const flat = [];
  for (const r of results) {
    for (const sk of r.skills)
      flat.push({ skill: sk, session: r.session });
  }
  flat.sort((a, b) => b.session.mtime - a.session.mtime);
  const fanOutRoots = detectAgentSkillsRoots(skillsRoot);
  if (fanOutRoots.length > 0) {
    console.log(`Fan-out targets: ${fanOutRoots.join(", ")}`);
  }
  const written = [];
  const knownSummaries = [...existingSummaries];
  for (const { skill, session } of flat) {
    const overlap = findOverlap(skill.description, knownSummaries);
    if (overlap) {
      console.log(`  skipped ${skill.name} \u2190 session ${session.sessionId.slice(0, 8)} (description overlaps "${overlap.name}", Jaccard=${overlap.score.toFixed(2)})`);
      continue;
    }
    try {
      const result = writeNewSkill({
        skillsRoot,
        name: skill.name,
        description: skill.description,
        trigger: skill.trigger,
        body: skill.body,
        sourceSessions: [session.sessionId],
        agent: gateAgent
      });
      const canonicalDir = dirname16(result.path);
      const symlinks = fanOutRoots.length > 0 ? fanOutSymlinks(canonicalDir, basename2(canonicalDir), fanOutRoots) : [];
      const symlinkSuffix = symlinks.length > 0 ? `, fan-out \u2192 ${symlinks.length} root(s)` : "";
      console.log(`  wrote ${skill.name} \u2190 session ${session.sessionId.slice(0, 8)} (${session.agent}${symlinkSuffix})`);
      written.push({ skill, session, result, symlinks });
      knownSummaries.push({ name: skill.name, desc: skill.description });
    } catch (e) {
      if (/already exists/i.test(e.message ?? "")) {
        console.log(`  skipped ${skill.name} (file already exists at ${skillsRoot})`);
      } else {
        console.log(`  failed ${skill.name}: ${e.message}`);
      }
    }
  }
  if (written.length > 0) {
    const existing = loadManifest2();
    const newEntries = written.map(({ skill, session, result, symlinks }) => ({
      skill_name: skill.name,
      canonical_path: result.path,
      symlinks,
      source_session_ids: [session.sessionId],
      source_session_paths: [session.path],
      source_agent: session.agent,
      gate_agent: gateAgent,
      created_at: result.createdAt,
      uploaded: false,
      // Persist the one-line insight when the gate produced one. Omitted
      // (undefined → absent in JSON) when the gate couldn't ground a
      // concrete line, so the SessionStart banner falls back to the
      // count-only surface for entries written before this field landed.
      ...skill.insight ? { insight: skill.insight } : {}
    }));
    saveManifest2({
      created_at: existing?.created_at ?? (/* @__PURE__ */ new Date()).toISOString(),
      entries: [...existing?.entries ?? [], ...newEntries]
    });
  }
  console.log("");
  console.log(`Mined ${written.length} skill(s) from ${picked.length} session(s) (${results.filter((r) => r.skills.length > 0).length} session(s) contributed candidate(s)).`);
  console.log(`Installed to ${skillsRoot}/ \u2014 local-only, not shared.`);
  console.log(`Sign in with 'hivemind login' to share with your team later.`);
}

// dist/src/cli/skillify-spec.js
var SKILLIFY_SPEC = [
  {
    cmd: "hivemind skillify",
    desc: "show scope, team, install, per-project state"
  },
  {
    cmd: "hivemind skillify pull",
    desc: "sync project skills from the org table to local FS",
    options: [
      { flag: "--user <email>", desc: "only skills authored by that user" },
      { flag: "--users <a,b,c>", desc: "only skills from those authors" },
      { flag: "--all-users", desc: 'explicit "no author filter" (default)' },
      { flag: "--to <project|global>", desc: "install location (project=cwd/.claude/skills, global=~/.claude/skills)" },
      { flag: "--dry-run", desc: "preview without touching disk" },
      { flag: "--force", desc: "overwrite local files even if up-to-date (creates .bak)" },
      { flag: "<skill-name>", desc: "pull only that one skill (combines with --user)" }
    ],
    note: "every agent's SessionStart hook auto-runs 'pull --all-users --to global' on every session. File writes are idempotent (skipped when local is at-or-newer than remote). Disable via HIVEMIND_AUTOPULL_DISABLED=1."
  },
  {
    cmd: "hivemind skillify unpull",
    desc: "remove every skill previously installed by pull",
    options: [
      { flag: "--user <email>", desc: "remove only that author's pulls" },
      { flag: "--not-mine", desc: "remove all pulls except your own" },
      { flag: "--dry-run", desc: "preview without touching disk" }
    ]
  },
  {
    cmd: "hivemind skillify scope",
    args: "<me|team|org>",
    desc: "sharing scope for newly mined skills"
  },
  {
    cmd: "hivemind skillify install",
    args: "<project|global>",
    desc: "default install location for new skills"
  },
  {
    cmd: "hivemind skillify promote",
    args: "<skill-name>",
    desc: "move a project skill to the global location"
  },
  {
    cmd: "hivemind skillify team add|remove|list",
    args: "<name>",
    desc: "manage team member list"
  },
  {
    cmd: "hivemind skillify mine-local",
    desc: "one-shot: mine skills from local sessions (no auth needed)",
    options: [
      { flag: "--n <num|all>", desc: "how many sessions to mine (default: 8)" },
      { flag: "--force", desc: "re-run even if the manifest sentinel exists" },
      { flag: "--dry-run", desc: "stop before calling the LLM gate" }
    ]
  }
];
function renderCliHelpBlock() {
  const INDENT = "  ";
  const CMD_COL_WIDTH = 42;
  const lines = [];
  for (const sub of SKILLIFY_SPEC) {
    const left = sub.args ? `${sub.cmd} ${sub.args}` : sub.cmd;
    const padded = left.length >= CMD_COL_WIDTH ? `${left}  ` : left.padEnd(CMD_COL_WIDTH);
    lines.push(`${INDENT}${padded}${capitalize(sub.desc)}.`);
    if (sub.options && sub.options.length > 0) {
      const optsList = sub.options.map((o) => o.flag).join(", ");
      lines.push(`${INDENT}${" ".repeat(CMD_COL_WIDTH)}Options: ${optsList}.`);
    }
    if (sub.note) {
      const noteWrapped = wrapAt(`Note: ${sub.note}`, 72);
      for (const noteLine of noteWrapped) {
        lines.push(`${INDENT}${" ".repeat(CMD_COL_WIDTH)}${noteLine}`);
      }
    }
  }
  return lines.join("\n");
}
function renderSubcommandUsageBlock() {
  const INDENT = "  ";
  const SUB_INDENT = "    ";
  const FLAG_INDENT = "      ";
  const CMD_COL_WIDTH = 44;
  const FLAG_COL_WIDTH = 26;
  const lines = [];
  for (const sub of SKILLIFY_SPEC) {
    const left = sub.args ? `${sub.cmd} ${sub.args}` : sub.cmd;
    const padded = left.length >= CMD_COL_WIDTH ? `${left}  ` : left.padEnd(CMD_COL_WIDTH);
    lines.push(`${INDENT}${padded}${sub.desc}`);
    if (sub.options && sub.options.length > 0) {
      const tail = sub.cmd.split(" ").slice(-1)[0];
      lines.push(`${SUB_INDENT}Options for ${tail}:`);
      for (const opt of sub.options) {
        const flagPadded = opt.flag.length >= FLAG_COL_WIDTH ? `${opt.flag}  ` : opt.flag.padEnd(FLAG_COL_WIDTH);
        lines.push(`${FLAG_INDENT}${flagPadded}${opt.desc}`);
      }
    }
  }
  return lines.join("\n");
}
function capitalize(s) {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}
function wrapAt(s, max) {
  const words = s.split(/\s+/);
  const out = [];
  let cur = "";
  for (const w of words) {
    if (cur.length === 0) {
      cur = w;
    } else if (cur.length + 1 + w.length > max) {
      out.push(cur);
      cur = w;
    } else {
      cur += " " + w;
    }
  }
  if (cur)
    out.push(cur);
  return out;
}

// dist/src/commands/skillify.js
function stateDir() {
  return getStateDir();
}
function showStatus() {
  const cfg = loadScopeConfig();
  console.log(`scope:   ${cfg.scope}`);
  console.log(`team:    ${cfg.team.length === 0 ? "(empty)" : cfg.team.join(", ")}`);
  console.log(`install: ${cfg.install}  (${cfg.install === "global" ? "~/.claude/skills/" : "<project>/.claude/skills/"})`);
  const dir = stateDir();
  if (!existsSync36(dir)) {
    console.log(`state: (no projects tracked yet)`);
    return;
  }
  const files = readdirSync8(dir).filter((f) => f.endsWith(".json") && f !== "config.json" && f !== "pulled.json" && f !== "autopull-last-run.json");
  if (files.length === 0) {
    console.log(`state: (no projects tracked yet)`);
    return;
  }
  console.log(`state: ${files.length} project(s) tracked`);
  for (const f of files) {
    try {
      const s = JSON.parse(readFileSync32(join46(dir, f), "utf-8"));
      const last = typeof s.updatedAt === "number" ? new Date(s.updatedAt).toISOString() : s.lastDate ?? "never";
      const skills = Array.isArray(s.skillsGenerated) && s.skillsGenerated.length > 0 ? s.skillsGenerated.join(", ") : "none";
      console.log(`  - ${s.project} (counter=${s.counter}, last=${last}, skills=${skills})`);
    } catch {
    }
  }
}
function setScope(scope) {
  if (scope !== "me" && scope !== "team") {
    console.error(`Invalid scope '${scope}'. Use one of: me, team`);
    process.exit(1);
  }
  const cfg = loadScopeConfig();
  saveScopeConfig({ ...cfg, scope });
  console.log(`Scope set to '${scope}'.`);
  if (scope === "team" && cfg.team.length === 0) {
    console.log(`Note: team list is empty. Use 'hivemind skillify team add <username>' to populate it.`);
  }
}
function setInstall(loc) {
  if (loc !== "project" && loc !== "global") {
    console.error(`Invalid install location '${loc}'. Use one of: project, global`);
    process.exit(1);
  }
  const cfg = loadScopeConfig();
  saveScopeConfig({ ...cfg, install: loc });
  const path5 = loc === "global" ? join46(homedir24(), ".claude", "skills") : "<cwd>/.claude/skills";
  console.log(`Install location set to '${loc}'. New skills will be written to ${path5}/<name>/SKILL.md.`);
}
function promoteSkill(name, cwd) {
  if (!name) {
    console.error("Usage: hivemind skillify promote <skill-name>");
    process.exit(1);
  }
  const projectPath = join46(cwd, ".claude", "skills", name);
  const globalPath = join46(homedir24(), ".claude", "skills", name);
  if (!existsSync36(join46(projectPath, "SKILL.md"))) {
    console.error(`Skill '${name}' not found at ${projectPath}/SKILL.md`);
    process.exit(1);
  }
  if (existsSync36(join46(globalPath, "SKILL.md"))) {
    console.error(`Skill '${name}' already exists at ${globalPath}/SKILL.md \u2014 refusing to overwrite. Remove it first or rename the project skill.`);
    process.exit(1);
  }
  mkdirSync23(dirname17(globalPath), { recursive: true });
  renameSync12(projectPath, globalPath);
  console.log(`Promoted '${name}' from ${projectPath} \u2192 ${globalPath}.`);
}
function teamAdd(name) {
  if (!name) {
    console.error("Usage: hivemind skillify team add <username>");
    process.exit(1);
  }
  const cfg = loadScopeConfig();
  if (cfg.team.includes(name)) {
    console.log(`'${name}' is already in the team list.`);
    return;
  }
  const next = [...cfg.team, name].sort();
  saveScopeConfig({ ...cfg, team: next });
  console.log(`Added '${name}' to team. Team is now: ${next.join(", ")}`);
}
function teamRemove(name) {
  if (!name) {
    console.error("Usage: hivemind skillify team remove <username>");
    process.exit(1);
  }
  const cfg = loadScopeConfig();
  if (!cfg.team.includes(name)) {
    console.log(`'${name}' is not in the team list.`);
    return;
  }
  const next = cfg.team.filter((n) => n !== name);
  saveScopeConfig({ ...cfg, team: next });
  console.log(`Removed '${name}' from team. Team is now: ${next.length === 0 ? "(empty)" : next.join(", ")}`);
}
function teamList() {
  const cfg = loadScopeConfig();
  if (cfg.team.length === 0) {
    console.log(`(team list is empty)`);
    return;
  }
  for (const n of cfg.team)
    console.log(n);
}
function usage() {
  console.log("Usage:");
  console.log(renderSubcommandUsageBlock());
}
function takeFlagValue2(args, flag) {
  const idx = args.indexOf(flag);
  if (idx < 0)
    return null;
  const value = args[idx + 1];
  if (value === void 0 || value.startsWith("--")) {
    console.error(`${flag} requires a value`);
    process.exit(1);
  }
  args.splice(idx, 2);
  return value;
}
function takeBooleanFlag(args, flag) {
  const idx = args.indexOf(flag);
  if (idx < 0)
    return false;
  args.splice(idx, 1);
  return true;
}
async function pullSkills(args) {
  const work = [...args];
  const toRaw = takeFlagValue2(work, "--to") ?? "global";
  const userOne = takeFlagValue2(work, "--user");
  const usersMany = takeFlagValue2(work, "--users");
  const allUsers = takeBooleanFlag(work, "--all-users");
  const dryRun = takeBooleanFlag(work, "--dry-run");
  const force = takeBooleanFlag(work, "--force");
  const skillName = work[0];
  if (toRaw !== "project" && toRaw !== "global") {
    console.error(`Invalid --to '${toRaw}'. Use 'project' or 'global'.`);
    process.exit(1);
  }
  let users = [];
  if (allUsers)
    users = [];
  else if (userOne)
    users = [userOne];
  else if (usersMany)
    users = usersMany.split(",").map((s) => s.trim()).filter(Boolean);
  const config = loadConfig();
  if (!config) {
    console.error("Not logged in. Run: hivemind login");
    process.exit(1);
  }
  const api = new DeeplakeApi(config.token, config.apiUrl, config.orgId, config.workspaceId, config.skillsTableName);
  const query = (sql) => api.query(sql);
  let summary;
  try {
    summary = await runPull({
      query,
      tableName: config.skillsTableName,
      install: toRaw,
      cwd: toRaw === "project" ? process.cwd() : void 0,
      users,
      skillName,
      dryRun,
      force
    });
  } catch (e) {
    console.error(`pull failed: ${e?.message ?? e}`);
    process.exit(1);
  }
  const dest = toRaw === "global" ? join46(homedir24(), ".claude", "skills") : `${process.cwd()}/.claude/skills`;
  const filterDesc = users.length === 0 ? "all users" : users.join(", ");
  console.log(`Destination: ${dest}`);
  console.log(`Filter:      ${filterDesc}${skillName ? ` \xB7 skill='${skillName}'` : ""}${dryRun ? " \xB7 dry-run" : ""}${force ? " \xB7 force" : ""}`);
  console.log(`Scanned ${summary.scanned} remote skill(s).`);
  for (const e of summary.entries) {
    const tag = e.action === "wrote" ? "\u2713 wrote" : e.action === "dryrun" ? "\u2192 would write" : "\xB7 skipped";
    const ver = e.localVersion === null ? `v${e.remoteVersion} (new)` : `v${e.localVersion} \u2192 v${e.remoteVersion}`;
    console.log(`  ${tag.padEnd(15)} ${e.name.padEnd(40)} ${ver.padEnd(20)} (${e.author}/${e.sourceAgent})`);
    if (e.manifestError) {
      console.warn(`    \u26A0 manifest not updated: ${e.manifestError} \u2014 \`unpull\` will not see this entry until a successful repull.`);
    }
  }
  console.log(`Result: ${summary.wrote} written, ${summary.dryrun} dry-run, ${summary.skipped} skipped.`);
}
async function unpullSkills(args) {
  const work = [...args];
  const toRaw = takeFlagValue2(work, "--to") ?? "global";
  const userOne = takeFlagValue2(work, "--user");
  const usersMany = takeFlagValue2(work, "--users");
  const notMine = takeBooleanFlag(work, "--not-mine");
  const dryRun = takeBooleanFlag(work, "--dry-run");
  const all = takeBooleanFlag(work, "--all");
  const legacyCleanup = takeBooleanFlag(work, "--legacy-cleanup");
  if (toRaw !== "project" && toRaw !== "global") {
    throw new Error(`Invalid --to '${toRaw}'. Use 'project' or 'global'.`);
  }
  let users = [];
  if (userOne)
    users = [userOne];
  else if (usersMany)
    users = usersMany.split(",").map((s) => s.trim()).filter(Boolean);
  let myUsername;
  if (notMine) {
    const config = loadConfig();
    if (!config) {
      throw new Error("--not-mine requires a logged-in user. Run: hivemind login");
    }
    myUsername = config.userName;
  }
  const summary = runUnpull({
    install: toRaw,
    cwd: toRaw === "project" ? process.cwd() : void 0,
    users,
    myUsername,
    notMine,
    dryRun,
    all,
    legacyCleanup
  });
  const dest = toRaw === "global" ? join46(homedir24(), ".claude", "skills") : `${process.cwd()}/.claude/skills`;
  const filterParts = [];
  if (users.length > 0)
    filterParts.push(`users=${users.join(",")}`);
  if (notMine)
    filterParts.push("not-mine");
  if (all)
    filterParts.push("all");
  if (legacyCleanup)
    filterParts.push("legacy-cleanup");
  if (dryRun)
    filterParts.push("dry-run");
  const filterDesc = filterParts.length ? filterParts.join(" \xB7 ") : "(no filter \u2014 all pulled)";
  console.log(`Scanning:    ${dest}`);
  console.log(`Filter:      ${filterDesc}`);
  console.log(`Scanned ${summary.scanned} dir(s).`);
  for (const e of summary.entries) {
    const tag = e.action === "removed" ? "\u2713 removed" : e.action === "would-remove" ? "\u2192 would remove" : e.action === "manifest-pruned" ? "\u26A0 pruned (orphan)" : "\xB7 kept";
    const id = e.dirName;
    const note = e.reason ? `  (${e.reason})` : "";
    console.log(`  ${tag.padEnd(20)} ${id.padEnd(50)} [${e.kind}]${note}`);
  }
  const prunedNote = summary.manifestPruned > 0 ? `, ${summary.manifestPruned} manifest-pruned` : "";
  console.log(`Result: ${summary.removed} removed, ${summary.wouldRemove} dry-run, ${summary.kept} kept${prunedNote}.`);
}
function runSkillifyCommand(args) {
  const sub = args[0];
  if (!sub || sub === "status") {
    showStatus();
    return;
  }
  if (sub === "scope") {
    setScope(args[1] ?? "");
    return;
  }
  if (sub === "install") {
    setInstall(args[1] ?? "");
    return;
  }
  if (sub === "promote") {
    promoteSkill(args[1] ?? "", process.cwd());
    return;
  }
  if (sub === "pull") {
    pullSkills(args.slice(1)).catch((e) => {
      console.error(`pull error: ${e?.message ?? e}`);
      process.exit(1);
    });
    return;
  }
  if (sub === "unpull") {
    unpullSkills(args.slice(1)).catch((e) => {
      console.error(`unpull error: ${e?.message ?? e}`);
      process.exit(1);
    }).catch(() => {
    });
    return;
  }
  if (sub === "team") {
    const action = args[1];
    if (action === "add") {
      teamAdd(args[2] ?? "");
      return;
    }
    if (action === "remove") {
      teamRemove(args[2] ?? "");
      return;
    }
    if (action === "list") {
      teamList();
      return;
    }
    console.error("Usage: hivemind skillify team <add|remove|list> [name]");
    process.exit(1);
  }
  if (sub === "mine-local") {
    runMineLocal(args.slice(1)).catch((e) => {
      console.error(`mine-local error: ${e?.message ?? e}`);
      process.exit(1);
    });
    return;
  }
  if (sub === "--help" || sub === "-h" || sub === "help") {
    usage();
    return;
  }
  console.error(`Unknown skillify subcommand: ${sub}`);
  usage();
  process.exit(1);
}
if (process.argv[1] && process.argv[1].endsWith("skillify.js")) {
  runSkillifyCommand(process.argv.slice(2));
}

// dist/src/rules/write.js
import { randomUUID as randomUUID3 } from "node:crypto";

// dist/src/rules/read.js
var SELECT_COLS = "id, rule_id, text, scope, status, assigned_by, version, created_at, agent, plugin_version";
async function listRules(query, tableName, opts = {}) {
  const safe = sqlIdent(tableName);
  const rows = await query(`SELECT ${SELECT_COLS} FROM "${safe}" ORDER BY version DESC, created_at DESC, id DESC`);
  const latest = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const row = normalize(r);
    if (!row)
      continue;
    if (!latest.has(row.rule_id))
      latest.set(row.rule_id, row);
  }
  const statusFilter = opts.status ?? "active";
  const filtered = [...latest.values()].filter((r) => statusFilter === "all" ? true : r.status === statusFilter);
  filtered.sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id.localeCompare(a.id));
  return filtered.slice(0, opts.limit ?? 10);
}
async function getRuleLatest(query, tableName, ruleId) {
  const safe = sqlIdent(tableName);
  const rows = await query(`SELECT ${SELECT_COLS} FROM "${safe}" WHERE rule_id = '${sqlStr(ruleId)}' ORDER BY version DESC, created_at DESC, id DESC LIMIT 1`);
  if (rows.length === 0)
    return null;
  return normalize(rows[0]);
}
function normalize(row) {
  const vRaw = row.version;
  const version = typeof vRaw === "number" ? vRaw : typeof vRaw === "string" ? Number(vRaw) : NaN;
  if (!Number.isFinite(version))
    return null;
  return {
    id: String(row.id ?? ""),
    rule_id: String(row.rule_id ?? ""),
    text: String(row.text ?? ""),
    scope: String(row.scope ?? ""),
    status: String(row.status ?? ""),
    assigned_by: String(row.assigned_by ?? ""),
    version,
    created_at: String(row.created_at ?? ""),
    agent: String(row.agent ?? ""),
    plugin_version: String(row.plugin_version ?? "")
  };
}

// dist/src/rules/write.js
var MAX_TEXT_LENGTH = 2e3;
function assertValidText(text) {
  if (text.length === 0)
    throw new Error("Rule text must not be empty");
  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`Rule text exceeds ${MAX_TEXT_LENGTH} chars (got ${text.length})`);
  }
  if (/[\r\n\u2028\u2029\u0085]/.test(text)) {
    throw new Error("Rule text must not contain newlines (use one rule per line)");
  }
}
async function insertRule(query, tableName, input) {
  assertValidText(input.text);
  const safe = sqlIdent(tableName);
  const ruleId = randomUUID3();
  const rowId = randomUUID3();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const agent = input.agent ?? "manual";
  const pluginVersion = input.plugin_version ?? "";
  const sql = `INSERT INTO "${safe}" (id, rule_id, text, scope, status, assigned_by, version, created_at, agent, plugin_version) VALUES ('${sqlStr(rowId)}', '${sqlStr(ruleId)}', E'${sqlStr(input.text)}', 'team', 'active', '${sqlStr(input.assigned_by)}', 1, '${sqlStr(now)}', '${sqlStr(agent)}', '${sqlStr(pluginVersion)}')`;
  await query(sql);
  return { rule_id: ruleId, version: 1 };
}
async function editRule(query, tableName, input) {
  const previous = await getRuleLatest(query, tableName, input.rule_id);
  if (!previous) {
    throw new Error(`Rule not found: ${input.rule_id}`);
  }
  return appendVersion(query, tableName, previous, {
    text: input.text ?? previous.text,
    status: input.status ?? previous.status,
    assigned_by: input.assigned_by,
    agent: input.agent,
    plugin_version: input.plugin_version
  });
}
async function markRuleDone(query, tableName, input) {
  return editRule(query, tableName, { ...input, status: "done" });
}
async function appendVersion(query, tableName, previous, next) {
  assertValidText(next.text);
  const safe = sqlIdent(tableName);
  const rowId = randomUUID3();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const nextVersion = previous.version + 1;
  const agent = next.agent ?? "manual";
  const pluginVersion = next.plugin_version ?? "";
  const sql = `INSERT INTO "${safe}" (id, rule_id, text, scope, status, assigned_by, version, created_at, agent, plugin_version) VALUES ('${sqlStr(rowId)}', '${sqlStr(previous.rule_id)}', E'${sqlStr(next.text)}', 'team', '${sqlStr(next.status)}', '${sqlStr(next.assigned_by)}', ${nextVersion}, '${sqlStr(now)}', '${sqlStr(agent)}', '${sqlStr(pluginVersion)}')`;
  await query(sql);
  return { rule_id: previous.rule_id, version: nextVersion };
}

// dist/src/commands/rules.js
var USAGE3 = `
hivemind rules \u2014 manage team-wide rules

Usage:
  hivemind rules add "<text>" [--scope team]
  hivemind rules list [--status active|done|all] [--limit N]
  hivemind rules edit <rule-id> "<new text>"
  hivemind rules done <rule-id>
`.trim();
function logUsageAndExit(code = 1) {
  console.error(USAGE3);
  process.exit(code);
  throw new Error("unreachable");
}
function requireConfig() {
  const cfg = loadConfig();
  if (!cfg) {
    console.error("Not logged in. Run `hivemind login` first.");
    process.exit(2);
    throw new Error("unreachable");
  }
  return cfg;
}
function makeApi(cfg) {
  return new DeeplakeApi(cfg.token, cfg.apiUrl, cfg.orgId, cfg.workspaceId, cfg.tableName);
}
function parseScope(args) {
  const idx = args.findIndex((a) => a === "--scope" || a.startsWith("--scope="));
  if (idx === -1)
    return "team";
  const raw = args[idx].includes("=") ? args[idx].split("=", 2)[1] : args[idx + 1];
  if (raw !== "team") {
    console.error(`Invalid --scope value: ${raw}. Rules support 'team' only in v1.`);
    process.exit(1);
    throw new Error("unreachable");
  }
  return "team";
}
function parseStatus(args) {
  const idx = args.findIndex((a) => a === "--status" || a.startsWith("--status="));
  if (idx === -1)
    return "active";
  const raw = args[idx].includes("=") ? args[idx].split("=", 2)[1] : args[idx + 1];
  if (raw === "active" || raw === "done" || raw === "all")
    return raw;
  console.error(`Invalid --status value: ${raw}. Allowed: active | done | all.`);
  process.exit(1);
  throw new Error("unreachable");
}
function parseLimit(args) {
  const idx = args.findIndex((a) => a === "--limit" || a.startsWith("--limit="));
  if (idx === -1)
    return 10;
  const raw = args[idx].includes("=") ? args[idx].split("=", 2)[1] : args[idx + 1];
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) {
    console.error(`Invalid --limit value: ${raw}. Must be a positive integer.`);
    process.exit(1);
    throw new Error("unreachable");
  }
  return n;
}
function stripKnownFlags(args) {
  const KNOWN = /* @__PURE__ */ new Set(["--scope", "--status", "--limit"]);
  const out = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (KNOWN.has(a)) {
      i++;
      continue;
    }
    if (KNOWN.has(a.split("=", 2)[0])) {
      continue;
    }
    out.push(a);
  }
  return out;
}
function formatListRow(r) {
  const tag = r.status === "done" ? "[done]" : "[active]";
  return `${tag} ${r.rule_id}  v${r.version}  ${r.assigned_by}  ${r.text}`;
}
async function runRulesCommand(args) {
  const sub = args[0];
  if (!sub || sub === "--help" || sub === "-h" || sub === "help") {
    console.log(USAGE3);
    return;
  }
  const cfg = requireConfig();
  const api = makeApi(cfg);
  const tableName = cfg.rulesTableName;
  const WRITE_SUBS = /* @__PURE__ */ new Set(["add", "edit", "done"]);
  if (WRITE_SUBS.has(sub)) {
    await api.ensureRulesTable(tableName);
  }
  const pluginVersion = getVersion();
  if (sub === "add") {
    const positional = stripKnownFlags(args.slice(1));
    const text = positional[0];
    if (!text) {
      console.error('Missing rule text. Usage: hivemind rules add "<text>" [--scope team]');
      process.exit(1);
      throw new Error("unreachable");
    }
    parseScope(args.slice(1));
    try {
      const out = await insertRule(api.query.bind(api), tableName, {
        text,
        assigned_by: cfg.userName,
        plugin_version: pluginVersion
      });
      console.log(`Added rule ${out.rule_id} (v${out.version}).`);
    } catch (err) {
      console.error(`Add failed: ${err.message}`);
      process.exit(1);
    }
    return;
  }
  if (sub === "list") {
    const status = parseStatus(args.slice(1));
    const limit2 = parseLimit(args.slice(1));
    let rows = [];
    try {
      rows = await listRules(api.query.bind(api), tableName, { status, limit: limit2 });
    } catch (err) {
      const msg = err.message;
      if (!isMissingTableError(msg))
        throw err;
    }
    if (rows.length === 0) {
      console.log(`(no rules with status=${status})`);
      return;
    }
    for (const r of rows)
      console.log(formatListRow(r));
    return;
  }
  if (sub === "edit") {
    const positional = stripKnownFlags(args.slice(1));
    const ruleId = positional[0];
    const newText = positional[1];
    if (!ruleId || !newText) {
      console.error('Usage: hivemind rules edit <rule-id> "<new text>"');
      process.exit(1);
      throw new Error("unreachable");
    }
    try {
      const out = await editRule(api.query.bind(api), tableName, {
        rule_id: ruleId,
        text: newText,
        assigned_by: cfg.userName,
        plugin_version: pluginVersion
      });
      console.log(`Edited rule ${out.rule_id} \u2192 v${out.version}.`);
    } catch (err) {
      console.error(`Edit failed: ${err.message}`);
      process.exit(1);
    }
    return;
  }
  if (sub === "done") {
    const positional = stripKnownFlags(args.slice(1));
    const ruleId = positional[0];
    if (!ruleId) {
      console.error("Usage: hivemind rules done <rule-id>");
      process.exit(1);
      throw new Error("unreachable");
    }
    try {
      const out = await markRuleDone(api.query.bind(api), tableName, {
        rule_id: ruleId,
        assigned_by: cfg.userName,
        plugin_version: pluginVersion
      });
      console.log(`Marked rule ${out.rule_id} done (v${out.version}).`);
    } catch (err) {
      console.error(`Done failed: ${err.message}`);
      process.exit(1);
    }
    return;
  }
  console.error(`Unknown rules subcommand: ${sub}`);
  logUsageAndExit(1);
}

// dist/src/tasks/write.js
import { randomUUID as randomUUID4 } from "node:crypto";

// dist/src/tasks/kpi-validator.js
function parseKpis(raw) {
  if (raw == null || raw === "")
    return [];
  let arr;
  if (typeof raw === "string") {
    try {
      arr = JSON.parse(raw);
    } catch {
      return [];
    }
  } else {
    arr = raw;
  }
  if (!Array.isArray(arr))
    return [];
  const out = [];
  for (const item of arr) {
    const kpi = validateOne(item);
    if (kpi)
      out.push(kpi);
  }
  return out;
}
function stringifyKpis(kpis) {
  const validated = kpis.map(validateOne).filter((k) => k !== null);
  return JSON.stringify(validated);
}
function validateOne(item) {
  if (!isObject3(item))
    return null;
  const kpi_id = safeStr(item.kpi_id);
  const name = safeStr(item.name);
  const target = num(item.target);
  const unit = safeStr(item.unit);
  const generated_by = safeStr(item.generated_by);
  const generated_at = isoStr(item.generated_at);
  if (kpi_id === null || name === null || target === null || unit === null || generated_by === null || generated_at === null) {
    return null;
  }
  if (!Number.isInteger(target) || target <= 0) {
    return null;
  }
  const out = {
    kpi_id,
    name,
    target,
    unit,
    generated_by,
    generated_at
  };
  const current = num(item.current);
  if (current !== null)
    out.current = current;
  return out;
}
function isObject3(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function str2(v) {
  if (typeof v !== "string" || v.length === 0)
    return null;
  return v;
}
function safeStr(v) {
  const s = str2(v);
  if (s === null)
    return null;
  if (/[\r\n\u2028\u2029\u0085]/.test(s))
    return null;
  return s;
}
function num(v) {
  if (typeof v !== "number" || !Number.isFinite(v))
    return null;
  return v;
}
function isoStr(v) {
  const s = safeStr(v);
  if (s === null)
    return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/.test(s)) {
    return null;
  }
  return s;
}

// dist/src/tasks/read.js
var SELECT_COLS2 = "id, task_id, text, scope, status, assigned_to, assigned_by, kpis, version, created_at, agent, plugin_version";
async function listTasks(query, tableName, opts = {}) {
  const safe = sqlIdent(tableName);
  const rows = await query(`SELECT ${SELECT_COLS2} FROM "${safe}" ORDER BY version DESC, created_at DESC, id DESC`);
  const latest = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const row = normalize2(r);
    if (!row)
      continue;
    if (!latest.has(row.task_id))
      latest.set(row.task_id, row);
  }
  const scope = opts.scope ?? "all";
  const status = opts.status ?? "active";
  const current = opts.current_user;
  const filtered = [...latest.values()].filter((row) => {
    if (status !== "all" && row.status !== status)
      return false;
    if (scope === "mine") {
      if (!current)
        return false;
      return row.assigned_to === current;
    }
    if (scope === "me") {
      if (!current)
        return false;
      return row.scope === "me" && row.assigned_to === current;
    }
    if (scope === "team")
      return row.scope === "team";
    return true;
  });
  filtered.sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id.localeCompare(a.id));
  return filtered.slice(0, opts.limit ?? 10);
}
async function getTaskLatest(query, tableName, taskId) {
  const safe = sqlIdent(tableName);
  const rows = await query(`SELECT ${SELECT_COLS2} FROM "${safe}" WHERE task_id = '${sqlStr(taskId)}' ORDER BY version DESC, created_at DESC, id DESC LIMIT 1`);
  if (rows.length === 0)
    return null;
  return normalize2(rows[0]);
}
function normalize2(row) {
  const vRaw = row.version;
  const version = typeof vRaw === "number" ? vRaw : typeof vRaw === "string" ? Number(vRaw) : NaN;
  if (!Number.isFinite(version))
    return null;
  return {
    id: String(row.id ?? ""),
    task_id: String(row.task_id ?? ""),
    text: String(row.text ?? ""),
    scope: String(row.scope ?? ""),
    status: String(row.status ?? ""),
    assigned_to: String(row.assigned_to ?? ""),
    assigned_by: String(row.assigned_by ?? ""),
    kpis: parseKpis(row.kpis),
    version,
    created_at: String(row.created_at ?? ""),
    agent: String(row.agent ?? ""),
    plugin_version: String(row.plugin_version ?? "")
  };
}

// dist/src/tasks/write.js
var MAX_TEXT_LENGTH2 = 2e3;
function assertValidText2(text) {
  if (text.length === 0)
    throw new Error("Task text must not be empty");
  if (text.length > MAX_TEXT_LENGTH2) {
    throw new Error(`Task text exceeds ${MAX_TEXT_LENGTH2} chars (got ${text.length})`);
  }
  if (/[\r\n\u2028\u2029\u0085]/.test(text)) {
    throw new Error("Task text must not contain newlines (use one task per line)");
  }
}
function assertValidScope(scope) {
  if (scope !== "me" && scope !== "team") {
    throw new Error(`Invalid task scope: ${JSON.stringify(scope)} (expected 'me' or 'team')`);
  }
}
async function insertTask(query, tableName, input) {
  assertValidText2(input.text);
  assertValidScope(input.scope);
  const safe = sqlIdent(tableName);
  const taskId = randomUUID4();
  const rowId = randomUUID4();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const assignedTo = input.assigned_to ?? input.assigned_by;
  let kpis;
  if (input.kpis !== void 0) {
    kpis = input.kpis;
  } else if (input.generateKpis) {
    kpis = await input.generateKpis(input.text).catch(() => []);
  } else {
    kpis = [];
  }
  const kpisJson = stringifyKpis(kpis);
  const agent = input.agent ?? "manual";
  const pluginVersion = input.plugin_version ?? "";
  const sql = `INSERT INTO "${safe}" (id, task_id, text, scope, status, assigned_to, assigned_by, kpis, version, created_at, agent, plugin_version) VALUES ('${sqlStr(rowId)}', '${sqlStr(taskId)}', E'${sqlStr(input.text)}', '${sqlStr(input.scope)}', 'active', '${sqlStr(assignedTo)}', '${sqlStr(input.assigned_by)}', E'${sqlStr(kpisJson)}'::jsonb, 1, '${sqlStr(now)}', '${sqlStr(agent)}', '${sqlStr(pluginVersion)}')`;
  await query(sql);
  return { task_id: taskId, version: 1 };
}
async function editTask(query, tableName, input) {
  const previous = await getTaskLatest(query, tableName, input.task_id);
  if (!previous) {
    throw new Error(`Task not found: ${input.task_id}`);
  }
  return appendVersion2(query, tableName, previous, {
    text: input.text ?? previous.text,
    status: input.status ?? previous.status,
    assigned_to: input.assigned_to ?? previous.assigned_to,
    assigned_by: input.assigned_by,
    // `undefined` means "carry over", which read.ts already validated to
    // a Kpi[]; an explicit empty array clears KPIs.
    kpis: input.kpis ?? previous.kpis,
    agent: input.agent,
    plugin_version: input.plugin_version
  });
}
async function markTaskDone(query, tableName, input) {
  return editTask(query, tableName, { ...input, status: "done" });
}
async function assignTask(query, tableName, input) {
  return editTask(query, tableName, {
    task_id: input.task_id,
    assigned_by: input.assigned_by,
    assigned_to: input.assigned_to,
    agent: input.agent,
    plugin_version: input.plugin_version
  });
}
async function appendVersion2(query, tableName, previous, next) {
  assertValidText2(next.text);
  const safe = sqlIdent(tableName);
  const rowId = randomUUID4();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const nextVersion = previous.version + 1;
  const kpisJson = stringifyKpis(next.kpis);
  const agent = next.agent ?? "manual";
  const pluginVersion = next.plugin_version ?? "";
  const sql = `INSERT INTO "${safe}" (id, task_id, text, scope, status, assigned_to, assigned_by, kpis, version, created_at, agent, plugin_version) VALUES ('${sqlStr(rowId)}', '${sqlStr(previous.task_id)}', E'${sqlStr(next.text)}', '${sqlStr(previous.scope)}', '${sqlStr(next.status)}', '${sqlStr(next.assigned_to)}', '${sqlStr(next.assigned_by)}', E'${sqlStr(kpisJson)}'::jsonb, ${nextVersion}, '${sqlStr(now)}', '${sqlStr(agent)}', '${sqlStr(pluginVersion)}')`;
  await query(sql);
  return { task_id: previous.task_id, version: nextVersion };
}

// dist/src/events/append.js
import { randomUUID as randomUUID5 } from "node:crypto";
async function appendEvent(query, tableName, input) {
  const safe = sqlIdent(tableName);
  const rowId = randomUUID5();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  if (!Number.isFinite(input.value)) {
    throw new Error(`Event value must be finite (got ${input.value})`);
  }
  if (!Number.isInteger(input.task_version) || input.task_version < 1) {
    throw new Error(`Event task_version must be a positive integer (got ${input.task_version})`);
  }
  const kpiId = input.kpi_id ?? "";
  const note = input.note ?? "";
  const agent = input.agent ?? "";
  const pluginVersion = input.plugin_version ?? "";
  const sql = `INSERT INTO "${safe}" (id, task_id, task_version, kpi_id, value, note, source, agent, ts, plugin_version) VALUES ('${sqlStr(rowId)}', '${sqlStr(input.task_id)}', ${input.task_version}, '${sqlStr(kpiId)}', ${input.value}, E'${sqlStr(note)}', '${sqlStr(input.source)}', '${sqlStr(agent)}', '${sqlStr(now)}', '${sqlStr(pluginVersion)}')`;
  await query(sql);
  return { id: rowId };
}

// dist/src/events/aggregate.js
async function computeAllForTask(query, tableName, taskId) {
  const safe = sqlIdent(tableName);
  const rows = await query(`SELECT kpi_id, SUM(value) AS total FROM "${safe}" WHERE task_id = '${sqlStr(taskId)}' GROUP BY kpi_id`);
  const out = {};
  for (const row of rows) {
    const kpiId = typeof row.kpi_id === "string" ? row.kpi_id : "";
    if (!kpiId)
      continue;
    out[kpiId] = normalizeTotal(row.total);
  }
  return out;
}
async function computeAllForTasks(query, tableName, taskIds) {
  if (taskIds.length === 0)
    return {};
  const safe = sqlIdent(tableName);
  const inList = taskIds.map((id) => `'${sqlStr(id)}'`).join(", ");
  const rows = await query(`SELECT task_id, kpi_id, SUM(value) AS total FROM "${safe}" WHERE task_id IN (${inList}) GROUP BY task_id, kpi_id`);
  const out = {};
  for (const row of rows) {
    const tid = typeof row.task_id === "string" ? row.task_id : "";
    const kid = typeof row.kpi_id === "string" ? row.kpi_id : "";
    if (!tid || !kid)
      continue;
    if (!out[tid])
      out[tid] = {};
    out[tid][kid] = normalizeTotal(row.total);
  }
  return out;
}
function normalizeTotal(raw) {
  if (raw == null)
    return 0;
  if (typeof raw === "number")
    return Number.isFinite(raw) ? raw : 0;
  if (typeof raw === "string") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

// dist/src/tasks/kpi-generator.js
var DEFAULT_MODEL = process.env.HIVEMIND_KPI_MODEL ?? "claude-sonnet-4-6";
var DEFAULT_TIMEOUT_MS = 1e4;
var MAX_KPIS = 3;
async function generateKpis(input) {
  const log8 = input.log ?? (() => {
  });
  if (process.env.HIVEMIND_KPI_LLM === "disable") {
    log8("kpi-gen: HIVEMIND_KPI_LLM=disable, skipping");
    return [];
  }
  if (!input.client && !process.env.ANTHROPIC_API_KEY) {
    log8("kpi-gen: no ANTHROPIC_API_KEY, skipping");
    return [];
  }
  const model = input.model ?? DEFAULT_MODEL;
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  let client;
  if (input.client) {
    client = input.client;
  } else {
    try {
      const sdkMod = await Promise.resolve().then(() => (init_sdk(), sdk_exports));
      const Ctor = sdkMod.default;
      client = new Ctor();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      log8(`kpi-gen: SDK import failed: ${msg}`);
      return [];
    }
  }
  const first = await callOnce(
    client,
    model,
    input.text,
    /* strict */
    false,
    timeoutMs,
    log8
  );
  if (first.kpis.length > 0)
    return first.kpis;
  if (!first.retryable)
    return [];
  log8("kpi-gen: first pass returned []; retrying with stricter prompt");
  const second = await callOnce(
    client,
    model,
    input.text,
    /* strict */
    true,
    timeoutMs,
    log8
  );
  return second.kpis;
}
async function callOnce(client, model, taskText, strict, timeoutMs, log8) {
  const system = buildSystemPrompt(strict);
  const userMsg = `Task: ${taskText}

Return the KPIs as a JSON array.`;
  try {
    const result = await withTimeout(client.messages.create({
      model,
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: userMsg }]
    }), timeoutMs);
    const text = extractText(result);
    if (!text) {
      log8("kpi-gen: LLM returned empty content");
      return { kpis: [], retryable: true };
    }
    const json2 = stripCodeFence(text);
    return { kpis: parseAndShape(json2, model), retryable: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    log8(`kpi-gen: LLM call failed: ${msg}`);
    return { kpis: [], retryable: false };
  }
}
function withTimeout(p, ms) {
  return new Promise((resolve9, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout after ${ms}ms`)), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve9(v);
    }, (e) => {
      clearTimeout(t);
      reject(e);
    });
  });
}
function buildSystemPrompt(strict) {
  const base = [
    "You are generating KPI definitions for an engineering task.",
    "Return 1-3 KPIs that measure DONE-ness of the task.",
    "Each KPI is a JSON object with these EXACT fields:",
    `  - kpi_id     (short stable id, e.g. "k_pr_merged")`,
    `  - name       (human-readable, e.g. "PRs merged")`,
    `  - target     (positive integer)`,
    `  - unit       (short, e.g. "count", "lines", "tests")`,
    `  - generated_by (string, just put the model id you are)`,
    `  - generated_at (ISO 8601 timestamp)`,
    "Output a JSON array. Do NOT include any field other than the six above.",
    "Do NOT include keys like 'current', 'progress', or 'status' \u2014 those are computed from events."
  ];
  if (strict) {
    base.push("CRITICAL: Output ONLY the JSON array. No prose, no markdown fences, no explanation. Start with '[' and end with ']'.");
  }
  return base.join("\n");
}
function extractText(result) {
  for (const block of result.content) {
    if (block.type === "text" && typeof block.text === "string") {
      return block.text;
    }
  }
  return "";
}
function stripCodeFence(raw) {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/^```(?:json|jsonc)?\s*\n([\s\S]*?)\n```$/);
  if (fenceMatch)
    return fenceMatch[1].trim();
  return trimmed;
}
function parseAndShape(json2, generatedBy) {
  let arr;
  try {
    arr = JSON.parse(json2);
  } catch {
    return [];
  }
  if (!Array.isArray(arr))
    return [];
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  const stamped = arr.map((item) => {
    if (typeof item !== "object" || item === null)
      return item;
    const obj = item;
    if (typeof obj.generated_by !== "string" || obj.generated_by.length === 0) {
      obj.generated_by = generatedBy;
    }
    if (typeof obj.generated_at !== "string" || obj.generated_at.length === 0) {
      obj.generated_at = nowIso;
    }
    return obj;
  });
  const validated = parseKpis(stamped);
  return validated.slice(0, MAX_KPIS);
}

// dist/src/commands/tasks.js
var USAGE4 = `
hivemind tasks \u2014 manage personal + team tasks

Usage:
  hivemind tasks add "<text>" [--scope me|team] [--assign <user>]
  hivemind tasks list [--mine|--team|--all] [--status active|done|all] [--limit N]
  hivemind tasks edit <task-id> "<new text>"
  hivemind tasks done <task-id>
  hivemind tasks assign <task-id> <user>
  hivemind tasks progress <task-id> <kpi-id> --value N [--note "..."]
  hivemind tasks report [<task-id>]

Identity: <user> must match what \`hivemind whoami\` shows for the
target user. Comparisons are exact (no fuzzy / email matching in v1).
`.trim();
function requireConfig2() {
  const cfg = loadConfig();
  if (!cfg) {
    console.error("Not logged in. Run `hivemind login` first.");
    process.exit(2);
    throw new Error("unreachable");
  }
  return cfg;
}
function makeApi2(cfg) {
  return new DeeplakeApi(cfg.token, cfg.apiUrl, cfg.orgId, cfg.workspaceId, cfg.tableName);
}
function parseScope2(args) {
  const idx = args.findIndex((a) => a === "--scope" || a.startsWith("--scope="));
  if (idx === -1)
    return "me";
  const raw = args[idx].includes("=") ? args[idx].split("=", 2)[1] : args[idx + 1];
  if (raw === "me" || raw === "team")
    return raw;
  console.error(`Invalid --scope value: ${raw}. Allowed: me | team.`);
  process.exit(1);
  throw new Error("unreachable");
}
function parseAssign(args) {
  const idx = args.findIndex((a) => a === "--assign" || a.startsWith("--assign="));
  if (idx === -1)
    return null;
  const raw = args[idx].includes("=") ? args[idx].split("=", 2)[1] : args[idx + 1];
  if (!raw || raw.length === 0) {
    console.error("Missing --assign value.");
    process.exit(1);
    throw new Error("unreachable");
  }
  return raw;
}
function parseScopeFilter(args) {
  const mine = args.includes("--mine");
  const team = args.includes("--team");
  const all = args.includes("--all");
  const count = Number(mine) + Number(team) + Number(all);
  if (count > 1) {
    console.error("Conflicting flags: pass at most one of --mine | --team | --all.");
    process.exit(1);
    throw new Error("unreachable");
  }
  if (team)
    return "team";
  if (all)
    return "all";
  return "mine";
}
function parseStatus2(args) {
  const idx = args.findIndex((a) => a === "--status" || a.startsWith("--status="));
  if (idx === -1)
    return "active";
  const raw = args[idx].includes("=") ? args[idx].split("=", 2)[1] : args[idx + 1];
  if (raw === "active" || raw === "done" || raw === "all")
    return raw;
  console.error(`Invalid --status value: ${raw}. Allowed: active | done | all.`);
  process.exit(1);
  throw new Error("unreachable");
}
function parseLimit2(args) {
  const idx = args.findIndex((a) => a === "--limit" || a.startsWith("--limit="));
  if (idx === -1)
    return 10;
  const raw = args[idx].includes("=") ? args[idx].split("=", 2)[1] : args[idx + 1];
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) {
    console.error(`Invalid --limit value: ${raw}. Must be a positive integer.`);
    process.exit(1);
    throw new Error("unreachable");
  }
  return n;
}
function parseValue(args) {
  const idx = args.findIndex((a) => a === "--value" || a.startsWith("--value="));
  if (idx === -1) {
    console.error("Missing required --value <N> flag.");
    process.exit(1);
    throw new Error("unreachable");
  }
  const raw = args[idx].includes("=") ? args[idx].split("=", 2)[1] : args[idx + 1];
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    console.error(`Invalid --value: ${raw}. Must be a finite integer (events store BIGINT).`);
    process.exit(1);
    throw new Error("unreachable");
  }
  if (n === 0) {
    console.error("Invalid --value: 0. Use a non-zero integer (zero events carry no signal).");
    process.exit(1);
    throw new Error("unreachable");
  }
  return n;
}
function parseNote(args) {
  const idx = args.findIndex((a) => a === "--note" || a.startsWith("--note="));
  if (idx === -1)
    return "";
  return args[idx].includes("=") ? args[idx].split("=", 2)[1] : args[idx + 1] ?? "";
}
function stripKnownFlags2(args) {
  const VALUE_FLAGS = /* @__PURE__ */ new Set(["--scope", "--status", "--limit", "--assign", "--value", "--note"]);
  const BOOL_FLAGS = /* @__PURE__ */ new Set(["--mine", "--team", "--all"]);
  const out = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (BOOL_FLAGS.has(a))
      continue;
    if (VALUE_FLAGS.has(a)) {
      i++;
      continue;
    }
    if (VALUE_FLAGS.has(a.split("=", 2)[0]))
      continue;
    out.push(a);
  }
  return out;
}
function formatListRow2(r) {
  const tag = r.status === "done" ? "[done]" : "[active]";
  const scopeMarker = r.scope === "team" ? "team " : "me   ";
  return `${tag} ${scopeMarker} ${r.task_id}  v${r.version}  ${r.assigned_to}  ${r.text}`;
}
function formatKpiLine(k) {
  const current = typeof k.current === "number" ? String(k.current) : "?";
  return `    - ${k.name}: ${current}/${k.target} ${k.unit}`;
}
async function runTasksCommand(args) {
  const sub = args[0];
  if (!sub || sub === "--help" || sub === "-h" || sub === "help") {
    console.log(USAGE4);
    return;
  }
  const cfg = requireConfig2();
  const api = makeApi2(cfg);
  const tableName = cfg.tasksTableName;
  const WRITE_SUBS = /* @__PURE__ */ new Set(["add", "edit", "done", "assign", "progress"]);
  if (WRITE_SUBS.has(sub)) {
    await api.ensureTasksTable(tableName);
  }
  const pluginVersion = getVersion();
  if (sub === "add") {
    const positional = stripKnownFlags2(args.slice(1));
    const text = positional[0];
    if (!text) {
      console.error('Missing task text. Usage: hivemind tasks add "<text>" [--scope me|team] [--assign <user>]');
      process.exit(1);
      throw new Error("unreachable");
    }
    const scope = parseScope2(args.slice(1));
    const assignedTo = parseAssign(args.slice(1)) ?? cfg.userName;
    try {
      const out = await insertTask(api.query.bind(api), tableName, {
        text,
        scope,
        assigned_to: assignedTo,
        assigned_by: cfg.userName,
        // T4: pass the LLM generator. insertTask awaits it before
        // INSERT so the persisted row carries KPIs from the start.
        // generateKpis returns [] gracefully on missing API key,
        // timeout, or any failure — task INSERT keeps working.
        generateKpis: (taskText) => generateKpis({ text: taskText }),
        plugin_version: pluginVersion
      });
      console.log(`Added task ${out.task_id} (v${out.version}, scope=${scope}, assigned_to=${assignedTo}).`);
    } catch (err) {
      console.error(`Add failed: ${err.message}`);
      process.exit(1);
    }
    return;
  }
  if (sub === "list") {
    const scope = parseScopeFilter(args.slice(1));
    const status = parseStatus2(args.slice(1));
    const limit2 = parseLimit2(args.slice(1));
    let rows = [];
    try {
      rows = await listTasks(api.query.bind(api), tableName, {
        scope,
        status,
        current_user: cfg.userName,
        limit: limit2
      });
    } catch (err) {
      const msg = err.message;
      if (!isMissingTableError(msg))
        throw err;
    }
    if (rows.length === 0) {
      console.log(`(no tasks with scope=${scope} status=${status})`);
      return;
    }
    for (const r of rows) {
      console.log(formatListRow2(r));
      for (const k of r.kpis)
        console.log(formatKpiLine(k));
    }
    return;
  }
  if (sub === "edit") {
    const positional = stripKnownFlags2(args.slice(1));
    const taskId = positional[0];
    const newText = positional[1];
    if (!taskId || !newText) {
      console.error('Usage: hivemind tasks edit <task-id> "<new text>"');
      process.exit(1);
      throw new Error("unreachable");
    }
    try {
      const out = await editTask(api.query.bind(api), tableName, {
        task_id: taskId,
        text: newText,
        assigned_by: cfg.userName,
        plugin_version: pluginVersion
      });
      console.log(`Edited task ${out.task_id} \u2192 v${out.version}.`);
    } catch (err) {
      console.error(`Edit failed: ${err.message}`);
      process.exit(1);
    }
    return;
  }
  if (sub === "done") {
    const positional = stripKnownFlags2(args.slice(1));
    const taskId = positional[0];
    if (!taskId) {
      console.error("Usage: hivemind tasks done <task-id>");
      process.exit(1);
      throw new Error("unreachable");
    }
    try {
      const out = await markTaskDone(api.query.bind(api), tableName, {
        task_id: taskId,
        assigned_by: cfg.userName,
        plugin_version: pluginVersion
      });
      console.log(`Marked task ${out.task_id} done (v${out.version}).`);
    } catch (err) {
      console.error(`Done failed: ${err.message}`);
      process.exit(1);
    }
    return;
  }
  if (sub === "assign") {
    const positional = stripKnownFlags2(args.slice(1));
    const taskId = positional[0];
    const newAssignee = positional[1];
    if (!taskId || !newAssignee) {
      console.error("Usage: hivemind tasks assign <task-id> <user>");
      process.exit(1);
      throw new Error("unreachable");
    }
    try {
      const out = await assignTask(api.query.bind(api), tableName, {
        task_id: taskId,
        assigned_by: cfg.userName,
        assigned_to: newAssignee,
        plugin_version: pluginVersion
      });
      console.log(`Assigned task ${out.task_id} to ${newAssignee} (v${out.version}).`);
    } catch (err) {
      console.error(`Assign failed: ${err.message}`);
      process.exit(1);
    }
    return;
  }
  if (sub === "progress") {
    const positional = stripKnownFlags2(args.slice(1));
    const taskId = positional[0];
    const kpiId = positional[1];
    if (!taskId || !kpiId) {
      console.error('Usage: hivemind tasks progress <task-id> <kpi-id> --value N [--note "..."]');
      process.exit(1);
      throw new Error("unreachable");
    }
    const value = parseValue(args.slice(1));
    const note = parseNote(args.slice(1));
    const task = await getTaskLatest(api.query.bind(api), tableName, taskId);
    if (!task) {
      console.error(`Task not found: ${taskId}`);
      process.exit(1);
      throw new Error("unreachable");
    }
    if (task.kpis.length > 0 && !task.kpis.some((k) => k.kpi_id === kpiId)) {
      const valid = task.kpis.map((k) => k.kpi_id).join(", ");
      console.error(`Unknown kpi_id '${kpiId}' on task ${taskId}. Valid: ${valid}`);
      process.exit(1);
      throw new Error("unreachable");
    }
    try {
      const out = await appendEvent(api.query.bind(api), cfg.taskEventsTableName, {
        task_id: taskId,
        task_version: task.version,
        kpi_id: kpiId,
        value,
        note,
        source: "user",
        agent: "manual",
        plugin_version: pluginVersion
      });
      console.log(`Recorded progress: task ${taskId} kpi ${kpiId} value ${value} (event ${out.id}).`);
    } catch (err) {
      const msg = err.message;
      if (msg.includes("does not exist") || msg.includes("permission denied")) {
        try {
          await api.ensureTaskEventsTable(cfg.taskEventsTableName);
          const out = await appendEvent(api.query.bind(api), cfg.taskEventsTableName, {
            task_id: taskId,
            task_version: task.version,
            kpi_id: kpiId,
            value,
            note,
            source: "user",
            agent: "manual",
            plugin_version: pluginVersion
          });
          console.log(`Recorded progress: task ${taskId} kpi ${kpiId} value ${value} (event ${out.id}).`);
        } catch (retryErr) {
          console.error(`Progress failed: ${retryErr.message}`);
          process.exit(1);
        }
      } else {
        console.error(`Progress failed: ${msg}`);
        process.exit(1);
      }
    }
    return;
  }
  if (sub === "report") {
    const positional = stripKnownFlags2(args.slice(1));
    const targetTaskId = positional[0];
    let tasksToReport = [];
    try {
      if (targetTaskId) {
        const one = await getTaskLatest(api.query.bind(api), tableName, targetTaskId);
        if (!one) {
          console.error(`Task not found: ${targetTaskId}`);
          process.exit(1);
          throw new Error("unreachable");
        }
        tasksToReport = [one];
      } else {
        tasksToReport = await listTasks(api.query.bind(api), tableName, {
          scope: "mine",
          status: "active",
          current_user: cfg.userName,
          limit: 50
          // report is the dive-deep view; allow a higher cap than list's 10
        });
      }
    } catch (err) {
      const msg = err.message;
      if (!isMissingTableError(msg))
        throw err;
    }
    if (tasksToReport.length === 0) {
      console.log("(no active tasks to report on)");
      return;
    }
    for (const task of tasksToReport) {
      console.log(formatListRow2(task));
      let totals = {};
      try {
        totals = await computeAllForTask(api.query.bind(api), cfg.taskEventsTableName, task.task_id);
      } catch (err) {
        const msg = err.message;
        if (!isMissingTableError(msg))
          throw err;
      }
      if (task.kpis.length === 0) {
        const kpiIds = Object.keys(totals);
        if (kpiIds.length === 0) {
          console.log("    (no KPIs defined \u2014 record progress with 'hivemind tasks progress <task-id> <kpi-id> --value N')");
        } else {
          console.log("    (no LLM-generated KPIs \u2014 showing manually-recorded progress)");
          for (const kid of kpiIds) {
            console.log(`    - ${kid}: ${totals[kid]} (manual)`);
          }
        }
        continue;
      }
      for (const k of task.kpis) {
        const current = totals[k.kpi_id] ?? 0;
        console.log(`    - ${k.name}: ${current}/${k.target} ${k.unit}`);
      }
    }
    return;
  }
  console.error(`Unknown tasks subcommand: ${sub}`);
  console.error(USAGE4);
  process.exit(1);
}

// dist/src/commands/goal.js
import { randomUUID as randomUUID8 } from "node:crypto";
var VALID_STATUS = /* @__PURE__ */ new Set(["opened", "in_progress", "closed"]);
function loadApiOrDie(table) {
  const cfg = loadConfig();
  if (!cfg) {
    process.stderr.write("hivemind: not logged in. Run `hivemind login` first.\n");
    process.exit(1);
  }
  const api = new DeeplakeApi(cfg.token, cfg.apiUrl, cfg.orgId, cfg.workspaceId, table);
  const query = (sql) => api.query(sql);
  return { api, query, userName: cfg.userName };
}
async function goalAdd(text) {
  const cfg = loadConfig();
  if (!cfg) {
    process.stderr.write("hivemind: not logged in.\n");
    process.exit(1);
  }
  const table = cfg.goalsTableName;
  const { api, query } = loadApiOrDie(table);
  await api.ensureGoalsTable(table);
  const safe = sqlIdent(table);
  const goalId = randomUUID8();
  const ts = (/* @__PURE__ */ new Date()).toISOString();
  await query(`INSERT INTO "${safe}" (id, goal_id, owner, status, content, version, created_at, agent, plugin_version) VALUES ('${randomUUID8()}', '${sqlStr(goalId)}', '${sqlStr(cfg.userName)}', 'opened', E'${sqlStr(text)}', 1, '${sqlStr(ts)}', 'manual', '')`);
  process.stdout.write(`${goalId}
`);
}
async function goalList(filter) {
  const cfg = loadConfig();
  if (!cfg) {
    process.stderr.write("not logged in\n");
    process.exit(1);
  }
  const { query } = loadApiOrDie(cfg.goalsTableName);
  const safe = sqlIdent(cfg.goalsTableName);
  let where = "";
  if (filter === "mine")
    where = `WHERE owner = '${sqlStr(cfg.userName)}'`;
  try {
    const rows = await query(`SELECT goal_id, owner, status, content FROM "${safe}" ${where} ORDER BY created_at DESC LIMIT 50`);
    if (rows.length === 0) {
      process.stdout.write("(no goals)\n");
      return;
    }
    for (const r of rows) {
      const text = String(r.content ?? "").split(/\r?\n/)[0].trim();
      process.stdout.write(`${r.goal_id}	${r.owner}	${r.status}	${text}
`);
    }
  } catch (e) {
    process.stderr.write(`hivemind goal list: ${e.message}
`);
    process.exit(1);
  }
}
async function goalDone(goalId) {
  await goalProgress(goalId, "closed");
}
async function goalProgress(goalId, status) {
  if (!VALID_STATUS.has(status)) {
    process.stderr.write(`invalid status: ${status} (expected opened|in_progress|closed)
`);
    process.exit(1);
  }
  const cfg = loadConfig();
  if (!cfg) {
    process.stderr.write("not logged in\n");
    process.exit(1);
  }
  const { query } = loadApiOrDie(cfg.goalsTableName);
  const safe = sqlIdent(cfg.goalsTableName);
  const ts = (/* @__PURE__ */ new Date()).toISOString();
  await query(`UPDATE "${safe}" SET status = '${sqlStr(status)}', created_at = '${sqlStr(ts)}' WHERE goal_id = '${sqlStr(goalId)}'`);
  process.stdout.write(`${goalId} -> ${status}
`);
}
async function kpiAdd(args) {
  const [goalId, kpiId, targetStr, unit, ...nameParts] = args;
  if (!goalId || !kpiId || !targetStr || !unit) {
    process.stderr.write("usage: hivemind kpi add <goal_id> <kpi_id> <target> <unit> [name]\n");
    process.exit(1);
  }
  const target = Number.parseInt(targetStr, 10);
  if (!Number.isFinite(target) || target <= 0) {
    process.stderr.write(`invalid target: ${targetStr} (must be positive integer)
`);
    process.exit(1);
  }
  const name = nameParts.length > 0 ? nameParts.join(" ") : kpiId;
  const cfg = loadConfig();
  if (!cfg) {
    process.stderr.write("not logged in\n");
    process.exit(1);
  }
  const { api, query } = loadApiOrDie(cfg.kpisTableName);
  await api.ensureKpisTable(cfg.kpisTableName);
  const safe = sqlIdent(cfg.kpisTableName);
  const content = `${name}

- target: ${target}
- current: 0
- unit: ${unit}`;
  const ts = (/* @__PURE__ */ new Date()).toISOString();
  await query(`INSERT INTO "${safe}" (id, goal_id, kpi_id, content, version, created_at, agent, plugin_version) VALUES ('${randomUUID8()}', '${sqlStr(goalId)}', '${sqlStr(kpiId)}', E'${sqlStr(content)}', 1, '${sqlStr(ts)}', 'manual', '')`);
  process.stdout.write(`${goalId}/${kpiId}
`);
}
async function kpiList(goalId) {
  if (!goalId) {
    process.stderr.write("usage: hivemind kpi list <goal_id>\n");
    process.exit(1);
  }
  const cfg = loadConfig();
  if (!cfg) {
    process.stderr.write("not logged in\n");
    process.exit(1);
  }
  const { query } = loadApiOrDie(cfg.kpisTableName);
  const safe = sqlIdent(cfg.kpisTableName);
  try {
    const rows = await query(`SELECT kpi_id, content FROM "${safe}" WHERE goal_id = '${sqlStr(goalId)}' ORDER BY created_at ASC LIMIT 50`);
    if (rows.length === 0) {
      process.stdout.write("(no kpis)\n");
      return;
    }
    for (const r of rows) {
      const firstLine = String(r.content ?? "").split(/\r?\n/)[0].trim();
      process.stdout.write(`${r.kpi_id}	${firstLine}
`);
    }
  } catch (e) {
    process.stderr.write(`hivemind kpi list: ${e.message}
`);
    process.exit(1);
  }
}
async function kpiBump(goalId, kpiId, deltaStr) {
  if (!goalId || !kpiId || !deltaStr) {
    process.stderr.write("usage: hivemind kpi bump <goal_id> <kpi_id> <delta>\n");
    process.exit(1);
  }
  const delta = Number.parseInt(deltaStr, 10);
  if (!Number.isFinite(delta)) {
    process.stderr.write(`invalid delta: ${deltaStr}
`);
    process.exit(1);
  }
  const cfg = loadConfig();
  if (!cfg) {
    process.stderr.write("not logged in\n");
    process.exit(1);
  }
  const { query } = loadApiOrDie(cfg.kpisTableName);
  const safe = sqlIdent(cfg.kpisTableName);
  const rows = await query(`SELECT content FROM "${safe}" WHERE goal_id = '${sqlStr(goalId)}' AND kpi_id = '${sqlStr(kpiId)}' LIMIT 1`);
  if (rows.length === 0) {
    process.stderr.write(`kpi not found: ${goalId}/${kpiId}
`);
    process.exit(1);
  }
  const content = String(rows[0].content ?? "");
  const newContent = content.replace(/^(\s*-?\s*current\s*:\s*)(-?\d+)(\s*)$/m, (_m, prefix, n, suffix) => `${prefix}${Number.parseInt(n, 10) + delta}${suffix}`);
  if (newContent === content) {
    process.stderr.write(`could not find 'current:' line in kpi ${goalId}/${kpiId}
`);
    process.exit(1);
  }
  const ts = (/* @__PURE__ */ new Date()).toISOString();
  await query(`UPDATE "${safe}" SET content = E'${sqlStr(newContent)}', created_at = '${sqlStr(ts)}' WHERE goal_id = '${sqlStr(goalId)}' AND kpi_id = '${sqlStr(kpiId)}'`);
  process.stdout.write(`${goalId}/${kpiId} +${delta}
`);
}
var USAGE_GOAL = `
hivemind goal \u2014 manage team goals

Usage:
  hivemind goal add "<text>"            create a goal (status=opened)
  hivemind goal list [--all|--mine]     list goals (default: --mine)
  hivemind goal done <goal_id>          mark goal closed
  hivemind goal progress <goal_id> <opened|in_progress|closed>
`.trim();
async function runGoalCommand(args) {
  const sub = args[0];
  if (!sub || sub === "--help" || sub === "-h") {
    process.stdout.write(USAGE_GOAL + "\n");
    return;
  }
  if (sub === "add") {
    const text = args.slice(1).join(" ").trim();
    if (!text) {
      process.stderr.write('usage: hivemind goal add "<text>"\n');
      process.exit(1);
    }
    await goalAdd(text);
    return;
  }
  if (sub === "list") {
    const filter = args.includes("--all") ? "all" : "mine";
    await goalList(filter);
    return;
  }
  if (sub === "done") {
    const id = args[1];
    if (!id) {
      process.stderr.write("usage: hivemind goal done <goal_id>\n");
      process.exit(1);
    }
    await goalDone(id);
    return;
  }
  if (sub === "progress") {
    const id = args[1];
    const status = args[2];
    if (!id || !status) {
      process.stderr.write("usage: hivemind goal progress <goal_id> <status>\n");
      process.exit(1);
    }
    await goalProgress(id, status);
    return;
  }
  process.stderr.write(`unknown goal subcommand: ${sub}
${USAGE_GOAL}
`);
  process.exit(1);
}
var USAGE_KPI = `
hivemind kpi \u2014 manage goal KPIs

Usage:
  hivemind kpi add <goal_id> <kpi_id> <target> <unit> [name]
  hivemind kpi list <goal_id>
  hivemind kpi bump <goal_id> <kpi_id> <delta>
`.trim();
async function runKpiCommand(args) {
  const sub = args[0];
  if (!sub || sub === "--help" || sub === "-h") {
    process.stdout.write(USAGE_KPI + "\n");
    return;
  }
  if (sub === "add") {
    await kpiAdd(args.slice(1));
    return;
  }
  if (sub === "list") {
    await kpiList(args[1]);
    return;
  }
  if (sub === "bump") {
    await kpiBump(args[1], args[2], args[3]);
    return;
  }
  process.stderr.write(`unknown kpi subcommand: ${sub}
${USAGE_KPI}
`);
  process.exit(1);
}

// dist/src/hooks/shared/context-renderer.js
async function renderContextBlock(query, input, opts = {}) {
  const maxRules = opts.maxRules ?? 10;
  const maxTasks = opts.maxTasks ?? 10;
  const log8 = opts.log ?? (() => {
  });
  try {
    let rules = [];
    try {
      rules = await listRules(query, input.rulesTable, {
        status: "active",
        limit: Math.max(maxRules * 4, maxRules + 1)
      });
    } catch (rulesErr) {
      const rmsg = rulesErr instanceof Error ? rulesErr.message : String(rulesErr);
      log8(`render-context-block: rules unavailable (continuing): ${rmsg}`);
    }
    let teamTasks = [];
    let myTasks = [];
    try {
      teamTasks = await listTasks(query, input.tasksTable, {
        scope: "team",
        status: "active",
        limit: Math.max(maxTasks * 4, maxTasks + 1)
      });
      myTasks = await listTasks(query, input.tasksTable, {
        scope: "me",
        status: "active",
        current_user: input.currentUser,
        limit: Math.max(maxTasks * 4, maxTasks + 1)
      });
    } catch (tasksErr) {
      const tmsg = tasksErr instanceof Error ? tasksErr.message : String(tasksErr);
      log8(`render-context-block: tasks unavailable (continuing): ${tmsg}`);
    }
    const visibleTasks = mergeAndDedupTasks(teamTasks, myTasks);
    const rulesShown = rules.slice(0, maxRules);
    const rulesHidden = Math.max(0, rules.length - maxRules);
    const tasksShown = visibleTasks.slice(0, maxTasks);
    const tasksHidden = Math.max(0, visibleTasks.length - maxTasks);
    const taskIds = tasksShown.map((t) => t.task_id);
    let totals = {};
    try {
      totals = await computeAllForTasks(query, input.taskEventsTable, taskIds);
    } catch (aggErr) {
      const aggMsg = aggErr instanceof Error ? aggErr.message : String(aggErr);
      log8(`render-context-block: aggregate failed (continuing with 0/target): ${aggMsg}`);
    }
    return formatBlock({
      rules: rulesShown,
      rulesHidden,
      tasks: tasksShown,
      tasksHidden,
      totals,
      currentUser: input.currentUser
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    log8(`render-context-block: ${msg}`);
    return "";
  }
}
function mergeAndDedupTasks(teamTasks, myTasks) {
  const winner = /* @__PURE__ */ new Map();
  for (const t of [...teamTasks, ...myTasks]) {
    const prev = winner.get(t.task_id);
    if (!prev) {
      winner.set(t.task_id, t);
      continue;
    }
    if (t.version > prev.version) {
      winner.set(t.task_id, t);
    } else if (t.version === prev.version && t.created_at > prev.created_at) {
      winner.set(t.task_id, t);
    }
  }
  const merged = [...winner.values()];
  merged.sort((a, b) => {
    const aMe = a.scope === "me" ? 0 : 1;
    const bMe = b.scope === "me" ? 0 : 1;
    if (aMe !== bMe)
      return aMe - bMe;
    return b.created_at.localeCompare(a.created_at);
  });
  return merged;
}
function formatBlock(input) {
  if (input.rules.length === 0 && input.tasks.length === 0) {
    return "";
  }
  const lines = [];
  if (input.rules.length > 0) {
    lines.push(`=== HIVEMIND RULES (${input.rules.length} active) ===`);
    for (const r of input.rules) {
      lines.push(`- ${r.rule_id}: ${sanitizeForInject(r.text)}`);
    }
    if (input.rulesHidden > 0) {
      lines.push(`(${input.rulesHidden} more \u2014 run 'hivemind rules list' to see all)`);
    }
    lines.push("");
  }
  if (input.tasks.length > 0) {
    lines.push(`=== HIVEMIND TASKS (${input.tasks.length} active) ===`);
    for (const t of input.tasks) {
      lines.push(formatTaskLine(t, input.totals[t.task_id] ?? {}, input.currentUser));
    }
    if (input.tasksHidden > 0) {
      lines.push(`(${input.tasksHidden} more \u2014 run 'hivemind tasks list' to see all)`);
    }
    lines.push("");
  }
  lines.push("=== HIVEMIND HOW-TO ===");
  lines.push("- Rules above are team principles. Treat any action that would violate one as a critical error and surface it to the user before proceeding.");
  lines.push("- Tasks above are your current work. Use 'hivemind tasks progress <task-id> <kpi-id> --value N' to record progress on a KPI.");
  lines.push("- Run 'hivemind rules list' / 'hivemind tasks list' for the full inventories beyond what's shown here.");
  return lines.join("\n");
}
function formatTaskLine(task, kpiTotals, currentUser) {
  const tag = task.scope === "team" ? "[team]" : "[me]";
  const highlight = task.scope === "team" && task.assigned_to === currentUser ? " \u2605YOU" : "";
  const kpiSummary = formatKpiSummary(task.kpis, kpiTotals);
  return `${tag} ${task.task_id}: ${sanitizeForInject(task.text)}${highlight}${kpiSummary}`;
}
function sanitizeForInject(text) {
  return text.replace(LINE_TERMINATOR_RE, "\\n");
}
var LINE_TERMINATOR_RE = /\r\n?|[\n\u2028\u2029\u0085]/g;
function formatKpiSummary(kpis, totals) {
  if (kpis.length === 0)
    return "";
  const parts = kpis.map((k) => {
    const current = totals[k.kpi_id] ?? 0;
    return `${sanitizeForInject(k.name)}: ${current}/${k.target} ${sanitizeForInject(k.unit)}`;
  });
  return ` | ${parts.join(", ")}`;
}

// dist/src/commands/context.js
var USAGE5 = `
hivemind context \u2014 print the rules + tasks block on demand

Usage:
  hivemind context

Same output that SessionStart auto-injects for claude-code / cursor /
hermes. Use from pi / openclaw agents (which have no SessionStart
hook in v1) to pull the block manually, or anywhere as a read-only
diagnostic to see what the renderer would produce right now.
`.trim();
async function runContextCommand(args) {
  if (args[0] === "--help" || args[0] === "-h" || args[0] === "help") {
    console.log(USAGE5);
    return;
  }
  const cfg = loadConfig();
  if (!cfg) {
    console.error("Not logged in. Run `hivemind login` first.");
    process.exit(2);
    throw new Error("unreachable");
  }
  const api = new DeeplakeApi(cfg.token, cfg.apiUrl, cfg.orgId, cfg.workspaceId, cfg.tableName);
  const block = await renderContextBlock((sql) => api.query(sql), {
    rulesTable: cfg.rulesTableName,
    tasksTable: cfg.tasksTableName,
    taskEventsTable: cfg.taskEventsTableName,
    currentUser: cfg.userName
  });
  if (!block) {
    console.error("(no active rules or visible tasks)");
    return;
  }
  console.log(block);
}

// dist/src/cli/update.js
import { execFileSync as execFileSync6 } from "node:child_process";
import { closeSync as closeSync3, existsSync as existsSync37, mkdirSync as mkdirSync24, openSync as openSync3, readFileSync as readFileSync34, realpathSync, unlinkSync as unlinkSync13, writeSync as writeSync2 } from "node:fs";
import { homedir as homedir25 } from "node:os";
import { dirname as dirname22, join as join51, sep as sep5 } from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";

// dist/src/utils/version-check.js
import { readFileSync as readFileSync33 } from "node:fs";
import { dirname as dirname21, join as join50 } from "node:path";
function isNewer(latest, current) {
  const parse2 = (v) => v.split(".").map(Number);
  const [la, lb, lc] = parse2(latest);
  const [ca, cb, cc] = parse2(current);
  return la > ca || la === ca && lb > cb || la === ca && lb === cb && lc > cc;
}

// dist/src/cli/update.js
var NPM_REGISTRY_URL = "https://registry.npmjs.org/@deeplake/hivemind/latest";
var PKG_NAME = "@deeplake/hivemind";
function defaultLockPath() {
  return join51(homedir25(), ".deeplake", "hivemind-update.lock");
}
function detectInstallKind(argv1) {
  const realArgv1 = (() => {
    try {
      return realpathSync(argv1 ?? process.argv[1] ?? fileURLToPath2(import.meta.url));
    } catch {
      return argv1 ?? process.argv[1] ?? fileURLToPath2(import.meta.url);
    }
  })();
  let dir = dirname22(realArgv1);
  let installDir = null;
  for (let i = 0; i < 10; i++) {
    const pkgPath = `${dir}${sep5}package.json`;
    try {
      const pkg = JSON.parse(readFileSync34(pkgPath, "utf-8"));
      if (pkg.name === PKG_NAME || pkg.name === "hivemind") {
        installDir = dir;
        break;
      }
    } catch {
    }
    const parent = dirname22(dir);
    if (parent === dir)
      break;
    dir = parent;
  }
  installDir ??= dirname22(realArgv1);
  if (realArgv1.includes(`${sep5}_npx${sep5}`) || realArgv1.includes(`${sep5}.npx${sep5}`)) {
    return { kind: "npx", installDir };
  }
  if (realArgv1.includes(`${sep5}node_modules${sep5}@deeplake${sep5}hivemind`) || realArgv1.includes(`${sep5}node_modules${sep5}hivemind`)) {
    return { kind: "npm-global", installDir };
  }
  let gitDir = installDir;
  for (let i = 0; i < 6; i++) {
    if (existsSync37(`${gitDir}${sep5}.git`)) {
      return { kind: "local-dev", installDir };
    }
    const parent = dirname22(gitDir);
    if (parent === gitDir)
      break;
    gitDir = parent;
  }
  return { kind: "unknown", installDir };
}
async function getLatestNpmVersion(timeoutMs = 5e3) {
  try {
    const res = await fetch(NPM_REGISTRY_URL, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok)
      return null;
    const meta = await res.json();
    return meta.version ?? null;
  } catch {
    return null;
  }
}
var defaultSpawn = (cmd, args) => {
  execFileSync6(cmd, args, { stdio: "inherit" });
};
function tryAcquireLock(path5) {
  mkdirSync24(dirname22(path5), { recursive: true, mode: 448 });
  const claim = () => {
    const fd = openSync3(path5, "wx", 384);
    writeSync2(fd, String(process.pid));
    return fd;
  };
  try {
    return claim();
  } catch (e) {
    if (e.code !== "EEXIST")
      throw e;
  }
  let holderPid = 0;
  try {
    holderPid = Number(readFileSync34(path5, "utf-8").trim()) || 0;
  } catch {
    try {
      return claim();
    } catch {
      return null;
    }
  }
  if (holderPid > 0) {
    try {
      process.kill(holderPid, 0);
      log(`another hivemind update is already running (pid=${holderPid}); skipping.`);
      return null;
    } catch {
    }
  }
  try {
    unlinkSync13(path5);
  } catch {
  }
  try {
    return claim();
  } catch {
    log(`another hivemind update is already running; skipping.`);
    return null;
  }
}
function releaseLock(fd, path5) {
  try {
    closeSync3(fd);
  } catch {
  }
  try {
    unlinkSync13(path5);
  } catch {
  }
}
async function runUpdate(opts = {}) {
  const current = opts.currentVersionOverride ?? getVersion();
  const latest = opts.latestVersionOverride !== void 0 ? opts.latestVersionOverride : await getLatestNpmVersion();
  if (!latest) {
    warn(`Could not reach npm registry to check for updates.`);
    warn(`Current version: ${current}`);
    return 1;
  }
  if (!isNewer(latest, current)) {
    log(`hivemind ${current} is up to date (npm latest: ${latest}).`);
    return 0;
  }
  log(`Update available: ${current} \u2192 ${latest}`);
  const detected = opts.installKindOverride ?? detectInstallKind();
  const spawn4 = opts.spawn ?? defaultSpawn;
  switch (detected.kind) {
    case "npm-global": {
      if (opts.dryRun) {
        log(`(dry-run) Would run: npm install -g ${PKG_NAME}@latest`);
        log(`(dry-run) Would re-run: hivemind install --skip-auth`);
        return 0;
      }
      const lockPath2 = opts.lockPathOverride ?? defaultLockPath();
      const lockFd = tryAcquireLock(lockPath2);
      if (lockFd === null)
        return 0;
      try {
        log(`Upgrading via npm\u2026`);
        try {
          spawn4("npm", ["install", "-g", `${PKG_NAME}@latest`]);
        } catch (e) {
          warn(`npm install failed: ${e.message}`);
          warn(`Try running it manually: npm install -g ${PKG_NAME}@latest`);
          return 1;
        }
        log(``);
        log(`Refreshing agent bundles\u2026`);
        try {
          spawn4("hivemind", ["install", "--skip-auth"]);
        } catch (e) {
          warn(`Agent refresh failed: ${e.message}`);
          warn(`Run manually: hivemind install`);
          return 1;
        }
        log(``);
        log(`Updated to ${latest}.`);
        return 0;
      } finally {
        releaseLock(lockFd, lockPath2);
      }
    }
    case "npx": {
      if (opts.dryRun) {
        log(`(dry-run) Would print npx-pin instructions (no persistent install to upgrade).`);
        return 0;
      }
      log(`You ran hivemind via npx, which does not have a persistent global install.`);
      log(`To use the new version, re-run with the explicit version pin:`);
      log(``);
      log(`  npx ${PKG_NAME}@${latest} install`);
      log(``);
      log(`Or install globally so future updates are one command:`);
      log(``);
      log(`  npm install -g ${PKG_NAME}@latest`);
      return 0;
    }
    case "local-dev": {
      if (opts.dryRun) {
        log(`(dry-run) Would refuse: running from a local dev checkout (${detected.installDir}).`);
        return 0;
      }
      warn(`hivemind is running from a local development checkout (${detected.installDir}).`);
      warn(`Update via your dev workflow (git pull + npm install + npm run build),`);
      warn(`not via 'hivemind update'.`);
      return 1;
    }
    case "unknown":
    default: {
      if (opts.dryRun) {
        log(`(dry-run) Would refuse: install kind unknown (${detected.installDir}).`);
        return 0;
      }
      warn(`Could not determine how hivemind was installed (path: ${detected.installDir}).`);
      warn(`Update manually: npm install -g ${PKG_NAME}@latest`);
      return 1;
    }
  }
}

// dist/src/cli/index.js
var AUTH_SUBCOMMANDS = /* @__PURE__ */ new Set([
  "whoami",
  "logout",
  "org",
  "workspaces",
  "workspace",
  "invite",
  "members",
  "remove",
  "autoupdate",
  "sessions"
]);
var USAGE6 = `
hivemind \u2014 one brain for every agent on your team

Usage:
  hivemind install   [--only <platforms>] [--skip-auth] [--token <value>]
      Auto-detect assistants on this machine and install hivemind into each.
      --only takes a comma-separated list: ${allPlatformIds().join(",")}
      --token, or env HIVEMIND_TOKEN, signs in non-interactively (useful
      for CI / scripted installs). Without it, a TTY install shows a
      consent prompt; a headless install skips auth and prints a hint
      for 'hivemind login'.

  hivemind uninstall [--only <platforms>]
      Auto-detect installed assistants and remove hivemind from each.
      --only takes the same list to scope the removal.

  hivemind claude  install | uninstall
  hivemind codex   install | uninstall
  hivemind claw    install | uninstall
  hivemind cursor  install | uninstall
  hivemind hermes  install | uninstall
  hivemind pi      install | uninstall
      Install or remove hivemind for a specific assistant.

  hivemind login            Run device-flow login (open browser).
  hivemind status           Show which assistants are wired up.
  hivemind update [--dry-run]
      Check npm for a newer @deeplake/hivemind, upgrade the CLI, and refresh
      every detected agent bundle. Single command for all agents.

  hivemind dashboard [--cwd <path>] [--out <path>] [--no-open]
                     [--serve] [--port <n>]
      Build a self-contained HTML dashboard for this repo. Combines
      KPI cards (tokens saved, skills created, memory recalls,
      sessions) with the codebase-graph visualization. Writes to
      ~/.hivemind/dashboards/<repo-key>/index.html by default.
      --no-open skips the browser launch (headless / CI scenarios).
      --serve starts a loopback HTTP server at http://127.0.0.1:<port>
      (default 8123) so the dashboard is reachable via a URL \u2014 useful
      over SSH; VS Code / Cursor Remote-SSH auto-forwards the port
      and opens it in the integrated Simple Browser tab on click.

Semantic search (embeddings):
  hivemind embeddings install                Download @huggingface/transformers
                                             once (~600 MB) into a shared dir,
                                             symlink every detected agent
                                             plugin to it, and set
                                             embeddings.enabled = true in
                                             ~/.deeplake/config.json. Idempotent.
  hivemind embeddings enable                 Light opt-in: flip
                                             embeddings.enabled = true in
                                             ~/.deeplake/config.json. Use this
                                             after \`disable\` to turn back on
                                             without re-running install.
  hivemind embeddings disable                Light opt-out: flip
                                             embeddings.enabled = false and
                                             SIGTERM the running daemon. Shared
                                             deps stay on disk.
  hivemind embeddings uninstall [--prune]    Full opt-out: remove the per-agent
                                             symlinks, flip
                                             embeddings.enabled = false, and
                                             SIGTERM the daemon. --prune also
                                             deletes the shared dir to reclaim
                                             ~600 MB.
  hivemind embeddings status                 Show config + shared-deps + per-
                                             agent state.

  Add --with-embeddings to "hivemind install" (or "hivemind <agent> install")
  to run "embeddings install" automatically after installing the agent(s).

Codebase graph (per-repo AST snapshot + cloud sync):
  hivemind graph build [--cwd <path>]        Walk TypeScript sources, extract
                                             AST nodes + edges, write a
                                             snapshot, and push to cloud.
  hivemind graph diff <sha1> <sha2>          Diff two snapshots by commit.
  hivemind graph history [-n N] [--json]     Show last N build entries.
  hivemind graph init [--force]              Install a managed
                                             .git/hooks/post-commit hook
                                             that rebuilds on each commit.
  hivemind graph pull                        Download the freshest cloud
                                             snapshot for HEAD into local.
  hivemind graph uninstall                   Remove the managed post-commit
                                             hook.
  Agents query the local snapshot via the Deeplake mount at
  ~/.deeplake/memory/graph/{index.md,find/<pattern>,show/<handle-or-pattern>}.

Skill management (mine + share reusable Claude skills across the org):
${renderCliHelpBlock()}

Team-wide rules:
  hivemind rules add "<text>" [--scope team]   Add a new rule (org-wide).
  hivemind rules list [--status active|done|all] [--limit N]
                                               List rules. Default: active, 10 newest.
  hivemind rules edit <rule-id> "<new text>"   Edit a rule (bumps version).
  hivemind rules done <rule-id>                Mark a rule done.
  Note: active rules are auto-injected into the SessionStart block for
  claude-code / cursor / hermes; codex / pi / openclaw use 'hivemind context'.

Personal + team tasks:
  hivemind tasks add "<text>" [--scope me|team] [--assign <user>]
                                               Add a task (default --scope me, self-assigned).
  hivemind tasks list [--mine|--team|--all] [--status active|done|all] [--limit N]
                                               List tasks. Default --mine + active + 10 newest.
  hivemind tasks edit <task-id> "<new text>"   Edit a task (bumps version).
  hivemind tasks done <task-id>                Mark a task done.
  hivemind tasks assign <task-id> <user>       Reassign a task.
  hivemind tasks progress <task-id> <kpi-id> --value N [--note "..."]
                                               Append a KPI progress event.
  hivemind tasks report [<task-id>]            KPI progress summary (computed from events).
  Note: KPIs are generated automatically from task text when
  ANTHROPIC_API_KEY is set (set HIVEMIND_KPI_LLM=disable to opt out).
  <user> values must match the target user's 'hivemind whoami' output
  exactly (no fuzzy email matching in v1).

Cross-agent helpers:
  hivemind context                             Print the rules+tasks block on demand.
                                               Fallback for pi/openclaw agents (no SessionStart hook)
                                               and read-only diagnostic for any agent.

Account / org / workspace:
  hivemind whoami                          Show current user, org, workspace.
  hivemind logout                          Remove credentials.
  hivemind org list                        List organizations.
  hivemind org switch <name-or-id>         Switch active organization.
  hivemind workspaces                      List workspaces in current org.
  hivemind workspace list                  List workspaces (alias of 'workspaces').
  hivemind workspace switch <name-or-id>   Switch active workspace.
  hivemind members                         List org members.
  hivemind invite <email> <ADMIN|WRITE|READ>  Invite a teammate.
  hivemind remove <user-id>                Remove a member.
  hivemind autoupdate [on|off]             Toggle Claude Code plugin auto-update.
  hivemind sessions prune [...]            Manage your captured sessions.

  hivemind --version        Print the hivemind version.
  hivemind --help           Show this message.

Docs:  https://github.com/activeloopai/hivemind
`.trim();
function parseOnly(args) {
  const idx = args.findIndex((a) => a === "--only" || a.startsWith("--only="));
  if (idx === -1)
    return null;
  const raw = args[idx].includes("=") ? args[idx].split("=", 2)[1] : args[idx + 1];
  if (!raw)
    return null;
  const ids = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const valid = new Set(allPlatformIds());
  const bad = ids.filter((id) => !valid.has(id));
  if (bad.length > 0) {
    warn(`Unknown platform(s): ${bad.join(", ")}. Valid: ${allPlatformIds().join(", ")}`);
    process.exit(1);
  }
  return ids;
}
function hasFlag(args, flag) {
  return args.includes(flag);
}
function parseToken(args) {
  const idx = args.findIndex((a) => a === "--token" || a.startsWith("--token="));
  if (idx === -1)
    return void 0;
  const raw = args[idx].includes("=") ? args[idx].split("=", 2)[1] : args[idx + 1];
  return raw && raw.length > 0 ? raw : void 0;
}
function hasEnvToken() {
  return Boolean(process.env.HIVEMIND_TOKEN);
}
async function runAuthGate(args) {
  const flagToken = parseToken(args);
  const isTTY = Boolean(process.stdin.isTTY);
  if (flagToken || hasEnvToken()) {
    const ok = await loginWithProvidedToken(flagToken);
    if (ok)
      return;
  }
  if (!isTTY) {
    log("");
    log("No TTY detected \u2014 continuing without sign-in.");
    log("To sign in:");
    log("  1) Visit https://app.deeplake.ai/api-keys to create an API key");
    log("  2) Rerun: HIVEMIND_TOKEN=<key> hivemind install");
    log("Or run `hivemind login` after install.");
    return;
  }
  log("");
  log("\u{1F41D} One more step to unlock Hivemind");
  log("");
  log("To enable shared memory and auto-learning across your agents,");
  log("we need to sign you in. Your traces will be securely stored in");
  log("your private Hivemind, so all your agents can recall them.");
  log("");
  log("You can later connect your own cloud storage like S3/GCS/Azure Blob.");
  log("");
  const yes = await confirm("Sign in now?", true);
  let signedIn = false;
  if (yes) {
    signedIn = await ensureLoggedIn();
    if (!signedIn) {
      warn("Login did not complete.");
    }
  }
  if (!signedIn) {
    log("");
    log("Alternatively, sign in at https://app.deeplake.ai/api-keys, create");
    log("an API key, and paste it here. Press Enter to skip and continue");
    log("installing without sign-in (you can run `hivemind login` later).");
    log("");
    const MAX_PASTE_ATTEMPTS = 3;
    for (let attempt = 1; attempt <= MAX_PASTE_ATTEMPTS; attempt++) {
      const pasted = await promptLine("API key: ");
      if (!pasted)
        break;
      signedIn = await loginWithProvidedToken(pasted);
      if (signedIn)
        break;
      const remaining = MAX_PASTE_ATTEMPTS - attempt;
      if (remaining > 0) {
        log("");
        log(`That key wasn't accepted (likely invalid or revoked). Try again (${remaining} attempt${remaining === 1 ? "" : "s"} left) or press Enter to skip.`);
        log("");
      }
    }
    if (!signedIn) {
      log("");
      log("Continuing install without sign-in. Run `hivemind login` later, or");
      log("rerun with `HIVEMIND_TOKEN=<key> hivemind install`.");
    }
  }
}
async function runInstallAll(args) {
  const only = parseOnly(args);
  const skipAuth = hasFlag(args, "--skip-auth");
  const withEmbeddings = hasFlag(args, "--with-embeddings");
  const targets = only ?? detectPlatforms().map((p) => p.id);
  if (targets.length === 0) {
    log("No supported assistants detected.");
    log("Supported: Claude Code, Codex, OpenClaw, Cursor, Hermes Agent.");
    log("Install one and rerun `hivemind install`, or target a specific assistant: `hivemind cursor install`.");
    return;
  }
  log(`Installing hivemind ${getVersion()} for: ${targets.join(", ")}`);
  log("");
  if (!skipAuth && !isLoggedIn()) {
    await runAuthGate(args);
  }
  for (const id of targets)
    runSingleInstall(id);
  if (withEmbeddings) {
    log("");
    installEmbeddings();
  }
  await maybeShowOrgChoice();
  log("");
  log("Done. Restart each assistant to activate hooks.");
}
function runSingleInstall(id) {
  try {
    if (id === "claude")
      installClaude();
    else if (id === "codex")
      installCodex();
    else if (id === "claw")
      installOpenclaw();
    else if (id === "cursor")
      installCursor();
    else if (id === "hermes")
      installHermes();
    else if (id === "pi")
      installPi();
  } catch (err) {
    warn(`  ${id.padEnd(14)} FAILED: ${err.message}`);
  }
}
function runSingleUninstall(id) {
  try {
    if (id === "claude")
      uninstallClaude();
    else if (id === "codex")
      uninstallCodex();
    else if (id === "claw")
      uninstallOpenclaw();
    else if (id === "cursor")
      uninstallCursor();
    else if (id === "hermes")
      uninstallHermes();
    else if (id === "pi")
      uninstallPi();
  } catch (err) {
    warn(`  ${id.padEnd(14)} FAILED: ${err.message}`);
  }
}
function runStatus() {
  const detected = detectPlatforms();
  log(`hivemind ${getVersion()}`);
  log(`logged in: ${isLoggedIn() ? "yes" : "no"}`);
  log("");
  log("Detected assistants:");
  if (detected.length === 0)
    log("  (none)");
  for (const p of detected)
    log(`  ${p.id.padEnd(8)} ${p.markerDir}`);
}
async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  if (!cmd || cmd === "--help" || cmd === "-h" || cmd === "help") {
    log(USAGE6);
    return;
  }
  if (cmd === "--version" || cmd === "-v" || cmd === "version") {
    log(getVersion());
    return;
  }
  if (cmd === "install") {
    await runInstallAll(args.slice(1));
    return;
  }
  if (cmd === "uninstall") {
    const only = parseOnly(args.slice(1));
    const targets = only ?? detectPlatforms().map((p) => p.id);
    for (const id of targets)
      runSingleUninstall(id);
    return;
  }
  if (cmd === "login") {
    await ensureLoggedIn();
    return;
  }
  if (cmd === "status") {
    runStatus();
    return;
  }
  if (cmd === "update") {
    const code = await runUpdate({ dryRun: hasFlag(args.slice(1), "--dry-run") });
    process.exit(code);
  }
  if (cmd === "skillify") {
    runSkillifyCommand(args.slice(1));
    return;
  }
  if (cmd === "rules") {
    await runRulesCommand(args.slice(1));
    return;
  }
  if (cmd === "tasks") {
    await runTasksCommand(args.slice(1));
    return;
  }
  if (cmd === "goal" || cmd === "goals") {
    await runGoalCommand(args.slice(1));
    return;
  }
  if (cmd === "kpi" || cmd === "kpis") {
    await runKpiCommand(args.slice(1));
    return;
  }
  if (cmd === "context") {
    await runContextCommand(args.slice(1));
    return;
  }
  if (cmd === "graph") {
    await runGraphCommand(args.slice(1));
    return;
  }
  if (cmd === "dashboard") {
    const code = await runDashboardCommand(args.slice(1));
    process.exit(code);
  }
  if (cmd === "embeddings") {
    const sub = args[1];
    if (sub === "install") {
      installEmbeddings();
      return;
    }
    if (sub === "enable") {
      enableEmbeddings();
      return;
    }
    if (sub === "disable") {
      disableEmbeddings();
      return;
    }
    if (sub === "uninstall") {
      uninstallEmbeddings({ prune: hasFlag(args.slice(2), "--prune") });
      return;
    }
    if (sub === "status") {
      statusEmbeddings();
      return;
    }
    warn("Usage: hivemind embeddings install | enable | disable | uninstall [--prune] | status");
    process.exit(1);
  }
  if (AUTH_SUBCOMMANDS.has(cmd)) {
    await runAuthCommand(args);
    return;
  }
  const platformCmds = ["claude", "codex", "claw", "cursor", "hermes", "pi"];
  if (platformCmds.includes(cmd)) {
    const sub = args[1];
    if (sub === "install") {
      runSingleInstall(cmd);
      if (hasFlag(args.slice(2), "--with-embeddings")) {
        log("");
        installEmbeddings();
      }
    } else if (sub === "uninstall")
      runSingleUninstall(cmd);
    else {
      warn(`Usage: hivemind ${cmd} install [--with-embeddings] | uninstall`);
      process.exit(1);
    }
    return;
  }
  warn(`Unknown command: ${cmd}`);
  log(USAGE6);
  process.exit(1);
}
main().catch((err) => {
  warn(`hivemind: ${err.message}`);
  process.exit(1);
});
/*! Bundled license information:

js-yaml/dist/js-yaml.mjs:
  (*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT *)
*/
