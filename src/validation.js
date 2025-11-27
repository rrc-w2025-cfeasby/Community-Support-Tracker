function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validateRequiredFields({ eventName, repName, repEmail, role }) {
    const errors = {};

    if (!eventName?.trim()) errors.eventName = 'Event Name is required.';
    if (!repName?.trim()) errors.repName = "Representative's Name is required.";
    if (!repEmail?.trim() || !validateEmail(repEmail)) {
    errors.repEmail = "A valid Representative's Email is required.";
    }
    if (!role) errors.role = 'Role selection is required.';

    return errors;
}

function processFormData({ eventName, repName, repEmail, role }) {
    return {
    eventName: eventName.trim(),
    repName: repName.trim(),
    repEmail: repEmail.trim(),
    role,
    };
}

module.exports = { validateEmail, validateRequiredFields, processFormData };