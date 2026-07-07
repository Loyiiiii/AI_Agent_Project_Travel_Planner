import { useState } from "react";

function TripIntakeForm({ initialData, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    origin: initialData?.origin || "",
    destination: initialData?.destination || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    numberOfTravelers: initialData?.numberOfTravelers || 1,
    budget: initialData?.budget || "",
    currency: initialData?.currency || "CAD",
    interests: initialData?.interests?.join(", ") || "",
    travelPace: initialData?.travelPace || "balanced"
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cleanedFormData = {
      origin: formData.origin.trim(),
      destination: formData.destination.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      numberOfTravelers: Number(formData.numberOfTravelers),
      budget: Number(formData.budget),
      currency: formData.currency.trim(),
      interests: formData.interests
        .split(",")
        .map((interest) => interest.trim())
        .filter((interest) => interest.length > 0),
      travelPace: formData.travelPace
    };

    onSubmit(cleanedFormData);
  }

  return (
    <form className="trip-intake-form" onSubmit={handleSubmit}>
      <h2>Tell us about your trip</h2>

      <div className="form-group">
        <label htmlFor="origin">Origin City</label>
        <input
          id="origin"
          name="origin"
          type="text"
          value={formData.origin}
          onChange={handleChange}
          placeholder="Toronto"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          name="destination"
          type="text"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Japan"
          disabled={isLoading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="numberOfTravelers">Number of Travelers</label>
        <input
          id="numberOfTravelers"
          name="numberOfTravelers"
          type="number"
          min="1"
          value={formData.numberOfTravelers}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="budget">Budget</label>
          <input
            id="budget"
            name="budget"
            type="number"
            min="0"
            value={formData.budget}
            onChange={handleChange}
            placeholder="3000"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="CAD">CAD</option>
            <option value="USD">USD</option>
            <option value="CNY">CNY</option>
            <option value="EUR">EUR</option>
            <option value="JPY">JPY</option>
            <option value="KRW">KRW</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="interests">Interests</label>
        <input
          id="interests"
          name="interests"
          type="text"
          value={formData.interests}
          onChange={handleChange}
          placeholder="food, photography, nature"
          disabled={isLoading}
        />
        <small>Separate interests with commas.</small>
      </div>

      <div className="form-group">
        <label htmlFor="travelPace">Travel Pace</label>
        <select
          id="travelPace"
          name="travelPace"
          value={formData.travelPace}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="relaxed">Relaxed</option>
          <option value="balanced">Balanced</option>
          <option value="packed">Packed</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Trip Request"}
      </button>
    </form>
  );
}

export default TripIntakeForm;
