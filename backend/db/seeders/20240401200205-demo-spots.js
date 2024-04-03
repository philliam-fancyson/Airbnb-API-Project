'use strict';

const { Spot, User } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const Users = [
  { username: 'Demoman' },
  { username: 'Star-Platinum' },
  { username: 'laundry-and-taxes' },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const user1 = await User.findOne({
      where: { username: Users[0].username },
      raw: true
    });
    const user2 = await User.findOne({
      where: { username: Users[1].username },
      raw: true
    });
    const user3 = await User.findOne({
      where: { username: Users[2].username },
      raw: true
    });


    await Spot.bulkCreate([
      {
        ownerId: user1.id,
        address: '123 TF2',
        city: 'Teufort',
        state: 'New Mexico',
        country: 'United States of America',
        lat: 35.6870,
        lng: 105.9378,
        name: '2Fort',
        description: `Dis map ain't big enough for da two of us!`,
        price: 123,
      },
      {
        ownerId: user2.id,
        address: '1910 Speedwagon Street',
        city: 'Washington D.C.',
        state: 'Washington D.C.',
        country: 'United States of America',
        lat: 38.8977,
        lng: 77.0365,
        name: 'Speedwagon Foundation',
        description: `Is this a JoJo reference?`,
        price: 198,
      },
      {
        ownerId: user2.id,
        address: '143 W. 52nd Street',
        city: 'Neo City',
        state: 'New York',
        country: 'United States of America',
        lat: 40.7588,
        lng: -73.9851,
        name: 'Urban Square Towers',
        description: `Wonderful view of the square and the occasional street fights. `,
        price: 100,
      },
      {
        ownerId: user3.id,
        address: 'Everything Address',
        city: 'Everywhere Street',
        state: 'All at Once State',
        country: 'United States of America',
        lat: 11.1001,
        lng: 10.1110,
        name: 'Laundromat',
        description: `Experience the beautiful reality where nothing matters.`,
        price: 202,
      },
    ])

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op  = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name : { [Op.in]: ['2Fort', 'Speedwagon Foundation', 'Urban Square Towers', 'Laundromat'] }
    }, {})
  }
};
