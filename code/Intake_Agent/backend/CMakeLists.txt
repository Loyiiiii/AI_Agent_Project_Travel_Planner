cmake_minimum_required(VERSION 3.20)

project(TravelPlannerBackend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(include)
include_directories(external)

add_executable(travel_planner_backend
    src/main.cpp

    src/model/TripRequest.cpp

    src/service/FieldValidator.cpp

    src/repository/TripRequestRepository.cpp

    src/controller/TripIntakeController.cpp
)
