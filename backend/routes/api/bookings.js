const express = require('express')
const Sequelize = require('sequelize')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');
const { User, Spot, Booking} = require('../../db/models');

const router = express.Router();

// Current User's bookings
router.get('/current', requireAuth, async(req, res) => {
    const { user } = req;

    const userBookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        attributes: { // ! Not returning Id initally again
            include : ['id']
        },
        include: {
            model: Spot,
        }
    });

    res.json({
        Bookings: (userBookings)
    });
});

router.put('/:bookingId', requireAuth, async(req, res) => {
    const { user } = req;

    const booking = await Booking.findByPk(req.params.spotId)
    // Check if booking exists
    // TODO can be a function
    if (!booking) {
        const err = new Error(`Couldn't find a Booking with the specified id`);
        err.title = "Resource Not Found";
        err.errors = { message: `Booking couldn't be found`};
        err.status = 404;
        return next(err);
    }
    // Checks if user owns the booking
    if (user.id !== booking.ownerId) {
        const err = new Error("Booking must belong to the current user.");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    }
})

module.exports = router;
