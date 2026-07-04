#include "model/TripRequest.h"

TripRequest::TripRequest()
    : requestId(""),
      origin(""),
      destination(""),
      startDate(""),
      endDate(""),
      numberOfTravelers(0),
      budget(0.0),
      currency(""),
      interests({}),
      travelPace(""),
      status(TripRequestStatus::DRAFT) {
}

std::string TripRequest::getRequestId() const {
    return requestId;
}

void TripRequest::setRequestId(const std::string& requestId) {
    this->requestId = requestId;
}

std::string TripRequest::getOrigin() const {
    return origin;
}

void TripRequest::setOrigin(const std::string& origin) {
    this->origin = origin;
}

std::string TripRequest::getDestination() const {
    return destination;
}

void TripRequest::setDestination(const std::string& destination) {
    this->destination = destination;
}

std::string TripRequest::getStartDate() const {
    return startDate;
}

void TripRequest::setStartDate(const std::string& startDate) {
    this->startDate = startDate;
}

std::string TripRequest::getEndDate() const {
    return endDate;
}

void TripRequest::setEndDate(const std::string& endDate) {
    this->endDate = endDate;
}

int TripRequest::getNumberOfTravelers() const {
    return numberOfTravelers;
}

void TripRequest::setNumberOfTravelers(int numberOfTravelers) {
    this->numberOfTravelers = numberOfTravelers;
}

double TripRequest::getBudget() const {
    return budget;
}

void TripRequest::setBudget(double budget) {
    this->budget = budget;
}

std::string TripRequest::getCurrency() const {
    return currency;
}

void TripRequest::setCurrency(const std::string& currency) {
    this->currency = currency;
}

std::vector<std::string> TripRequest::getInterests() const {
    return interests;
}

void TripRequest::setInterests(const std::vector<std::string>& interests) {
    this->interests = interests;
}

std::string TripRequest::getTravelPace() const {
    return travelPace;
}

void TripRequest::setTravelPace(const std::string& travelPace) {
    this->travelPace = travelPace;
}

TripRequestStatus TripRequest::getStatus() const {
    return status;
}

void TripRequest::setStatus(TripRequestStatus status) {
    this->status = status;
}
