const {
    validateEmail,
    validateRequiredFields,
    processFormData,
} = require('../src/validation');

describe('validateEmail', () => {
    test('valid email passes', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    });

    test('invalid email fails', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    });
});

describe('validateRequiredFields', () => {
    test('flags all empty fields', () => {
    const result = validateRequiredFields({
        eventName: '',
        repName: '',
        repEmail: '',
        role: '',
    });
    expect(result).toEqual({
        eventName: expect.any(String),
        repName: expect.any(String),
        repEmail: expect.any(String),
        role: expect.any(String),
    });
    });

    test('flags invalid email format', () => {
    const result = validateRequiredFields({
        eventName: 'Tech',
        repName: 'Chris',
        repEmail: 'bademail',
        role: 'sponsor',
    });
    expect(result.repEmail).toBe("A valid Representative's Email is required.");
    });

    test('returns empty object for valid input', () => {
    const result = validateRequiredFields({
        eventName: 'Tech',
        repName: 'Chris',
        repEmail: 'chris@example.com',
        role: 'sponsor',
    });
    expect(result).toEqual({});
    });
});

describe('processFormData', () => {
    test('returns trimmed and structured data object', () => {
    const result = processFormData({
        eventName: '  Tech Conference  ',
        repName: '  Chris Feasby ',
        repEmail: ' chris@example.com ',
        role: 'sponsor',
    });

    expect(result).toEqual({
        eventName: 'Tech Conference',
        repName: 'Chris Feasby',
        repEmail: 'chris@example.com',
        role: 'sponsor',
    });
    });
});