'use strict';

const { SpotImage, Spot } = require('../models');
const Op = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const Spots = [
  { name: '2Fort' },
  { name: 'Speedwagon Foundation' },
  { name: 'Urban Square Towers' },
  { name: 'Laundromat' }
];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for (let i = 0; i < Spots.length; i++) {
      const spot = await Spot.findOne({
        raw: true,
        attributes: ['id'],
        where: { name: Spots[i].name}
      })
      await SpotImage.bulkCreate([
        {
          spotId: spot.id,
          url: 'image url',
          preview: true,
        },
        {
          spotId: spot.id,
          url: 'image url',
          preview: false,
        },
    ])}
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: 'image url'
    }, {})
  }
};
