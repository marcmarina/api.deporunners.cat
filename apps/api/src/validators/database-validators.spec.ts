import { isModelIdValid } from './database-validators';

const mockedResolvingModel = {
  findOne: () => ({ id: 'id' }),
};

const mockedNotFoundModel = {
  findOne: () => null,
};

describe('validateModelId', () => {
  it('returns true when the id is valid', async () => {
    await expect(
      isModelIdValid(mockedResolvingModel as any, 'id'),
    ).resolves.toEqual(true);
  });

  it('throws an error when the id is not valid', async () => {
    await expect(
      isModelIdValid(mockedNotFoundModel as any, 'id'),
    ).rejects.toBeDefined();
  });
});
