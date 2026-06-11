#ifndef TRAVEL_INTENT_H
#define TRAVEL_INTENT_H

#include <string>
#include <vector>

using namespace std;

/*
 * TravelIntent
 * ============
 * Central data structure representing the user's travel request.
 *
 * This object is produced by the Intent Agent and consumed by
 * all downstream agents in the system.
 *
 * Example:
 *
 * User Input:
 * ---------------------------------------------------
 * "I want to travel from Waterloo to Montreal
 *  for the F1 race. My budget is 1000-1800 CAD.
 *  I prefer staying downtown."
 * ---------------------------------------------------
 *
 * Extracted TravelIntent:
 * ---------------------------------------------------
 * origin = Waterloo
 * destination = Montreal
 * budgetMin = 1000
 * budgetMax = 1800
 * purpose = Watch F1 event
 * destinationAreas = ["Downtown"]
 * ---------------------------------------------------
 *
 * NOTE:
 * This file only stores data.
 * No business logic should be implemented here.
 */
struct TravelIntent {

    // =====================================================
    // Basic Trip Information
    // =====================================================

    /*
     * User's departure location.
     *
     * Example:
     * "Waterloo, ON"
     * "123 King St W, Toronto"
     */
    string origin;

    /*
     * Main destination city or region.
     *
     * Example:
     * "Montreal"
     * "Tokyo"
     * "Vancouver"
     */
    string destination;

    /*
     * Optional destination sub-regions.
     *
     * Example:
     * ["Downtown"]
     * ["Old Montreal", "Plateau"]
     */
    vector<string> destinationAreas;

    // =====================================================
    // Time Information
    // =====================================================

    /*
     * Departure date.
     *
     * Format:
     * YYYY-MM-DD
     *
     * Example:
     * "2026-06-12"
     */
    string startDate;

    /*
     * Return date.
     *
     * Format:
     * YYYY-MM-DD
     */
    string endDate;

    /*
     * Total travel duration in days.
     *
     * Example:
     * 3
     * 7
     * 14
     */
    int travelDays = 0;

    // =====================================================
    // Traveler Information
    // =====================================================

    /*
     * Number of travelers.
     *
     * Example:
     * 1
     * 2
     * 4
     */
    int travelers = 0;

    // =====================================================
    // Budget Information
    // =====================================================

    /*
     * Minimum expected budget.
     *
     * Example:
     * 1000
     */
    double budgetMin = 0.0;

    /*
     * Maximum acceptable budget.
     *
     * Example:
     * 1800
     */
    double budgetMax = 0.0;

    /*
     * Currency code.
     *
     * Example:
     * CAD
     * USD
     * EUR
     */
    string currency = "CAD";

    // =====================================================
    // Travel Goal
    // =====================================================

    /*
     * Main reason for the trip.
     *
     * Example:
     * "Watch F1"
     * "Business Meeting"
     * "Family Visit"
     * "Vacation"
     */
    string purpose;

    /*
     * Additional notes extracted from the user.
     *
     * Example:
     * "Meet friends during the trip"
     * "First time visiting Montreal"
     */
    string notes;

    // =====================================================
    // Raw Input
    // =====================================================

    /*
     * Original user message.
     *
     * Useful for:
     * - Debugging
     * - LLM reprocessing
     * - Logging
     */
    string rawInput;
};

#endif