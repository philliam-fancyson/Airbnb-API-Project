'use strict';

const { ReviewImage, Review, Spot } = require('../models');
const Op = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

const Spots = [
  { name: '2Fort' },
  { name: 'Speedwagon Foundation' },
  { name: 'Urban Square Towers' },
  { name: 'Laundromat' }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for (let i =  0; i < Spots.length; i++) {
      const reviews = await Review.findAll({
        attributes: ['id'],
        include: {
          model: Spot,
          where: { name: Spots[i].name }
        }
      });
      for (let review of reviews) {
        await ReviewImage.create({
          reviewId: review.id,
          url: 'image url'
        });
      };
    };
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: 'image url'
    }, {})
  }
};
