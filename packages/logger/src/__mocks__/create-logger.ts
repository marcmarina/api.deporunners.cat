export function createLogger() {
  return {
    error: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
  };
}
