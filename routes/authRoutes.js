const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.alerts); // always check for alerts in queries.

router.get('/google', authController.oauthGoogle);

// callback route for google to redirect to + using passport middleWare to add req.user to the request.
router.get(
  '/google/callback',
  authController.oauthGoogleCallback,
  viewsController.getOverview
);

module.exports = router;
