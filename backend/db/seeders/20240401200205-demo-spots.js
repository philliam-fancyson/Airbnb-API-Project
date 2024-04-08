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
  { username: 'JohnSmith'},
  { username: 'StrawHatLuffy'},
  { username: 'Howl04'},
  { username: 'JaneSmith'}
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
    const user4 = await User.findOne({
      where: { username: Users[3].username },
      raw: true
    });
    const user5 = await User.findOne({
      where: { username: Users[4].username },
      raw: true
    });
    const user6 = await User.findOne({
      where: { username: Users[5].username },
      raw: true
    });
    const user7 = await User.findOne({
      where: { username: Users[6].username },
      raw: true
    });

    await Spot.bulkCreate([
      {
        ownerId: user4.id,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
      },
      {
        ownerId: user5.id,
        address: "Paradise",
        city: "Enies Lobby",
        state: "Grand Line",
        country: "New World",
        lat: -40.5125651,
        lng: -100.2214542,
        name: "Going Merry",
        description: "Come aboard and bring along, All your hopes and dreams",
        price: 80,
      },
      {
        ownerId: user5.id,
        address: "Egghead",
        city: "Future Island",
        state: "Grand Line",
        country: "New World",
        lat: 40.5125651,
        lng: 100.2214542,
        name: "Thousand Sunny",
        description: "Together we will find everything that we're looking for",
        price: 300,
      },
      {
        ownerId: user6.id,
        address: "On The Move",
        city: "Road of City",
        state: "Kingdom of State",
        country: "Country Nation",
        lat: 80.5125651,
        lng: -10.2214542,
        name: "The Moving Castle",
        description: "Come take a load off",
        price: 350,
      },
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
      {
        ownerId: user7.id,
        address: "123 Cartoon Lane",
        city: "New York",
        state: "New York",
        country: "United States of America",
        lat: -80.121212,
        lng: 40.12121,
        name: "Apple Academy",
        description: "Another place where web developers are created",
        price: 300,
      },
      {
        ownerId: user7.id,
        address: "123 Harpoon Lane",
        city: "Kansas City",
        state: "Kansas",
        country: "United States of America",
        lat: 76.121212,
        lng: 12.12121,
        name: "Apple 3 Academy",
        description: "Another place where web developers are created",
        price: 204,
      },
    ])

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op  = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name : { [Op.in]: ['App Academy','2Fort', 'Speedwagon Foundation', 'Urban Square Towers', 'Laundromat',
                          'Going Merry', 'Thousand Sunny', "The Moving Castle", "Apple Academy", "Apple 2 Academy",
                        'Apple 3 Academy'] }
    }, {})
  }
};
