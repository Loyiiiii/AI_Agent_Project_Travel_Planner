#include "TripIntakeForm.h"
#include <iostream>
#include <cassert>

int main() {
    // ── Test 1: empty form should fail submitForm() ──
    TripIntakeForm form;
    assert(form.submitForm() == false);
    std::cout << "Test 1 passed: empty form rejected\n";

    // ── Test 2: fill required fields ──
    form.origin      = "Waterloo, ON";
    form.destination = "Montreal, QC";
    form.dateRange.start = "2025-06-13";
    form.dateRange.end   = "2025-06-15";
    form.travelers.count = 2;
    form.budget.amount   = 1500.0;
    form.budget.currency = "CAD";

    assert(form.submitForm() == true);
    std::cout << "Test 2 passed: valid form accepted\n";

    // ── Test 3: editForm() doesn't wipe data ──
    form.editForm();
    assert(form.origin == "Waterloo, ON");
    assert(form.submitForm() == true);   // data still intact
    std::cout << "Test 3 passed: editForm() keeps data\n";

    // ── Test 4: optional preference fields ──
    form.travelStyle = {"Relaxed", "Spontaneous"};
    form.mustSee     = "F1 Grand Prix Saturday";
    form.accommodation.type = {"Boutique Hotel"};
    form.constraints.dietaryRestrictions = {"Vegan"};

    assert(form.submitForm() == true);
    std::cout << "Test 4 passed: optional fields accepted\n";

    std::cout << "\nAll tests passed.\n";
    return 0;
}