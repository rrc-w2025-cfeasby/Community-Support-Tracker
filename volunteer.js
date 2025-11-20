// Community-Support-Tracker/volunteer.js

// In-memory temporary data store
const volunteerEntries = [];

/**
 * Validate the volunteer form values.
 * Returns an array of error messages (empty if valid).
 */
function validateVolunteerData({ charityName, date, hours, rating }) {
  const errors = [];

  // Required fields
  if (!charityName || charityName.trim() === "") {
    errors.push("Charity Name is required.");
  }
  if (!date || date.trim() === "") {
    errors.push("Date is required.");
  }
  if (!hours || hours.toString().trim() === "") {
    errors.push("Hours Volunteered is required.");
  }
  if (!rating || rating.toString().trim() === "") {
    errors.push("Volunteer Experience Rating is required.");
  }

  // Hours: positive number
  const hoursNum = Number(hours);
  if (isNaN(hoursNum) || hoursNum <= 0) {
    errors.push("Hours Volunteered must be a positive number.");
  }

  // Rating: 1–5
  const ratingNum = Number(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    errors.push("Volunteer Experience Rating must be a number between 1 and 5.");
  }

  return errors;
}

/**
 * Pure data-processing function.
 * Takes valid raw data and returns a normalized entry object.
 */
function buildVolunteerEntry({ charityName, date, hours, rating }) {
  return {
    id: Date.now(), // simple unique-ish ID
    charityName: charityName.trim(),
    date,
    hours: Number(hours),
    rating: Number(rating),
  };
}

/**
 * Clear all per-field error spans.
 */
function clearErrorSpans() {
  const ids = ["charityName_error", "date_error", "hours_error", "rating_error"];
  ids.forEach((id) => {
    const span = document.getElementById(id);
    if (span) {
      span.textContent = "";
      span.hidden = true;
    }
  });
}

/**
 * Show validation errors mapped to each field's <span>.
 */
function showValidationErrors(errors) {
  clearErrorSpans();

  errors.forEach((msg) => {
    let spanId = null;

    if (msg.includes("Charity Name")) {
      spanId = "charityName_error";
    } else if (msg.includes("Date")) {
      spanId = "date_error";
    } else if (msg.includes("Hours Volunteered")) {
      spanId = "hours_error";
    } else if (msg.includes("Volunteer Experience Rating")) {
      spanId = "rating_error";
    }

    if (!spanId) return;
    const span = document.getElementById(spanId);
    if (!span) return;

    span.textContent = msg;
    span.hidden = false;
  });
}

/**
 * Handle form submission:
 *  - prevent page reload
 *  - collect data
 *  - validate and show errors
 *  - push normalized entry to volunteerEntries if valid
 */
function handleVolunteerSubmit(event) {
  event.preventDefault();

  const form = event.target || document.getElementById("volunteer-form");
  if (!form) return;

  const charityNameInput = form.querySelector("#charityName");
  const dateInput = form.querySelector("#date");
  const hoursInput = form.querySelector("#hours");
  const ratingInputs = form.querySelectorAll("input[name='rating']");

  let ratingValue = "";
  ratingInputs.forEach((input) => {
    if (input.checked) {
      ratingValue = input.value;
    }
  });

  const rawData = {
    charityName: charityNameInput?.value ?? "",
    date: dateInput?.value ?? "",
    hours: hoursInput?.value ?? "",
    rating: ratingValue,
  };

  const errors = validateVolunteerData(rawData);

  if (errors.length > 0) {
    showValidationErrors(errors);
    return;
  }

  // If valid, clear any old errors
  clearErrorSpans();

  const entry = buildVolunteerEntry(rawData);
  volunteerEntries.push(entry);

  form.reset();
}

/**
 * Wire up the form submit handler.
 */
function initVolunteerForm(formId = "volunteer-form") {
  const form = document.getElementById(formId);
  if (!form) {
    console.warn(`Volunteer form with id="${formId}" not found.`);
    return;
  }

  form.addEventListener("submit", handleVolunteerSubmit);
}

// Export for Jest (CommonJS) but keep browser compatibility.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    volunteerEntries,
    validateVolunteerData,
    buildVolunteerEntry,
    handleVolunteerSubmit,
    initVolunteerForm,
  };
}
