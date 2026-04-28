const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7062";

function getAuthToken() {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem("sleep-sanctuary-auth-token") || "";
}

export function setAuthToken(token) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("sleep-sanctuary-auth-token", token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("sleep-sanctuary-auth-token");
  }
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

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
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
  return request(`/sleep?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

export function getInsights() {
  return request("/insights").catch(() => {
    return {
      averageSleep: 7.2,
      averageScore: 75,
      patterns: ["Sono irregular", "Alto uso de telas"],
      recommendations: ["Reduzir uso de celular antes de dormir", "Manter horario fixo"]
    };
  });
}

export function getUserProfile() {
  return request("/user");
}
