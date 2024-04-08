'use strict';

const { Review, User, Spot } = require('../models');
const Op = require('sequelize');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const Users = [
  { username: 'Demoman' },
  { username: 'funny-userGuy' },
  { username: 'WhiteReaper' },
  { username: 'sakura98' },
  { username: 'JohnSmith'},
  { username: 'Chopper'},
  { username: 'Berrylover'},
  { username: 'HanaHanaNoMi'}
];

const Spots = [
  { name: '2Fort' },
  { name: 'Speedwagon Foundation' },
  { name: 'Urban Square Towers' },
  { name: 'Laundromat' },
  { name: 'App Academy'},
  { name: 'Going Merry' },
  { name: 'Thousand Sunny' }
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
    const spot6 = await Spot.findOne({ raw: true, where: { name: Spots[5].name} })
    const spot7 = await Spot.findOne({ raw: true, where: { name: Spots[6].name} })

    // JohnSmith Reviews
    const user5 = await User.findOne({ where: { username: Users[4].username }, raw: true });
    await Review.create({
      userId: user5.id,
      spotId: spot5.id,
      review: 'This was an awesome Spot!',
      stars: 5,
    });

    // Straw Hat Reviews
    const user6 = await User.findOne({ where: { username: Users[5].username }, raw: true });
    await Review.bulkCreate([
      {
        userId: user6.id,
        spotId: spot6.id,
        review: 'Amazing Place!',
        stars: 5,
      },
      {
        userId: user6.id,
        spotId: spot7.id,
        review: 'Awesome Time!',
        stars: 5,
        },
    ]);

    const user7 = await User.findOne({ where: { username: Users[6].username }, raw: true });
    await Review.bulkCreate([
      {
        userId: user7.id,
        spotId: spot6.id,
        review: 'Magnificent Place!',
        stars: 5,
      },
      {
        userId: user7.id,
        spotId: spot7.id,
        review: 'Great Time!',
        stars: 5,
        },
    ]);

    const user8 = await User.findOne({ where: { username: Users[7].username }, raw: true });
    await Review.bulkCreate([
      {
      userId: user8.id,
      spotId: spot6.id,
      review: 'Wonderful experience',
      stars: 5,
      },
      {
        userId: user8.id,
        spotId: spot7.id,
        review: 'Excellent location',
        stars: 5,
        },
    ]);

    // Demoman Reviews
    const user1 = await User.findOne({ where: { username: Users[0].username }, raw: true });
    await Review.create({
      userId: user1.id,
      spotId: spot1.id,
      review: 'What an amazing spot!!',
      stars: 5,
    })

    // funny-userGuy Reviews
    const user2 = await User.findOne({ where: { username: Users[1].username }, raw: true });
    await Review.bulkCreate([
      {
      userId: user2.id,
      spotId: spot1.id,
      review: 'Terrible spot, I got shot at!',
      stars: 2,
      },
      {
        userId: user2.id,
        spotId: spot3.id,
        review: `Amazing place. Didn't get shot at but I did see a bear fight a samurai.`,
        stars: 4,
      }
    ]);

    // WhiteReaper Reviews
    const user3 = await User.findOne({ where: { username: Users[2].username }, raw: true });
    await Review.bulkCreate([
      {
      userId: user3.id,
      spotId: spot1.id,
      review: '...',
      stars: 3,
      },
      {
        userId: user3.id,
        spotId: spot2.id,
        review: '...',
        stars: 4,
      },
      {
        userId: user3.id,
        spotId: spot3.id,
        review: '...',
        stars: 5,
      },
      {
        userId: user3.id,
        spotId: spot4.id,
        review: '...',
        stars: 5,
      }
    ]);

    // sakura98 Reviews
    const user4 = await User.findOne({ where: { username: Users[3].username }, raw: true });
    await Review.create({
      userId: user4.id,
      spotId: spot3.id,
      review: 'I love the view from this place! So close to everything.',
      stars: 5,
    })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op  = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      // Change this to account for Database changes and delete according to userId
      stars : { [Op.between]: [1, 5] }
    }, {})
  }
};
