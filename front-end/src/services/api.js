const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7062";
const AUTH_TOKEN_STORAGE_KEY = "sleep-sanctuary-auth-token";

function getAuthToken() {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";
}

export function setAuthToken(token) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function normalizeProfile(profile) {
  if (!profile) {
    return profile;
  }

  return {
    ...profile,
    profession: profile.profession || profile.occupation || "",
    occupation: profile.occupation || profile.profession || "",
    weight: profile.weight ?? "",
    height: profile.height ?? ""
  };
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    let errorBody;
    try {
      const errorJson = await response.json();
      errorBody = errorJson.errors ? errorJson.errors.join(", ") : JSON.stringify(errorJson);
    } catch {
      errorBody = await response.text();
    }
    throw new Error(errorBody || `Erro ${response.status} ao chamar ${endpoint}`);
  }

  return parseResponse(response);
}

async function requestOrNull(endpoint, options = {}) {
  try {
    return await request(endpoint, options);
  } catch {
    return null;
  }
}

export function loginUser(email, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function registerUser(data) {
  return request("/user", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function saveSleepRecord(data) {
  return request("/sleep", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function getSleepHistory(pageNumber = 1, pageSize = 20) {
  return request(`/sleep${buildQuery({ pageNumber, pageSize })}`);
}

export async function getInsights() {
  const apiInsights = await requestOrNull("/insights");
  if (apiInsights) {
    return apiInsights;
  }

  const historyResponse = await getSleepHistory(1, 50).catch(() => null);
  const records = Array.isArray(historyResponse?.items) ? historyResponse.items : [];

  if (records.length === 0) {
    return {
      averageSleep: 0,
      averageScore: null,
      patterns: ["Ainda nao ha registros suficientes para gerar padroes."],
      recommendations: ["Preencha mais registros diarios para liberar insights personalizados."]
    };
  }

  const durations = records
    .map((record) => Number(record.durationInHours))
    .filter((value) => Number.isFinite(value) && value > 0);
  const averageSleep = durations.length
    ? durations.reduce((accumulator, value) => accumulator + value, 0) / durations.length
    : 0;

  return {
    averageSleep,
    averageScore: null,
    patterns: [
      `Foram analisados ${records.length} registros recentes.`,
      `Media de sono aproximada: ${averageSleep.toFixed(1)} horas por noite.`
    ],
    recommendations: [
      "Mantenha o registro diario para aumentar a precisao dos insights.",
      "Tente manter horarios de dormir e acordar mais consistentes."
    ]
  };
}

export async function getUserProfile() {
  const profile = await request("/user");
  return normalizeProfile(profile);
}

export async function getSleepRecordById(recordId) {
  return request(`/sleep/${recordId}`);
}

export async function getSleepAnalysisByRecordId(recordId) {
  return requestOrNull(`/sleep/${recordId}/analysis`);
}
