import express from 'express';
require("babel-core/register");
require("babel-polyfill");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const hbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
app.use(require('express-session')({
    secret: 'isaud$#@joisdfsdifuh#@#%@#$',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
const Strategy = require('passport-local').Strategy;

const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');
const authController = require('./controllers/authController');
const registerController = require('./controllers/registerController');
var currentUser = '';

mongoose.connect('mongodb://localhost/chat');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'main', layoutsDir: path.join(__dirname, "views/layouts") }));
app.set('view engine', 'hbs');

passport.use(new Strategy(
    {
        usernameField: 'email',
    },
    function (email, password, done) {
        const userModel = require('./models/userModel');
        const bcrypt = require('bcrypt');
        return userModel.findOne({ email: email }, function (err, user) {
            if (user && bcrypt.compareSync(password, user.password)) {
                user.password = undefined;
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }
));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use('/files', fileRoutes);
app.use('/login', authController);
app.use('/register', registerController);

//middleware
//TO-DO
// if auth /user/chat NEED
// if not auth /login OK
app.use('/',
    require('connect-ensure-login').ensureLoggedIn('/login'),
    function (req, res, next) {
        currentUser = req.user;
        next();
    });

app.get('/chat', function (req, res, next) {
    return res.render('chat');
});

app.use('/user', userRoutes);

app.get('/out', function (req, res) {
    req.session.destroy(function (err) { });
});

app.use('*', function (req, res) {
    return res.redirect('/login');
});

const messageController = require('./controllers/messageController');
const userModel = require('./models/userModel');
const userController = require('./controllers/userController');
var objectId = mongoose.Types.ObjectId;

io.engine.generateId = (req) => {
    return (currentUser != '') ? currentUser._id : /=.+;/g.exec(req.headers.cookie)[0]; // custom id must be unique
}

io.on('connection', async function (client) {
    var skipMessages = 0;
    var usersIn = [];
    var currentSessionUser = new Object();
    client.on('getAllUsersIn', async function (req) {
        io.clients(async (error, clients) => {
            if (error) throw error;
            for (let i = 0; i < clients.length && currentUser._id != clients[i]; i++) {
                try {
                    usersIn.push(await userController.getUser(clients[i]));
                } catch (ex) {
                    console.log("can't find user id:", client.id);
                }
            }
            let currentUsrFront = currentUser;
            currentUsrFront.__v = currentUsrFront.email = undefined;
            client.emit('allUsersIn', { usersIn: usersIn, currentUsr: currentUsrFront});
        }, this);
    });

    try {
        currentSessionUser = await userController.getUser(client.id);
        console.log('Client connected...', currentSessionUser);
        client.broadcast.emit('newUserIn', currentSessionUser);
    } catch (ex) {
        console.log("can't find user id:", client.id);
    }

    client.on('sendForAll',async (req) => {
        //save message here
        if (req.text.trim() == '') {
            return;
        }
        let emitter = currentSessionUser;
        emitter.password=emitter.__v=emitter.email = undefined;
        req.receptor = 0;//in future a list of all client ids conected in the same room
        req.emitter = emitter;//when user use id of other user, it has to be checked at backend
        messageController.create(req).save(function (err, m) {
            client.broadcast.emit('forAll', m);
            client.emit('forAll', m);
        });
    });

    client.on('disconnect', (reason) => {
        client.broadcast.emit('userOut', reason);
    });

    client.on('getOldMessages', async () => {
        if(skipMessages != -1){
            const messages = await messageController
                .list(objectId(currentUser._id).getTimestamp(), skipMessages);
            client.emit('oldMessages', await messages);
            (messages.length == 0) ? skipMessages = -1 : skipMessages += 100;
        }
    })
});

server.listen(5002);