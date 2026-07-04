cmake_minimum_required(VERSION 3.20)

project(TravelPlannerBackend)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Crow CONFIG REQUIRED)
find_package(nlohmann_json CONFIG REQUIRED)

include_directories(include)

add_executable(travel_planner_backend
    src/main.cpp

    src/model/TripRequest.cpp

    src/service/FieldValidator.cpp

    src/repository/TripRequestRepository.cpp

    src/controller/TripIntakeController.cpp
)

target_link_libraries(travel_planner_backend
    PRIVATE
        Crow::Crow
        nlohmann_json::nlohmann_json
)
