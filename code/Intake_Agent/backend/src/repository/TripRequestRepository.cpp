#include "repository/TripRequestRepository.h"

#include <stdexcept>

TripRequest TripRequestRepository::save(const TripRequest& tripRequest) {
    savedRequests[tripRequest.getRequestId()] = tripRequest;
    return tripRequest;
}

bool TripRequestRepository::existsById(const std::string& requestId) const {
    return savedRequests.find(requestId) != savedRequests.end();
}

TripRequest TripRequestRepository::findById(const std::string& requestId) const {
    auto it = savedRequests.find(requestId);

    if (it == savedRequests.end()) {
        throw std::runtime_error("Trip request not found.");
    }

    return it->second;
}

std::vector<TripRequest> TripRequestRepository::findAll() const {
    std::vector<TripRequest> requests;

    for (const auto& pair : savedRequests) {
        requests.push_back(pair.second);
    }

    return requests;
}
