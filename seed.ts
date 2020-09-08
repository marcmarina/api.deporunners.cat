import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Member from './src/models/Member';
import User from './src/models/User';
import Role from './src/models/Role';
import Town from './src/models/Town';
import TShirtSize from './src/models/TShirtSize';

dotenv.config();

const towns = [
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
];

const roles = [{ name: 'Admin' }];

const memberTemplate = {
  firstName: 'John',
  lastName: 'Doe',
  password: '123456',
  dni: '12345678A',
  telephone: '654654654',
  address: {
    postCode: '08810',
    streetAddress: 'C/ Lluis Companys, 17 4-2',
  },
};

const userTemplate = {
  name: 'John Doe',
  password: '123456',
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
      address: {
        ...memberTemplate.address,
        town: townId,
      },
      email: `john${i > 0 ? i + 1 : ''}@doe.com`,
      numMember: i + 1,
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
