import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';
import 'whatwg-fetch';
const { mockResizeObserver } = require('./src/utils/testUtils');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// 設置全局 mock
beforeAll(() => {
  mockResizeObserver();
});

// 清理全局 mock
afterEach(() => {
  jest.clearAllMocks();
});