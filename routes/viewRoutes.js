const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/sign-up',  viewsController.getSignUpForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours',
// BookingCheckout will handle bookings after successfull checkout in the Development env.
// bookingController.createBookingCheckout, 
authController.protect, 
viewsController.getMyTours);

router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

module.exports = router;
