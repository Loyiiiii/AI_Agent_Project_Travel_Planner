function TripSummary({ tripRequest, onConfirm, onEdit, isLoading }) {
  if (!tripRequest) {
    return (
      <div className="trip-summary">
        <h2>Trip Summary</h2>
        <p>No trip request available.</p>
      </div>
    );
  }

  function formatList(items, separator = ", ") {
    if (!items) {
      return "None";
    }

    if (Array.isArray(items)) {
      return items.length === 0 ? "None" : items.join(separator);
    }

    return items;
  }

  return (
    <div className="trip-summary">
      <h2>Review Your Trip Request</h2>

      <p>
        Please review the information below before confirming your trip request.
      </p>

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
          <span className="summary-value">{formatList(tripRequest.destination, " · ")}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Start Date:</span>
          <span className="summary-value">{tripRequest.startDate}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">End Date:</span>
          <span className="summary-value">{tripRequest.endDate}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Number of Travelers:</span>
          <span className="summary-value">
            {tripRequest.numberOfTravelers}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Budget:</span>
          <span className="summary-value">
            {tripRequest.budget} {tripRequest.currency}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Interests:</span>
          <span className="summary-value">
            {formatList(tripRequest.interests)}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Travel Pace:</span>
          <span className="summary-value">{tripRequest.travelPace}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Status:</span>
          <span className="summary-value">{tripRequest.status}</span>
        </div>
      </div>

      <div className="summary-actions">
        <button
          type="button"
          onClick={onEdit}
          disabled={isLoading}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Confirming..." : "Confirm Trip Request"}
        </button>
      </div>
    </div>
  );
}

export default TripSummary;