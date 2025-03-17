import { describe, it, expect } from '@jest/globals';
import { validateEnglishCommaSpaceEmpty } from '../formatValidate';

describe('validateEnglishCommaSpaceEmpty', () => {
  it('should return true for empty string', () => {
    expect(validateEnglishCommaSpaceEmpty('')).toBe(true);
  });

  it('should return true for valid English letters', () => {
    expect(validateEnglishCommaSpaceEmpty('abc')).toBe(true);
    expect(validateEnglishCommaSpaceEmpty('ABC')).toBe(true);
    expect(validateEnglishCommaSpaceEmpty('abcDEF')).toBe(true);
  });

  it('should return true for valid English letters with spaces', () => {
    expect(validateEnglishCommaSpaceEmpty('abc def')).toBe(true);
    expect(validateEnglishCommaSpaceEmpty('ABC DEF')).toBe(true);
    expect(validateEnglishCommaSpaceEmpty('abc DEF ghi')).toBe(true);
  });

  it('should return true for valid English letters with commas', () => {
    expect(validateEnglishCommaSpaceEmpty('abc,def')).toBe(true);
    expect(validateEnglishCommaSpaceEmpty('ABC,DEF')).toBe(true);
    expect(validateEnglishCommaSpaceEmpty('abc,DEF,ghi')).toBe(true);
  });

  it('should return true for valid English letters with spaces and commas', () => {
    expect(validateEnglishCommaSpaceEmpty('abc, def')).toBe(true);
    expect(validateEnglishCommaSpaceEmpty('ABC, DEF')).toBe(true);
    expect(validateEnglishCommaSpaceEmpty('abc, DEF, ghi')).toBe(true);
  });

  it('should return false for numbers', () => {
    expect(validateEnglishCommaSpaceEmpty('abc123')).toBe(false);
    expect(validateEnglishCommaSpaceEmpty('123')).toBe(false);
    expect(validateEnglishCommaSpaceEmpty('abc 123')).toBe(false);
  });

  it('should return false for special characters', () => {
    expect(validateEnglishCommaSpaceEmpty('abc!')).toBe(false);
    expect(validateEnglishCommaSpaceEmpty('abc@def')).toBe(false);
    expect(validateEnglishCommaSpaceEmpty('abc#DEF')).toBe(false);
    expect(validateEnglishCommaSpaceEmpty('abc$')).toBe(false);
    expect(validateEnglishCommaSpaceEmpty('abc.')).toBe(false);
  });

  it('should return false for non-English characters', () => {
    expect(validateEnglishCommaSpaceEmpty('abc中文')).toBe(false);
    expect(validateEnglishCommaSpaceEmpty('中文')).toBe(false);
    expect(validateEnglishCommaSpaceEmpty('abc日本語')).toBe(false);
    expect(validateEnglishCommaSpaceEmpty('abc한글')).toBe(false);
  });
}); 