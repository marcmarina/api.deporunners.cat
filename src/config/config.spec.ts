import { fetchNullableVariable, fetchVariable } from './config';

describe('variable fetching', () => {
  const DEFINED = 'NODE_ENV';
  const NOT_DEFINED = 'NOT_DEFINED';

  describe('fetchNullableVariable', () => {
    it('should fetch a defined environment variable', () => {
      expect(fetchNullableVariable(DEFINED)).toStrictEqual('test');
    });

    it('should return null when fetching an undefined environment variable', () => {
      expect(fetchNullableVariable(NOT_DEFINED)).toBeNull();
    });
  });

  describe('fetchVariable', () => {
    it('should fetch a defined environment variable', () => {
      expect(fetchVariable(DEFINED)).toStrictEqual('test');
    });

    it('should throw an error when fetching an undefined environment variable', () => {
      expect(() => fetchVariable(NOT_DEFINED)).toThrow(
        `Could not fetch environment variable ${NOT_DEFINED}`,
      );
    });
  });
});
