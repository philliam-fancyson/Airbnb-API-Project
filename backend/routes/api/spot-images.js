const express = require('express')
const Sequelize = require('sequelize')

const { requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage } = require('../../db/models');

const router = express.Router();

// Delete image from Spot
router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const { user } = req;

    const spotImage = await SpotImage.findByPk(req.params.imageId,{
        include: { model: Spot }
    });
    // Check if Spot's Image exists
    if (!spotImage) {
        const err = new Error(`Couldn't find a Spot Image with the specified id`);
        err.title = "Resource Not Found";
        err.errors = { message: `Spot Image couldn't be found`};
        err.status = 404;
        return next(err);

    }
    // Checks if user owns the spotImage
    if (user.id !== spotImage.Spot.ownerId) {
        const err = new Error("Forbidden");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    }

    await spotImage.destroy();

    res.json({
        messsage: "Successfully deleted"
    });
});

module.exports = router;
