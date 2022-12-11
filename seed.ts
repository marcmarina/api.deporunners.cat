import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import dotenv from 'dotenv';
import faker from 'faker';

import { config } from './src/config';
import { database } from './src/database';
import {
  Event,
  IEvent,
  IMember,
  IUser,
  Member,
  Role,
  Town,
  TShirtSize,
  User,
} from './src/models';
import { randomInt } from './src/utils';

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
    postCode: '12345',
    streetAddress: 'Sample Street, 12',
  },
};

const userTemplate = {
  name: 'John Doe',
  password: bcrypt.hashSync('123456', 12),
};

const {
  members: memberCount,
  users: userCount,
  events: eventCount,
} = config.seedNumbers;

async function seed() {
  await database.connect(config.mongoURI);

  await Member.deleteMany({});
  await User.deleteMany({});
  await Role.deleteMany({});
  await Town.deleteMany({});
  await TShirtSize.deleteMany({});
  await Event.deleteMany({});

  await Town.insertMany(towns);
  await TShirtSize.insertMany(tShirtSizes);
  await Role.insertMany(roles);

  const members: IMember[] = [];
  for (let i = 0; i < memberCount; i++) {
    const member = new Member({
      ...memberTemplate,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      address: {
        ...memberTemplate.address,
        town: (await Town.findOne())?._id,
        streetAddress: faker.address.streetAddress(),
        postCode: faker.address.zipCode(),
      },
      email: faker.internet.email().toLowerCase(),
      numMember: i + 1,
      iban: faker.finance.iban(),
      tshirtSize: (await TShirtSize.findOne())?._id,
    });
    members.push(member);
  }

  await Member.insertMany(members);

  const users: IUser[] = [];
  for (let i = 0; i < userCount; i++) {
    const role = await Role.findOne();
    const user = new User({
      ...userTemplate,
      email: `john${i > 0 ? i + 1 : ''}@doe.com`,
      role: role?._id,
    });
    users.push(user);
  }
  await User.insertMany(users);

  const events: IEvent[] = [];
  for (let i = 0; i < eventCount; i++) {
    events.push(
      new Event({
        name: `Event ${i + 1}`,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam semper facilisis maximus. Nulla augue massa, sollicitudin consectetur libero ut, egestas rhoncus orci. Nulla vitae ex tempor, accumsan nibh a, egestas elit. Curabitur at consequat lectus, ut venenatis urna. Proin quis turpis tellus. Phasellus ornare et erat a euismod. Aliquam id orci placerat, lobortis elit a, scelerisque erat. Etiam consequat feugiat dui a fringilla.`,
        coordinates: `${faker.address.latitude()}, ${faker.address.longitude()}`,
        dateTime: dayjs()
          .add(randomInt(1, 10), 'day')
          .add(randomInt(1, 12), 'hour'),
        members: [],
      }),
    );
  }
  await Event.insertMany(events);

  database.disconnect();
}

seed();
