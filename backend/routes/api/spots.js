const express = require('express')
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review } = require('../../db/models');

const router = express.Router();

// All Spots
router.get('/', async (req, res) => {
    const allSpots = await Spot.findAll({
        logging: console.log,
        attributes: {
            include: [
                [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
                [Sequelize.fn('', Sequelize.col('SpotImages.url')), 'previewImage']
            ]
        },
        include: [
            {
                model: SpotImage,
                attributes: [],
                where: {
                    preview: true
                },
                required: false
            },
            {
                model: Review,
                attributes: [],
            }
        ],
        group: ['Spot.id', 'SpotImages.url']
    });

    res.json({
        Spots: allSpots
    });
});

// Current User's Spots
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;

    const userSpots = await Spot.findAll({
        raw: true,
        where: {
            ownerId: user.id
        },
        attributes: {
            include: [
                [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
                [Sequelize.col('SpotImages.url'), 'previewImage']
            ]
        },
        include: [
            {
                model: SpotImage,
                attributes: [],
                where: {
                    preview: true
                },
                required: false
            },
            {
                model: Review,
                attributes: [],
            }
        ],
        group: ['Spot.id', 'SpotImages.url']
    });

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
        attributes: {
            include: [
                [Sequelize.fn('COUNT', Sequelize.col('Reviews.spotId')), 'numReviews'],
                [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgStarRating'],
            ]
        },
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview'],
            },
            {
                model: User,
                as: 'Owner',
                attributes: ['id', 'firstName', 'lastName'],
            }
        ],
        group: ['Spot.id', 'SpotImages.id', 'Owner.id']
    });
    if (spot) {
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
