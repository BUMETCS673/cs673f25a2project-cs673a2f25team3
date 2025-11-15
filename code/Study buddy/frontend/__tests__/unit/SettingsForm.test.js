import { describe, it, expect } from '@jest/globals';
import { exportForTesting } from '../../components/SettingsForm';

/* 
  95% AI
  5% manual
*/

describe('isGoalValid', () => {
  it('returns false for an empty string', () => {
    expect(exportForTesting.isGoalValid("")).toBe(false);
  });

  it('returns false for NaN', () => {
    expect(exportForTesting.isGoalValid(NaN)).toBe(false);
  });

  it('returns false for a negative value', () => {
    expect(exportForTesting.isGoalValid(-1)).toBe(false);
    expect(exportForTesting.isGoalValid(-100)).toBe(false);
  });

  it('returns false for zero', () => {
    expect(exportForTesting.isGoalValid(0)).toBe(false);
  });

  it('returns true for positive values', () => {
    expect(exportForTesting.isGoalValid(1)).toBe(true);
    expect(exportForTesting.isGoalValid(3.5)).toBe(true);
    expect(exportForTesting.isGoalValid(100)).toBe(true);
  });

  it('returns false for non-numeric strings', () => {
    expect(exportForTesting.isGoalValid("abc")).toBe(false);
    expect(exportForTesting.isGoalValid(" ")).toBe(false);
    expect(exportForTesting.isGoalValid(null)).toBe(false);
    expect(exportForTesting.isGoalValid(undefined)).toBe(false);
  });
});

