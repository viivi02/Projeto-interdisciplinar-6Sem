const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function getAuthToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem("sleep-sanctuary-auth-token") || "";
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
    const errorBody = await response.text();
    throw new Error(errorBody || `Erro ${response.status} ao chamar ${endpoint}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function saveSleepRecord(data) {
  return request("/sleep-records", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function getSleepHistory() {
  return request("/sleep-history");
}

export function getInsights() {
  return request("/insights");
}

export function getUserProfile() {
  return request("/user/profile");
}

