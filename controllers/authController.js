var express = require('express');
var passport = require('passport');
var router = express.Router();

router.post('/enter', 
  passport.authenticate('local', 
    {successRedirect: '/chat', failureRedirect: '/login'}),
      function(req, res){
        console.log('aqui carai');
        return res.end();
      }
);
router.get('/',function (req, res) {
  res.render('loginRegister', {register: false});
});

module.exports = router;