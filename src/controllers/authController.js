import express from 'express';
import passport from 'passport';
const router = express.Router();

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

// export default router;
module.exports = router;