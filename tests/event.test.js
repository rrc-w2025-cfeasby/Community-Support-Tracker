const { handleFormSubmit } = require('../src/formHandler');

test('submitting valid form updates tempData object', () => {
  document.body.innerHTML = `
    <form id="signup-form">
      <input id="event_name" value="Tech Conference" />
      <input id="rep_name" value="Chris Feasby" />
      <input id="rep_email" value="chris@example.com" />
      <select id="role">
        <option value="">--Please choose a role--</option>
        <option value="sponsor" selected>Sponsor</option>
      </select>
      <div id="form-feedback"></div>
      <button type="submit">Sign Up</button>
    </form>
    <div id="event_name-error"></div>
    <div id="rep_name-error"></div>
    <div id="rep_email-error"></div>
    <div id="role-error"></div>
  `;

  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const form = document.getElementById('signup-form');

  form.addEventListener('submit', handleFormSubmit);
  form.dispatchEvent(new Event('submit'));

  expect(logSpy).toHaveBeenCalledWith('Form Submitted:', {
    eventName: 'Tech Conference',
    repName: 'Chris Feasby',
    repEmail: 'chris@example.com',
    role: 'sponsor',
  });

  logSpy.mockRestore();
});