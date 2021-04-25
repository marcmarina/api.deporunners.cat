import db from '../utils/db';
import 'dotenv/config';

import Clothing from '../models/Clothing';
import {
  getAllClothing,
  changeImage,
  updateClothing,
} from '../services/clothing';
import environment from '../utils/environment';

beforeAll(async () => {
  await db.connect(environment.mongoURI());
});

afterAll(async () => {
  await db.disconnect();
});

test('returns a correct array of clothing', async () => {
  expect((await getAllClothing()).length).toBe(10);
});

test('changes the clothing image path', async () => {
  const clothing = await Clothing.findOne();
  const res = await changeImage('test', clothing._id);
  expect(res.image).toBe('test');
});

test('updates the clothing record', async () => {
  const clothing = await Clothing.findOne();
  clothing.name = 'Test';
  clothing.price = 15;

  const res = await updateClothing(clothing);
  expect(res.ok).toBe(1);
});

test('throws error on non valid data', async () => {
  const clothing = await Clothing.findOne();
  clothing.sizes = [];

  await expect(updateClothing(clothing)).rejects.toBeDefined();
});
