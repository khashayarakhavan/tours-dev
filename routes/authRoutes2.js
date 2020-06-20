const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// callback route for google to redirect to + using passport middleWare to add req.user to the request.
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

module.exports = router;
