const passport = require('passport');
const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewsController');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // callback route for google to redirect to + using passport middleWare to add req.user to the request.
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/sign-up' }),
    authController.signupGoogle,
    authController.protect,
    viewsController.getAccount
    // function(req, res) {
    //   // Successful authentication, redirect home.
    //   res.redirect('/');
    // }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
