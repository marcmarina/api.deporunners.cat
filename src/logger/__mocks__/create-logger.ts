export function createLogger() {
  return {
    error: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
  };
}
