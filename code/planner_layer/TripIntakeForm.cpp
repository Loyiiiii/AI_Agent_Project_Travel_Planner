#include "TripIntakeForm.h"
#include <iostream>

// ─────────────────────────────────────────────
//  submitForm()
// ─────────────────────────────────────────────
bool TripIntakeForm::submitForm() const {
    // Minimal sanity check: required text fields must be non-empty.
    // Full validation (date logic, budget range, traveler count, etc.)
    // is delegated to FieldValidator inside TripIntakeController.
    if (origin.empty() || destination.empty()) {
        return false;
    }
    if (!dateRange.start.has_value() || !dateRange.end.has_value()) {
        return false;
    }
    if (!travelers.count.has_value() || travelers.count.value() < 1) {
        return false;
    }
    if (!budget.amount.has_value() || budget.amount.value() < 0.0) {
        return false;
    }

    // All required fields present — controller may proceed.
    return true;
}

// ─────────────────────────────────────────────
//  editForm()
// ─────────────────────────────────────────────
void TripIntakeForm::editForm() {
    // Allow the UI to navigate back without wiping any field data.
    submitted_ = false;
}