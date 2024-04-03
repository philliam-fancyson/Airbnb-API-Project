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
  { username: 'sakura98' }
];

const Spots = [
  { name: '2Fort' },
  { name: 'Speedwagon Foundation' },
  { name: 'Urban Square Towers' },
  { name: 'Laundromat' }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // All Spots
    const spot1 = await Spot.findOne({ raw: true, where: { name: Spots[0].name} })
    const spot2 = await Spot.findOne({ raw: true, where: { name: Spots[1].name} })
    const spot3 = await Spot.findOne({ raw: true, where: { name: Spots[2].name} })
    const spot4 = await Spot.findOne({ raw: true, where: { name: Spots[3].name} })

    // Demoman Reviews
    const user1 = await User.findOne({ where: { username: Users[0].username }, raw: true });
    await Review.create({
      userId: user1.id,
      spotId: spot1.id,
      review: 'This was an awesome Spot!',
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
