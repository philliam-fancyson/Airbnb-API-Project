const express = require('express')
const Sequelize = require('sequelize')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');
const { User, Spot, ReviewImage, Review } = require('../../db/models');

const router = express.Router();

// ! Insert review Validators here

// Current User's review
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;

    // const userReviews = await Review.findAll({
    //     where: {
    //         userId: user.id
    //     },
    //     // attributes: { include: ['id'] },
    //     include: [
    //         {
    //             model: User,
    //             attributes: ['id', 'firstName', 'lastName']
    //         },
    //         {
    //             model: Spot,
    //             attributes: {
    //                 exclude: ['createdAt', 'updatedAt']
    //             },
    //         },
    //     ]
    // });
    const userReviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: {
            model: ReviewImage,
            required: false
        }
    })
    console.log(userReviews)

    if (userReviews.length >= 1) {
        res.json({
            Review: userReviews
        })
    } else {
        res.json({
            message: 'No Reviews to show'
        });
    };
});


module.exports = router;
