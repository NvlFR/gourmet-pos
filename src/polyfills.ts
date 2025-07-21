// Crypto polyfill for Vite
if (typeof globalThis.crypto === "undefined") {
  const crypto = require("crypto");
  (globalThis as any).crypto = crypto;
}
