#ifndef TRIP_REQUEST_H
#define TRIP_REQUEST_H

#include <string>
#include <vector>

#include "TripRequestStatus.h"

class TripRequest {
private:
    std::string requestId;
    std::string origin;
    std::string destination;
    std::string startDate;
    std::string endDate;

    int numberOfTravelers;
    double budget;

    std::string currency;
    std::vector<std::string> interests;
    std::string travelPace;

    TripRequestStatus status;

public:
    TripRequest();

    std::string getRequestId() const;
    void setRequestId(const std::string& requestId);

    std::string getOrigin() const;
    void setOrigin(const std::string& origin);

    std::string getDestination() const;
    void setDestination(const std::string& destination);

    std::string getStartDate() const;
    void setStartDate(const std::string& startDate);

    std::string getEndDate() const;
    void setEndDate(const std::string& endDate);

    int getNumberOfTravelers() const;
    void setNumberOfTravelers(int numberOfTravelers);

    double getBudget() const;
    void setBudget(double budget);

    std::string getCurrency() const;
    void setCurrency(const std::string& currency);

    std::vector<std::string> getInterests() const;
    void setInterests(const std::vector<std::string>& interests);

    std::string getTravelPace() const;
    void setTravelPace(const std::string& travelPace);

    TripRequestStatus getStatus() const;
    void setStatus(TripRequestStatus status);
};

#endif
