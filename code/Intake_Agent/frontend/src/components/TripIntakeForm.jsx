import { useState, useRef, useEffect } from "react";
import { CITIES } from "../data/cities";

// ── static data ──────────────────────────────────────────────

const CURRENCIES = ["CAD", "USD", "CNY", "EUR", "JPY", "KRW"];

// travel style chip -> backend travelPace enum
const PACE_MAP = { "Relaxed": "relaxed", "Moderate": "balanced", "Packed": "packed", "Spontaneous": "balanced" };

const PREF_PAGES = [
  {
    title: "Travel & Stay",
    desc: "How you like to get there and where you sleep.",
    groups: [
      { id: "travelStyle", label: "Travel Style", accent: "blue", chips: ["Relaxed", "Moderate", "Packed", "Spontaneous"] },
      { id: "accommodation", label: "Accommodation", accent: "gold", chips: ["Luxury Hotel (5★)", "Hotel (3–4★)", "Boutique Hotel", "Airbnb", "Hostel", "Camping / Glamping"] },
      { id: "transportTo", label: "Getting There", accent: "blue", chips: ["Economy Flight", "Business Flight", "Train", "Bus / Coach", "Drive", "Carpool"] },
    ],
  },
  {
    title: "Activities & Food",
    desc: "What you want to do and how you like to eat.",
    groups: [
      { id: "transportLoc", label: "Getting Around", accent: "gold", chips: ["Public Transit", "Rental Car", "Self-Drive", "Rideshare", "Bike / E-Bike", "Walk everywhere", "Taxi"] },
      { id: "food", label: "Food & Dining", accent: "blue", chips: ["Local & Street Food", "Fine Dining", "Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-Free"] },
      { id: "tripFocus", label: "Trip Focus", accent: "gold", chips: ["Culture & Museums", "Nature & Outdoors", "Adventure & Sports", "Beach & Relaxation", "Nightlife", "Food Tour", "Shopping", "Family-friendly", "Romance"] },
    ],
  },
  {
    title: "Anything else?",
    desc: "Must-sees, special needs, or notes for our agents.",
    isText: true,
    placeholder: "e.g. F1 Grand Prix on Saturday, wheelchair accessible",
  },
];

// ── date helpers ─────────────────────────────────────────────
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

function CalendarIcon() {
  return (
    <svg className="cal-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 6h13" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 1v3M11.5 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ── city autocomplete field ─────────────────────────────────
function CityField({ id, label, value, onChange, placeholder, error }) {
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
      <input id={id} type="text" autoComplete="off" value={value} onChange={handleInput} placeholder={placeholder} className={error ? "invalid" : ""} />
      {suggestions.length > 0 && (
        <div className="ac-list">
          {suggestions.map((c) => (
            <div key={c} onMouseDown={() => pick(c)}>{c}</div>
          ))}
        </div>
      )}
      {error && <span className="ferr show">{error}</span>}
    </div>
  );
}

// ── multi-select city field (for destination, up to maxItems) ─
function MultiCityField({ id, label, values, onChange, placeholder, maxItems = 10, error, exclude }) {
  const [inputValue, setInputValue] = useState("");
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
    setInputValue(v);
    if (v.trim().length < 2 || values.length >= maxItems) {
      setSuggestions([]);
      return;
    }
    setSuggestions(
      CITIES.filter(
        (c) =>
          c.toLowerCase().includes(v.toLowerCase()) &&
          !values.includes(c) &&
          c.toLowerCase() !== (exclude || "").trim().toLowerCase()
      ).slice(0, 8)
    );
  }

  function addCity(city) {
    if (values.includes(city) || values.length >= maxItems) return;
    if (city.toLowerCase() === (exclude || "").trim().toLowerCase()) return;
    onChange([...values, city]);
    setInputValue("");
    setSuggestions([]);
  }

  function removeCity(city) {
    onChange(values.filter((c) => c !== city));
  }

  const atLimit = values.length >= maxItems;

  return (
    <div className="field" ref={wrapRef}>
      <label htmlFor={id}>{label} <span className="field-count">({values.length}/{maxItems})</span></label>

      <input
        id={id}
        type="text"
        autoComplete="off"
        value={inputValue}
        onChange={handleInput}
        placeholder={atLimit ? `Limit of ${maxItems} reached` : placeholder}
        disabled={atLimit}
      />

      {suggestions.length > 0 && (
        <div className="ac-list">
          {suggestions.map((c) => (
            <div key={c} onMouseDown={() => addCity(c)}>{c}</div>
          ))}
        </div>
      )}

      <div className="tag-list">
        {values.map((c) => (
          <span key={c} className="tag-chip">
            {c}
            <button type="button" onClick={() => removeCity(c)} aria-label={`Remove ${c}`}>×</button>
          </span>
        ))}
      </div>

      {error && <span className="ferr show">{error}</span>}
    </div>
  );
}

// ── date range calendar popover (with calendar icon trigger) ─
function DateRangeField({ startDate, endDate, onChange, error }) {
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
          <span className="ds-lbl"><CalendarIcon /> Start Date</span>
          <span className={`ds-val${startDate ? "" : " ph"}`}>{fmtDisplay(startDate) || "Add date"}</span>
        </div>
        <div className="ds-div" />
        <div className="ds">
          <span className="ds-lbl"><CalendarIcon /> End Date</span>
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
      {error && <span className="ferr show">{error}</span>}
    </div>
  );
}

// ── main component ──────────────────────────────────────────
function TripIntakeForm({ initialData, onSubmit, isLoading }) {
  const [step, setStep] = useState("basics"); // 'basics' | 'preferences'
  const [prefPage, setPrefPage] = useState(0);

  const [origin, setOrigin] = useState(initialData?.origin || "");
  const [destinations, setDestinations] = useState(
    Array.isArray(initialData?.destination)
      ? initialData.destination
      : initialData?.destination
      ? initialData.destination.split(",").map((s) => s.trim()).filter(Boolean)
      : []
  );
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [numberOfTravelers, setNumberOfTravelers] = useState(initialData?.numberOfTravelers || 1);
  const [budget, setBudget] = useState(initialData?.budget || "");
  const [currency, setCurrency] = useState(initialData?.currency || "CAD");

  const [selPrefs, setSelPrefs] = useState({}); // { groupId: [labels] }
  const [notes, setNotes] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function toggleChip(groupId, label) {
    setSelPrefs((prev) => {
      const cur = prev[groupId] || [];
      const next = cur.includes(label) ? cur.filter((l) => l !== label) : [...cur, label];
      return { ...prev, [groupId]: next };
    });
  }

  function handleDateChange(newStart, newEnd) {
    setStartDate(newStart);
    setEndDate(newEnd);
  }

  function validateBasics() {
    const errs = {};
    if (!origin.trim()) errs.origin = "Please enter an origin city";
    if (destinations.length === 0) errs.destination = "Please add at least one destination";
    if (destinations.some((d) => d.trim().toLowerCase() === origin.trim().toLowerCase())) {
      errs.destination = "Destination must differ from origin";
    }
    if (!startDate || !endDate) errs.dates = "Please select your travel dates";
    if (!numberOfTravelers || Number(numberOfTravelers) < 1) errs.numberOfTravelers = "Must be at least 1 traveler";
    if (budget === "" || Number(budget) < 0) errs.budget = "Must be 0 or more";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function goToPreferences(e) {
    e.preventDefault();
    if (!validateBasics()) return;
    setStep("preferences");
    setPrefPage(0);
  }

  function nextPrefPage() {
    if (prefPage < PREF_PAGES.length - 1) setPrefPage((p) => p + 1);
    else finishAndSubmit();
  }
  function prevPrefPage() {
    if (prefPage > 0) setPrefPage((p) => p - 1);
    else setStep("basics");
  }
  function skipPrefPage() {
    const page = PREF_PAGES[prefPage];
    if (page.isText) setNotes("");
    else {
      setSelPrefs((prev) => {
        const next = { ...prev };
        page.groups.forEach((g) => delete next[g.id]);
        return next;
      });
    }
    if (prefPage < PREF_PAGES.length - 1) setPrefPage((p) => p + 1);
    else finishAndSubmit();
  }

  function finishAndSubmit() {
    const travelStyleSel = (selPrefs.travelStyle || [])[0];
    const travelPace = PACE_MAP[travelStyleSel] || "balanced";

    const allChipInterests = Object.values(selPrefs).flat();
    const noteInterests = notes.split(",").map((s) => s.trim()).filter(Boolean);

    const cleanedFormData = {
      origin: origin.trim(),
      destination: destinations.join(", "),
      startDate,
      endDate,
      numberOfTravelers: Number(numberOfTravelers),
      budget: Number(budget),
      currency: currency.trim(),
      interests: [...allChipInterests, ...noteInterests],
      travelPace,
    };

    onSubmit(cleanedFormData);
  }

  const currentPage = PREF_PAGES[prefPage];
  const progressPct = (prefPage / PREF_PAGES.length) * 100;

  return (
    <div className="trip-intake-form">
      <div className="wizard-split">
        {step === "preferences" && (
          <div className="pref-progress-track"><div className="pref-progress-fill" style={{ width: `${progressPct}%` }} /></div>
        )}

        <div className="wizard-left">
          {step === "basics" ? (
            <>
              <p className="step-eyebrow">Step 01 — Basics</p>
              <h2 className="wizard-title">Tell us about<br />your trip</h2>
              <p className="wizard-desc">Fill in the required fields. We'll ask about your preferences next.</p>
            </>
          ) : (
            <>
              <p className="step-eyebrow">{prefPage + 1} of {PREF_PAGES.length}</p>
              <h2 className="wizard-title">{currentPage.title}</h2>
              <p className="wizard-desc">{currentPage.desc}</p>
              <p className="pref-note">{currentPage.isText ? "Optional" : "Optional — select all that apply"}</p>
            </>
          )}
        </div>

        <div className="wizard-right">
          {step === "basics" && (
            <form onSubmit={goToPreferences}>
              <div className="field-group">
                <div className="group-label">Where &amp; When</div>
                <CityField id="origin" label="Origin City" value={origin} onChange={setOrigin} placeholder="Toronto" error={fieldErrors.origin} />
                <div style={{ marginTop: 20 }}>
                  <MultiCityField id="destination" label="Destination City" values={destinations} onChange={setDestinations} placeholder="Search and select up to 10" maxItems={10} error={fieldErrors.destination} exclude={origin} />
                </div>
                <div style={{ marginTop: 20 }}>
                  <DateRangeField startDate={startDate} endDate={endDate} onChange={handleDateChange} error={fieldErrors.dates} />
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
                      className={fieldErrors.numberOfTravelers ? "invalid" : ""}
                    />
                    {fieldErrors.numberOfTravelers && <span className="ferr show">{fieldErrors.numberOfTravelers}</span>}
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
                      className={fieldErrors.budget ? "invalid" : ""}
                    />
                    {fieldErrors.budget && <span className="ferr show">{fieldErrors.budget}</span>}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-sub" disabled={isLoading}>
                Next: Preferences →
              </button>
            </form>
          )}

          {step === "preferences" && (
            <div className="pref-viewport">
              {currentPage.isText ? (
                <input
                  type="text"
                  className="pref-text-in"
                  placeholder={currentPage.placeholder}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isLoading}
                />
              ) : (
                currentPage.groups.map((g) => (
                  <div className={`pref-group accent-${g.accent}`} key={g.id}>
                    <div className="pref-group-lbl">{g.label}</div>
                    <div className="chip-group">
                      {g.chips.map((label) => (
                        <div
                          key={label}
                          className={`chip${(selPrefs[g.id] || []).includes(label) ? " selected" : ""}`}
                          onClick={() => toggleChip(g.id, label)}
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              <div className="pref-nav">
                <button type="button" className="btn-pb" onClick={prevPrefPage} disabled={isLoading}>
                  {prefPage === 0 ? "← Edit Trip" : "← Back"}
                </button>
                <button type="button" className="btn-ps" onClick={skipPrefPage} disabled={isLoading}>Skip</button>
                <button type="button" className="btn-pn" onClick={nextPrefPage} disabled={isLoading}>
                  {isLoading ? "Submitting..." : prefPage === PREF_PAGES.length - 1 ? "Review Trip ✓" : "Next →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripIntakeForm;