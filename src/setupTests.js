import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { jest } from '@jest/globals';

const mockResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.ResizeObserver = mockResizeObserver;

afterEach(() => {
  jest.clearAllMocks();
}); 