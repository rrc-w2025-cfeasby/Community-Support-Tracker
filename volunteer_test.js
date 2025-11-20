/**
 * @jest-environment jsdom
 */
/**
 * @jest-environment jsdom
 */

import {
  volunteerEntries,
  initVolunteerForm,
  validateVolunteerData,
  buildVolunteerEntry,
} from "./volunteer.js";

// Build a fake HTML page for each test
function setupDOM() {
  document.body.innerHTML = `
    <form id="volunteer-form">
      <input id="charityName" name="charityName" />
      <input id="hoursVolunteered" name="hoursVolunteered" />
      <input id="volunteerDate" name="volunteerDate" type="date" />
      <input id="experienceRating" name="experienceRating" />
      <button type="submit">Log Hours</button>
    </form>
    <ul id="volunteer-errors"></ul>
  `;
}

beforeEach(() => {
  setupDOM();
  volunteerEntries.length = 0; // clear temp data
  initVolunteerForm();        // wire up submit handler
});

test("submitting valid form updates the temporary data object correctly", () => {
  const form = document.getElementById("volunteer-form");

  const charityInput = document.getElementById("charityName");
  const hoursInput   = document.getElementById("hoursVolunteered");
  const dateInput    = document.getElementById("volunteerDate");
  const ratingInput  = document.getElementById("experienceRating");

  charityInput.value = "Red Cross";
  hoursInput.value   = "3.5";
  dateInput.value    = "2025-11-01";
  ratingInput.value  = "4";

  // Simulate clicking "submit"
  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

  // Check that temp data has one entry
  expect(volunteerEntries.length).toBe(1);

  const entry = volunteerEntries[0];

  // Check normalization
  expect(entry).toEqual(
    expect.objectContaining({
      charityName: "Red Cross",
      hours: 3.5,
      date: "2025-11-01",
      rating: 4,
    })
  );
  expect(typeof entry.id).toBe("number");
});

test("submitting invalid or incomplete data shows validation errors in the DOM", () => {
  const form = document.getElementById("volunteer-form");
  const errorList = document.getElementById("volunteer-errors");

  // Leave fields empty
  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

  // No entries should be added
  expect(volunteerEntries.length).toBe(0);

  // Errors should show up in the DOM
  expect(errorList.children.length).toBeGreaterThan(0);
  expect(errorList.style.display).toBe("block");

  // Optionally check a specific message
  const errorTexts = Array.from(errorList.children).map((li) => li.textContent);
  expect(errorTexts).toEqual(
    expect.arrayContaining(["Charity Name is required."])
  );
});
describe("validateVolunteerData", () => {
  test("identifies empty required fields", () => {
    const errors = validateVolunteerData({
      charityName: "",
      hoursVolunteered: "",
      date: "",
      rating: "",
    });

    expect(errors).toEqual(
      expect.arrayContaining([
        "Charity Name is required.",
        "Hours Volunteered is required.",
        "Date is required.",
        "Volunteer Experience Rating is required.",
      ])
    );
  });

  test("flags non-numeric hours volunteered", () => {
    const errors = validateVolunteerData({
      charityName: "Charity",
      hoursVolunteered: "abc",
      date: "2025-11-01",
      rating: "3",
    });

    expect(errors).toEqual(
      expect.arrayContaining(["Hours Volunteered must be a positive number."])
    );
  });

  test("flags negative hours volunteered", () => {
    const errors = validateVolunteerData({
      charityName: "Charity",
      hoursVolunteered: "-5",
      date: "2025-11-01",
      rating: "3",
    });

    expect(errors).toEqual(
      expect.arrayContaining(["Hours Volunteered must be a positive number."])
    );
  });

  test("flags rating out of range (<1)", () => {
    const errors = validateVolunteerData({
      charityName: "Charity",
      hoursVolunteered: "2",
      date: "2025-11-01",
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
      hoursVolunteered: "2",
      date: "2025-11-01",
      rating: "6",
    });

    expect(errors).toEqual(
      expect.arrayContaining([
        "Volunteer Experience Rating must be a number between 1 and 5.",
      ])
    );
  });

  test("returns empty array for valid input", () => {
    const errors = validateVolunteerData({
      charityName: "Charity",
      hoursVolunteered: "2.5",
      date: "2025-11-01",
      rating: "5",
    });

    expect(errors).toHaveLength(0);
  });
});
describe("validateVolunteerData", () => {
  test("identifies empty required fields", () => {
    const errors = validateVolunteerData({
      charityName: "",
      hoursVolunteered: "",
      date: "",
      rating: "",
    });

    expect(errors).toEqual(
      expect.arrayContaining([
        "Charity Name is required.",
        "Hours Volunteered is required.",
        "Date is required.",
        "Volunteer Experience Rating is required.",
      ])
    );
  });

  test("flags non-numeric hours volunteered", () => {
    const errors = validateVolunteerData({
      charityName: "Charity",
      hoursVolunteered: "abc",
      date: "2025-11-01",
      rating: "3",
    });

    expect(errors).toEqual(
      expect.arrayContaining(["Hours Volunteered must be a positive number."])
    );
  });

  test("flags negative hours volunteered", () => {
    const errors = validateVolunteerData({
      charityName: "Charity",
      hoursVolunteered: "-5",
      date: "2025-11-01",
      rating: "3",
    });

    expect(errors).toEqual(
      expect.arrayContaining(["Hours Volunteered must be a positive number."])
    );
  });

  test("flags rating out of range (<1)", () => {
    const errors = validateVolunteerData({
      charityName: "Charity",
      hoursVolunteered: "2",
      date: "2025-11-01",
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
      hoursVolunteered: "2",
      date: "2025-11-01",
      rating: "6",
    });

    expect(errors).toEqual(
      expect.arrayContaining([
        "Volunteer Experience Rating must be a number between 1 and 5.",
      ])
    );
  });

  test("returns empty array for valid input", () => {
    const errors = validateVolunteerData({
      charityName: "Charity",
      hoursVolunteered: "2.5",
      date: "2025-11-01",
      rating: "5",
    });

    expect(errors).toHaveLength(0);
  });
});

describe("buildVolunteerEntry", () => {
  test("returns normalized temporary data object for valid inputs", () => {
    const rawData = {
      charityName: "  Food Bank  ",
      hoursVolunteered: "4",
      date: "2025-11-10",
      rating: "5",
    };

    const entry = buildVolunteerEntry(rawData);

    expect(entry).toEqual(
      expect.objectContaining({
        charityName: "Food Bank", // trimmed
        hours: 4,
        date: "2025-11-10",
        rating: 5,
      })
    );
    expect(typeof entry.id).toBe("number");
  });
});
