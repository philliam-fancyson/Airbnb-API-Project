'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demoman',
        hashedPassword: bcrypt.hashSync('kaboom')
      },
      {
        email: 'user1@user.io',
        username: 'funny-userGuy',
        hashedPassword: bcrypt.hashSync('heeheeHAHA')
      },
      {
        email: 'user2@user.io',
        username: 'morbius',
        hashedPassword: bcrypt.hashSync('morbinTime')
      },
      {
        email: 'jotaro-joestar@gmail.com',
        username: 'Star-Platinum',
        hashedPassword: bcrypt.hashSync('ora!ora!ora!ora!ora!')
      },
      {
        email: 'evelyn-wang@yahoo.com',
        username: 'laundry-and-taxes',
        hashedPassword: bcrypt.hashSync('nothing@!matters2022')
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const { Op } = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: [
        'Demoman',
        'funny-userGuy',
        'morbius',
        'Star-Platinum',
        'laundry-and-taxes'
      ]}
    })
  }
};
