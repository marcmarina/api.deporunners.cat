import db from '../utils/db';
import 'dotenv/config';

import Clothing from '../models/Clothing';

beforeAll(() => {
  db.connect(process.env.MONGODB_URI);
});

afterAll(() => {
  db.disconnect();
});

test('returns a correct array of clothing', async () => {
  expect((await Clothing.find()).length).toBe(10);
});
