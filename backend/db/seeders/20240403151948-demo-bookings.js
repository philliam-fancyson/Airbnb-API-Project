'use strict';

const { Booking, User, Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

const Spots = [
  { name: '2Fort' },
  { name: 'Speedwagon Foundation' },
  { name: 'Urban Square Towers' },
  { name: 'Laundromat' },
  { name: 'App Academy' }
];

const Users = [
  { username: 'Demoman' },
  { username: 'funny-userGuy' },
  { username: 'WhiteReaper' },
  { username: 'sakura98' },
  { username: 'JohnSmith' }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // All Spots
    const spot1 = await Spot.findOne({ raw: true, where: { name: Spots[0].name} })
    const spot2 = await Spot.findOne({ raw: true, where: { name: Spots[1].name} })
    const spot3 = await Spot.findOne({ raw: true, where: { name: Spots[2].name} })
    const spot4 = await Spot.findOne({ raw: true, where: { name: Spots[3].name} })
    const spot5 = await Spot.findOne({ raw: true, where: { name: Spots[4].name} })

    // JohnSmith bookings
    const user5 = await User.findOne({ where: { username: Users[4].username }, raw: true });
    await Booking.create({
      userId: user5.id,
      spotId: spot5.id,
      startDate: "2021-11-19",
      endDate: "2021-11-20"
    });

    // Demoman bookings
    const user1 = await User.findOne({ where: { username: Users[0].username }, raw: true });
    await Booking.create({
      userId: user1.id,
      spotId: spot1.id,
      startDate: "2021-11-19",
      endDate: "2021-11-20"
    });

  // funny-userGuy Bookings
  const user2 = await User.findOne({ where: { username: Users[1].username }, raw: true });
  await Booking.bulkCreate([
    {
      userId: user2.id,
      spotId: spot1.id,
      startDate: "2021-11-21",
      endDate: "2021-11-22"
    },
    {
      userId: user2.id,
      spotId: spot3.id,
      startDate: "2023-04-19",
      endDate: "2023-04-21"
    },
    {
      userId: user2.id,
      spotId: spot2.id,
      startDate: "2024-04-11",
      endDate: "2024-04-18"
    },
  ]);

  // WhiteReaper Reviews
  const user3 = await User.findOne({ where: { username: Users[2].username }, raw: true });
  await Booking.bulkCreate([
    {
      userId: user3.id,
      spotId: spot1.id,
      startDate: "2022-07-04",
      endDate: "2022-07-05"
    },
    {
      userId: user3.id,
      spotId: spot2.id,
      startDate: "2023-09-01",
      endDate: "2023-09-05"
    },
    {
      userId: user3.id,
      spotId: spot3.id,
      startDate: "2024-02-03",
      endDate: "2024-02-07"
    },
    {
      userId: user3.id,
      spotId: spot4.id,
      startDate: "2024-03-30",
      endDate: "2024-04-01"
    },
    {
      userId: user3.id,
      spotId: spot3.id,
      startDate: "2024-06-02",
      endDate: "2024-06-03"
    },
    {
      userId: user3.id,
      spotId: spot4.id,
      startDate: "2024-06-04",
      endDate: "2024-06-05"
    },
    {
      userId: user3.id,
      spotId: spot1.id,
      startDate: "2024-06-08",
      endDate: "2024-06-09"
    },
  ]);

  // sakura98 Bookings
  const user4 = await User.findOne({ where: { username: Users[3].username }, raw: true });
  await Booking.bulkCreate([
    {
    userId: user4.id,
    spotId: spot3.id,
    startDate: "2023-05-08",
    endDate: "2023-05-11"
    },
    {
      userId: user4.id,
      spotId: spot4.id,
      startDate: "2024-04-15",
      endDate: "2024-04-20"
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op  = Sequelize.Op;
    // Change this to delete only datapoints seeded
    return queryInterface.bulkDelete(options, {

    }, {})
  }
};
