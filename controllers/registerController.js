const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const router = express.Router();

router.post('/',function (req, res) {
        var usr = {
            name: req.body.name,
            email: req.body.email,
            register: true,
            error: ''
        }
        req.body.password = bcrypt.hashSync(req.body.password, 12);
        var user = new userModel(req.body);
        userModel.findOne({ email: req.body.email }, function (err, usrFound) {
            if (usrFound) {
                usr.error = 'Email alredy registered!';
                return res.render('loginRegister', usr);
            }
        });

        user.save(function (err, user) {
            if (err){
                user.error = 'Some thing were wrong :/';
                return res.render('loginRegister', usr);
            }

            usr.register = false;
            usr.success = 'Good, you are registered!';
            usr.error = '';
            return res.render('loginRegister', 
            {
                loginEmail: user.email,
                success: 'Good, you are registered!',
                register: false
            });
        });
    }
)

module.exports = router;