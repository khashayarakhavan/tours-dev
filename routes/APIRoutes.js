const express = require('express');

const router = express.Router();

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/current_user', (req, res) => {
  res.send(req.user);
});

module.exports = router;
