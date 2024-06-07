const express = require('express')
const Sequelize = require('sequelize')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

const Op = Sequelize.Op;

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

const validateDates = [
    check('startDate')
        .toDate()
        .isAfter( {comparisonDate: Date().toString() })
        .withMessage('startDate cannot be in the past'),
    check('endDate')
        .toDate()
        .custom((value, { req }) => {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(value);
            if (endDate <= startDate) {
                throw new Error('endDate cannot be on or before startDate')
            }
            return true;
        }),
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
        };
    };
};

const handleQueries = [
    check('page')
        .optional()
        .isInt( {min: 1, max: 10})
        .withMessage("Page must be greater than or equal to 1"),
    check('size')
        .optional()
        .isInt( {min: 1, max: 20})
        .withMessage("Size must be greater than or equal to 1"),
    check('minLat')
        .optional()
        .isFloat( {min: -90} )
        .withMessage("Minimum latitude is invalid"),
    check('maxLat')
        .optional()
        .isFloat( {max: 90} )
        .withMessage("Maximum latitude is invalid"),
    check('minLng')
        .optional()
        .isFloat( {min: -180} )
        .withMessage("Minimum longitude is invalid"),
    check('maxLng')
        .optional()
        .isFloat( {max: 180} )
        .withMessage("Maximum longitude is invalid"),
    check('minPrice')
        .optional()
        .isFloat( {min: 0} )
        .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
        .optional()
        .isFloat( {min: 0} )
        .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
];

// * All Spots
router.get('/', handleQueries, async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    if (!page) page = 1;
    if (!size) size = 20;

    page = parseInt(page);
    size = parseInt(size);

    const pagination = {};

    pagination.limit = size;
    pagination.offset = size * (page - 1);

    let where = {};

    minLat = minLat ? minLat : -90;
    maxLat = maxLat ? maxLat : 90;
    minLng = minLng ? minLng : -180;
    maxLng = maxLng ? maxLng : 180;
    minPrice = minPrice ? minPrice : 0;
    maxPrice = maxPrice ? maxPrice : 1000;

    where.lat = { [Op.between] : [minLat, maxLat]};
    where.lng = { [Op.between] : [minLng, maxLng]};
    where.price = { [Op.between] : [minPrice, maxPrice]};

    const allSpots = await Spot.findAll({
        where,
        ...pagination
    });

    for (let spot of allSpots) {
        const avgRating = await Review.findAll({
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']
            ],
            where: { spotId: spot.id},
            raw: true
        })
        spot.dataValues.avgRating = avgRating[0].avgRating;

        const spotPreviewImage = await SpotImage.findOne({
            where: {
                spotId: spot.id,
                preview: true
            }
        });
        const previewImage = spotPreviewImage ? spotPreviewImage.url : null;
        spot.dataValues.previewImage = previewImage;
    }

    res.json({
        Spots: allSpots,
        page, size
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
        if (spot.dataValues.SpotImages.length === 0) {
            spot.dataValues.SpotImages = null;
        };
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
router.get('/:spotId/reviews', async(req, res, next) => {

    const spot = await Spot.findByPk(req.params.spotId);
    // Check if spot exists
    if (!spot) {
        const err = new Error(`Couldn't find a Spot with the specified id`);
        err.title = "Resource Not Found";
        err.errors = { message: `Spot couldn't be found`};
        err.status = 404;
        return next(err);
    };

    const userReviews = await Review.findAll({
        where: {
           spotId: spot.id
        },
        attributes: { include: ['id'] },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });

    if (userReviews.length >= 1) {
        for (let review of userReviews) {
            let reviewImages = await ReviewImage.findAll({
                where: { reviewId: review.id},
                attributes: ['id', 'url']
            })
            review.dataValues.ReviewImage = reviewImages.length > 0 ? reviewImages : null;
        };
        res.json({
            Reviews: userReviews
        });
    } else {
        res.json({
            message: `No Reviews for this place yet`
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
    });

    // Add User data if user is owner; if not, send only booking data
    if (user.id === spot.ownerId) {
        for (let booking of spotBookings) {
            const userBooking = await User.findOne({
                where: {
                    id: booking.userId
                },
                attributes: ['id', 'firstName', 'lastName']
            });
            booking.dataValues.User = userBooking
        }
        res.json({
            Bookings: spotBookings
        })
    } else {
        let payload = [];
        for (let booking of spotBookings) {
            const { spotId, startDate, endDate } = booking;
            payload.push({ spotId, startDate, endDate })
        }
        res.json({
            Bookings: payload
        })
    };
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
        const err = new Error("Forbidden");
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
            spotId: parseInt(req.params.spotId),
            userId: user.id
        }
    });

    if (userReview.length >= 1) {
        const err = new Error(`Review from the current user already exists for the Spot`);
        err.title = "User Already Has Review";
        err.errors = { message: `User already has a review for this spot`};
        err.status = 500;
        return next(err);
    }

    // Build new Review
    const newReview = await Review.create({
        userId: req.user.id,
        spotId: req.params.spotId,
        review,
        stars,
    });

    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json')
    res.json(newReview);
});

// * Create a Booking for :spotId
router.post('/:spotId/bookings', [requireAuth, validateDates], async(req, res, next) => {
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
        const err = new Error("Forbidden.");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    };

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

    let booking2 = await Booking.findAll({
        where: {
            spotId: spot.id,
            [Op.and]: [
                { startDate: { [Op.lte]: reqStartDate }}, { endDate: { [Op.gte]: reqStartDate}},
                [{ startDate: { [Op.lte]: reqEndDate }}, { endDate: { [Op.gte]: reqEndDate}}]
            ]
        }
    });

    if (booking.length >= 1) return handleBookingOverlapErrors(reqStartDate, reqEndDate, booking, next)
    else if (booking2.length >= 1) return handleBookingOverlapErrors(reqStartDate, reqEndDate, booking2, next)
    else {
        booking = await Booking.create({
            spotId: spot.id,
            userId: user.id,
            startDate: reqStartDate,
            endDate: reqEndDate
        });
    };

    console.log(booking)

    res.json({
        id: booking.dataValues.id,
        spotId: booking.dataValues.spotId,
        userId: booking.dataValues.userId,
        startDate: booking.dataValues.startDate,
        endDate: booking.dataValues.endDate
    });
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
        const err = new Error("Forbidden.");
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
        const err = new Error("Forbidden");
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
