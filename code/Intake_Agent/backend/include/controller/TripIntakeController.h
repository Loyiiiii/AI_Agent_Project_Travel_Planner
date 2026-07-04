#ifndef TRIP_INTAKE_CONTROLLER_H
#define TRIP_INTAKE_CONTROLLER_H

#include <string>
#include <vector>

#include <nlohmann/json.hpp>

#include "model/TripRequest.h"
#include "service/FieldValidator.h"
#include "repository/TripRequestRepository.h"

class TripIntakeController {
private:
    FieldValidator fieldValidator;
    TripRequestRepository tripRequestRepository;
    int nextRequestNumber;

    TripRequest parseTripRequestFromJson(const nlohmann::json& requestBody) const;
    nlohmann::json convertTripRequestToJson(const TripRequest& tripRequest) const;
    nlohmann::json convertErrorsToJson(const std::vector<std::string>& errors) const;

    std::string generateRequestId();

public:
    TripIntakeController();

    nlohmann::json createTripRequest(const nlohmann::json& requestBody);
    nlohmann::json confirmTripRequest(const nlohmann::json& requestBody);
};

#endif
