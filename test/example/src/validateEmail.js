/**
 * Validates an email address.
 * @param {*} value
 * @returns {boolean}
 * @throws {TypeError} if value is null or undefined
 */
export function validateEmail(value) {
  if (value === null || value === undefined) {
    throw new TypeError('validateEmail: value must not be null or undefined');
  }
  if (typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
