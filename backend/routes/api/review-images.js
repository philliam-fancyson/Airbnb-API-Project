const express = require('express')
const Sequelize = require('sequelize')

const { requireAuth } = require('../../utils/auth');
const { User, Review, ReviewImage } = require('../../db/models');

const router = express.Router();

// Delete image from Review
// ! TypeError: Cannot read properties of undefined (reading 'field')
router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const { user } = req;

    const reviewImage = await ReviewImage.findByPk(req.params.imageId);
    // Check if Review's Image exists
    if (!reviewImage) {
        const err = new Error(`Couldn't find a Review Image with the specified id`);
        err.title = "Resource Not Found";
        err.errors = { message: `Review Image couldn't be found`};
        err.status = 404;
        return next(err);
    };
    // Checks if user owns the Review
    const review = await Review.findOne({where: { id: reviewImage.dataValues.reviewId }});
    if (user.id !== review.userId) {
        const err = new Error("Review must belong to the current user.");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    }

    await reviewImage.destroy();

    res.json({
        messsage: "Successfully deleted"
    });
});

module.exports = router;
