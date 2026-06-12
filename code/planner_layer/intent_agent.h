#ifndef INTENT_AGENT_H
#define INTENT_AGENT_H

#include <string>
#include <vector>

#include "models/travel_intent.h"

using namespace std;

/*
 * IntentAgent
 * -----------
 * The Intent Agent is responsible for understanding the user's main travel goal.
 *
 * Example user input:
 * "I want to go from Waterloo to Montreal to watch F1,
 *  budget 1000-1800 CAD, and stay downtown."
 *
 * This agent should extract:
 * - origin
 * - destination
 * - travel purpose
 * - budget
 * - destination area preference
 *
 * This agent does NOT:
 * - search flights
 * - search hotels
 * - calculate routes
 * - optimize budget
 * - generate the final itinerary
 */
class IntentAgent {
public:
    /*
     * parse()
     * -------
     * Reads the user's natural language input and converts it
     * into a TravelIntent object.
     *
     * Input:
     * - userInput: the original message typed by the user
     *
     * Output:
     * - TravelIntent object containing extracted travel information
     */
    TravelIntent parse(const string& userInput);

    /*
     * getMissingFields()
     * ------------------
     * Checks which important travel fields are still missing.
     *
     * Example:
     * If the user says:
     * "I want to go to Montreal"
     *
     * Missing fields may include:
     * - origin
     * - start date
     * - end date
     * - number of travelers
     * - budget
     *
     * Input:
     * - intent: the extracted TravelIntent object
     *
     * Output:
     * - a list of missing field names
     */
    vector<string> getMissingFields(const TravelIntent& intent);

    /*
     * generateQuestions()
     * -------------------
     * Converts missing field names into user-friendly questions.
     *
     * Example:
     * "origin" becomes:
     * "Where will you depart from?"
     *
     * Input:
     * - missingFields: list returned by getMissingFields()
     *
     * Output:
     * - list of questions to ask the user next
     */
    vector<string> generateQuestions(const vector<string>& missingFields);

private:
    /*
     * toLower()
     * ---------
     * Converts text to lowercase.
     *
     * This helps make keyword matching case-insensitive.
     *
     * Example:
     * "Waterloo" -> "waterloo"
     */
    string toLower(string text);

    /*
     * extractBudget()
     * ---------------
     * Extracts budget numbers from user input.
     *
     * Example:
     * "budget 1000-1800 CAD"
     *
     * Result:
     * budgetMin = 1000
     * budgetMax = 1800
     */
    void extractBudget(const string& text, TravelIntent& intent);
};

#endif