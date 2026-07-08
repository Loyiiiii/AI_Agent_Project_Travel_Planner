# AI Travel Planner - Trip Intake Agent

## 1. Project Overview

This project is the first module of an AI Travel Planner system.

The current module is called the **Trip Intake Agent**. Its responsibility is to collect basic travel information from the user, validate the submitted information, show a summary for confirmation, and save the confirmed trip request.

This module does **not** generate a full travel itinerary yet. It only prepares a structured `TripRequest` that can later be passed to future planning agents.

The full expected flow is:

```text
User fills trip intake form
        ↓
Frontend sends trip data to backend
        ↓
Backend creates TripRequest
        ↓
Backend validates TripRequest
        ↓
Frontend displays TripSummary
        ↓
User confirms trip request
        ↓
Backend saves confirmed TripRequest
```

---

## 2. Current Module Scope

The current version focuses only on the intake workflow.

### Included in this version

* Trip intake form
* Basic trip request data model
* Backend field validation
* Trip summary page
* Confirmation workflow
* In-memory trip request repository
* Frontend-backend API connection

### Not included yet

* AI-generated itinerary
* Destination research
* Flight search
* Hotel search
* Budget optimization
* Database persistence
* User login
* Multi-user sessions

---

## 3. Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* C++
* CMake
* cpp-httplib
* nlohmann/json

### Important Backend Dependency Note

The backend does **not** currently use Crow or vcpkg.

Instead, it uses header-only libraries stored inside the project:

```text
backend/external/httplib.h
backend/external/nlohmann/json.hpp
```

This means teammates do not need to install Crow or configure vcpkg to run the current backend.

---

## 4. Project Structure

```text
AI_Agent_Project_Travel_Planner/
│
├── code/
│   └── Intake_Agent/
│       │
│       ├── backend/
│       │   ├── CMakeLists.txt
│       │   │
│       │   ├── external/
│       │   │   ├── httplib.h
│       │   │   └── nlohmann/
│       │   │       └── json.hpp
│       │   │
│       │   ├── include/
│       │   │   ├── model/
│       │   │   │   ├── TripRequest.h
│       │   │   │   └── TripRequestStatus.h
│       │   │   │
│       │   │   ├── service/
│       │   │   │   └── FieldValidator.h
│       │   │   │
│       │   │   ├── repository/
│       │   │   │   └── TripRequestRepository.h
│       │   │   │
│       │   │   └── controller/
│       │   │       └── TripIntakeController.h
│       │   │
│       │   └── src/
│       │       ├── main.cpp
│       │       │
│       │       ├── model/
│       │       │   └── TripRequest.cpp
│       │       │
│       │       ├── service/
│       │       │   └── FieldValidator.cpp
│       │       │
│       │       ├── repository/
│       │       │   └── TripRequestRepository.cpp
│       │       │
│       │       └── controller/
│       │           └── TripIntakeController.cpp
│       │
│       └── frontend/
│           ├── package.json
│           ├── package-lock.json
│           ├── index.html
│           │
│           └── src/
│               ├── App.jsx
│               ├── main.jsx
│               │
│               ├── api/
│               │   └── tripIntakeApi.js
│               │
│               ├── components/
│               │   ├── TripIntakeForm.jsx
│               │   └── TripSummary.jsx
│               │
│               ├── pages/
│               │   └── TripIntakePage.jsx
│               │
│               └── styles/
│                   └── tripIntake.css
│
└── docs/
    ├── uml/
    └── api/
```

---

## 5. Backend Architecture

The backend is organized into four main layers:

```text
Controller Layer
Service Layer
Repository Layer
Model Layer
```

### 5.1 Model Layer

The model layer defines the core data objects.

#### `TripRequest`

`TripRequest` represents one submitted travel request.

It contains:

```text
requestId
origin
destination
startDate
endDate
numberOfTravelers
budget
currency
interests
travelPace
status
```

#### `TripRequestStatus`

`TripRequestStatus` represents the current state of a trip request.

Possible statuses:

```text
DRAFT
PENDING_CONFIRMATION
CONFIRMED
SAVED
```

Current status flow:

```text
DRAFT
  ↓
PENDING_CONFIRMATION
  ↓
CONFIRMED
  ↓
SAVED
```

---

### 5.2 Service Layer

#### `FieldValidator`

`FieldValidator` checks whether a `TripRequest` is valid.

It checks:

```text
origin is not empty
destination is not empty
startDate is not empty
endDate is not empty
endDate is not before startDate
numberOfTravelers is greater than 0
budget is greater than 0
currency is not empty
```

It returns a list of error messages.

If the list is empty, the trip request is valid.

---

### 5.3 Repository Layer

#### `TripRequestRepository`

`TripRequestRepository` is responsible for saving trip requests.

The current version uses an in-memory repository:

```text
unordered_map<string, TripRequest>
```

This means data is only stored while the backend server is running.

If the backend server is stopped, saved requests are lost.

A real database can be added in a later version.

---

### 5.4 Controller Layer

#### `TripIntakeController`

`TripIntakeController` coordinates the backend workflow.

It handles two main operations:

```text
createTripRequest()
confirmTripRequest()
```

`createTripRequest()`:

```text
parse JSON request
create TripRequest
validate TripRequest
return errors if invalid
return TripRequest summary if valid
```

`confirmTripRequest()`:

```text
parse JSON request
validate TripRequest again
set status to SAVED
save TripRequest in repository
return saved TripRequest
```

---

## 6. Frontend Architecture

The frontend is organized into:

```text
Page Layer
Component Layer
API Layer
Style Layer
```

### 6.1 Page Layer

#### `TripIntakePage.jsx`

This is the main frontend workflow controller.

It manages:

```text
currentStep
tripRequest
errors
isLoading
```

Possible page steps:

```text
FORM
SUMMARY
SUCCESS
```

It connects:

```text
TripIntakeForm
TripSummary
tripIntakeApi.js
```

---

### 6.2 Component Layer

#### `TripIntakeForm.jsx`

This component displays the form and collects user input.

It collects:

```text
origin
destination
startDate
endDate
numberOfTravelers
budget
currency
interests
travelPace
```

It does not directly call the backend.

Instead, it calls:

```text
onSubmit(formData)
```

The parent page handles the actual API request.

---

#### `TripSummary.jsx`

This component displays the validated trip request returned by the backend.

It shows:

```text
requestId
origin
destination
startDate
endDate
numberOfTravelers
budget
currency
interests
travelPace
status
```

It provides two buttons:

```text
Edit
Confirm Trip Request
```

---

### 6.3 API Layer

#### `tripIntakeApi.js`

This file contains frontend functions for calling the backend API.

Current functions:

```text
checkBackendHealth()
submitTripIntake(tripData)
confirmTripRequest(tripRequest)
```

The frontend communicates with the backend through HTTP and JSON.

The current backend base URL is:

```text
http://localhost:8080
```

---

## 7. API Contract

### 7.1 Health Check

#### Request

```http
GET /api/health
```

#### Example Response

```json
{
  "status": "ok",
  "message": "Travel planner backend is running."
}
```

---

### 7.2 Submit Trip Intake Form

#### Request

```http
POST /api/trip-intake
Content-Type: application/json
```

#### Example Request Body

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

#### Success Response

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

#### Error Response

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

---

### 7.3 Confirm Trip Request

#### Request

```http
POST /api/trip-intake/confirm
Content-Type: application/json
```

#### Example Request Body

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

#### Success Response

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

---

## 8. Required Software

Before running the project, install the following tools.

### 8.1 Git

Used to clone the repository.

Check installation:

```powershell
git --version
```

---

### 8.2 CMake

Used to configure and build the C++ backend.

Check installation:

```powershell
cmake --version
```

---

### 8.3 Visual Studio 2022 or Build Tools

Required for the C++ compiler on Windows.

Install Visual Studio 2022 Community or Visual Studio Build Tools.

During installation, make sure to select:

```text
Desktop development with C++
```

Check that CMake can detect the compiler when building the backend.

---

### 8.4 Node.js

Required to run the React frontend.

Check installation:

```powershell
node -v
npm.cmd -v
```

If `npm -v` fails in PowerShell because of execution policy, use:

```powershell
npm.cmd -v
```

The `.cmd` version avoids PowerShell script execution policy issues.

---

## 9. How to Run the Project

The project requires two terminals:

```text
Terminal 1: backend server
Terminal 2: frontend server
```

The backend must be running before submitting the frontend form.

---

### 9.1 Clone the Repository

Using HTTPS:

```powershell
git clone <repository-url>
cd AI_Agent_Project_Travel_Planner
```

Using SSH:

```powershell
git clone git@github.com:<username>/<repository-name>.git
cd AI_Agent_Project_Travel_Planner
```

---

### 9.2 Build and Run the Backend

Open Terminal 1.

Go to the backend folder:

```powershell
cd code/Intake_Agent/backend
```

Create a build folder:

```powershell
mkdir build
cd build
```

Run CMake:

```powershell
cmake ..
```

Build the backend:

```powershell
cmake --build .
```

Run the backend server:

```powershell
.\Debug\travel_planner_backend.exe
```

Expected output:

```text
Travel planner backend running on http://localhost:8080
```

Keep this terminal open.

The backend is now running at:

```text
http://localhost:8080
```

---

### 9.3 Run the Frontend

Open Terminal 2.

Go to the frontend folder:

```powershell
cd code/Intake_Agent/frontend
```

Install frontend dependencies:

```powershell
npm.cmd install
```

Start the frontend development server:

```powershell
npm.cmd run dev
```

Expected output:

```text
Local: http://localhost:5173/
```

Open this URL in a browser:

```text
http://localhost:5173/
```

---

## 10. How to Test the Full Workflow

### 10.1 Valid Trip Request Test

Open:

```text
http://localhost:5173/
```

Fill the form with:

```text
Origin City: Toronto
Destination: Japan
Start Date: 2026-08-01
End Date: 2026-08-12
Number of Travelers: 2
Budget: 3000
Currency: CAD
Interests: food, photography
Travel Pace: Balanced
```

Click:

```text
Submit Trip Request
```

Expected result:

```text
Review Your Trip Request
Status: PENDING_CONFIRMATION
```

Then click:

```text
Confirm Trip Request
```

Expected result:

```text
Trip Request Saved
Status: SAVED
```

---

### 10.2 Invalid Trip Request Test

Click:

```text
Create Another Trip Request
```

Fill the form with invalid data:

```text
Origin City: leave empty
Destination: Japan
Start Date: 2026-08-12
End Date: 2026-08-01
Number of Travelers: 0
Budget: -100
Currency: CAD
Interests: food
Travel Pace: Balanced
```

Click:

```text
Submit Trip Request
```

Expected result:

The page should stay on the form and display validation errors such as:

```text
Origin city is required.
End date cannot be before start date.
Number of travelers must be greater than 0.
Budget must be greater than 0.
```

---

## 11. Backend API Testing Without Frontend

The backend can also be tested directly with PowerShell.

Make sure the backend server is running first.

### 11.1 Health Check

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method GET
```

Expected result:

```text
status  : ok
message : Travel planner backend is running.
```

---

### 11.2 Submit Valid Trip Request

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

Expected result:

```json
{
  "valid": true,
  "tripRequest": {
    "status": "PENDING_CONFIRMATION"
  },
  "errors": []
}
```

---

### 11.3 Confirm Trip Request

```powershell
$confirmBodyJson = $response.tripRequest | ConvertTo-Json -Depth 10

$confirmResponse = Invoke-RestMethod `
  -Uri "http://localhost:8080/api/trip-intake/confirm" `
  -Method POST `
  -ContentType "application/json" `
  -Body $confirmBodyJson

$confirmResponse | ConvertTo-Json -Depth 10
```

Expected result:

```json
{
  "success": true,
  "tripRequest": {
    "status": "SAVED"
  },
  "message": "Trip request saved successfully."
}
```

---

## 12. Common Issues and Fixes

### 12.1 `npm` cannot be loaded because running scripts is disabled

If this error appears:

```text
npm.ps1 cannot be loaded because running scripts is disabled
```

Use:

```powershell
npm.cmd install
npm.cmd run dev
```

Instead of:

```powershell
npm install
npm run dev
```

---

### 12.2 `node` or `npm` is not recognized

Install Node.js first.

Check:

```powershell
node -v
npm.cmd -v
```

If these commands do not work, restart VS Code or restart the terminal.

---

### 12.3 `cmake` is not recognized

Install CMake first.

Check:

```powershell
cmake --version
```

After installing CMake, restart the terminal.

---

### 12.4 Backend starts, but frontend submit fails

Check that the backend terminal is still running.

Test:

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method GET
```

If this fails, restart the backend.

---

### 12.5 CORS error in browser

The backend should set CORS headers in `main.cpp`.

Check that responses call:

```cpp
setCorsHeaders(response);
```

The current frontend runs at:

```text
http://localhost:5173
```

The current backend runs at:

```text
http://localhost:8080
```

Because they are on different ports, CORS headers are required.

---

### 12.6 Build folder issues

If backend build behaves strangely, delete and recreate the build folder:

```powershell
cd code/Intake_Agent/backend
Remove-Item -Recurse -Force build
mkdir build
cd build
cmake ..
cmake --build .
```

---

## 13. Notes About Dependencies

### 13.1 Backend dependencies

The backend uses header-only libraries stored in:

```text
code/Intake_Agent/backend/external/
```

Current backend external libraries:

```text
cpp-httplib
nlohmann/json
```

No vcpkg setup is required for the current version.

---

### 13.2 Frontend dependencies

The frontend uses npm dependencies defined in:

```text
code/Intake_Agent/frontend/package.json
```

The standard way to install them is:

```powershell
npm.cmd install
```

The generated `node_modules` folder is large and normally should not be manually edited.

---

## 14. Current Limitations

The current version has several intentional limitations:

```text
1. Trip requests are stored only in memory.
2. Saved data disappears when the backend server stops.
3. There is no user account system.
4. There is no database yet.
5. There is no AI itinerary generation yet.
6. The frontend only supports one intake workflow page.
7. Dates are currently handled as YYYY-MM-DD strings.
```

These limitations are acceptable for the first Trip Intake Agent module.

---

## 15. Next Development Steps

Possible next steps:

```text
1. Add persistent database storage.
2. Add TripRequestRepository database implementation.
3. Add richer travel preferences.
4. Add transportation and accommodation preferences.
5. Add Planner Agent after TripRequest is confirmed.
6. Add UML diagrams and API documentation.
7. Improve frontend styling and user experience.
8. Add automated API tests.
```

The next major module after this one should consume a confirmed `TripRequest` and begin generating an actual travel plan.
