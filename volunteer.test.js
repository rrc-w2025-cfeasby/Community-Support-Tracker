
/**
 * @jest-environment jsdom
 */
const {
  validateVolunteerData,
  buildVolunteerEntry,
  handleVolunteerSubmit,
  volunteerEntries,
  syncEntriesFromStorage,
  renderTable,
  saveEntriesToStorage,
  calculateTotalHours,
  deleteLog,
} = require("./volunteer.js");



// Build DOM that matches volunteer.html
function setupDOM() {
  document.body.innerHTML = `
    <form id="volunteer-form">
      <input type="text" id="charityName" name="charityName" />
      <span id="charityName_error" hidden></span>

      <input type="date" id="date" name="date" />
      <span id="date_error" hidden></span>

      <input type="number" id="hours" name="hours" />
      <span id="hours_error" hidden></span>

      <div class="star-rating">
        <input type="radio" id="star1" name="rating" value="1">
        <label for="star1">★</label>
        <input type="radio" id="star2" name="rating" value="2">
        <label for="star2">★</label>
        <input type="radio" id="star3" name="rating" value="3">
        <label for="star3">★</label>
        <input type="radio" id="star4" name="rating" value="4">
        <label for="star4">★</label>
        <input type="radio" id="star5" name="rating" value="5">
        <label for="star5">★</label>
      </div>
      <span id="rating_error" hidden></span>

      <button type="submit">Submit</button>
    </form>

    <table id="volunteerTable"><tbody></tbody></table>
    <div id="summary"></div>
  `;
}

beforeEach(() => {
  setupDOM();
  volunteerEntries.length = 0;
  document.body.innerHTML = `
    <table id="volunteerTable"><tbody></tbody></table>
    <div id="summary"></div>
  `;
});

// INTEGRATION TESTS
describe("volunteer form submission", () => {
  test("submitting valid form updates the temporary data object correctly", () => {
    const form = document.getElementById("volunteer-form");

    document.getElementById("charityName").value = "Red Cross";
    document.getElementById("date").value = "2025-11-01";
    document.getElementById("hours").value = "3.5";
    document.getElementById("star4").checked = true;

    const event = new Event("submit", { bubbles: true, cancelable: true });
    event.preventDefault = jest.fn(); // stub preventDefault
    Object.defineProperty(event, "target", { value: form });

    handleVolunteerSubmit(event);

    expect(volunteerEntries.length).toBe(1);
    const entry = volunteerEntries[0];

    expect(entry).toEqual(
      expect.objectContaining({
        charityName: "Red Cross",
        date: "2025-11-01",
        hours: 3.5,
        rating: 4,
      })
    );
    expect(typeof entry.id).toBe("number");
  });

  test("submitting invalid or incomplete data shows validation errors in the DOM", () => {
    const form = document.getElementById("volunteer-form");

    const charityError = document.getElementById("charityName_error");
    const dateError = document.getElementById("date_error");
    const hoursError = document.getElementById("hours_error");
    const ratingError = document.getElementById("rating_error");

    const event = new Event("submit", { bubbles: true, cancelable: true });
    event.preventDefault = jest.fn();
    Object.defineProperty(event, "target", { value: form });

    handleVolunteerSubmit(event);

    expect(volunteerEntries.length).toBe(0);

    const errorsVisible =
      !charityError.hidden || !dateError.hidden || !hoursError.hidden || !ratingError.hidden;

    expect(errorsVisible).toBe(true);
  });
});

// Integration test to verify localStorage sync and table rendering
describe("Integration: volunteer hours table and localStorage", () => {
  test("table updates correctly after data is added to localStorage", () => {
    const fakeEntries = [
      { id: 1, charityName: "Food Bank", date: "2025-12-04", hours: 5, rating: 4 },
      { id: 2, charityName: "Shelter", date: "2025-12-05", hours: 3, rating: 5 },
    ];
    localStorage.setItem("volunteerEntries", JSON.stringify(fakeEntries));

    syncEntriesFromStorage();
    renderTable();

    const rows = document.querySelectorAll("#volunteerTable tbody tr");
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain("Food Bank");
    expect(rows[1].textContent).toContain("Shelter");
  });

  test("data persisted in localStorage is correctly retrieved and displayed in the table", () => {
    const fakeEntries = [
      { id: 3, charityName: "Red Cross", date: "2025-12-06", hours: 4, rating: 5 },
    ];
    localStorage.setItem("volunteerEntries", JSON.stringify(fakeEntries));

    syncEntriesFromStorage();
    renderTable();

    const cell = document.querySelector("#volunteerTable tbody tr td");
    expect(cell.textContent).toBe("Red Cross");
  });
});


// UNIT TESTS
describe("validateVolunteerData", () => {
  test("identifies empty required fields", () => {
    const errors = validateVolunteerData({
      charityName: "",
      date: "",
      hours: "",
      rating: "",
    });

    expect(errors).toEqual(
      expect.arrayContaining([
        "Charity Name is required.",
        "Date is required.",
        "Hours Volunteered is required.",
        "Volunteer Experience Rating is required.",
      ])
    );
  });

  test("flags non-numeric hours volunteered", () => {
    const errors = validateVolunteerData({
      charityName: "Charity",
      date: "2025-11-01",
      hours: "abc",
      rating: "3",
    });

    expect(errors).toEqual(
      expect.arrayContaining(["Hours Volunteered must be a positive number."])
    );
  });

  test("flags negative hours volunteered", () => {
    const errors = validateVolunteerData({
      charityName: "Charity",
      date: "2025-11-01",
      hours: "-5",
      rating: "3",
    });

    expect(errors).toEqual(
      expect.arrayContaining(["Hours Volunteered must be a positive number."])
    );
  });

  test("flags rating out of range (<1)", () => {
    const errors = validateVolunteerData({
      charityName: "Charity",
      date: "2025-11-01",
      hours: "2",
      rating: "0",
    });

    expect(errors).toEqual(
      expect.arrayContaining([
        "Volunteer Experience Rating must be a number between 1 and 5.",
      ])
    );
  });

  test("flags rating out of range (>5)", () => {
    const errors = validateVolunteerData({
      charityName: "Charity",
      date: "2025-11-01",
      hours: "2",
      rating: "6",
    });

    expect(errors).toEqual(
      expect.arrayContaining([
        "Volunteer Experience Rating must be a number between 1 and 5.",
      ])
    );
  });

  test("returns empty array for valid inputs", () => {
    const errors = validateVolunteerData({
      charityName: "Charity",
      date: "2025-11-01",
      hours: "2.5",
      rating: "5",
    });

    expect(errors).toHaveLength(0);
  });
});

describe("buildVolunteerEntry", () => {
  test("returns normalized temporary data object for valid inputs", () => {
    const rawData = {
      charityName: "  Food Bank  ",
      date: "2025-11-10",
      hours: "4",
      rating: "5",
    };

    const entry = buildVolunteerEntry(rawData);

    expect(entry).toEqual(
      expect.objectContaining({
        charityName: "Food Bank",
        date: "2025-11-10",
        hours: 4,
        rating: 5,
      })
    );
    expect(typeof entry.id).toBe("number");
  });
});

describe("calculateTotalHours and deleteLog", () => {
  beforeEach(() => {
    volunteerEntries.length = 0; 
  });

  test("calculateTotalHours returns correct sum", () => {
    volunteerEntries.push(
      { id: 1, charityName: "Food Bank", date: "2025-12-04", hours: 5, rating: 4 },
      { id: 2, charityName: "Shelter", date: "2025-12-05", hours: 3, rating: 5 }
    );
    const total = calculateTotalHours();
    expect(total).toBe(8);
  });
});

describe("Unit: deleteLog", () => {
  test("deleting a record updates localStorage and table correctly", () => {
    volunteerEntries.push(
      { id: 1, charityName: "Food Bank", date: "2025-12-04", hours: 5, rating: 4 }
    );
    saveEntriesToStorage();
    renderTable();

    deleteLog(0);

    const rows = document.querySelectorAll("#volunteerTable tbody tr");
    expect(rows.length).toBe(0);

    const stored = JSON.parse(localStorage.getItem("volunteerEntries"));
    expect(stored.length).toBe(0);
  });

  test("total volunteer hours update when a record is deleted", () => {
    volunteerEntries.push(
      { id: 1, charityName: "Food Bank", date: "2025-12-04", hours: 5, rating: 4 },
      { id: 2, charityName: "Shelter", date: "2025-12-05", hours: 3, rating: 5 }
    );
    saveEntriesToStorage();
    renderTable();

    deleteLog(0);

    const summary = document.getElementById("summary").textContent;
    expect(summary).toContain("Total Volunteer Hours: 3");
  });
});


