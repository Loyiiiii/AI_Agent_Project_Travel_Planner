#include "controller/TripIntakeController.h"

#include <iomanip>
#include <sstream>
#include <stdexcept>

TripIntakeController::TripIntakeController()
    : fieldValidator(),
      tripRequestRepository(),
      nextRequestNumber(1) {
}

nlohmann::json TripIntakeController::createTripRequest(const nlohmann::json& requestBody) {
    TripRequest tripRequest = parseTripRequestFromJson(requestBody);

    if (tripRequest.getRequestId().empty()) {
        tripRequest.setRequestId(generateRequestId());
    }

    std::vector<std::string> errors = fieldValidator.validate(tripRequest);

    if (!errors.empty()) {
        return {
            {"valid", false},
            {"tripRequest", nullptr},
            {"errors", convertErrorsToJson(errors)}
        };
    }

    tripRequest.setStatus(TripRequestStatus::PENDING_CONFIRMATION);

    return {
        {"valid", true},
        {"tripRequest", convertTripRequestToJson(tripRequest)},
        {"errors", nlohmann::json::array()}
    };
}

nlohmann::json TripIntakeController::confirmTripRequest(const nlohmann::json& requestBody) {
    TripRequest tripRequest = parseTripRequestFromJson(requestBody);

    std::vector<std::string> errors = fieldValidator.validate(tripRequest);

    if (!errors.empty()) {
        return {
            {"success", false},
            {"tripRequest", nullptr},
            {"errors", convertErrorsToJson(errors)},
            {"message", "Trip request could not be confirmed."}
        };
    }

    tripRequest.setStatus(TripRequestStatus::CONFIRMED);

    tripRequest.setStatus(TripRequestStatus::SAVED);
    TripRequest savedTripRequest = tripRequestRepository.save(tripRequest);

    return {
        {"success", true},
        {"tripRequest", convertTripRequestToJson(savedTripRequest)},
        {"errors", nlohmann::json::array()},
        {"message", "Trip request saved successfully."}
    };
}

TripRequest TripIntakeController::parseTripRequestFromJson(
    const nlohmann::json& requestBody
) const {
    TripRequest tripRequest;

    if (requestBody.contains("requestId") && requestBody["requestId"].is_string()) {
        tripRequest.setRequestId(requestBody["requestId"].get<std::string>());
    }

    if (requestBody.contains("origin") && requestBody["origin"].is_string()) {
        tripRequest.setOrigin(requestBody["origin"].get<std::string>());
    }

    if (requestBody.contains("destination") && requestBody["destination"].is_array()) {
        std::vector<std::string> destinations;

        for (const auto& destinationCity : requestBody["destination"]) {
            if (destinationCity.is_string()) {
                destinations.push_back(destinationCity.get<std::string>());
            }
        }

        tripRequest.setDestination(destinations);
    }

    if (requestBody.contains("startDate") && requestBody["startDate"].is_string()) {
        tripRequest.setStartDate(requestBody["startDate"].get<std::string>());
    }

    if (requestBody.contains("endDate") && requestBody["endDate"].is_string()) {
        tripRequest.setEndDate(requestBody["endDate"].get<std::string>());
    }

    if (requestBody.contains("numberOfTravelers") && requestBody["numberOfTravelers"].is_number_integer()) {
        tripRequest.setNumberOfTravelers(requestBody["numberOfTravelers"].get<int>());
    }

    if (requestBody.contains("budget") && requestBody["budget"].is_number()) {
        tripRequest.setBudget(requestBody["budget"].get<double>());
    }

    if (requestBody.contains("currency") && requestBody["currency"].is_string()) {
        tripRequest.setCurrency(requestBody["currency"].get<std::string>());
    }

    if (requestBody.contains("interests") && requestBody["interests"].is_array()) {
        std::vector<std::string> interests;

        for (const auto& interest : requestBody["interests"]) {
            if (interest.is_string()) {
                interests.push_back(interest.get<std::string>());
            }
        }

        tripRequest.setInterests(interests);
    }

    if (requestBody.contains("travelPace") && requestBody["travelPace"].is_string()) {
        tripRequest.setTravelPace(requestBody["travelPace"].get<std::string>());
    }

    return tripRequest;
}

nlohmann::json TripIntakeController::convertTripRequestToJson(
    const TripRequest& tripRequest
) const {
    return {
        {"requestId", tripRequest.getRequestId()},
        {"origin", tripRequest.getOrigin()},
        {"destination", tripRequest.getDestination()},
        {"startDate", tripRequest.getStartDate()},
        {"endDate", tripRequest.getEndDate()},
        {"numberOfTravelers", tripRequest.getNumberOfTravelers()},
        {"budget", tripRequest.getBudget()},
        {"currency", tripRequest.getCurrency()},
        {"interests", tripRequest.getInterests()},
        {"travelPace", tripRequest.getTravelPace()},
        {"status", tripRequestStatusToString(tripRequest.getStatus())}
    };
}

nlohmann::json TripIntakeController::convertErrorsToJson(
    const std::vector<std::string>& errors
) const {
    nlohmann::json errorArray = nlohmann::json::array();

    for (const std::string& error : errors) {
        errorArray.push_back(error);
    }

    return errorArray;
}

std::string TripIntakeController::generateRequestId() {
    std::ostringstream oss;

    oss << "TRIP-"
        << std::setw(3)
        << std::setfill('0')
        << nextRequestNumber;

    nextRequestNumber++;

    return oss.str();
}