const express = require('express')
const Sequelize = require('sequelize')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');
const { User, Spot, ReviewImage, Review } = require('../../db/models');

const router = express.Router();

// TODO Maybe move this and other handlers into another route
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
        handleValidationErrors
];

// * Current User's review
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;

    const userReviews = await Review.findAll({
        where: {
            userId: user.id
        },
        attributes: { include: ['id'] },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
            },
        ]
    });

    for (let review of userReviews) {
        const images = await ReviewImage.findAll({
            where: {reviewId: review.dataValues.id},
            attributes: ['id', 'url']
        });
        review.dataValues.ReviewImages = images
    }

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

// * Create Review Images
router.post('/:reviewId/images', requireAuth, async(req, res, next) => {
    const { user } = req;
    const { url } = req.body;

    const review = await Review.findOne({
        where: {id : req.params.reviewId},
        attributes: { include: ['id']}
    });
    // Check if review exists
    if (!review) {
        const err = new Error(`Couldn't find a Review with the specified id`);
        err.title = "Resource Not Found";
        err.errors = { message: `Review couldn't be found`};
        err.status = 404;
        return next(err);
    };

    // Checks if user owns the Review
    if (user.id !== review.userId) {
        const err = new Error("Review must belong to the current user.");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    };

    // Checks if review has more than 10 images
    console.log(review);
    const allReviewImages = await ReviewImage.findAll({
        where: {
            reviewId: review.id
        }
    });
    if (allReviewImages.length >= 10) {
        const err = new Error("Cannot add any more images because there is a maximum of 10 images per resource");
        err.title = "Exceeded Max Images";
        err.errors = { message: "Maximum number of images for this resource was reached" };
        err.status = 403;
        return next(err);
    };

    // Build new ReviewImage
    const newReviewImage = await ReviewImage.build({
        reviewId: review.id,
        url,
    })

    await newReviewImage.save();

    res.json({
        id: newReviewImage.id,
        url: newReviewImage.url
    })
});

// * Edit Review
router.put('/:reviewId', [requireAuth, validateReview], async(req, res, next) => {
    const { user } = req;
    const { review, stars } = req.body;

    const userReview = await Review.findOne({where: {id : req.params.reviewId}})
    // Check if review exists
    console.log(userReview);
    if (!userReview) {
        const err = new Error(`Couldn't find a Review with the specified id`);
        err.title = "Resource Not Found";
        err.errors = { message: `Review couldn't be found`};
        err.status = 404;
        return next(err);
    };

    // Checks if user owns the Review
    if (user.id !== userReview.userId) {
        const err = new Error("Review must belong to the current user.");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    };

    userReview.review = review;
    userReview.stars = stars;

    await userReview.save();

    res.json(userReview)
});

// * Delete Review
router.delete('/:reviewId', requireAuth, async(req, res, next) => {
    const { user } = req;

    const userReview = await Review.findOne({where: {id: req.params.reviewId}});
    // Check if review exists
    if (!userReview) {
        const err = new Error(`Couldn't find a Review with the specified id`);
        err.title = "Resource Not Found";
        err.errors = { message: `Review couldn't be found`};
        err.status = 404;
        return next(err);
    };

    // Checks if user owns the Review
    if (user.id !== userReview.userId) {
        const err = new Error("Review must belong to the current user.");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    };

    await userReview.destroy();

    res.json({
        message: "Successfully deleted"
    })
});

module.exports = router;
