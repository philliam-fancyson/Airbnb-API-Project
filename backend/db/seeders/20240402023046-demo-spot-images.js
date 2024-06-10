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
    //spot1
    const spot1 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[0].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot1.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1717993815/sfApartment_evoqqt.webp",
        preview: true,
      },
      {
        spotId: spot1.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034723/1000_F_561086014_SOomcF3Z62sM5iQ592WvwPCGFgnslsBb_s8jo9l.jpg",
        preview: false
      },
      {
        spotId: spot1.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034723/1000_F_125977613_1hrQWUcUvhD16JyveSr7ksFXFC8hIxi9_trebcf.jpg",
        preview: false
      },
      {
        spotId: spot1.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/1000_F_261892957_6jyBXvEgM79iYr1eEiJKCosnVPJdvHHr_sdemoz.jpg",
        preview: false
      },
      {
        spotId: spot1.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/6924-Waters-Edge-Rear-elevation-fire-pit_1600x_gtkkeg.webp",
        preview: false
      },
    ]);

    //spot2
    const spot2 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[1].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot2.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: true,
      },
      {
        spotId: spot2.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot2.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot2.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot2.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    // spot 3
    const spot3 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[2].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot3.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034723/1000_F_125977613_1hrQWUcUvhD16JyveSr7ksFXFC8hIxi9_trebcf.jpg",
        preview: true,
      },
      {
        spotId: spot3.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot3.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot3.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot3.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    // spot 3
    const spot4 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[3].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot4.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/1000_F_261892957_6jyBXvEgM79iYr1eEiJKCosnVPJdvHHr_sdemoz.jpg",
        preview: true,
      },
      {
        spotId: spot4.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot4.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot4.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot4.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    // spot5
    const spot5 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[4].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot5.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/6924-Waters-Edge-Rear-elevation-fire-pit_1600x_gtkkeg.webp",
        preview: true,
      },
      {
        spotId: spot5.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot5.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot5.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot5.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    //spot6
    const spot6 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[5].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot6.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/4281285a8726780ffded0638744ed8110671e974_pzwo7x.webp",
        preview: true,
      },
      {
        spotId: spot6.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot6.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot6.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot6.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    //spot7
    const spot7 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[6].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot7.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: true,
      },
      {
        spotId: spot7.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot7.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot7.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot7.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    //spot 8
    const spot8 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[7].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot8.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/DSC_5979_myhulc.webp",
        preview: true,
      },
      {
        spotId: spot8.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot8.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot8.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot8.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    const spot9 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[8].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot9.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: true,
      },
      {
        spotId: spot9.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot9.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot9.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot9.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    // spot10
    const spot10 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[9].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot10.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_64230_N_n5vfil.webp",
        preview: true,
      },
      {
        spotId: spot10.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot10.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot10.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot10.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    // spot11
    const spot11 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[10].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot11.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034726/images_fwrnld.jpg",
        preview: true,
      },
      {
        spotId: spot11.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot11.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot11.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot11.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    // spot12
    const spot12 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[11].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot12.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034726/image_xfg68a.jpg",
        preview: true,
      },
      {
        spotId: spot12.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot12.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot12.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot12.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    // spot13
    const spot13 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[12].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot13.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034727/intro-1639672877_feyanj.jpg",
        preview: true,
      },
      {
        spotId: spot13.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot13.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot13.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot13.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    // spot14
    const spot14 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[13].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot14.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034727/luxury-home-design-on-budget_hvo9bu.jpg",
        preview: true,
      },
      {
        spotId: spot14.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot14.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot14.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot14.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    // spot15
    const spot15 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[14].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot15.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034730/360_F_553740783_qZ4iSN1tTqbfsXtpAo2D1v2AE5TvVxna_jmc6zj.jpg",
        preview: true,
      },
      {
        spotId: spot15.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot15.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot15.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot15.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    // spot16
    const spot16 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[15].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot16.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034728/Terrace20Living_20Room_gkzyih.webp",
        preview: true,
      },
      {
        spotId: spot16.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot16.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot16.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot16.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    // spot17
    const spot17 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[16].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot17.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034728/qyzck2kk3uzmhaufako9.webp",
        preview: true,
      },
      {
        spotId: spot17.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot17.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot17.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot17.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    // spot18
    const spot18 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[17].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot18.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034729/3ec3866a5e909014446d4ea61b04ae662bd55085_yzo8cg.jpg",
        preview: true,
      },
      {
        spotId: spot18.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot18.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot18.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot18.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);

    const spot19 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[18].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot19.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034729/6e3009b923f474f1336428676ec08676c833e640_2000x2000_r08rs1.webp",
        preview: true,
      },
      {
        spotId: spot19.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot19.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot19.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot19.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);


    const spot20 = await Spot.findOne({
      raw: true,
      attributes: ['id'],
      where: { name: Spots[19].name}
    });

    await SpotImage.bulkCreate([
      {
        spotId: spot20.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034729/150-van-ness-ave-san-francisco-ca-heated-pool_ofdzic.jpg",
        preview: true,
      },
      {
        spotId: spot20.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot20.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot20.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034724/apartments-fantasy_nieox4.jpg",
        preview: false
      },
      {
        spotId: spot20.id,
        url: "https://res.cloudinary.com/djoayqv3y/image/upload/v1718034725/grid_0_640_N_j8zarg.webp",
        preview: false
      },
    ]);




    // for (let i = 0; i < Spots.length; i++) {
    //   const spot = await Spot.findOne({
    //     raw: true,
    //     attributes: ['id'],
    //     where: { name: Spots[i].name}
    //   });
    //   await SpotImage.bulkCreate([
    //     {
    //       spotId: spot.id,
    //       url: 'image url',
    //       preview: true,
    //     },
    //     {
    //       spotId: spot.id,
    //       url: 'image url',
    //       preview: false,
    //     },
    // ])}
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {

    }, {})
  }
};
