#include <iostream>

#include "httplib.h"
#include <nlohmann/json.hpp>

#include "controller/TripIntakeController.h"

void setCorsHeaders(httplib::Response& response) {
    response.set_header("Access-Control-Allow-Origin", "*");
    response.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.set_header("Access-Control-Allow-Headers", "Content-Type");
}

int main() {
    httplib::Server server;

    TripIntakeController tripIntakeController;

    server.Get("/api/health", [](const httplib::Request& request, httplib::Response& response) {
        nlohmann::json result = {
            {"status", "ok"},
            {"message", "Travel planner backend is running."}
        };

        setCorsHeaders(response);
        response.status = 200;
        response.set_content(result.dump(), "application/json");
    });

    server.Post("/api/trip-intake", [&tripIntakeController](const httplib::Request& request, httplib::Response& response) {
        setCorsHeaders(response);

        try {
            nlohmann::json requestBody = nlohmann::json::parse(request.body);

            nlohmann::json result = tripIntakeController.createTripRequest(requestBody);

            if (result.contains("valid") && result["valid"] == false) {
                response.status = 400;
            } else {
                response.status = 200;
            }

            response.set_content(result.dump(), "application/json");
        } catch (const std::exception& error) {
            nlohmann::json errorResponse = {
                {"valid", false},
                {"tripRequest", nullptr},
                {"errors", {"Invalid request body."}},
                {"message", error.what()}
            };

            response.status = 400;
            response.set_content(errorResponse.dump(), "application/json");
        }
    });

    server.Post("/api/trip-intake/confirm", [&tripIntakeController](const httplib::Request& request, httplib::Response& response) {
        setCorsHeaders(response);

        try {
            nlohmann::json requestBody = nlohmann::json::parse(request.body);

            nlohmann::json result = tripIntakeController.confirmTripRequest(requestBody);

            if (result.contains("success") && result["success"] == false) {
                response.status = 400;
            } else {
                response.status = 200;
            }

            response.set_content(result.dump(), "application/json");
        } catch (const std::exception& error) {
            nlohmann::json errorResponse = {
                {"success", false},
                {"tripRequest", nullptr},
                {"errors", {"Invalid confirmation request."}},
                {"message", error.what()}
            };

            response.status = 400;
            response.set_content(errorResponse.dump(), "application/json");
        }
    });

    server.Options("/api/trip-intake", [](const httplib::Request& request, httplib::Response& response) {
        setCorsHeaders(response);
        response.status = 204;
    });

    server.Options("/api/trip-intake/confirm", [](const httplib::Request& request, httplib::Response& response) {
        setCorsHeaders(response);
        response.status = 204;
    });

    std::cout << "Travel planner backend running on http://localhost:8080" << std::endl;

    server.listen("localhost", 8080);

    return 0;
}
