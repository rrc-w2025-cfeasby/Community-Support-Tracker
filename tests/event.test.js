/**
 * @jest-environment jsdom
 */

const { handleFormSubmit } = require('../src/formHandler');
const { displaySignups, loadSignups, updateSummary } = require('../src/formHandler');

describe("Event Signup Integration Tests", () => {
  beforeEach(() => {
    // Reset DOM and localStorage before each test
    document.body.innerHTML = `
      <form id="signup-form">
        <input id="event_name" value="Tech Conference" />
        <input id="rep_name" value="Chris Feasby" />
        <input id="rep_email" value="chris@academic.rrc.ca" />
        <select id="role">
          <option value="">--Please choose a role--</option>
          <option value="sponsor" selected>Sponsor</option>
        </select>
        <div id="form-feedback"></div>
        <button type="submit">Sign Up</button>
      </form>
      <div id="event_name_error"></div>
      <div id="rep_name_error"></div>
      <div id="rep_email_error"></div>
      <div id="role_error"></div>
      <table id="signup-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Participant Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      `;
      localStorage.clear();      
  });

  test('submitting valid form updates tempData object and persists to localStorage', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const form = document.getElementById("signup-form");

    form.addEventListener('submit', handleFormSubmit);
    form.dispatchEvent(new Event('submit'));

    expect(logSpy).toHaveBeenCalledWith('Form Submitted:', {
      eventName: 'Tech Conference',
      repName: 'Chris Feasby',
      repEmail: 'chris@academic.rrc.ca',
      role: 'sponsor',
    });
    
    // Assert localStorage persistence
    const storedSignups = JSON.parse(localStorage.getItem("eventSignups"));
    expect(storedSignups).toBeDefined();
    expect(storedSignups.length).toBe(1);
    expect(storedSignups[0]).toEqual({
      eventName: "Tech Conference",
      participantName: "Chris Feasby",
      email: "chris@academic.rrc.ca",
      role: "sponsor",
    });

    logSpy.mockRestore();
  });

  test("event signup table updates correctly after data is added to localStorage", () => {
    localStorage.setItem(
      "eventSignups",
      JSON.stringify([
        {
          eventName: "Bits and Bytes",
          participantName: "Alice",
          email: "alice@example.com",
          role: "participant",
        },
      ])
    );

    displaySignups(loadSignups());

    const rows = document.querySelectorAll("#signup-table tbody tr");
    expect(rows.length).toBe(1);
    const cells = rows[0].querySelectorAll("td");
    expect(cells[0].textContent).toBe("Bits and Bytes");
    expect(cells[1].textContent).toBe("Alice");
    expect(cells[2].textContent).toBe("alice@example.com");
    expect(cells[3].textContent).toBe("participant");
  });
});

describe("Event Signup Unit Tests", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <table id="signup-table"><tbody></tbody></table>
      <div id="summary-content"></div>
    `;
    localStorage.clear();
  });

  test("generate summary section grouped by role", () => {
    localStorage.setItem(
      "eventSignups",
      JSON.stringify([
        { eventName: "Event A", participantName: "Alice", email: "a@example.com", role: "sponsor"},
        { eventName: "Event B", participantName: "Bob", email: "b@example.com", role: "participant" },
        { eventName: "Event C", participantName: "Carol", email: "c@example.com", role: "sponsor"},
      ])
    );

    updateSummary();

    const summaryItems = document.querySelectorAll("#summary-content li");
    expect(summaryItems.length).toBe(2);
    expect(summaryItems[0].textContent).toContain("sponsor: 2");
    expect(summaryItems[1].textContent).toContain("participant: 1");
  });

  test("deleting a record updates localStorage and table correctly", () => {
    localStorage.setItem(
      "eventSignups",
      JSON.stringify([
        { eventName: "Event A", participantName: "Alice", email: "a@example.com", role: "sponsor" },
      ])
    );

    displaySignups(loadSignups());

    expect(document.querySelectorAll("#signup-table tbody tr").length).toBe(1);

    const deleteBtn = document.querySelector(".delete-btn");
    // Simulate confirm returning true
    window.confirm = jest.fn(() => true);
    deleteBtn.click();

    const stored = JSON.parse(localStorage.getItem("eventSignups"));
    expect(stored.length).toBe(0);
    expect(document.querySelectorAll("#signup-table tbody tr").length).toBe(0);
  });

  test("summary updates when a record is deleted", () => {
    document.body.innerHTML = `
      <table id="signup-table"><tbody></tbody></table>
      <div id="summary-content"></div>
    `;

    localStorage.setItem(
      "eventSignups",
      JSON.stringify([
        { eventName: "Event A", participantName: "Alice", email: "a@example.com", role: "sponsor" },
        { eventName: "Event B", participantName: "Bob", email: "b@example.com", role: "participant" },
      ])
    );

    displaySignups(loadSignups());
    updateSummary();

    expect(document.querySelector("#summary-content").textContent).toContain("sponsor: 1");
    expect(document.querySelector("#summary-content").textContent).toContain("participant: 1");

    const deleteBtn = document.querySelector(".delete-btn");
    window.confirm = jest.fn(() => true);
    deleteBtn.click();
    updateSummary();

    expect(document.querySelector("#summary-content").textContent).not.toContain("sponsor: 1");
    expect(document.querySelector("#summary-content").textContent).toContain("participant: 1");
  });
});