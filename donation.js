/**
 * Community Support Project
 * Donation Details
 * Nov 20th, 2025   Kang Ye
 */
console.log('[donation.js] file loaded');
window.addEventListener('error', e => console.error('Global error:', e.message, e.filename, e.lineno));
// Load all records
function loadRecords() {
    return JSON.parse(localStorage.getItem("donationRecords")) || [];
}

// Save a single record
function saveRecord(record) {
    const records = loadRecords();
    records.push(record);
    localStorage.setItem("donationRecords", JSON.stringify(records));
}

// Delete record by index
function deleteRecord(index) {
    const records = loadRecords();
    records.splice(index, 1);
    localStorage.setItem("donationRecords", JSON.stringify(records));
}

// Get form values
function getFormData() {
    return {
        charityName: document.getElementById("charityname").value.trim(),
        donationAmount: Number(document.getElementById("donationamount").value.trim()),
        donationDate: document.getElementById("donationdate").value.trim(),
        donorComment: document.getElementById("donorcomment").value.trim() || "(No comment)"
    };
}

// Validate
function validateForm(data) {
    const errors = [];

    if (!data.charityName) errors.push({field: "charityname", message: "Charity Name is required."});
    if (!data.donationAmount || data.donationAmount <= 0)
        errors.push({field:"donationamount", message:"Donation amount must be positive."});
    if (!data.donationDate)
        errors.push({field: "donationdate", message:"Date is required."});

    return errors;
}

// Render table
function renderDonationTable(){
    const records = loadRecords();
    const tbody = document.querySelector("#donation-table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    records.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${item.charityName}</td>
        <td>$${Number(item.donationAmount).toFixed(2)}</td>
        <td>${item.donationDate}</td>
        <td>${item.donorComment}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
        `;

        tbody.appendChild(row);
    });
}

// Render Card View
function renderDonationCards() {
    const records = loadRecords();
    const container = document.getElementById("records");
    container.innerHTML= "";

    if (records.length === 0) {
        container.innerHTML = "<p> No donation records yet. </p>";
        return;
    }

    records.forEach((item, index)=> {
        const card = document.createElement("div");
        card.className = "donation-card";

        card.innerHTML = `
        <h3>${item.charityName}</h3>
        <p><strong>Amount:</strong> $${item.donationAmount.toFixed(2)}</p>
        <p><strong>Date:</strong>${item.donationDate}</p>
        <p><strong>Comment:</strong>${item.donorComment}</p>
        <button class="delete-btn" data-index="${index}">Delete</button>
        `;

        container.appendChild(card);

    });
 }

// Error Handling
// Clear errors
function clearErrors() {
        document.querySelectorAll(".error-msg").forEach(e =>e.remove());
        document.querySelectorAll(".input-error").forEach(e =>e.classList.remove("input-error"));
    }

// Show errors besides the input
function showErrors(errors) {
    errors.forEach(err => {
        const field =document.getElementById(err.field)

        // Add red border of errors
        field.classList.add("input-error");

        // Create hint information
        const msg = document.createElement("div");
        msg.className = "error-msg";
        msg.textContent = err.message;

        field.parentElement.appendChild(msg);
    });
}

function scrollToFirstError() {
        const firstError = document.querySelector(".input-error");
        if (firstError) {
            firstError.scrollIntoView({behavior: "smooth", block: "center"});
        }
    }

// The connection to Webpage executed after DOM
function initApp() {
    renderDonationTable();
    renderDonationCards();
    console.log('[initApp] running')


    const form = document.getElementById("donation_main");
    form.addEventListener('submit', e => {
            e.preventDefault();
            clearErrors();

            const data = getFormData();
            const errors = validateForm(data);

            if (errors.length > 0) {
                showErrors(errors);
                scrollToFirstError();
                return;
            }

            saveRecord(data);
            renderDonationTable();
            renderDonationCards();
            form.reset();

        });

    // Event delegation for delete buttons (table + cards)
    document.addEventListener("click", e => {
        if (e.target.classList.contains("delete-btn")) {
            const index = Number(e.target.dataset.index);
            deleteRecord(index);
            renderDonationTable();
            renderDonationCards();
        }
    });

        // Menu toggle
        const toggle = document.getElementById("menu-toggle");
        const nav = document.getElementById("navbar");
        if (toggle && nav) {
            toggle.addEventListener("click", () =>
            nav.classList.toggle("open"));
        }
    }

// Export for Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadRecords,
    saveRecord,
    deleteRecord,
    validateForm,
    getFormData,
  };
}
initApp();