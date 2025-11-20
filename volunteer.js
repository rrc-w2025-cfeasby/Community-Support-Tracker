/* Volunteer Form Validation Script */

// Object to hold form field values
const volunteerEntries = [];

// Current field values
const fields = {
    charityName: '',
    date: '',
    hours: '',
    rating: ''
};
// Helper functions
const getSelectedRadioValue = (radioNodeList) => {
    for (const radio of radioNodeList) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
};

const showError = (charityName, message) => {
    const errorField = document.getElementById(`${charityName}_error`);
    if (!errorField) {
        console.error(`Error field '${charityName}_error' not found.`);
        return;
    }
    errorField.textContent = message;
    errorField.classList.add("error-visible");
};


const clearAllErrors = () => {
    document.querySelectorAll(".error-message").forEach((el) => {
        el.textContent = "";
        el.classList.remove("error-visible");
    });
};

// Make inputs clear their own error as the user types/changes
const setupLiveErrorClearing = () => {
    document.querySelectorAll("input, select, textarea").forEach((el) => {
        const key = el.name || el.id;
        if (!key) return;

        el.addEventListener("input", () => {
            const errorField = document.getElementById(`${key}_error`);
            if (errorField) {
                errorField.textContent = "";
                errorField.classList.remove("error-visible");
            }
        });

        el.addEventListener("change", () => {
            const errorField = document.getElementById(`${key}_error`);
            if (errorField) {
                errorField.textContent = "";
                errorField.classList.remove("error-visible");
            }
        });
    });
};

// Simple value helpers (now they work with strings, not elements)
const isNotEmpty = (value) => value && value.trim() !== "";
const isPositiveNumber = (value) => !isNaN(value) && Number(value) > 0;
const isValidRating = (value) => !isNaN(value) && Number.isInteger(Number(value));
const isRadioSelected = (value) => value !== null;
const isAlphabetic = (str) => /^[A-Za-z\s]+$/.test(str);
const isLengthInRange = (str, min, max) => str.length >= min && str.length <= max;
const validateDateFormat = (dateString) => /^\d{4}-\d{2}-\d{2}$/.test(dateString);

const updateFieldsFromForm = () => {
    fields.charityName = document.getElementById("charityName").value;
    fields.date = document.getElementById("date").value;
    fields.hours = document.getElementById("hours").value;

    const ratingInputs = document.getElementsByName("rating");
    fields.rating = getSelectedRadioValue(ratingInputs);
};

const validateVolunteerForm = () => {
    let isValid = true;

    // Charity Name
    if (!fields.charityName || fields.charityName.trim() === "")  {
        showError('charityName', 'Charity name is required.');
        isValid = false;
    } else if (!isAlphabetic(fields.charityName)) {
        showError('charityName', 'Charity name must contain only alphabetic characters and spaces.');
        isValid = false;
    } else if (!isLengthInRange(fields.charityName, 2, 50)) {
        showError('charityName', 'Charity name must be between 2 and 50 characters long.');
        isValid = false;
    }

    // Date
    
    if (!isNotEmpty(fields.date)) {
        showError('date', 'Date is required.');
        isValid = false;
    } else if (!validateDateFormat(fields.date)) {
        showError('date', 'Date must be in YYYY-MM-DD format.');
        isValid = false;
    }
    // Hours Volunteered
    
    if (!isNotEmpty(fields.hours)) {
        showError('hours', 'Hours volunteered is required.');
        isValid = false;
    } else if (!isPositiveNumber(fields.hours)) {
        showError('hours', 'Hours volunteered must be a positive number.');
        isValid = false;
    } else if ((Number(fields.hours) > 24) || (Number(fields.hours) <= 0)) {
        showError('hours', 'Hours volunteered must be between 0 and 24.');
        isValid = false;
    }

    // Rating

    if (!isRadioSelected(fields.rating)) {
        showError('rating', 'Please select a rating.');
        isValid = false;
    } else if (!isValidRating(fields.rating)) {
        showError('rating', 'Invalid rating selected.');
        isValid = false;
    } else if (fields.rating < 1 || fields.rating > 5) {
        showError('rating', 'Rating must be between 1 and 5.');
        isValid = false;
    }


    return isValid;
}

// Live update of rating display

document.querySelectorAll('input[name="rating"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.getElementById('rating_error').textContent = 
        `You selected ${radio.value} star(s).`;
    });
  });

// Main form submission handler

document.addEventListener("DOMContentLoaded", () => {
    const volunteerForm = document.getElementById("volunteer-form");
    if (!volunteerForm) {
        console.error("volunteer-form not found");
        return;
    }

    setupLiveErrorClearing();

    volunteerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        clearAllErrors();

        // Read the form into `fields`
        updateFieldsFromForm();

        if (validateVolunteerForm()) {
            // Build a normalized entry object
            const entry = {
                charityName: fields.charityName.trim(),
                date: fields.date,
                hours: Number(fields.hours),
                rating: Number(fields.rating)
            };

            // Store it temporarily
            volunteerEntries.push(entry);

            console.log("Form submitted successfully.", entry);
            console.log("All volunteer entries:", volunteerEntries);

            // Optionally reset the form
            volunteerForm.reset();
        } else {
            console.log("Form submission missed some fields.");
        }
    });
});
export { 
    volunteerEntries,
    validateVolunteerForm,
    updateFieldsFromForm,
    isNotEmpty,
    isPositiveNumber,
    isValidRating,
    isRadioSelected,
    isAlphabetic,
    isLengthInRange,
    validateDateFormat,
    showError,
    clearAllErrors,
    setupLiveErrorClearing

};