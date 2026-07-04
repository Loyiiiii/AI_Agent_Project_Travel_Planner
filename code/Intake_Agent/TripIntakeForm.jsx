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
        setErrors(response.errors || []);
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
    setCurrentStep("FORM");
  }

  return (
    <div className="trip-intake-page">
      <h1>Trip Intake</h1>

      {errors.length > 0 && (
        <div className="error-box">
          <h3>Please fix the following issues:</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {isLoading && <p>Loading...</p>}

      {currentStep === "FORM" && (
        <TripIntakeForm
          initialData={tripRequest}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}

      {currentStep === "SUMMARY" && tripRequest && (
        <TripSummary
          tripRequest={tripRequest}
          onConfirm={handleConfirm}
          onEdit={handleEdit}
          isLoading={isLoading}
        />
      )}

      {currentStep === "SUCCESS" && tripRequest && (
        <div className="success-box">
          <h2>Trip Request Saved</h2>
          <p>Your trip request has been confirmed and saved successfully.</p>

          <h3>Saved Trip</h3>
          <p>
            <strong>From:</strong> {tripRequest.origin}
          </p>
          <p>
            <strong>To:</strong> {tripRequest.destination}
          </p>
          <p>
            <strong>Dates:</strong> {tripRequest.startDate} to{" "}
            {tripRequest.endDate}
          </p>
          <p>
            <strong>Travelers:</strong> {tripRequest.numberOfTravelers}
          </p>
          <p>
            <strong>Budget:</strong> {tripRequest.budget}{" "}
            {tripRequest.currency}
          </p>
          <p>
            <strong>Status:</strong> {tripRequest.status}
          </p>
        </div>
      )}
    </div>
  );
}

export default TripIntakePage;
