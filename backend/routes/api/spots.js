const express = require('express')
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage } = require('../../db/models');

const router = express.Router();

// All Spots
router.get('/', async (req, res) => {
    const allSpots = await Spot.findAll()

    for (let spot of allSpots) { // This gives us the images. Do the same for aggregate data reviews
        const previewImage = await SpotImage.findOne({
            where: {
                spotId: spot.id,
                preview: true,
            }
        });
        if (!previewImage) {
            spot.dataValues.previewImage = null;
        } else {
            spot.dataValues.previewImage = previewImage.url;
        }
    };


    res.json({
        Spots: allSpots
    });
});

// Current User's Spots
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;

    const userSpots = await Spot.findAll({
        where: {
            ownerId: user.id
        },
    });

    for (let spot of userSpots) {
        const previewImage = await SpotImage.findOne({ // This gives us the images. Do the same for aggregate data reviews
            where: {
                spotId: spot.id,
                preview: true,
            }
        });
        if (!previewImage) {
            spot.dataValues.previewImage = null;
        } else {
            spot.dataValues.previewImage = previewImage.url;
        }
    };

    if (userSpots.length >= 1) {
        res.json({
            Spots: userSpots
        })
    } else {
        res.json({
            message: 'No Spots to show'
        });
    };
});

// :spotId Spot
router.get('/:spotId', async(req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: { // Fix this too
            model: SpotImage,
            attributes: ['id', 'url', 'preview'],
        }
    });
    if (spot) {
        // const spotOwner = await User.findByPk(spot.ownerId);
        // const { id, ownerId, address, city, state, country, previewImage,
        //         lat, lng, name, description, price, createdAt, updatedAt } = spot;
        // // put in spots here
        // res.json({
        //     id, ownerId, address, city, state, country,
        //     lat, lng, name, description, price, createdAt, updatedAt,
        //     numReviews: 'placeholder', // Aggregate Data

        //     avgStarRating: 'placeholder', // Aggregate Data
        //     // Spot data returns associated data for SpotImages, an array of image
        //     // data including the id, url, and preview
        //     SpotImages: previewImage.toString(),
        //     Owner: {
        //         id: spotOwner.id,
        //         firstName: spotOwner.firstName,
        //         lastName: spotOwner.lastName,
        //     }
        // })

        res.json(spot);
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            message: `Spot couldn't be found`
        });
    };
});

// Create a new Spot
router.post('/', requireAuth, async(req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const newSpot = await Spot.build({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    await newSpot.save();
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json')
    res.json(newSpot);
})

// Add Spot Images
router.post('/:spotId/images', requireAuth, async(req, res, next) => {
    const { user } = req;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(req.params.spotId)
    // Checks if spot exists
    if (!spot) {
        const err = new Error(`Spot couldn't be found`);
        err.title = "Resource Not Found";
        err.errors = { message: `Spot couldn't be found`};
        err.status = 404;
        return next(err);

    }
    // Checks if user owns the spot
    if (user.id !== spot.ownerId) {
        const err = new Error("Spot must belong to the current user.");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    }

    const newSpotImage = await SpotImage.build({
        spotId: spot.id,
        url,
        preview
    })

    await newSpotImage.save();

    res.json({
        id: newSpotImage.id,
        url: newSpotImage.url,
        preview: newSpotImage.preview
    });
})

// Edit a Spot
router.put('/:spotId', requireAuth, async(req, res, next) => {
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(req.params.spotId)
    // Check if spot exists
    if (!spot) {
        const err = new Error(`Spot couldn't be found`);
        err.title = "Resource Not Found";
        err.errors = { message: `Spot couldn't be found`};
        err.status = 404;
        return next(err);

    }
    // Checks if user owns the spot
    if (user.id !== spot.ownerId) {
        const err = new Error("Spot must belong to the current user.");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    }

    // Maybe check if values are empty and then try to overwrite those details???
    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    await spot.save();

    res.json(spot);
});

router.delete('/:spotId', requireAuth, async(req, res, next) => {
    const { user } = req;

    const spot = await Spot.findByPk(req.params.spotId)
        // Check if spot exists
    if (!spot) {
        const err = new Error(`Spot couldn't be found`);
        err.title = "Resource Not Found";
        err.errors = { message: `Spot couldn't be found`};
        err.status = 404;
        return next(err);

    }
    // Checks if user owns the spot
    if (user.id !== spot.ownerId) {
        const err = new Error("Spot must belong to the current user.");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    }

    await spot.destroy();

    res.json({
        messsage: "Successfully deleted"
    });
});

module.exports = router;
