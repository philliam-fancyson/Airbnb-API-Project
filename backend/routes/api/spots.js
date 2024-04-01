const express = require('express')
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');
const { User, Spot } = require('../../db/models');

const router = express.Router();

// All Spots
router.get('/', async (req, res) => {
    const allSpots = await Spot.findAll()
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
        }
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
    const spot = await Spot.findByPk(req.params.spotId);
    if (spot) {
        const spotOwner = await User.findByPk(spot.ownerId);
        const { id, ownerId, address, city, state, country, previewImage,
                lat, lng, name, description, price, createdAt, updatedAt } = spot;
        // put in spots here
        res.json({
            id, ownerId, address, city, state, country,
            lat, lng, name, description, price, createdAt, updatedAt,
            numReviews: 'placeholder', // Aggregate Data

            avgStarRating: 'placeholder', // Aggregate Data
            // Spot data returns associated data for SpotImages, an array of image
            // data including the id, url, and preview
            SpotImages: previewImage.toString(),
            Owner: {
                id: spotOwner.id,
                firstName: spotOwner.firstName,
                lastName: spotOwner.lastName,
            }
        })
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            message: `Spot couldn't be found`
        });
    };
});

router.post('/:spotId/images', async(req, res) => {
    const { url, preview } = req.body;

    res.json({test})
})

module.exports = router;
