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
 * displaySignups - Displays signups in the table
 * @param {Array} signups - Array of signup objects
 * Each object should have: { eventName, participantName, email, role }
 */
function displaySignups(signups){
    const tableBody = document.querySelector("#signup-table tbody");

    // Clear previous rows
    tableBody.innerHTML = "";

    // Render each signup
    signups.forEach(({ eventName, participantName, email, role }) => {
        const row = document.createElement("tr");

        const eventCell = document.createElement("td");
        eventCell.textContent = eventName;
        eventCell.setAttribute("data-label", "Event Name");

        const nameCell = document.createElement("td");
        nameCell.textContent = participantName;
        nameCell.setAttribute("data-label", "Participant Name");

        const emailCell = document.createElement("td");
        emailCell.textContent = email;
        emailCell.setAttribute("data-label", "Email");

        const roleCell = document.createElement("td");
        roleCell.textContent = role;
        roleCell.setAttribute("data-label", "Role");

        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteCell.setAttribute("data-label", "Delete");

        row.appendChild(eventCell);
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(roleCell);
        row.appendChild(deleteCell);

        tableBody.appendChild(row);
    });
}

/**
 * saveSignup - Saves a signup to localStorage
 * @param {Object} signup - The signup object
 * { eventName, participantName, email, role }
 */
function saveSignup(signup){
    if(!signup || !signup.eventName || !signup.participantName || !signup.email || !signup.role) return;

    // Get existing signups from localStorage
    const storedSignups = JSON.parse(localStorage.getItem("eventSignups")) || [];

    // Add new signup
    storedSignups.push(signup);

    // Save back to localStorage
    localStorage.setItem("eventSignups", JSON.stringify(storedSignups));
}

/**
 * loadSignups - Load signups from localStorage
 * @returns {Array} signups
 */
function loadSignups(){
    return JSON.parse(localStorage.getItem("eventSignups")) || [];
}

/**
 * updateSummary - Updates the upcoming events summary by role
 */
function updateSummary(){
    const summaryDiv = document.getElementById("summary-content");
    summaryDiv.innerHTML = "";

    const signups = loadSignups();

    // Count signups by role
    const roleCounts = {};
    signups.forEach(({ role }) => {
        if (!roleCounts[role]) {
            roleCounts[role] = 0;
        }
        roleCounts[role]++;
    });

    // Render summary
    if(signups.length === 0){
        summaryDiv.textContent = "No signups yet.";
        returns;
    }

    const list = document.createElement("ul");
    Object.entries(roleCounts).forEach(([role, count]) => {
        const li = document.createElement("li");
        li.textContent = `${role}: ${count}`;
        list.appendChild(li);
    });

    summaryDiv.appendChild(list);
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

        p.style.color = "#d32f2f";
        feedbackDiv.appendChild(p);
        return;
    }

    // Save signup to localStorage
    const signup = {
        eventName,
        participantName: repName,
        email: repEmail,
        role
    };
    saveSignup(signup);

    // Store in temporary object
    const tempData = {
        eventName,
        repName,
        repEmail,
        role
    };

    console.log("Form Submitted:", tempData);

    // Refresh table
    displaySignups(loadSignups());
    updateSummary();
    
    const p = document.createElement('p');
    p.textContent = 'Form submitted successfully!';
    p.style.color = 'green';
    feedbackDiv.appendChild(p);

    // Clear form
    event.target.reset();

    // Wait 3 seconds and clear the feedbackDiv
    setTimeout(() => {
        feedbackDiv.innerHTML = "";
    }, 3000);
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

    // Load persisted signups into table on page load
    displaySignups(loadSignups());

    updateSummary();
});
