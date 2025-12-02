/**
 * @jest-environment jsdom
 */

// Load application code
const {
    validateForm,
    saveRecord,
    getFormData,
    loadRecords,
    renderDonationTable,
    initApp
} =require('./donation.js');

// Helper to build form inputs
function buildForm(vals) {
    document.body.innerHTML = `
    <input id="charityname" value="${vals.charityName || ''}" />
    <input id="donationamount" value="${vals.donationAmount || ''}" />
    <input id="donationdate" value="${vals.donationDate || ''}" />
    <textarea id="donorcomment">${vals.donorComment || ''}</textarea>

    <form id="donation_main"></form>

    <div id="records"></div>
    <table id="donation-table"><tbody></tbody></table>
    <p id="total-amount"></p>

    <button id="menu-toggle"></button>
    <nav id="navbar"></nav>
    `;
}

// Unit Test of Stage one

// Stage 1: For Validation
describe("Form validation", () => {
    beforeEach(() => {
        buildForm({
            charityName: "Alice Smith",
            donationAmount: "100",
            donationDate: "2025-11-20",
            donorComment: "Good cause"
        });
    });

    test("valid form returns empty errors", () => {
        const data = getFormData();
        const errors = validateForm(data);
        expect(errors).toEqual([]);
    });

    test("missing charity name returns error", () => {
        document.getElementById("charityname").value = "";
        const data = getFormData();
        const errors = validateForm(data);
        expect(errors[0].message).toBe("Charity Name is required.");
        expect(errors.find(e => e.field === "charityname").message).toBe("Charity Name is required.");
    });

    test ("negative donation amount returns error", () => {
        document.getElementById("donationamount").value = "-50";
        const data = getFormData();
        const errors = validateForm(data);
        expect(errors.some(e => e.field === "donationamount")).toBe(true);
    });

    test ("missing donation date returns error", () => {
        document.getElementById("donationdate").value = "";
        const data = getFormData();
        const errors = validateForm(data);
        expect(errors.some(e => e.field === "donationdate")).toBe(true);
    });
});

// Stage 1: LocalStorage
describe("LocalStorage", () => {
    beforeEach(() => {localStorage.clear();});

    test("saveRecord stores donation record", () => {
        const data = {
            charityName: "Alice Smith",
            donationAmount: 100,
            donationDate:"2025-11-20",
            donorComment: "Good cause"
        };

        saveRecord(data);

        const stored = JSON.parse(localStorage.getItem("donationRecords"));
        expect(stored.length).toBe(1);
        expect(stored[0].charityName).toBe("Alice Smith");
        expect(stored[0].donationAmount).toBe(100);
    });

    test("loadRecords returns empty array when nothing stored", () => {
        localStorage.clear();
        const records = loadRecords();
        expect(records).toEqual([]);
    });
});

// Stage 1: Edge Case Validation
describe('validateForm(unit)-edge cases', () => {
    test('flags negative or zero amount', () => {
        const bad = {
            charityName: 'A',
            donationAmount: -10,
            donationDate: '2026-01-01'
        };
        const errors = validateForm(bad);
        expect(errors.some(e => e.field === 'donationamount')).toBe(true);
    });
});

// Stage 1: getFormData
describe("getFormData(unit)", () => {
    test("returns correct temp object from DOM inputs", () => {
        buildForm({
            charityName: 'Hope',
            donationAmount: '120.5',
            donationDate:'2025-12-01',
            donorComment: 'Go go'
        });

        const data = getFormData();
        expect(data.charityName).toBe('Hope');
        expect(data.donationAmount).toBe(120.5);
        expect(data.donationDate).toBe('2025-12-01');
    });
});

// Stage 1: Form Submission Integration
describe("Form submission integration", () => {
    beforeEach(() => localStorage.clear());

    test("Valid submission updates localStorage", () => {
        buildForm({
            charityName:'Unity',
            donationAmount: '200',
            donationDate:'2025-12-01'
        });

        const data = getFormData();
        saveRecord(data);

        expect(loadRecords()).toHaveLength(1);
        expect(loadRecords()[0].donationAmount).toBe(200);
    });

    test("Invalid submission produces errors", () => {
        buildForm({
            charityName: '',
            donationAmount: '',
            donationDate: ''
        });

        const errors = validateForm(getFormData());
        expect(errors.length).toBeGreaterThan(0);
    });
});


// Unit test of Stage Two
// Stage 2: renderDonationTable
describe("renderDonationTable", () => {
    beforeEach(() => {
        document.body.innerHTML = `
        <table id="donation-table"><tbody></tbody></table>
        <div id="records"></div>
        <button id="menu-toggle"></button>
        <nav id="navbar"></nav>
        `;

        // input two test records to LocalStorage
        localStorage.setItem("donationRecords", JSON.stringify([
            {
                charityName: 'A',
                donationAmount: 50,
                donationDate:"2026-01-01",
                donorComment: 'Test A'
            },
            {
                charityName: 'B',
                donationAmount: 75,
                donationDate:'2025-12-24',
                donorComment: 'Test B'
            }
        ]));
    });

    test("renders donation records into DOM", () => {
        renderDonationTable();
        const rows = document.querySelectorAll("#donation-table tbody tr");
        expect(rows.length).toBe(2);   // Must match 2 records
        expect(rows[0].querySelector("td").textContent).toBe('A');
    });
});

//Stage 2: initApp
describe("initApp", () => {
    beforeEach(() => {localStorage.clear(); });

    test("Loads records and renders table, cards, and total", () => {
        document.body.innerHTML = `
        <table id="donation-table"><tbody></tbody></table>
        <div id="records"></div>
        <p id="total-amount"></p>
        <form id="donation_main"></form>

        <button id="menu-toggle"></button>
        <nav id="navbar"></nav>
        `;

        // Save one date to localStorage
        localStorage.setItem("donationRecords", JSON.stringify([
            {
                charityName: 'Init',
                donationAmount: 100,
                donationDate: '2025-12-01',
                donorComment:''
            }
    ]));

        initApp();

        // Table rows
        expect(document.querySelectorAll('#donation-table tbody tr')).toHaveLength(1);
        expect(document.querySelector('#records').children.length).toBe(1);
        expect(document.querySelector('#total-amount').textContent).toBe('$100.00');
    });
});
