const API_BASE = "http://localhost:3000/api";

export async function apiCall(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}
