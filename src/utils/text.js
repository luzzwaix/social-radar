export function decodeUnicodeEscapes(value) {
  if (typeof value !== "string") {
    return value;
  }

  // If a backend (or dataset pipeline) double-escaped unicode, the UI may
  // show literals like "\u0410\u043b\u043c\u0430\u0442\u044b" instead of Cyrillic.
  // Decoding here is safe: it only affects strings that actually contain \uXXXX.
  // Some payloads include multiple backslashes (\\u0410), so we decode one-or-more.
  return value.replace(/\\+u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export function repairMojibake(value) {
  if (typeof value !== "string") {
    return value;
  }

  // Recover common UTF-8 -> cp1251/latin1 mojibake like:
  // "РџСЂРѕРіРЅРѕР·" -> "Прогноз"
  if (!/[ÐÑРС]/.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(Array.from(value, (symbol) => symbol.charCodeAt(0) & 0xff));
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return /[\u0400-\u04FF]/.test(decoded) ? decoded : value;
  } catch {
    return value;
  }
}

export function normalizeDisplayText(value) {
  return repairMojibake(decodeUnicodeEscapes(value));
}

export function decodeUnicodeEscapesDeep(value) {
  if (typeof value === "string") {
    return normalizeDisplayText(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => decodeUnicodeEscapesDeep(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, decodeUnicodeEscapesDeep(item)]));
  }

  return value;
}
