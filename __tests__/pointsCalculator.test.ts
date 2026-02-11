
// Import testing globals from vitest to fix "Cannot find name" errors for describe, test, and expect
import { describe, test, expect } from 'vitest';
import { calculateLevel, calculateProgressToNextLevel, getActionPoints } from '../utils/pointsCalculator';

describe('Gamification Engine Logic', () => {
  test('Level calculation should be correct based on 100 points per level', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(250)).toBe(3);
    expect(calculateLevel(550)).toBe(6);
  });

  test('Progress to next level should return remainder of 100', () => {
    expect(calculateProgressToNextLevel(50)).toBe(50);
    expect(calculateProgressToNextLevel(120)).toBe(20);
    expect(calculateProgressToNextLevel(300)).toBe(0);
  });

  test('Action points should return correct values for predefined activities', () => {
    expect(getActionPoints('complete_questionnaire')).toBe(50);
    expect(getActionPoints('add_project')).toBe(20);
    expect(getActionPoints('daily_visit')).toBe(10);
    expect(getActionPoints('unknown_action')).toBe(0);
  });
});
