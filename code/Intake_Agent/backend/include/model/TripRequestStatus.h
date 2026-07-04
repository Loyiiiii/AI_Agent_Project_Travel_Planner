#ifndef TRIP_REQUEST_STATUS_H
#define TRIP_REQUEST_STATUS_H

#include <string>

enum class TripRequestStatus {
    DRAFT,
    PENDING_CONFIRMATION,
    CONFIRMED,
    SAVED
};

inline std::string tripRequestStatusToString(TripRequestStatus status) {
    switch (status) {
        case TripRequestStatus::DRAFT:
            return "DRAFT";

        case TripRequestStatus::PENDING_CONFIRMATION:
            return "PENDING_CONFIRMATION";

        case TripRequestStatus::CONFIRMED:
            return "CONFIRMED";

        case TripRequestStatus::SAVED:
            return "SAVED";

        default:
            return "UNKNOWN";
    }
}

#endif
