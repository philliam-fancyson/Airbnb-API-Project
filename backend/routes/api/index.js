const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const spotImagesRouter = require('./spot-images.js');
const reviewsRouter = require('./reviews.js')
const reviewImagesRouter = require('./review-images.js');
const bookingsRouter = require('./bookings.js')
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);
//Session route
router.use('/session', sessionRouter);
// Users route
router.use('/users', usersRouter);
// Spots route
router.use('/spots', spotsRouter);
// Spot Images route
router.use('/spot-images', spotImagesRouter);
// Reviews route
router.use('/reviews', reviewsRouter);
// Review Images route
router.use('/review-images', reviewImagesRouter);
// Bookings route
router.use('/bookings', bookingsRouter)

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
