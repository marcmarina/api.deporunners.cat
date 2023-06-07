import { createValidationError } from './create-error';

describe('createValidationError', () => {
  it.each`
    message               | path
    ${'validation error'} | ${['a']}
    ${'validation error'} | ${['a', 'b']}
    ${'validation error'} | ${['a', 'b', 'c']}
  `('should return an error object', ({ message, path }) => {
    expect(createValidationError(message, path)).toMatchSnapshot();
  });
});
