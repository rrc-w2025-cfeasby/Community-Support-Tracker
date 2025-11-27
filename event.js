/**
 *  Front End - Final Project
 * 
 *  Student 3: Chris Feasby
 *  Event Signup Form
 * 
 *  Nov 20, 2025
 * 
 */

/**
 * Show the Error on the form
 * 
 * @param {string} id - the specific id coming in
 * @param {string} message - the message for that id
 */
function showError(id, message){
    const errorDiv = document.getElementById(`${id}_error`);
    if(errorDiv){
        errorDiv.textContent = message;
    }else{
        console.warn(`Missing error container for: ${id}_error`);
    }    
}

/**
 * Clear the errors on the form
 * 
 */
function clearErrors(){
    ['event_name', 'rep_name', 'rep_email', 'role'].forEach(id => {
        const errorDiv = document.getElementById(`${id}_error`);
        if(errorDiv){
            errorDiv.textContent = '';   
        }
    });
}

/**
 * Validate Email functionality 
 * 
 * @param {string} email - the email being send to be validated
 * @returns a valid email
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Validate Field functionality
 * 
 * @param {string} id - the id that is passed in 
 */
function validateField(id) {
    const value = document.getElementById(id).value.trim();
    const errorDiv = document.getElementById(`${id}_error`);

    const messages = {
        event_name: 'Event Name is required.',
        rep_name: "Representative's Name is required.",
        rep_email: "A valid Representative's Email is required.",
        role: `Role selection is required.`
    };

    if(!errorDiv) return;

    if(id === 'rep_email'){
        if(!value || !validateEmail(value)){
            errorDiv.textContent = messages[id];
        } else {
            errorDiv.textContent = '';
        }
    } else {
        if(!value){
            errorDiv.textContent = messages[id];
        } else {
            errorDiv.textContent = '';
        }
    }
}

function validateForm(){
    const eventName = document.getElementById('event_name').value.trim();
    const repName = document.getElementById('rep_name').value.trim();
    const repEmail = document.getElementById('rep_email').value.trim();
    const role = document.getElementById('role').value;
    const feedbackDiv = document.getElementById('form-feedback');

    const isValid = eventName && repName && validateEmail(repEmail) && role;

    if(isValid){
        feedbackDiv.innerHTML = '';
    }
}

/**
 * Handle the Form Submit
 * 
 * @param {event} event - The event processed
 * @returns 
 */
function handleFormSubmit(event) {
    event.preventDefault();

    // Collect form data
    const eventName = document.getElementById('event_name').value.trim();
    const repName = document.getElementById('rep_name').value.trim();
    const repEmail = document.getElementById('rep_email').value.trim();
    const role = document.getElementById('role').value;

    // Clear previous errors
    clearErrors();

    let hasErrors = false;
    
    if(!eventName) {
        showError('event_name', 'Event Name is required.');
        hasErrors = true;
    }
    if(!repName) {
        showError('rep_name', "Representative's Name is required.");
        hasErrors = true;
    }
    if(!repEmail || !validateEmail(repEmail)) {
        showError('rep_email', "A valid Representative's Email is required.");
        hasErrors = true;
    }
    if(!role) {
        showError('role', 'Role selection is required.');
        hasErrors = true;
    }

    const feedbackDiv = document.getElementById('form-feedback');
    feedbackDiv.innerHTML = '';

    if(hasErrors) {
        const p = document.createElement('p');
        p.textContent = 'Please correct the errors above.';

        p.style.color = 'red';
        feedbackDiv.appendChild(p);
        return;
    }

    // Store in temporary object
    const tempData = {
        eventName,
        repName,
        repEmail,
        role
    };

    console.log("Form Submitted:", tempData);
    
    const p = document.createElement('p');
    p.textContent = 'Form submitted successfully!';
    p.style.color = 'green';
    feedbackDiv.appendChild(p);
}

/**
 * DOMContentLoaded functionality
 */
document.addEventListener('DOMContentLoaded', () => {
    const fields = ['event_name', 'rep_name', 'rep_email', 'role'];

    fields.forEach(id => {
        const input = document.getElementById(id);
        if(input){
            input.addEventListener('input', () => {
                validateField(id);
                validateForm();
            });
        }
    });

    const form = document.getElementById('signup-form');
    form.addEventListener('submit', handleFormSubmit);
});
