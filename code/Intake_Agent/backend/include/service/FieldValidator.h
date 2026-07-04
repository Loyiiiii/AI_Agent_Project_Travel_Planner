#ifndef FIELD_VALIDATOR_H
#define FIELD_VALIDATOR_H

#include <string>
#include <vector>

#include "model/TripRequest.h"

class FieldValidator {
public:
    std::vector<std::string> validate(const TripRequest& tripRequest) const;

private:
    bool isEmpty(const std::string& value) const;
    bool isValidDateRange(const std::string& startDate, const std::string& endDate) const;
};

#endif
