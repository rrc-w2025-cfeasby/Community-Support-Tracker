// Community-Support-Tracker/volunteer.js

const STORAGE_KEY = "volunteerEntries";
// In-memory temporary data store
let volunteerEntries = [];

// Stage One 
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

// Pure data-processing function.
// Takes valid raw data and returns a normalized entry object.
function buildVolunteerEntry({ charityName, date, hours, rating }) {
  return {
    id: Date.now(), 
    charityName: charityName.trim(),
    date,
    hours: Number(hours),
    rating: Number(rating),
  };
}

// Clear all per-field error spans.
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

//Show validation errors mapped to each field's <span>.
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

    if (spanId) {
      const span = document.getElementById(spanId);
      if (span) {
        span.textContent = msg;
        span.hidden = false;
      }
    }
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
  const form = event.target;
  let ratingValue = "";
  const ratingInputs = form.querySelectorAll("input[name='rating']");
  ratingInputs.forEach((input) => {
    if (input.checked) ratingValue = input.value;
  });

  const rawData = {
    charityName: form.elements["charityName"].value.trim(),
    date: form.elements["date"].value,
    hours: form.elements["hours"].value,
    rating: ratingValue,
  };



 const errors = validateVolunteerData(rawData);
  if (errors.length > 0) {
    showValidationErrors(errors);
    return; 
  }

  // Clear old errors
  clearErrorSpans();

  // Build normalized entry
  const entry = buildVolunteerEntry(rawData);

  // Push to in‑memory array
  volunteerEntries.push(entry);

  // Stage Two: persist + render
  saveEntriesToStorage();
  renderTable();

  // Reset form
  form.reset();
}

// Stage Two Persistence + Table 

// LocalStorage helpers
 function localEntriesStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Sync in-memory entries from localStorage
function syncEntriesFromStorage() {
  const stored = localStorage.getItem("volunteerEntries");
  volunteerEntries.length = 0;
  if (stored) {
    JSON.parse(stored).forEach(e => volunteerEntries.push(e));
  }
}

// Save in-memory entries to localStorage
function saveEntriesToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(volunteerEntries));
}

// Calculate total hours volunteered
function calculateTotalHours() {
  return volunteerEntries.reduce((sum, e) => sum + Number(e.hours), 0);
}

// Update Summary
function updateSummary() {
  const summaryDiv = document.getElementById("summary");
  if (summaryDiv) {
    summaryDiv.textContent = `Total Volunteer Hours: ${calculateTotalHours()}`;
  }
}

// Update summary section with total hours
function renderTable() {
  const tbody = document.querySelector("#volunteerTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  volunteerEntries.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.charityName}</td>
      <td>${entry.date}</td>
      <td>${entry.hours}</td>
      <td>${entry.rating}</td>
    `;
    tbody.appendChild(row);
  });
  const summary = document.getElementById("summary");
  if (summary) {
    summary.textContent = `Total Volunteer Hours: ${calculateTotalHours()}`;
  }
}

// Delete a volunteer entry by index
 function deleteLog(index) {
  volunteerEntries.splice(index, 1);
  saveEntriesToStorage();
  renderTable();
}

// Initialize form event listener
function initVolunteerForm(formId = "volunteer-form") {
  const form = document.getElementById(formId);
  if (!form) {
    console.warn(`Volunteer form with id="${formId}" not found.`);
    return;
  }

  // Attach submit handler
  form.addEventListener("submit", handleVolunteerSubmit);

  //Attach input listeners to clear errors automatically
  document.querySelectorAll("#volunteer-form input").forEach((input) => {
    input.addEventListener("input", () => {
      clearErrorSpans();
    });
  });
}

// Initialize localStorage
function initVolunteerTracker() {
  syncEntriesFromStorage();
  renderTable();
  initVolunteerForm();

  const table = document.getElementById("volunteerTable");
  if (table) {
    table.addEventListener("click", (e) => {
      if (e.target.classList.contains("deleteBtn")) {
        const index = e.target.dataset.index;
        deleteLog(Number(index));
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", initVolunteerTracker)

// Export for Jest (CommonJS) but keep browser compatibility.
module.exports = {
  validateVolunteerData,
  buildVolunteerEntry,
  handleVolunteerSubmit,
  volunteerEntries,
  saveEntriesToStorage,
  syncEntriesFromStorage,
  renderTable,
  calculateTotalHours,
  deleteLog,
};
