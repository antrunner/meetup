// Prompt used:
// CONTEXT: validateEmail(value) - src/validateEmail.js
// TASK: Jest unit tests.
// COVER: empty string, no @, valid, null, undefined.
// FORMAT: Vitest, no DOM.

import { validateEmail } from '../../src/validateEmail';

describe('validateEmail', () => {
  it('returns false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('returns false when @ is missing', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('returns false when domain is missing', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  it('returns true for a valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('throws TypeError for null', () => {
    expect(() => validateEmail(null)).toThrow(TypeError);
  });

  it('throws TypeError for undefined', () => {
    expect(() => validateEmail(undefined)).toThrow(TypeError);
  });
});
