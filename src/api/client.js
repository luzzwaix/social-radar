const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_MOCK_DELAY_MS = 180;

const clientConfig = {
  baseUrl: "",
  timeoutMs: DEFAULT_TIMEOUT_MS,
  mockDelayMs: DEFAULT_MOCK_DELAY_MS,
  useMockFallback: true,
};

export class ApiError extends Error {
  constructor(message, { status = 0, code = "API_ERROR", details = null, cause = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.cause = cause;
  }
}

export class ApiTimeoutError extends ApiError {
  constructor(message = "Request timed out", details = null) {
    super(message, { status: 408, code: "API_TIMEOUT", details });
    this.name = "ApiTimeoutError";
  }
}

export function configureApiClient(options = {}) {
  Object.assign(clientConfig, options);
  return getApiClientConfig();
}

export function getApiClientConfig() {
  return { ...clientConfig };
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function serializeQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function joinUrl(baseUrl, path, params) {
  const normalizedBase = (baseUrl || "").replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}${serializeQuery(params)}`;
}

function toHeaders(headers = {}, hasJsonBody = false) {
  const nextHeaders = { ...headers };
  if (hasJsonBody && !Object.keys(nextHeaders).some((key) => key.toLowerCase() === "content-type")) {
    nextHeaders["Content-Type"] = "application/json";
  }
  return nextHeaders;
}

function normalizeBody(body, method) {
  if (body == null || method === "GET" || method === "HEAD") {
    return undefined;
  }

  if (typeof body === "string" || body instanceof FormData || body instanceof Blob) {
    return body;
  }

  return JSON.stringify(body);
}

function createTimeoutSignal(timeoutMs) {
  if (typeof AbortController === "undefined") {
    return { signal: undefined, clear: () => {} };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timer),
  };
}

async function parseErrorResponse(response) {
  try {
    return await response.json();
  } catch {
    try {
      return await response.text();
    } catch {
      return null;
    }
  }
}

async function resolveMock(mockFactory, mockData, context, mockDelayMs) {
  await sleep(mockDelayMs);

  if (typeof mockFactory === "function") {
    return mockFactory(context);
  }

  if (typeof mockData === "function") {
    return mockData(context);
  }

  if (mockData !== undefined) {
    return mockData;
  }

  throw new ApiError("Mock response is missing", { code: "MOCK_MISSING" });
}

function normalizeApiError(error, response) {
  if (error instanceof ApiError) {
    return error;
  }

  const status = response?.status ?? 0;
  const message = response ? `Request failed with status ${status}` : error?.message || "Network request failed";

  return new ApiError(message, {
    status,
    code: response ? "HTTP_ERROR" : "NETWORK_ERROR",
    details: error,
    cause: error,
  });
}

export async function request(path, options = {}) {
  const {
    method = "GET",
    baseUrl = clientConfig.baseUrl,
    params,
    body,
    headers = {},
    timeoutMs = clientConfig.timeoutMs,
    mockDelayMs = clientConfig.mockDelayMs,
    mockData,
    mockFactory,
    useMockFallback = clientConfig.useMockFallback,
    parseJson = true,
    expectedStatus = [200, 201, 202, 204],
  } = options;

  const context = {
    path,
    method,
    params,
    body,
    headers,
    timeoutMs,
  };

  if (useMockFallback) {
    return resolveMock(mockFactory, mockData, context, mockDelayMs);
  }

  if (typeof fetch !== "function") {
    throw new ApiError("Fetch API is not available in this runtime", {
      code: "FETCH_UNAVAILABLE",
    });
  }

  const url = joinUrl(baseUrl, path, params);
  const { signal, clear } = createTimeoutSignal(timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      signal,
      headers: toHeaders(headers, Boolean(body) && typeof body !== "string" && !(body instanceof FormData)),
      body: normalizeBody(body, method),
    });

    if (!expectedStatus.includes(response.status)) {
      const details = await parseErrorResponse(response);
      throw new ApiError(`Request failed with status ${response.status}`, {
        status: response.status,
        code: "HTTP_ERROR",
        details,
      });
    }

    if (response.status === 204 || parseJson === false) {
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new ApiTimeoutError("Request timed out", { path, timeoutMs });
    }

    throw normalizeApiError(error);
  } finally {
    clear();
  }
}

