const express = require('express');
const passport = require('passport');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.use(viewsController.alerts); // always check for alerts in queries.

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// callback route for google to redirect to + using passport middleWare to add req.user to the request.
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/sign-up' }),
  authController.signupGoogle
  // authController.protect,
  // viewsController.getAccount
);

module.exports = router;
