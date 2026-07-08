# Trip Intake Agent API Documentation

## 1. Overview

This document describes the backend API used by the Trip Intake Agent.

The frontend communicates with the C++ backend using HTTP requests and JSON.

Current backend base URL:

```text
http://localhost:8080
```

Current frontend URL:

```text
http://localhost:5173
```

---

## 2. Endpoints

The current backend provides three endpoints:

```text
GET  /api/health
POST /api/trip-intake
POST /api/trip-intake/confirm
```

---

## 3. GET /api/health

### Purpose

Checks whether the backend server is running.

### Request

```http
GET /api/health
```

### Example Response

```json
{
  "status": "ok",
  "message": "Travel planner backend is running."
}
```

### Success Criteria

The backend is considered running if this endpoint returns status code `200`.

---

## 4. POST /api/trip-intake

### Purpose

Submits the user's trip intake form to the backend.

The backend creates a `TripRequest`, validates it, and returns either a validated trip request summary or a list of validation errors.

### Request

```http
POST /api/trip-intake
Content-Type: application/json
```

### Request Body

```json
{
  "origin": "Toronto",
  "destination": "Japan",
  "startDate": "2026-08-01",
  "endDate": "2026-08-12",
  "numberOfTravelers": 2,
  "budget": 3000,
  "currency": "CAD",
  "interests": ["food", "photography"],
  "travelPace": "balanced"
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `origin` | string | yes | City where the trip starts |
| `destination` | string | yes | Destination city, country, or region |
| `startDate` | string | yes | Trip start date in `YYYY-MM-DD` format |
| `endDate` | string | yes | Trip end date in `YYYY-MM-DD` format |
| `numberOfTravelers` | number | yes | Number of travelers |
| `budget` | number | yes | Trip budget |
| `currency` | string | yes | Budget currency |
| `interests` | array of strings | no | User travel interests |
| `travelPace` | string | no | Travel pace preference |

### Successful Response

Status code:

```text
200
```

Response body:

```json
{
  "valid": true,
  "tripRequest": {
    "requestId": "TRIP-001",
    "origin": "Toronto",
    "destination": "Japan",
    "startDate": "2026-08-01",
    "endDate": "2026-08-12",
    "numberOfTravelers": 2,
    "budget": 3000,
    "currency": "CAD",
    "interests": ["food", "photography"],
    "travelPace": "balanced",
    "status": "PENDING_CONFIRMATION"
  },
  "errors": []
}
```

### Error Response

Status code:

```text
400
```

Response body:

```json
{
  "valid": false,
  "tripRequest": null,
  "errors": [
    "Origin city is required.",
    "End date cannot be before start date.",
    "Number of travelers must be greater than 0.",
    "Budget must be greater than 0."
  ]
}
```

### Validation Rules

The backend validates the following rules:

```text
origin must not be empty
destination must not be empty
startDate must not be empty
endDate must not be empty
endDate must not be before startDate
numberOfTravelers must be greater than 0
budget must be greater than 0
currency must not be empty
```

---

## 5. POST /api/trip-intake/confirm

### Purpose

Confirms and saves a validated trip request.

This endpoint is called after the frontend displays the trip summary and the user clicks confirm.

### Request

```http
POST /api/trip-intake/confirm
Content-Type: application/json
```

### Request Body

```json
{
  "requestId": "TRIP-001",
  "origin": "Toronto",
  "destination": "Japan",
  "startDate": "2026-08-01",
  "endDate": "2026-08-12",
  "numberOfTravelers": 2,
  "budget": 3000,
  "currency": "CAD",
  "interests": ["food", "photography"],
  "travelPace": "balanced",
  "status": "PENDING_CONFIRMATION"
}
```

### Successful Response

Status code:

```text
200
```

Response body:

```json
{
  "success": true,
  "tripRequest": {
    "requestId": "TRIP-001",
    "origin": "Toronto",
    "destination": "Japan",
    "startDate": "2026-08-01",
    "endDate": "2026-08-12",
    "numberOfTravelers": 2,
    "budget": 3000,
    "currency": "CAD",
    "interests": ["food", "photography"],
    "travelPace": "balanced",
    "status": "SAVED"
  },
  "errors": [],
  "message": "Trip request saved successfully."
}
```

### Error Response

Status code:

```text
400
```

Response body:

```json
{
  "success": false,
  "tripRequest": null,
  "errors": [
    "Trip request could not be confirmed."
  ],
  "message": "Trip request could not be confirmed."
}
```

---

## 6. PowerShell Test Commands

### 6.1 Health Check

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method GET
```

---

### 6.2 Submit Valid Trip Request

```powershell
$bodyObject = @{
  origin = "Toronto"
  destination = "Japan"
  startDate = "2026-08-01"
  endDate = "2026-08-12"
  numberOfTravelers = 2
  budget = 3000
  currency = "CAD"
  interests = @("food", "photography")
  travelPace = "balanced"
}

$bodyJson = $bodyObject | ConvertTo-Json -Depth 5

$response = Invoke-RestMethod `
  -Uri "http://localhost:8080/api/trip-intake" `
  -Method POST `
  -ContentType "application/json" `
  -Body $bodyJson

$response | ConvertTo-Json -Depth 10
```

---

### 6.3 Submit Invalid Trip Request

```powershell
$invalidBodyObject = @{
  origin = ""
  destination = "Japan"
  startDate = "2026-08-12"
  endDate = "2026-08-01"
  numberOfTravelers = 0
  budget = -100
  currency = ""
  interests = @("food")
  travelPace = "balanced"
}

$invalidBodyJson = $invalidBodyObject | ConvertTo-Json -Depth 5

try {
  $invalidResponse = Invoke-RestMethod `
    -Uri "http://localhost:8080/api/trip-intake" `
    -Method POST `
    -ContentType "application/json" `
    -Body $invalidBodyJson

  $invalidResponse | ConvertTo-Json -Depth 10
} catch {
  $_.ErrorDetails.Message
}
```

---

### 6.4 Confirm Trip Request

```powershell
$confirmBodyJson = $response.tripRequest | ConvertTo-Json -Depth 10

$confirmResponse = Invoke-RestMethod `
  -Uri "http://localhost:8080/api/trip-intake/confirm" `
  -Method POST `
  -ContentType "application/json" `
  -Body $confirmBodyJson

$confirmResponse | ConvertTo-Json -Depth 10
```

---

## 7. Notes

The current repository implementation stores data in memory only.

This means saved trip requests disappear when the backend server stops.

A database can be added in a future version.
