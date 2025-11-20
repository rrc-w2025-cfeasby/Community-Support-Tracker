/**
 * @jest-environment jsdom
 */

const {
  volunteerEntries,
  initVolunteerForm, // not strictly needed but fine to import
  validateVolunteerData,
  buildVolunteerEntry,
  handleVolunteerSubmit,
} = require("./volunteer.js");

// Build DOM that matches volunteer.html
function setupDOM() {
  document.body.innerHTML = `
    <form id="volunteer-form">
      <div class="field">
        <label for="charityName">Charity Name:</label>
        <input type="text" id="charityName" name="charityName" />
        <span id="charityName_error" class="error-message" hidden></span>
      </div>

      <div class="field">
        <label for="date">Date:</label>
        <input type="date" id="date" name="date" />
        <span id="date_error" class="error-message" hidden></span>
      </div>

      <div class="field">
        <label for="hours">Hours Volunteered:</label>
        <input type="number" id="hours" name="hours" min="1" />
        <span id="hours_error" class="error-message" hidden></span>
      </div>

      <div class="field">
        <fieldset>
          <legend>Volunteer Experience Rating (1–5 Stars)</legend>
          <div class="star-rating">
            <input type="radio" id="star5" name="rating" value="5">
            <label for="star5">★</label>
            <input type="radio" id="star4" name="rating" value="4">
            <label for="star4">★</label>
            <input type="radio" id="star3" name="rating" value="3">
            <label for="star3">★</label>
            <input type="radio" id="star2" name="rating" value="2">
            <label for="star2">★</label>
            <input type="radio" id="star1" name="rating" value="1">
            <label for="star1">★</label>
          </div>
          <span id="rating_error" class="error-message" hidden></span>
        </fieldset>
      </div>

      <button id="submit-button" type="submit">Submit</button>
    </form>
  `;
}

beforeEach(() => {
  setupDOM();
  volunteerEntries.length = 0; // clear temp data
  // We don't rely on the event listener in tests; we call handleVolunteerSubmit directly.
});

//
// INTEGRATION TESTS
//

describe("volunteer form submission", () => {
  test("submitting valid form updates the temporary data object correctly", () => {
    const form = document.getElementById("volunteer-form");

    const charityInput = document.getElementById("charityName");
    const dateInput = document.getElementById("date");
    const hoursInput = document.getElementById("hours");
    const star4 = document.getElementById("star4");

    charityInput.value = "Red Cross";
    dateInput.value = "2025-11-01";
    hoursInput.value = "3.5";
    star4.checked = true;

    // Fake submit event with form as target
    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "target", { value: form });

    handleVolunteerSubmit(event);

    // Now the handler definitely ran; check that temp data has one entry
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

    // Leave all fields empty
    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "target", { value: form });

    handleVolunteerSubmit(event);

    // No entries should be added
    expect(volunteerEntries.length).toBe(0);

    // At least one error message should be visible
    const errorsVisible =
      !charityError.hidden || !dateError.hidden || !hoursError.hidden || !ratingError.hidden;

    expect(errorsVisible).toBe(true);
  });
});

//
// UNIT TESTS
//

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
