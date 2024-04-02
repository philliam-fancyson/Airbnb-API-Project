'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 TF2',
        city: 'Teufort',
        state: 'New Mexico',
        country: 'United States of America',
        lat: 35.6870,
        lng: 105.9378,
        name: '2Fort',
        description: `Dis map ain't big enough for da two of us!`,
        price: 123,
        avgRating: 1.0,
      },
      {
        ownerId: 4,
        address: '1910 Speedwagon Street',
        city: 'Washington D.C.',
        state: 'Washington D.C.',
        country: 'United States of America',
        lat: 38.8977,
        lng: 77.0365,
        name: 'Speedwagon Foundation',
        description: `Is this a JoJo reference?`,
        price: 198,
        avgRating: 4.2,
      },
      {
        ownerId: 5,
        address: 'Everything Address',
        city: 'Everywhere Street',
        state: 'All at Once State',
        country: 'United States of America',
        lat: 11.1001,
        lng: 10.1110,
        name: 'Laundromat',
        description: `Nothing matters`,
        price: 202,
        avgRating: 5.0,
      },
    ])

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op  = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId : { [Op.in]: [1, 4, 6] }
    }, {})
  }
};
