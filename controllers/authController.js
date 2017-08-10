var express = require('express');
var passport = require('passport');
var router = express.Router();

router.post('/enter', passport.authenticate('local', {successRedirect: '/user', failureRedirect: '/auth'}));
router.get('/',function (req, res) {
  res.render('loginRegister');
});

module.exports = router;