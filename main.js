/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(2);
var Schema = mongoose.Schema;

var userSchema = new Schema({
	'name': String,
	'email': String,
	'password': String
});

module.exports = mongoose.model('user', userSchema);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(0);
var app = express();
var server = __webpack_require__(6).createServer(app);
var io = __webpack_require__(7)(server);
var hbs = __webpack_require__(8);
var mongoose = __webpack_require__(2);
var bodyParser = __webpack_require__(9);
var passport = __webpack_require__(4);
app.use(__webpack_require__(10)({
    secret: 'isaud$#@joisdfsdifuh#@#%@#$',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
var Strategy = __webpack_require__(11).Strategy;

var fileRoutes = __webpack_require__(12);
var userRoutes = __webpack_require__(14);
var authController = __webpack_require__(16);
var registerController = __webpack_require__(17);
var currentUser = '';

mongoose.connect('mongodb://localhost/chat');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');

passport.use(new Strategy({
    usernameField: 'email'
}, function (email, password, done) {
    var userModel = __webpack_require__(1);
    var bcrypt = __webpack_require__(3);
    return userModel.findOne({ email: email }, function (err, user) {
        if (user && bcrypt.compareSync(password, user.password)) {
            user.password = undefined;
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));
passport.serializeUser(function (user, done) {
    return done(null, user);
});
passport.deserializeUser(function (user, done) {
    return done(null, user);
});

app.use('/files', fileRoutes);
app.use('/login', authController);
app.use('/register', registerController);

//middleware
//TO-DO
// if auth /user/chat NEED
// if not auth /login OK
app.use('/', __webpack_require__(18).ensureLoggedIn('/login'), function (req, res, next) {
    next();
});

app.get('/chat', function (req, res, next) {
    currentUser = req.user;
    return res.render('chat');
});

app.use('/user', userRoutes);

app.get('/sair', function (req, res) {
    req.session.destroy(function (err) {});
});

app.use('*', function (req, res) {
    return res.redirect('/login');
});

var messageModel = __webpack_require__(19);
var userModel = __webpack_require__(1);

io.engine.generateId = function (req) {
    return currentUser != '' ? currentUser._id : /=.+;/g.exec(req.headers.cookie)[0]; // custom id must be unique
};

io.on('connection', function (client) {
    /* io.of('/chat').clients((error, clients) => {
        if (error) throw error;
        client.broadcast.emit('userEnter', { clients: clients });   
      }); */
    client.on('getAllUsersIn', function (req) {
        var usersIn = [];
        io.clients(function (error, clients) {
            if (error) throw error;
            //clients.forEach(function(usrId, index) {
            for (var i = 0; i < clients.length; i++) {
                userModel.findOne({ _id: clients[i] }, function (err, user) {}).then(function (usr) {
                    usr.email = undefined;usr.password = undefined;usr.__v = undefined;
                    usersIn.push(usr);
                    console.log('at persistence: ', usersIn);
                });
            }

            console.log('no fim caraio', usersIn);
            client.emit('allUsersIn', { usersIn: usersIn });
            /*                     console.log('fim: ',usersIn);
            
                                client.emit('allUsersIn', { usersIn: usersIn }); */
            //});
        }, this);
    });

    console.log('Client connected...', client.id);

    client.on('sendForAll', function (req) {
        //save message here
        if (req.text.trim() == '') {
            return;
        }
        req.receptor = 0; //in future a list of all client ids conected in the same room
        req.emitter = currentUser._id;
        messageModel.create(req).save(function (err, m) {
            msgData = { 'msg': m.message, 'time': m.datetime };
            client.broadcast.emit('forAll', msgData);
            client.emit('forAll', msgData);
        });
    });

    client.on('disconnect', function (reason) {
        client.broadcast.emit('userOut');
    });
});

server.listen(3001);

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("express-handlebars");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var express = __webpack_require__(0);
var path = __webpack_require__(13);
routes = express.Router();

routes.use('/public', express.static(path.resolve(__dirname, '../public')));
routes.use('/bootstrap', express.static(path.resolve(__dirname, '../node_modules/bootstrap')));
routes.use('/fontaws', express.static(path.resolve(__dirname, '../node_modules/font-awesome')));
routes.use('/jquery', express.static(path.resolve(__dirname, '../node_modules/jquery')));
routes.use('/socket', express.static(path.resolve(__dirname, '../node_modules/socket.io-client/dist')));

module.exports = routes;
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(0);
var router = express.Router();
var userController = __webpack_require__(15);

/*
 * GET
 */
router.get('/', userController.list);

/*
 * GET
 */
router.get('/:id', userController.show);

/*
 * POST
 */
// router.post('/', userController.create);

/*
 * PUT
 */
router.put('/:id', userController.update);

/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var userModel = __webpack_require__(1);
var bcrypt = __webpack_require__(3);

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function list(req, res) {
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
    show: function show(req, res) {
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
    update: function update(req, res) {
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
    remove: function remove(req, res) {
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

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(0);
var passport = __webpack_require__(4);
var router = express.Router();

router.post('/enter', passport.authenticate('local', { successRedirect: '/chat', failureRedirect: '/login' }), function (req, res) {
  console.log('aqui carai');
  return res.end();
});
router.get('/', function (req, res) {
  res.render('loginRegister', { register: false });
});

module.exports = router;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(0);
var bcrypt = __webpack_require__(3);
var userModel = __webpack_require__(1);
var router = express.Router();

router.post('/', function (req, res) {
    var usr = {
        name: req.body.name,
        email: req.body.email,
        register: true,
        error: ''
    };
    req.body.password = bcrypt.hashSync(req.body.password, 12);
    var user = new userModel(req.body);
    userModel.findOne({ email: req.body.email }, function (err, usrFound) {
        if (usrFound) {
            usr.error = 'Email alredy registered!';
            return res.render('loginRegister', usr);
        }
    });

    user.save(function (err, user) {
        if (err) {
            user.error = 'Some thing were wrong :/';
            return res.render('loginRegister', usr);
        }

        usr.register = false;
        usr.success = 'Good, you are registered!';
        usr.error = '';
        return res.render('loginRegister', {
            loginEmail: user.email,
            success: 'Good, you are registered!',
            register: false
        });
    });
});

module.exports = router;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("connect-ensure-login");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var messageModel = __webpack_require__(20);

/**
 * messageController.js
 *
 * @description :: Server-side logic for managing messages.
 */
module.exports = {

    /**
     * messageController.list()
     */
    list: function list(req, res) {
        messageModel.find(function (err, messages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting message.',
                    error: err
                });
            }
            return res.json(messages);
        });
    },

    /**
     * messageController.show()
     */
    show: function show(req, res) {
        var id = req.params.id;
        messageModel.findOne({ _id: id }, function (err, message) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting message.',
                    error: err
                });
            }
            if (!message) {
                return res.status(404).json({
                    message: 'No such message'
                });
            }
            return res.json(message);
        });
    },

    /**
     * messageController.create()
     */
    create: function create(req) {
        var message = new messageModel({
            emitter: req.emitter,
            message: req.text,
            receptor: req.receptor,
            datetime: new Date(),
            room: req.room

        });
        return message;
    },
    /**
     * messageController.update()
     */
    update: function update(req, res) {
        var id = req.params.id;
        messageModel.findOne({ _id: id }, function (err, message) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting message',
                    error: err
                });
            }
            if (!message) {
                return res.status(404).json({
                    message: 'No such message'
                });
            }

            message.message = req.body.message ? req.body.message : message.message;
            message.receptor = req.body.receptor ? req.body.receptor : message.receptor;
            message.datetime = req.body.datetime ? req.body.datetime : message.datetime;
            message.room = req.body.room ? req.body.room : message.room;

            message.save(function (err, message) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating message.',
                        error: err
                    });
                }

                return res.json(message);
            });
        });
    },

    /**
     * messageController.remove()
     */
    remove: function remove(req, res) {
        var id = req.params.id;
        messageModel.findByIdAndRemove(id, function (err, message) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the message.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mongoose = __webpack_require__(2);
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	'message': String,
	'receptor': Number,
	'datetime': String,
	'room': String
});

module.exports = mongoose.model('message', messageSchema);

/***/ })
/******/ ]);