var userModel = require('../models/userModel.js');
var bcrypt = require('bcrypt');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        userModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        userModel.findOne({ _id: id }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            return res.json(user);
        });
    },

    async getUser(id){
        let usr = await userModel.findOne({ _id: id }, function (err, user) { });
        if (usr) {
            usr.email = undefined; usr.password = undefined; usr.__v = undefined;
            return usr;
        }
        return null;
    },

    /**
     * userController.create()
     */
    // create: function (req, res) {
    //     var usr = {
    //         name: req.body.name,
    //         email: req.body.email,
    //         register: true,
    //         error: ''
    //     }
    //     req.body.password = bcrypt.hashSync(req.body.password, 12);
    //     var user = new userModel(req.body);
    //     userModel.findOne({ email: req.body.email }, function (err, usrFound) {
    //         if (usrFound) {
    //             usr.error = 'Email alredy registered!';
    //             return res.render('loginRegister', usr);
    //         }
    //     });

    //     user.save(function (err, user) {
    //         if (err){
    //             user.error = 'Some thing were wrong :/';
    //             return res.render('loginRegister', usr);
    //         }

    //         usr.register = false;
    //         usr.success = 'Good, you are registered!';
    //         usr.error = '';
    //         return res.render('loginRegister', 
    //         {
    //             loginEmail: user.email,
    //             success: 'Good, you are registered!',
    //             register: false
    //         });
    //     });
    // },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        userModel.findOne({ _id: id }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.name = req.body.name ? req.body.name : user.name;
            user.email = req.body.email ? req.body.email : user.email;
            user.password = req.body.password ? req.body.password : user.password;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        userModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }

    // login: function (req, res){
    //     userModel.findOne({ email:req.body.email }, function (err, user) {
    //         if(user && bcrypt.compareSync(req.body.password, user.password)){
    //             res.redirect('/chat');
    //             return res.end();
    //         }else{
    //             return res.render('loginRegister', 
    //             {
    //                 register: false,
    //                 loginEmail: req.body.email,
    //                 error:'Email or password is wrong.'
    //             });
    //         }
    //     });
    // }

};
