'use strict';

const { SpotImage, Spot } = require('../models');
const Op = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const Spots = [
  { name: 'App Academy'},
  { name: '2Fort' },
  { name: 'Speedwagon Foundation' },
  { name: 'Urban Square Towers' },
  { name: 'Laundromat' },
  { name: 'Going Merry' },
  { name: 'Thousand Sunny' },
  { name: 'The Moving Castle'},
  { name:"Apple Academy"},
  { name:"Apple 2 Academy"},
  { name:'Apple 3 Academy'},
  { name:'Apple 4 Academy'},
  { name:'App Vista'},
  { name:'App Mansion'},
  { name:'App Appademy'},
  { name:'App Lodge'},
  { name:'App Home'},
  { name:'App Castle'},
  { name:'App Towers'},
  { name:'Millenium Towers'},
  { name:'App Building'},
  { name:'App Center'}
];


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for (let i = 0; i < Spots.length; i++) {
      const spot = await Spot.findOne({
        raw: true,
        attributes: ['id'],
        where: { name: Spots[i].name}
      });
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
