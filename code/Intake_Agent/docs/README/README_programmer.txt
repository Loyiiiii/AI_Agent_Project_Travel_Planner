How to run Intake Agent

Requirements:
- Git
- CMake
- Visual Studio 2022 with C++ tools
- Node.js

Backend:
cd code/Intake_Agent/backend
mkdir build
cd build
cmake ..
cmake --build .
.\Debug\travel_planner_backend.exe

Frontend:
Open a new terminal.
cd code/Intake_Agent/frontend
npm.cmd install
npm.cmd run dev

Open:
http://localhost:5173/

Backend runs on:
http://localhost:8080
