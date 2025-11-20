/* Volunteer Form Validation Script */

// Object to hold form field values
const volunteerEntries = [];

// Form validation function
function validateVolunteerData({ charityName, hoursVolunteered, date, rating }) {
  const errors = [];

  // Required fields
  if (!charityName || charityName.trim() === "") {
    errors.push("Charity Name is required.");
  }
  if (!hoursVolunteered || hoursVolunteered.toString().trim() === "") {
    errors.push("Hours Volunteered is required.");
  }
  if (!date || date.trim() === "") {
    errors.push("Date is required.");
  }
  if (!rating || rating.toString().trim() === "") {
    errors.push("Volunteer Experience Rating is required.");
  }

  // Hours: positive number
  const hoursNum = Number(hoursVolunteered);
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

function buildVolunteerEntry({ charityName, hoursVolunteered, date, rating }) {
  return {
    id: Date.now(), // simple unique-ish ID
    charityName: charityName.trim(),
    hours: Number(hoursVolunteered),
    date,                      
    rating: Number(rating),
  };
}

//show error summary
function showErrors(errors) {
  const errorList = document.getElementById("volunteer-errors");
  if (!errorList) return;

  // Clear previous errors
  errorList.innerHTML = "";

  if (errors.length === 0) {
    errorList.style.display = "none";
    return;
  }

  errors.forEach((msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    errorList.appendChild(li);
  });

  errorList.style.display = "block";
}

function handleVolunteerSubmit(event) {
  event.preventDefault(); // 1. Stop form from reloading the page

  const form = event.target;

  // 2. Collect data
  const charityNameInput = form.querySelector("#charityName");
  const hoursInput       = form.querySelector("#hoursVolunteered");
  const dateInput        = form.querySelector("#volunteerDate");
  const ratingInput      = form.querySelector("#experienceRating");

  const rawData = {
    charityName: charityNameInput?.value ?? "",
    hoursVolunteered: hoursInput?.value ?? "",
    date: dateInput?.value ?? "",
    rating: ratingInput?.value ?? "",
  };

  // 3. Validate
  const errors = validateVolunteerData(rawData);
  showErrors(errors);

  if (errors.length > 0) {
    // 4. If errors, do not store anything
    return;
  }

  // 5. Build normalized entry and store
  const entry = buildVolunteerEntry(rawData);
  volunteerEntries.push(entry);

  // 6. Clear the form after success (optional)
  form.reset();
}

// Initialization function to set up event listeners
 function initVolunteerForm(formId = "volunteer-form") {
  const form = document.getElementById(formId);
  if (!form) {
    console.warn(`Volunteer form with id="${formId}" not found.`);
    return;
  }

  form.addEventListener("submit", handleVolunteerSubmit);
}

export {
  volunteerEntries,
  validateVolunteerData,
  buildVolunteerEntry,
  handleVolunteerSubmit,
  initVolunteerForm,
};
