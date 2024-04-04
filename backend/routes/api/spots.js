const express = require('express')
const Sequelize = require('sequelize')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .isFloat({ min: -90, max: 90})
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .isFloat({ min: -180, max: 180})
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .isLength({ min: 1, max: 50})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .isFloat({ min: 0, max: Infinity})
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

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

const handleBookingOverlapErrors = (reqStartDate, reqEndDate, booking, next) => {
    const err = new Error('Sorry, this spot is already booked for the specified dates ');
    err.title = 'Booking Conflict'
    err.status = 403;
    for (let books of booking) {
        const startDateError = `Start date conflicts with an existing booking`;
        const endDateError = `End date conflicts with an existing booking`;
        const startDateCheck = reqStartDate >= books.startDate && reqStartDate <= books.endDate;
        const endDateCheck = reqEndDate >= books.startDate && reqEndDate <= books.endDate

        if (startDateCheck) {
            if (endDateCheck) err.errors = { startDate: startDateError, endDate: endDateError};
            else err.errors = { startDate: startDateError};
            return next(err);
        };
        if (endDateCheck) {
            err.errors = { endDate: endDateError};
            return next(err);
        };
        if ((books.startDate >= reqStartDate && books.startDate <= reqEndDate) ||
            (books.endDate >= reqStartDate && books.endDate <= reqEndDate)) {
                err.errors = { startDate: startDateError, endDate: endDateError};
                return next(err);
            }
    };
};

// * All Spots
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

// * Current User's Spots
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
        // TODO Throw to error Handler
        res.json({
            message: 'No Spots to show'
        });
    };
});

// * :spotId Spot
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
        // TODO  Throw to error handler
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            message: `Spot couldn't be found`
        });
    };
});

// * All :spotId's Reviews
router.get('/:spotId/reviews', async(req, res) => {
    const userReviews = await Review.findAll({
        where: {
           spotId: req.params.spotId
        },
        // attributes: { include: ['id'] },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            // ! Review Image model reading undefined
            // {
            //     model: ReviewImage
            // }
        ]
    });

    if (userReviews.length >= 1) {
        res.json({
            Review: userReviews
        })
    } else {
        // ! Throw Error response here
        res.json({
            message: `Spot couldn't be found`
        });
    };
});

// * All :spotId's Bookings
router.get('/:spotId/bookings', requireAuth, async(req, res, next) => {
    const { user } = req;

    // Check if spot exists
    const spot = await Spot.findOne({
        where: {
            id: req.params.spotId
        }
    });
    if (!spot) {
        const err = new Error(`Couldn't find a Spot with the specified id`);
        err.title = "Resource Not Found";
        err.errors = { message: `Spot couldn't be found`};
        err.status = 404;
        return next(err);
    };

    // Get Bookings for Spot
    const spotBookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        },
        attributes: ['spotId', 'startDate','endDate', 'userId'] // workaround for displaying necessary information
    });

    // TODO: Build a payload and ammo for payload Bookings so that you can just append the data into
    // Add User data if user is owner
    if (user.id === spot.ownerId) {
        for (let booking of spotBookings) {
            const userBooking = await User.findOne({
                where: {
                    id: booking.userId
                },
                attributes: ['id', 'firstName', 'lastName']
            });
            booking.dataValues.createdAt = userBooking.createdAt
            booking.dataValues.User = userBooking
        }
    };

    res.json({
        Bookings: spotBookings
    })
})

// * Create a new Spot
router.post('/', [requireAuth, validateSpot], async(req, res, next) => {
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

// * Create Spot Images
router.post('/:spotId/images', requireAuth, async(req, res, next) => {
    const { user } = req;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(req.params.spotId)
    // Checks if spot exists
    if (!spot) {
        const err = new Error(`Couldn't find a Spot with the specified id`);
        err.title = "Resource Not Found";
        err.errors = { message: `Spot couldn't be found`};
        err.status = 404;
        return next(err);
    };

    // Checks if user owns the spot
    if (user.id !== spot.ownerId) {
        const err = new Error("Spot must belong to the current user.");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    }

    // Build new SpotImage
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
});

// * Create a new Review for Spot based on Spot's id
router.post('/:spotId/reviews', [requireAuth, validateReview], async(req, res, next) => {
    const { user } = req;
    const { review, stars } = req.body;

    // Checks if spot exists
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
        const err = new Error(`Couldn't find a Spot with the specified id`);
        err.title = "Resource Not Found";
        err.errors = { message: `Spot couldn't be found`};
        err.status = 404;
        return next(err);
    };

    // Check if user already has a review for this Spot
    const userReview = await Review.findAll({
        where: {
            spotId: req.params.spotId,
            userId: user.id
        }
    });

    console.log(userReview.length >= 1);
    if (userReview.length >= 1) {
        const err = new Error(`Review from the current user already exists for the Spot`);
        err.title = "User Already Has Review";
        err.errors = { message: `User already has a review for this spot`};
        err.status = 500;
        return next(err);
    }

    // Build new Review
    const newReview = await Review.build({
        userId: req.user.id,
        spotId: req.params.spotId,
        review,
        stars,
    });
    // TODO For some reason not returning id of review, look into review
    // TODO because creating a spot returns id
    await newReview.save();
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json')
    res.json(newReview);
});

// * Create a Booking for :spotId
router.post('/:spotId/bookings', requireAuth, async(req, res, next) => {
    const { user } = req;
    const { startDate, endDate } = req.body;

    const reqStartDate = new Date(startDate);
    const reqEndDate = new Date(endDate);

    const spot = await Spot.findByPk(req.params.spotId)
    // Check if spot exists
    // TODO Could be a function
    if (!spot) {
        if (!spot) {
            const err = new Error(`Couldn't find a Spot with the specified id`);
            err.title = "Resource Not Found";
            err.errors = { message: `Spot couldn't be found`};
            err.status = 404;
            return next(err);
        };
    };

    // Check if user is owner of spot
    // TODO could be a function
    if (user.id === spot.ownerId) {
        const err = new Error("Spot must NOT belong to the current user.");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    };

    const Op = Sequelize.Op;
    // Check if booking already exists for date; if not, create a booking
    let booking = await Booking.findAll({
        where: {
            spotId: spot.id,
            [Op.or]: [
                { startDate: { [Op.between]: [reqStartDate, reqEndDate] }},
                { endDate: { [Op.between]: [reqStartDate, reqEndDate] }} ,
            ]
        }
    });
    if (booking.length >= 1) handleBookingOverlapErrors(reqStartDate, reqEndDate, booking, next)
    else {
        booking = await Booking.create({
            spotId: spot.id,
            userId: user.id,
            startDate: reqStartDate,
            endDate: reqEndDate
        })
    }

    res.json({booking});
});

// * Edit a Spot
router.put('/:spotId', [requireAuth, validateSpot], async(req, res, next) => {
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(req.params.spotId)
    // Check if spot exists
    if (!spot) {
        const err = new Error(`Couldn't find a Spot with the specified id`);
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

// * Delete Spot
router.delete('/:spotId', requireAuth, async(req, res, next) => {
    const { user } = req;

    const spot = await Spot.findByPk(req.params.spotId)
        // Check if spot exists
    if (!spot) {
        const err = new Error(`Couldn't find a Spot with the specified id`);
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
