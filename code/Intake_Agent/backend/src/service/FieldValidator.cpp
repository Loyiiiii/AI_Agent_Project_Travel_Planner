#include "service/FieldValidator.h"

std::vector<std::string> FieldValidator::validate(const TripRequest& tripRequest) const {
    std::vector<std::string> errors;

    if (isEmpty(tripRequest.getOrigin())) {
        errors.push_back("Origin city is required.");
    }

    if (isEmpty(tripRequest.getDestination())) {
        errors.push_back("Destination is required.");
    }

    if (isEmpty(tripRequest.getStartDate())) {
        errors.push_back("Start date is required.");
    }

    if (isEmpty(tripRequest.getEndDate())) {
        errors.push_back("End date is required.");
    }

    if (
        !isEmpty(tripRequest.getStartDate()) &&
        !isEmpty(tripRequest.getEndDate()) &&
        !isValidDateRange(tripRequest.getStartDate(), tripRequest.getEndDate())
    ) {
        errors.push_back("End date cannot be before start date.");
    }

    if (tripRequest.getNumberOfTravelers() <= 0) {
        errors.push_back("Number of travelers must be greater than 0.");
    }

    if (tripRequest.getBudget() <= 0) {
        errors.push_back("Budget must be greater than 0.");
    }

    if (isEmpty(tripRequest.getCurrency())) {
        errors.push_back("Currency is required.");
    }

    return errors;
}

bool FieldValidator::isEmpty(const std::string& value) const {
    return value.empty();
}

bool FieldValidator::isValidDateRange(
    const std::string& startDate,
    const std::string& endDate
) const {
    return endDate >= startDate;
}
