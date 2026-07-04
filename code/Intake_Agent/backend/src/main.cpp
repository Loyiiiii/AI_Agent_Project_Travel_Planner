#include <iostream>

#include <crow.h>
#include <nlohmann/json.hpp>

#include "controller/TripIntakeController.h"

int main() {
    crow::SimpleApp app;

    TripIntakeController tripIntakeController;

    CROW_ROUTE(app, "/api/health")
    .methods(crow::HTTPMethod::GET)
    ([]() {
        crow::response response;

        response.code = 200;
        response.set_header("Content-Type", "application/json");
        response.write(R"({"status":"ok","message":"Travel planner backend is running."})");

        return response;
    });

    CROW_ROUTE(app, "/api/trip-intake")
    .methods(crow::HTTPMethod::POST)
    ([&tripIntakeController](const crow::request& request) {
        crow::response response;

        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        response.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.set_header("Access-Control-Allow-Headers", "Content-Type");

        try {
            nlohmann::json requestBody = nlohmann::json::parse(request.body);

            nlohmann::json result = tripIntakeController.createTripRequest(requestBody);

            if (result.contains("valid") && result["valid"] == false) {
                response.code = 400;
            } else {
                response.code = 200;
            }

            response.write(result.dump());
            return response;
        } catch (const std::exception& error) {
            nlohmann::json errorResponse = {
                {"valid", false},
                {"tripRequest", nullptr},
                {"errors", {"Invalid request body."}},
                {"message", error.what()}
            };

            response.code = 400;
            response.write(errorResponse.dump());
            return response;
        }
    });

    CROW_ROUTE(app, "/api/trip-intake/confirm")
    .methods(crow::HTTPMethod::POST)
    ([&tripIntakeController](const crow::request& request) {
        crow::response response;

        response.set_header("Content-Type", "application/json");
        response.set_header("Access-Control-Allow-Origin", "*");
        response.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.set_header("Access-Control-Allow-Headers", "Content-Type");

        try {
            nlohmann::json requestBody = nlohmann::json::parse(request.body);

            nlohmann::json result = tripIntakeController.confirmTripRequest(requestBody);

            if (result.contains("success") && result["success"] == false) {
                response.code = 400;
            } else {
                response.code = 200;
            }

            response.write(result.dump());
            return response;
        } catch (const std::exception& error) {
            nlohmann::json errorResponse = {
                {"success", false},
                {"tripRequest", nullptr},
                {"errors", {"Invalid confirmation request."}},
                {"message", error.what()}
            };

            response.code = 400;
            response.write(errorResponse.dump());
            return response;
        }
    });

    CROW_ROUTE(app, "/api/trip-intake")
    .methods(crow::HTTPMethod::OPTIONS)
    ([]() {
        crow::response response;

        response.code = 204;
        response.set_header("Access-Control-Allow-Origin", "*");
        response.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.set_header("Access-Control-Allow-Headers", "Content-Type");

        return response;
    });

    CROW_ROUTE(app, "/api/trip-intake/confirm")
    .methods(crow::HTTPMethod::OPTIONS)
    ([]() {
        crow::response response;

        response.code = 204;
        response.set_header("Access-Control-Allow-Origin", "*");
        response.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.set_header("Access-Control-Allow-Headers", "Content-Type");

        return response;
    });

    std::cout << "Travel planner backend running on http://localhost:8080" << std::endl;

    app.port(8080).multithreaded().run();

    return 0;
}
