/**
 * Community Support Project
 * Donation Details
 * Nov 20th, 2025   Kang Ye
 */

// Validation of form

function validateForm(data) {
    const {charityName, donationAmount, donationDate} = data;

    let errors = [];

    if (!charityName) errors.push({field: "charityname", message: "Charity Name is required."});

    if (!donationAmount || !isFinite(donationAmount) || Number(donationAmount) <= 0)
        errors.push({field: "donationamount", message: "Donation Amount must be a valid number greater than 0."});

    if (!donationDate)
        errors.push({field: "donationdate", message: "Date of Donation is required"});

    return errors;
}


// Collect form data

function getFormData() {
    return {
        charityName: document.getElementById("charityname").value.trim(),
        donationAmount: Number(document.getElementById("donationamount").value.trim()),
        donationDate: document.getElementById("donationdate").value.trim(),
        donorComment: document.getElementById("donorcomment").value.trim() || "(No comment)"
    };
}

// Save to local storage
function saveToLocalStorage(data) {
    let records = JSON.parse(localStorage.getItem("donationRecords")) || [];
    records.push(data);
    localStorage.setItem("donationRecords", JSON.stringify(records));
}

// Show donation records on webpage
function renderDonationCards() {
    let records = JSON.parse(localStorage.getItem("donationRecords"))

    const container = document.getElementById("records");
    if (!container) return;

    container.innerHTML = "";

    // No records
    if (records.length === 0) {
        container.innerHTML = "<p> No donation records yet. </p>";
        return;
    }

    records.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "donation-card";

        card.innerHTML = `
        <h3> ${item.charityName}</h3>
        <div class="card-field"><span class="card-label">Amount:</span> ${item.donationAmount}</div>
        <div class="card-field"><span class="card-label">Date:</span> ${item.donationDate}</div>
        <div class="card-field"><span class="card-label">Comment:</span> ${item.donorComment}</div>
        <button class="delete-btn" onclick="deleteRecord(${index})">Delete</button>
        `;

        container.appendChild(card);
    });
}

// Delete records
function deleteRecord(index) {
    let records = JSON.parse(localStorage.getItem("donationRecords")) || [];
    records.splice(index, 1);
    localStorage.setItem("donationRecords", JSON.stringify(records));
    renderDonationCards();
}


// Show errors besides the input
function showErrors(errors) {
    errors.forEach(err => {
        const field =document.getElementById(err.field);
        if (!field) return;

        // Add red border of errors
        field.classList.add("input-error");

        // Create hint information
        const message = document.createElement("div");
        message.className = "error-msg";
        message.textContent = err.message;

        field.parentElement.appendChild(message);
    });
}

// Clear errors
function clearErrors() {
        document.querySelectorAll(".error-msg").forEach(e =>e.remove());
        document.querySelectorAll(".input-error").forEach(e =>e.classList.remove("input-error"));
    }

function scrollToFirstError() {
        const firstError = document.querySelector(".input-error");
        if (firstError) {
            firstError.scrollIntoView({behavior: "smooth", block: "center"});
        }
    }

// The connection to Webpage executed after DOM
function initApp() {
    renderDonationCards();

    const form = document.querySelector("form");
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            clearErrors();

            const data = getFormData();
            const errors = validateForm(data);
            if (errors.length) {
                showErrors(errors);
                scrollToFirstError();
                return;
            }

            saveToLocalStorage(data);
            renderDonationCards();
            form.reset();
        });

        document.addEventListener("click", e => {
            if (e.target.classList.contains("delete-btn")) {
                const index = Number(e.target.dataset.index);
                deleteRecord(index);
            }
        });

        const toggle = document.getElementById("menu-toggle");
        const nav = document.getElementById("navbar");
        if (toggle && nav) {
            toggle.addEventListener("click", () =>
            nav.classList.toggle("open"));
        }
    }
}

if (typeof window !=="undefined" && window.document) {
    document.addEventListener("DOMContentLoaded", initApp)
    }


// Export for test
module.exports = {
    validateForm,
    saveToLocalStorage,
    renderDonationCards,
    deleteRecord,
    getFormData
};

