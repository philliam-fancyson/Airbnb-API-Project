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
        email: "john.smith@gmail.com",
        firstName: "John",
        lastName: "Smith",
        hashedPassword: bcrypt.hashSync('secret password'),
        username: "JohnSmith"
      },
      {
        email: "jane.smith@gmail.com",
        firstName: "Jane",
        lastName: "Smith",
        hashedPassword: bcrypt.hashSync('secret password'),
        username: "JaneSmith"
      },
      {
        email: 'demo@user.io',
        username: 'Demoman',
        hashedPassword: bcrypt.hashSync('kaboom'),
        firstName: 'Tavish',
        lastName: 'DeGroot'
      },
      {
        email: 'user1@user.io',
        username: 'funny-userGuy',
        hashedPassword: bcrypt.hashSync('heeheeHAHA'),
        firstName: 'Comedian',
        lastName: 'Cody'
      },
      {
        email: 'user2@user.io',
        username: 'WhiteReaper',
        hashedPassword: bcrypt.hashSync('wR2=>d2=>wS3=>ggEZ'),
        firstName: 'Sergei',
        lastName: 'Dragunov',
      },
      {
        email: 'jotaro-joestar@gmail.com',
        username: 'Star-Platinum',
        hashedPassword: bcrypt.hashSync('ora!ora!ora!ora!ora!'),
        firstName: 'Jotaro',
        lastName: 'JoeStar'
      },
      {
        email: 'evelyn-wang@yahoo.com',
        username: 'laundry-and-taxes',
        hashedPassword: bcrypt.hashSync('nothing@!matters2022'),
        firstName: 'Evelyn',
        lastName: 'Wang'
      },
      {
        email: 'sakura@lesserafim.com',
        username: 'sakura98',
        hashedPassword: bcrypt.hashSync('AKB48!HKT48'),
        firstName: 'Sakura',
        lastName: 'Miyawaki'
      },
      {
        email: 'StrawHat@user.io',
        username: 'StrawHatLuffy',
        hashedPassword: bcrypt.hashSync('TheOnePieceIsReal!'),
        firstName: 'Monkey D.',
        lastName: 'Luffy'
      },
      {
        email: 'PirateHunter@user.io',
        username: 'WadoIchimonji',
        hashedPassword: bcrypt.hashSync('WhichwayisEast'),
        firstName: 'Roronoa',
        lastName: 'Zoro'
      },
      {
        email: 'GreatCaptainUsopp@user.io',
        username: 'UsoppHammer',
        hashedPassword: bcrypt.hashSync('IMTHEGREATESTPIRATEEVER123'),
        firstName: 'God',
        lastName: 'Usopp'
      },
      {
        email: 'Dr.Chopper.user.io',
        username: 'Chopper',
        hashedPassword: bcrypt.hashSync('DoctorsCode'),
        firstName: 'Tony Tony',
        lastName: 'Chopper'
      },
      {
        email: 'Navigator@user.io',
        username: 'Berrylover',
        hashedPassword: bcrypt.hashSync('I1Love2Berries3!'),
        firstName: 'Nami',
        lastName: 'StrawHat'
      },
      {
        email: 'TresFleur@user.io',
        username: 'HanaHanaNoMi',
        hashedPassword: bcrypt.hashSync('Cinco@Fleur55'),
        firstName: 'Nico',
        lastName: 'Robin'
      },
      {
        email: 'WizardHowl@user.io',
        username: 'Howl04',
        hashedPassword: bcrypt.hashSync('SophieMyLove21'),
        firstName: 'Howl',
        lastName: 'Calcifer'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op  = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: [
        'Demoman',
        'funny-userGuy',
        'WhiteReaper',
        'Star-Platinum',
        'laundry-and-taxes',
        'sakura98',
        'JohnSmith',
        'StrawHatLuffy',
        'WadoIchimonji',
        'UsoppHammer',
        'Chopper',
        'Berrylover',
        'HanaHanaNoMi',
        'JaneSmith',
        'Howl04',
      ]}
    }, {})
  }
};
