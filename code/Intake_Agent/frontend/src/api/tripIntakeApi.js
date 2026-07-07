const API_BASE_URL = "http://localhost:8080";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    return data;
  }

  return data;
}

export async function submitTripIntake(tripData) {
  const response = await fetch(`${API_BASE_URL}/api/trip-intake`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tripData)
  });

  return handleResponse(response);
}

export async function confirmTripRequest(tripRequest) {
  const response = await fetch(`${API_BASE_URL}/api/trip-intake/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tripRequest)
  });

  return handleResponse(response);
}

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`, {
    method: "GET"
  });

  return handleResponse(response);
}
