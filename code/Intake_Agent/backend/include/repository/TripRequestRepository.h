#ifndef TRIP_REQUEST_REPOSITORY_H
#define TRIP_REQUEST_REPOSITORY_H

#include <string>
#include <vector>
#include <unordered_map>

#include "model/TripRequest.h"

class TripRequestRepository {
private:
    std::unordered_map<std::string, TripRequest> savedRequests;

public:
    TripRequest save(const TripRequest& tripRequest);

    bool existsById(const std::string& requestId) const;

    TripRequest findById(const std::string& requestId) const;

    std::vector<TripRequest> findAll() const;
};

#endif
