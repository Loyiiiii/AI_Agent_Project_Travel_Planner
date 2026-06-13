#pragma once
#include "travel_intent.h"
#include <string>
#include <vector>

struct TravelConstraints {
    int budget_min;
    int budget_max;
    std::vector<std::string> dates;
    std::vector<std::string> must_attend;
    std::string lodging_preference;
    std::string transport_preference;
    std::string risk_tolerance;
    //identity constraints
    bool needs_visa_check;
};

class ConstraintAgent {
public:
    TravelConstraints extract(const TravelIntent& intent, 
                              const std::string& raw_user_input);
};