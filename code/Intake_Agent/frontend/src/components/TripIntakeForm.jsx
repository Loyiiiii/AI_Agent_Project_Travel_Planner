import { useState, useRef, useEffect } from "react";

// ── static data ──────────────────────────────────────────────
const CITIES = [
  "Abu Dhabi","Accra","Addis Ababa","Adelaide","Agra","Ahmedabad","Algiers","Almaty",
  "Amsterdam","Anchorage","Ankara","Athens","Auckland","Austin","Baghdad","Baku",
  "Bali","Bangkok","Barcelona","Beijing","Beirut","Belgrade","Berlin","Bogota",
  "Bologna","Bordeaux","Brisbane","Brussels","Bucharest","Budapest","Buenos Aires",
  "Cairo","Calgary","Cape Town","Casablanca","Chennai","Chicago","Chongqing","Colombo",
  "Copenhagen","Dakar","Dallas","Dar es Salaam","Delhi","Denver","Dhaka","Doha",
  "Dubai","Dublin","Durban","Edinburgh","Florence","Frankfurt","Geneva","Glasgow",
  "Guangzhou","Guatemala City","Hamburg","Hanoi","Havana","Helsinki","Ho Chi Minh City",
  "Hong Kong","Honolulu","Houston","Hyderabad","Istanbul","Jakarta","Jeddah",
  "Johannesburg","Karachi","Kathmandu","Kinshasa","Kuala Lumpur","Kuwait City",
  "Lagos","Lahore","Las Vegas","Lima","Lisbon","London","Los Angeles","Luanda",
  "Luxembourg City","Lyon","Madrid","Manila","Marseille","Medellin","Melbourne",
  "Mexico City","Miami","Milan","Minneapolis","Montreal","Moscow","Mumbai",
  "Munich","Nairobi","Naples","New York City","Nice","Osaka","Oslo","Ottawa",
  "Panama City","Paris","Perth","Philadelphia","Phnom Penh","Prague","Pune",
  "Riyadh","Rome","San Francisco","Santiago","Sao Paulo","Seattle","Seoul",
  "Shanghai","Singapore","Sofia","Stockholm","Sydney","Taipei","Tehran","Tel Aviv",
  "Tokyo","Toronto","Vancouver","Vienna","Warsaw","Washington DC","Waterloo","Wellington","Zurich",
  "Calgary, AB","Edmonton, AB","Halifax, NS","Kelowna, BC","Kingston, ON","London, ON",
  "Mississauga, ON","Montreal, QC","Ottawa, ON","Quebec City, QC","Regina, SK",
  "Saskatoon, SK","Toronto, ON","Vancouver, BC","Victoria, BC","Waterloo, ON","Winnipeg, MB","Windsor, ON",
  "Atlanta, GA","Austin, TX","Boston, MA","Charlotte, NC","Dallas, TX","Denver, CO",
  "Houston, TX","Las Vegas, NV","Los Angeles, CA","Miami, FL","Minneapolis, MN",
  "Nashville, TN","New Orleans, LA","New York, NY","Orlando, FL","Philadelphia, PA",
  "Phoenix, AZ","Portland, OR","San Diego, CA","San Francisco, CA","Seattle, WA","Washington, DC",
];

const CURRENCIES = ["CAD", "USD", "CNY", "EUR", "JPY", "KRW"];

const INTEREST_CHIPS = [
  "Food", "Photography", "Nature", "Culture & Museums", "Adventure & Sports",
  "Nightlife", "Shopping", "History", "Relaxation", "Hiking", "Beach", "Family-friendly",
];

const PACE_CHIPS = [
  { value: "relaxed", label: "Relaxed" },
  { value: "balanced", label: "Balanced" },
  { value: "packed", label: "Packed" },
];

// ── helpers ──────────────────────────────────────────────────
const toISO = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const fromISO = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const fmtDisplay = (iso) => {
  const d = fromISO(iso);
  if (!d) return null;
  return d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
};
const sameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// ── city autocomplete field ─────────────────────────────────
function CityField({ id, label, value, onChange, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setSuggestions([]);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInput(e) {
    const v = e.target.value;
    onChange(v);
    if (v.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setSuggestions(CITIES.filter((c) => c.toLowerCase().includes(v.toLowerCase())).slice(0, 8));
  }

  function pick(city) {
    onChange(city);
    setSuggestions([]);
  }

  return (
    <div className="field" ref={wrapRef}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" autoComplete="off" value={value} onChange={handleInput} placeholder={placeholder} />
      {suggestions.length > 0 && (
        <div className="ac-list">
          {suggestions.map((c) => (
            <div key={c} onMouseDown={() => pick(c)}>{c}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── date range calendar popover ─────────────────────────────
function DateRangeField({ startDate, endDate, onChange }) {
  const [open, setOpen] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const triggerRef = useRef(null);
  const popRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        open &&
        popRef.current && !popRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const viewMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const y = viewMonth.getFullYear();
  const mo = viewMonth.getMonth();
  const firstDay = new Date(y, mo, 1).getDay();
  const daysInMonth = new Date(y, mo + 1, 0).getDate();

  const selS = fromISO(startDate);
  const selE = fromISO(endDate);

  function pickDay(d) {
    const dt = new Date(y, mo, d);
    if (!selS || (selS && selE)) {
      onChange(toISO(dt), "");
    } else if (dt <= selS) {
      onChange(toISO(dt), "");
    } else {
      onChange(toISO(selS), toISO(dt));
      setTimeout(() => setOpen(false), 300);
    }
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(<div key={"e" + i} className="cal-day emp" />);
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(y, mo, d);
    const past = dt < today;
    let cls = "cal-day";
    if (past) cls += " dis";
    else {
      if (sameDay(dt, selS)) cls += " rs";
      if (sameDay(dt, selE)) cls += " re";
      if (selS && selE && dt > selS && dt < selE) cls += " inr";
    }
    cells.push(
      <div key={d} className={cls} onClick={past ? undefined : () => pickDay(d)}>
        {d}
      </div>
    );
  }

  return (
    <div className="field full">
      <label>Travel Dates</label>
      <div
        className={`date-trig${open ? " open" : ""}`}
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="ds">
          <span className="ds-lbl">Start Date</span>
          <span className={`ds-val${startDate ? "" : " ph"}`}>{fmtDisplay(startDate) || "Add date"}</span>
        </div>
        <div className="ds-div" />
        <div className="ds">
          <span className="ds-lbl">End Date</span>
          <span className={`ds-val${endDate ? "" : " ph"}`}>{fmtDisplay(endDate) || "Add date"}</span>
        </div>
      </div>

      {open && (
        <div className="cal open" ref={popRef}>
          <div className="cal-hdr">
            <button type="button" className="cal-nav-btn" onClick={() => setMonthOffset((v) => v - 1)}>&#8249;</button>
            <span className="cal-nav-lbl">{viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            <button type="button" className="cal-nav-btn" onClick={() => setMonthOffset((v) => v + 1)}>&#8250;</button>
          </div>
          <div className="cal-grid">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="cal-dow">{d}</div>
            ))}
            {cells}
          </div>
          <div className="cal-foot">
            <button type="button" className="cal-clr" onClick={() => onChange("", "")}>Clear dates</button>
            <button type="button" className="cal-ok" onClick={() => setOpen(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── main component ──────────────────────────────────────────
function TripIntakeForm({ initialData, onSubmit, isLoading }) {
  const [step, setStep] = useState("basics"); // 'basics' | 'preferences'

  const [origin, setOrigin] = useState(initialData?.origin || "");
  const [destination, setDestination] = useState(initialData?.destination || "");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [numberOfTravelers, setNumberOfTravelers] = useState(initialData?.numberOfTravelers || 1);
  const [budget, setBudget] = useState(initialData?.budget || "");
  const [currency, setCurrency] = useState(initialData?.currency || "CAD");

  const [selectedInterests, setSelectedInterests] = useState(initialData?.interests || []);
  const [customInterests, setCustomInterests] = useState("");
  const [travelPace, setTravelPace] = useState(initialData?.travelPace || "balanced");

  function toggleInterest(label) {
    setSelectedInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  }

  function handleDateChange(newStart, newEnd) {
    setStartDate(newStart);
    setEndDate(newEnd);
  }

  function goToPreferences(e) {
    e.preventDefault();
    setStep("preferences");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const customList = customInterests
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const cleanedFormData = {
      origin: origin.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      numberOfTravelers: Number(numberOfTravelers),
      budget: Number(budget),
      currency: currency.trim(),
      interests: [...selectedInterests, ...customList],
      travelPace,
    };

    onSubmit(cleanedFormData);
  }

  return (
    <div className="trip-intake-form">
      <div className="wizard-split">
        <div className="wizard-left">
          <p className="step-eyebrow">{step === "basics" ? "Step 01 — Basics" : "Step 02 — Preferences"}</p>
          <h2 className="wizard-title">
            {step === "basics" ? <>Tell us about<br />your trip</> : <>What's your<br />style?</>}
          </h2>
          <p className="wizard-desc">
            {step === "basics"
              ? "Fill in the required fields. We'll ask about your preferences next."
              : "Optional — select all that apply."}
          </p>
        </div>

        <div className="wizard-right">
          {step === "basics" && (
            <form onSubmit={goToPreferences}>
              <div className="field-group">
                <div className="group-label">Where &amp; When</div>
                <div className="g2">
                  <CityField id="origin" label="Origin City" value={origin} onChange={setOrigin} placeholder="Toronto" />
                  <CityField id="destination" label="Destination" value={destination} onChange={setDestination} placeholder="Japan" />
                </div>
                <div style={{ marginTop: 20 }}>
                  <DateRangeField startDate={startDate} endDate={endDate} onChange={handleDateChange} />
                </div>
              </div>

              <div className="field-group">
                <div className="group-label">Travelers &amp; Budget</div>
                <div className="g2">
                  <div className="field full">
                    <label htmlFor="numberOfTravelers">Number of Travelers</label>
                    <input
                      id="numberOfTravelers"
                      type="number"
                      min="1"
                      value={numberOfTravelers}
                      onChange={(e) => setNumberOfTravelers(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="currency">Currency</label>
                    <div className="select-wrap">
                      <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} disabled={isLoading}>
                        {CURRENCIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="budget">Budget</label>
                    <input
                      id="budget"
                      type="number"
                      min="0"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="3000"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-sub" disabled={isLoading}>
                Next: Preferences →
              </button>
            </form>
          )}

          {step === "preferences" && (
            <form onSubmit={handleSubmit}>
              <div className="pref-group">
                <div className="pref-group-lbl">Interests</div>
                <div className="chip-group">
                  {INTEREST_CHIPS.map((label) => (
                    <div
                      key={label}
                      className={`chip${selectedInterests.includes(label) ? " selected" : ""}`}
                      onClick={() => toggleInterest(label)}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <input
                    type="text"
                    className="pref-text-in"
                    placeholder="Add your own, separated by commas"
                    value={customInterests}
                    onChange={(e) => setCustomInterests(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="pref-group">
                <div className="pref-group-lbl">Travel Pace</div>
                <div className="chip-group">
                  {PACE_CHIPS.map(({ value, label }) => (
                    <div
                      key={value}
                      className={`chip${travelPace === value ? " selected" : ""}`}
                      onClick={() => setTravelPace(value)}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pref-nav">
                <button type="button" className="btn-pb" onClick={() => setStep("basics")} disabled={isLoading}>
                  ← Back
                </button>
                <button type="submit" className="btn-pn" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Review Trip ✓"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripIntakeForm;