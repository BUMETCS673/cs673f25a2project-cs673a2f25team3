import { describe, it, expect } from '@jest/globals';
import { exportForTest } from '../../components/LoginForm';

/*
  100% AI
*/

describe('isPasswordSecure', () => {
  it('returns false for password less than 12 chars', () => {
    expect(exportForTest.isPasswordSecure('Short1!')).toBe(false);
  });

  it('returns false for no digit', () => {
    expect(exportForTest.isPasswordSecure('Abcdefghijk!')).toBe(false);
  });

  it('returns false for no uppercase', () => {
    expect(exportForTest.isPasswordSecure('abcdefgh1!jkz')).toBe(false);
  });

  it('returns false for no lowercase', () => {
    expect(exportForTest.isPasswordSecure('ABCDEFGHI1!X')).toBe(false);
  });

  it('returns false for no special character', () => {
    expect(exportForTest.isPasswordSecure('Abcdefghij12')).toBe(false);
  });

  it('returns true for valid password (all requirements)', () => {
    expect(exportForTest.isPasswordSecure('Abcdefgh1!jk')).toBe(true);
    expect(exportForTest.isPasswordSecure('MyBigPassword1@')).toBe(true);
    expect(exportForTest.isPasswordSecure('StrongPASSword8$')).toBe(true);
  });

  it('returns true for more than 12 chars with all requirements', () => {
    expect(exportForTest.isPasswordSecure('XyZqwerty123!')).toBe(true);
    expect(exportForTest.isPasswordSecure('Password123!@#')).toBe(true);
  });

  it('returns false for password with 12+ chars but missing special char', () => {
    expect(exportForTest.isPasswordSecure('Abcdefghijk1')).toBe(false);
  });

  it('returns false for password with only lowercase and special and 12+ chars', () => {
    expect(exportForTest.isPasswordSecure('abcdefghijk!z')).toBe(false);
  });
});

