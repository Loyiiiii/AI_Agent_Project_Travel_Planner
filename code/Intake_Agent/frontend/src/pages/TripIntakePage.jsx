import { useState } from "react";

import TripIntakeForm from "../components/TripIntakeForm";
import TripSummary from "../components/TripSummary";
import {
  submitTripIntake,
  confirmTripRequest
} from "../api/tripIntakeApi";

function TripIntakePage() {
  const [currentStep, setCurrentStep] = useState("FORM");
  const [tripRequest, setTripRequest] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData) {
    setIsLoading(true);
    setErrors([]);

    try {
      const response = await submitTripIntake(formData);

      if (!response.valid) {
        setErrors(response.errors || ["Trip request is invalid."]);
        setCurrentStep("FORM");
        return;
      }

      setTripRequest(response.tripRequest);
      setCurrentStep("SUMMARY");
    } catch (error) {
      setErrors(["Failed to submit trip request. Please try again."]);
      setCurrentStep("FORM");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirm() {
    if (!tripRequest) {
      setErrors(["No trip request available to confirm."]);
      setCurrentStep("FORM");
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      const response = await confirmTripRequest(tripRequest);

      if (!response.success) {
        setErrors(response.errors || ["Failed to confirm trip request."]);
        setCurrentStep("SUMMARY");
        return;
      }

      setTripRequest(response.tripRequest);
      setCurrentStep("SUCCESS");
    } catch (error) {
      setErrors(["Failed to confirm trip request. Please try again."]);
      setCurrentStep("SUMMARY");
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit() {
    setErrors([]);
    setCurrentStep("FORM");
  }

  function handleStartOver() {
    setCurrentStep("FORM");
    setTripRequest(null);
    setErrors([]);
    setIsLoading(false);
  }

  return (
    <main className="trip-intake-page">
      <section className="page-header">
        <h1>Travel Planner Agent</h1>
        <p>
          Enter your basic travel information. We will validate it and prepare a
          structured trip request for planning.
        </p>
      </section>

      {errors.length > 0 && (
        <section className="error-box">
          <h3>Please fix the following issues:</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </section>
      )}

      {currentStep === "FORM" && (
        <TripIntakeForm
          initialData={tripRequest}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}

      {currentStep === "SUMMARY" && (
        <TripSummary
          tripRequest={tripRequest}
          onConfirm={handleConfirm}
          onEdit={handleEdit}
          isLoading={isLoading}
        />
      )}

      {currentStep === "SUCCESS" && tripRequest && (
        <section className="success-box">
          <h2>Trip Request Saved</h2>

          <p>Your trip request has been confirmed and saved successfully.</p>

          <div className="summary-card">
            <div className="summary-row">
              <span className="summary-label">Request ID:</span>
              <span className="summary-value">{tripRequest.requestId}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Origin:</span>
              <span className="summary-value">{tripRequest.origin}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Destination:</span>
              <span className="summary-value">{tripRequest.destination}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Dates:</span>
              <span className="summary-value">
                {tripRequest.startDate} to {tripRequest.endDate}
              </span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Budget:</span>
              <span className="summary-value">
                {tripRequest.budget} {tripRequest.currency}
              </span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Status:</span>
              <span className="summary-value">{tripRequest.status}</span>
            </div>
          </div>

          <button type="button" onClick={handleStartOver}>
            Create Another Trip Request
          </button>
        </section>
      )}
    </main>
  );
}

export default TripIntakePage;