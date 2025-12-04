// Community-Support-Tracker/volunteer.js

const STORAGE_KEY = "volunteerEntries";
// In-memory temporary data store
const volunteerEntries = [];


// LocalStorage helpers
 function localEntriesStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    return[];
  }

  try {
    const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
  } catch  {
    return [];
  }
}

// Save in-memory entries to localStorage
function saveEntriesToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(volunteerEntries));
}

// Calculate total hours volunteered
function calculateTotalHours() {
  return volunteerEntries.reduce(
    (sum, entry) => sum + Number(entry.hoursVolunteered || 0), 0);
}

// Update Summary
function updateSummary() {
  const total = calculateTotalHours();
  const summaryDiv = document.getElementById("summary");
  if (summaryDiv) {
    summaryDiv.textContent = `Total Volunteer Hours: ${total}`;
  }
}

// Update summary section with total hours
function renderTable() {
  const tbody = document.querySelector("#volunteerTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  volunteerEntries.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.charityName}</td>
      <td>${entry.hours}</td>
      <td>${entry.date}</td>
      <td>${entry.rating}</td>
      <td><button data-index="${index}" class="deleteBtn">Delete</button></td>
    `;
    tbody.appendChild(row);
  });

  updateSummary();
}


// Delete a volunteer entry by index
 function deleteLog(index) {
  volunteerEntries.splice(index, 1);
  saveEntriesToStorage();
  renderTable();
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
  const form = event.target

  const charityName = form.querySelector("#charityName");
  const hours = form.querySelector("#hours");
  const date = form.querySelector("#date");
  const rating = form.querySelectorAll("input[name='rating']");

  if (!charityName || !hours || !date || !rating){
    return;
  }
   const entry = { 
    id: Date.now(),
    charityName,
    hours: Number(hours),
    date,
    rating: Number(ratingValue),
  };
  volunteerEntries.push(entry);
  saveEntriesToStorage();
  renderTable();
  form.reset();
};

// Get selected rating value
  let ratingValue = "";
  rating.forEach((input) => {
    if (input.checked) {
      ratingValue = input.value;
    }
  });

// Initialize localStorage
function initVolunteerTracker() {
  volunteerEntries = localEntriesStorage();
  renderTable();
  const form =document.getElementById("volunter-form");
  if (table) {
    table.addEventListener("click", (e) => {
      if (e.target.classList.contains("deleteBtn")) {
        deleteLog(Number(index));
      }
    })
  }
}


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

    if (!spanId) return;
    const span = document.getElementById(spanId);
    if (!span) return;

    span.textContent = msg;
    span.hidden = false;
  });
}


  
  // Validate
  const errors = validateVolunteerData(rawData);

  if (errors.length > 0) {
    showValidationErrors(errors);
    return;
  }

  // If valid, clear any old errors
  clearErrorSpans();


//  Wire up the form submit handler.
function initVolunteerForm(formId = "volunteer-form") {
  const form = document.getElementById(formId);
  if (!form) {
    console.warn(`Volunteer form with id="${formId}" not found.`);
    return;
  }

  form.addEventListener("submit", handleVolunteerSubmit);
}

// Initialize the volunteer tracker app
function initVolunteerTracker() {
  syncEntriesFromStorage();
  renderTable();
  initVolunteerForm();
}

document.addEventListener("DOMContentLoaded", initVolunteerTracker)
// Export for Jest (CommonJS) but keep browser compatibility.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateTotalHours,
    deleteLog,
    validateVolunteerData,
    buildVolunteerEntry,
    handleVolunteerSubmit,
    initVolunteerForm,
    saveEntriesToStorage,
    renderTable,
  };
}