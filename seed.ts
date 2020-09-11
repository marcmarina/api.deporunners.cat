import mongoose from 'mongoose';
import dotenv from 'dotenv';
import faker from 'faker';
import bcrypt from 'bcrypt';

import Member from './src/models/Member';
import User from './src/models/User';
import Role from './src/models/Role';
import Town from './src/models/Town';
import TShirtSize from './src/models/TShirtSize';

dotenv.config();

const towns = [
  {
    name: 'Barcelona',
  },
  {
    name: 'Sant Pere de Ribes',
  },
  {
    name: 'Sitges',
  },
  {
    name: 'Vilanova i La Geltrú',
  },
  {
    name: 'Cubelles',
  },
  {
    name: 'Cunit',
  },
  {
    name: 'Calafell',
  },
  {
    name: 'Canyelles',
  },
  {
    name: 'Igualada',
  },
  {
    name: "L'Arboç",
  },
  {
    name: "Sant Sadurní d'Anoia",
  },
  {
    name: 'Vilafranca del Penedès',
  },
];

const tShirtSizes = [
  {
    name: 'XS',
    orderNum: 1,
  },
  {
    name: 'S',
    orderNum: 2,
  },
  {
    name: 'M',
    orderNum: 3,
  },
  {
    name: 'L',
    orderNum: 4,
  },
  {
    name: 'XL',
    orderNum: 5,
  },
  {
    name: 'XXL',
    orderNum: 6,
  },
];

const roles = [{ name: 'Admin' }];

const memberTemplate = {
  firstName: 'John',
  lastName: 'Doe',
  password: bcrypt.hashSync('123456', 12),
  dni: '12345678A',
  telephone: '654654654',
  address: {
    postCode: '08810',
    streetAddress: 'C/ Lluis Companys, 17 4-2',
  },
};

const userTemplate = {
  name: 'John Doe',
  password: bcrypt.hashSync('123456', 12),
};

const memberCount = parseInt(process.env.SEED_MEMBER_COUNT);
const userCount = parseInt(process.env.SEED_USER_COUNT);

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  });

  await Member.deleteMany({});
  await User.deleteMany({});
  await Role.deleteMany({});
  await Town.deleteMany({});
  await TShirtSize.deleteMany({});

  await Town.insertMany(towns);
  await TShirtSize.insertMany(tShirtSizes);
  await Role.insertMany(roles);

  const members = [];
  for (let i = 0; i < memberCount; i++) {
    let { _id: townId } = await Town.findOne();
    let member = new Member({
      ...memberTemplate,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      address: {
        ...memberTemplate.address,
        town: townId,
      },
      email: faker.internet.email().toLowerCase(),
      numMember: i + 1,
      iban: faker.finance.iban(),
    });
    members.push(member);
  }

  await Member.insertMany(members);

  const users = [];
  for (let i = 0; i < userCount; i++) {
    let { _id: roleId } = await Role.findOne();
    let user = new User({
      ...userTemplate,
      email: `john${i > 0 ? i + 1 : ''}@doe.com`,
      role: roleId,
    });
    users.push(user);
  }

  await User.insertMany(users);

  mongoose.disconnect();

  console.info('Done!');
}

seed();
