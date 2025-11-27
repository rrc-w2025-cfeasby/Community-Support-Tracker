/**
 * @jest-environment jsdom
 */

const { validateForm, saveToLocalStorage, getFormData } = require("./script1");

describe("Form validation", () => {
    beforeEach(() => {
        document.body.innerHTML =`
        <input id="charityname" value="Alice Smith" />
        <input id="donationamount" value="100" />
        <input id="donationdate" value="2025-11-20" />
        <input id="donorcomment" value="Good cause" />
        `;
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
    });
});

describe("LocalStorage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("saveToLocalStorage stores donation record", () => {
        const data = {
            charityName: "Alice Smith",
            donationAmount: 100,
            donationDate:"2025-11-20",
            donorComment: "Good cause"
        };
        saveToLocalStorage(data);

        const records = JSON.parse(localStorage.getItem("donationRecords"));
        expect(records.length).toBe(1);
        expect(records[0].charityName).toBe("Alice Smith");
    });
});