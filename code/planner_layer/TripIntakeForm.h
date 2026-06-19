#pragma once
#include <string>
#include <vector>
#include <optional>

// ─────────────────────────────────────────────
//  Nested data structs  (mirrors TripIntake TS)
// ─────────────────────────────────────────────

struct DateRange {
    std::optional<std::string> start;        // ISO date "YYYY-MM-DD"
    std::optional<std::string> end;
    std::optional<std::string> roughPeriod;  // e.g. "late June"

    enum class Flexibility { Fixed, PlusMinus3Days, PlusMinus1Week, Flexible };
    std::optional<Flexibility> flexibility;
};

struct TravelersInfo {
    std::optional<int> count;

    enum class Relationship { Solo, Couple, Friends, Family, Group };
    std::optional<Relationship> relationship;
};

struct BudgetInfo {
    std::optional<double> amount;
    std::optional<std::string> currency;     // e.g. "CAD"

    enum class Scope { Total, PerPerson, ExcludingFlight, Unknown };
    std::optional<Scope> scope;

    enum class Level { Budget, Medium, High, Luxury };
    std::optional<Level> level;

    enum class Flexibility { Strict, Medium, Flexible };
    std::optional<Flexibility> flexibility;
};

struct AccommodationInfo {
    std::vector<std::string> type;           // e.g. {"Boutique Hotel", "Airbnb"}

    enum class Level { Budget, Medium, High, Luxury };
    std::optional<Level> level;

    std::optional<std::string> locationPreference;  // e.g. "downtown"
    std::optional<std::string> roomPreference;
};

struct TransportationInfo {
    std::optional<bool> preferFlight;
    std::optional<bool> preferTrain;
    std::optional<bool> okayWithCarRental;
    std::optional<bool> preferPublicTransit;
};

struct ConstraintsInfo {
    std::optional<bool>        visaRequiredCheck;
    std::optional<std::string> passportCountry;
    std::optional<std::string> accessibilityNeeds;
    std::vector<std::string>   dietaryRestrictions;  // e.g. {"Vegan", "Gluten-Free"}
};

struct PreferencesInfo {
    std::vector<std::string> likes;
    std::vector<std::string> dislikes;
    std::vector<std::string> mustHave;
    std::vector<std::string> avoid;
};

// ─────────────────────────────────────────────
//  TripIntakeForm
//  Matches UML class + TS TripIntake type.
//  Owned by the frontend; filled by the user,
//  then handed to TripIntakeController via
//  submitForm().
// ─────────────────────────────────────────────
class TripIntakeForm {
public:
    // ── Required fields ───────────────────────
    std::string origin;          // departure city
    std::string destination;     // arrival city

    DateRange       dateRange;
    std::optional<int> durationDays;  // derived or user-supplied

    TravelersInfo   travelers;
    BudgetInfo      budget;

    // ── Optional preference fields ────────────
    std::vector<std::string> travelStyle;       // e.g. {"Relaxed", "Spontaneous"}

    enum class Pace { Relaxed, Balanced, Packed, Extreme };
    std::optional<Pace> pace;

    AccommodationInfo     accommodation;
    TransportationInfo    transportation;
    ConstraintsInfo       constraints;
    PreferencesInfo       preferences;

    // Free-text from the "Anything else?" page
    std::string mustSee;   // e.g. "F1 Grand Prix on Saturday, wheelchair accessible"

    // ── Methods ───────────────────────────────

    /**
     * submitForm()
     * Collects all field values currently held by the form into a
     * plain data bundle and signals the TripIntakeController to
     * create a TripRequest from them.
     *
     * Called by the UI after the user clicks "Confirm & Plan".
     * Returns true if the form considers itself internally consistent
     * enough to pass on (field-level validation is done by
     * FieldValidator inside the controller, not here).
     */
    bool submitForm() const;

    /**
     * editForm()
     * Resets the form's internal "submitted" flag so the UI can
     * navigate back and let the user change values.
     * Does NOT clear any field data.
     */
    void editForm();

private:
    bool submitted_ = false;
};