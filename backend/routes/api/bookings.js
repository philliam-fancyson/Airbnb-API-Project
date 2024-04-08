const express = require('express')
const Sequelize = require('sequelize')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');
const { User, Spot, Booking} = require('../../db/models');

const Op = Sequelize.Op;

const router = express.Router();

// TODO put in another file for Create to use
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

// Edit User's booking
router.put('/:bookingId', [requireAuth, validateDates], async(req, res, next) => {
    const { user } = req;
    const { startDate, endDate } = req.body;

    const reqStartDate = new Date(startDate);
    const reqEndDate = new Date(endDate);

    const booking = await Booking.findByPk(req.params.bookingId)
    // Check if booking exists
    // TODO can be a function
    if (!booking) {
        const err = new Error(`Couldn't find a Booking with the specified id`);
        err.title = "Resource Not Found";
        err.errors = { message: `Booking couldn't be found`};
        err.status = 404;
        return next(err);
    };
    // Checks if user owns the booking
    // TODO can be a function
    if (user.id !== booking.userId) {
        const err = new Error("Forbidden");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    };

    // Check if booking is in the past
    if (booking.endDate < Date.now()) {
        const err = new Error("Forbidden");
        err.title = "Forbidden";
        err.errors = { message: "Past bookings can't be modified" };
        err.status = 403;
        return next(err);
    };

    // Check for overlaps
    const spotBookings = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            [Op.or]: [
                { startDate: { [Op.between]: [reqStartDate, reqEndDate] }},
                { endDate: { [Op.between]: [reqStartDate, reqEndDate] }},
            ],
            id: { [Op.ne]: req.params.bookingId}
        }
    });

    let spotBookings2 = await Booking.findAll({
        where: {
            spotId: booking.spotId,
            [Op.and]: [
                { startDate: { [Op.lt]: reqStartDate }}, { endDate: { [Op.gt]: reqStartDate}},
                { startDate: { [Op.lt]: reqEndDate }}, { endDate: { [Op.gt]: reqEndDate}},
            ],
            id: { [Op.ne]: req.params.bookingId}
        }
    });

    console.log(spotBookings2);

    if (spotBookings.length >= 1) return handleBookingOverlapErrors(reqStartDate, reqEndDate, spotBookings, next);
    else if (spotBookings2.length >= 1) return handleBookingOverlapErrors(reqStartDate, reqEndDate, spotBookings2, next);
    else {
        booking.startDate = reqStartDate;
        booking.endDate = reqEndDate;
        await booking.save();
    };

    res.json(booking);
});

// Delete a User's booking
router.delete('/:bookingId', requireAuth, async(req, res, next) => {
    const { user } = req;

    const booking = await Booking.findByPk(req.params.bookingId);

    // Check if booking exists
    if (!booking) {
        const err = new Error(`Couldn't find a Booking with the specified id`);
        err.title = "Resource Not Found";
        err.errors = { message: `Booking couldn't be found`};
        err.status = 404;
        return next(err);
    };

    // Checks if user owns the booking
    if (user.id !== booking.userId) {
        const err = new Error("Forbidden");
        err.title = "Forbidden";
        err.errors = { message: "Forbidden" };
        err.status = 403;
        return next(err);
    };


    // Check if booking is in the past or ongoing
    if (booking.startDate <= Date.now()) {
        const err = new Error("Forbidden");
        err.title = "Forbidden";
        err.errors = { message: "Bookings that have been started can't be deleted" };
        err.status = 403;
        return next(err);
    };

    await booking.destroy();

    res.json({
        messsage: "Successfully deleted"
    });
})

module.exports = router;
