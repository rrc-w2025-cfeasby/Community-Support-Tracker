const validateSurveyForm = () => {
    let isValid = true;

    // Name
    const name = document.getElementById('name');
    if (!isNotEmpty(name)) {
        showError('name', 'Name is required.');
        isValid = false;
    }
    // Date
    const dateInput = document.getElementById('date');
    if (!isNotEmpty(dateInput)) {
        showError('date', 'Date is required.');
        isValid = false;
    } else if (!validateDateFormat(dateInput.value)) {
        showError('date', 'Date must be in YYYY-MM-DD format.');
        isValid = false;
    }
    // Hours Volunteered
    const hoursInput = document.getElementById('hours');
    if (!isNotEmpty(hoursInput)) {
        showError('hours', 'Hours volunteered is required.');
        isValid = false;
    } else if (!isPositiveNumber(hoursInput.value)) {
        showError('hours', 'Hours volunteered must be a positive number.');
        isValid = false;
    }
    // Rating
    const ratingInputs = document.getElementsByName('rating');
    if (!isRadioSelected(ratingInputs)) {
        showError('rating', 'Please select a rating.');
        isValid = false;
    }

    return isValid;
}
