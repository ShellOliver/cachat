var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
app.use(require('express-session')({
    secret: 'isaud$#@joisdfsdifuh#@#%@#$',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
var Strategy = require('passport-local').Strategy;

var fileRoutes = require('./routes/fileRoutes');
var userRoutes = require('./routes/userRoutes');
var authController = require('./controllers/authController');
var registerController = require('./controllers/registerController');

mongoose.connect('mongodb://localhost/chat');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'main' }));
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
/*app.use('/',
    require('connect-ensure-login').ensureLoggedIn('/login'),
    function (req, res, next) {
        next();
    });*/

app.get('/chat', function (req, res, next) {
    return res.render('chat');
});

app.use('/user', userRoutes);

app.get('/sair', function (req, res) {
    req.session.destroy(function(err) { });
});

app.use('*', function (req, res) {
    return res.redirect('/login');
});

const message = require('./controllers/messageController');
io.on('connection', function (client) {
    console.log('Client connected...', client.id);
    client.broadcast.emit('userEnter', { id: client.session });

    client.on('sendForAll', function (req) {
        //save message here
        if(req.text.trim() == ''){
            return;
        }
        req.receptor = 0;//in future a list of all client ids conected in the same room
        message.create(req);
        client.broadcast.emit('forAll', req.text);
        client.emit('forAll', req.text);
    });

    client.on('disconnect', (reason) => {
        client.broadcast.emit('userOut');
    });
});

server.listen(3001);