import { uniqueArray } from './arrays';

describe('uniqueArray', () => {
  it('should return an empty array if the input is empty', () => {
    expect(uniqueArray([])).toEqual([]);
  });

  it('should return an array with unique elements', () => {
    expect(uniqueArray([1, 1, 2, 3, 3])).toEqual([1, 2, 3]);
  });
});
