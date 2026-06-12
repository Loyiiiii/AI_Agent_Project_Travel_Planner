#include <iostream>
#include <string>
#include <vector>
#include <regex>
#include <algorithm>

using namespace std;

/*
 * TravelIntent
 * ------------
 * Stores the travel information extracted from the user's request.
 * This object is passed to later agents (Constraint Agent, Task Planner Agent).
 */
struct TravelIntent {
    string origin = "";
    string destination = "";

    // Optional destination sub-regions
    vector<string> destinationAreas;

    string startDate = "";
    string endDate = "";

    int travelers = 0;

    double budgetMin = 0;
    double budgetMax = 0;

    string mainPurpose = "";

    // Original user input for future reference
    string notes = "";
};

/*
 * IntentAgent
 * -----------
 * Responsible for understanding WHAT the user wants.
 *
 * Responsibilities:
 * - Extract travel intent
 * - Identify missing required information
 * - Generate follow-up questions
 *
 * Not responsible for:
 * - Price search
 * - Hotel search
 * - Route planning
 * - Budget optimization
 */
class IntentAgent {
public:

    /*
     * Parse natural language input and extract travel intent.
     */
    TravelIntent parse(const string& userInput) {
        TravelIntent intent;

        // Store original message
        intent.notes = userInput;

        string text = toLower(userInput);

        /*
         * Simple rule-based extraction.
         * Later versions can replace this section with an LLM call.
         */

        if (text.find("waterloo") != string::npos) {
            intent.origin = "Waterloo";
        }

        if (text.find("montreal") != string::npos ||
            text.find("montréal") != string::npos) {
            intent.destination = "Montreal";
        }

        if (text.find("f1") != string::npos ||
            text.find("formula 1") != string::npos) {
            intent.mainPurpose = "Watch F1 event";
        }

        if (text.find("downtown") != string::npos ||
            text.find("city center") != string::npos) {
            intent.destinationAreas.push_back("downtown");
        }

        extractBudget(text, intent);

        return intent;
    }

    /*
     * Check which required fields are still missing.
     * These fields must be collected before planning begins.
     */
    vector<string> getMissingFields(const TravelIntent& intent) {
        vector<string> missing;

        if (intent.origin.empty())
            missing.push_back("origin");

        if (intent.destination.empty())
            missing.push_back("destination");

        if (intent.startDate.empty())
            missing.push_back("start_date");

        if (intent.endDate.empty())
            missing.push_back("end_date");

        if (intent.travelers == 0)
            missing.push_back("travelers");

        if (intent.budgetMax == 0)
            missing.push_back("budget_max");

        return missing;
    }

    /*
     * Generate user-friendly follow-up questions
     * based on the missing information.
     */
    vector<string> generateQuestions(
        const vector<string>& missingFields) {

        vector<string> questions;

        for (const string& field : missingFields) {

            if (field == "origin") {
                questions.push_back(
                    "Where will you depart from?");
            }

            else if (field == "destination") {
                questions.push_back(
                    "Where do you want to travel?");
            }

            else if (field == "start_date") {
                questions.push_back(
                    "What is your departure date?");
            }

            else if (field == "end_date") {
                questions.push_back(
                    "What is your return date?");
            }

            else if (field == "travelers") {
                questions.push_back(
                    "How many people are traveling?");
            }

            else if (field == "budget_max") {
                questions.push_back(
                    "What is your maximum budget?");
            }
        }

        return questions;
    }

private:

    /*
     * Convert text to lowercase
     * to make matching case-insensitive.
     */
    string toLower(string text) {
        transform(
            text.begin(),
            text.end(),
            text.begin(),
            ::tolower
        );

        return text;
    }

    /*
     * Extract budget numbers from text.
     *
     * Example:
     * "budget 1000-1800 CAD"
     *
     * Result:
     * budgetMin = 1000
     * budgetMax = 1800
     */
    void extractBudget(
        const string& text,
        TravelIntent& intent) {

        regex numberRegex("\\d+");

        sregex_iterator begin(
            text.begin(),
            text.end(),
            numberRegex);

        sregex_iterator end;

        vector<double> numbers;

        for (auto it = begin; it != end; ++it) {
            numbers.push_back(stod(it->str()));
        }

        if (numbers.size() >= 2) {
            intent.budgetMin = numbers[0];
            intent.budgetMax = numbers[1];
        }
        else if (numbers.size() == 1) {
            intent.budgetMax = numbers[0];
        }
    }
};

/*
 * Utility function for debugging.
 * Prints the extracted intent information.
 */
void printIntent(const TravelIntent& intent) {

    cout << "===== Travel Intent =====" << endl;

    cout << "Origin: "
         << intent.origin << endl;

    cout << "Destination: "
         << intent.destination << endl;

    cout << "Destination Areas: ";

    for (const string& area : intent.destinationAreas) {
        cout << area << " ";
    }

    cout << endl;

    cout << "Start Date: "
         << intent.startDate << endl;

    cout << "End Date: "
         << intent.endDate << endl;

    cout << "Travelers: "
         << intent.travelers << endl;

    cout << "Budget Min: "
         << intent.budgetMin << endl;

    cout << "Budget Max: "
         << intent.budgetMax << endl;

    cout << "Purpose: "
         << intent.mainPurpose << endl;

    cout << endl;
}

/*
 * Example usage.
 */
int main() {

    IntentAgent agent;

    string userInput =
        "I want to go from Waterloo to Montreal "
        "to watch F1, budget 1000-1800 CAD, "
        "want to stay downtown and meet friends.";

    TravelIntent intent =
        agent.parse(userInput);

    printIntent(intent);

    vector<string> missingFields =
        agent.getMissingFields(intent);

    vector<string> questions =
        agent.generateQuestions(missingFields);

    cout << "===== Missing Information =====" << endl;

    for (const string& field : missingFields) {
        cout << "- " << field << endl;
    }

    cout << "\n===== Follow-up Questions =====" << endl;

    for (const string& q : questions) {
        cout << "- " << q << endl;
    }

    return 0;
}