var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

var fileRoutes = require('./routes/fileRoutes');
var userRoutes = require('./routes/userRoutes');
var authController = require('./controllers/authController');

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
        const userModel = require('./models/userModels');
        return userModel.findOne({ email: email }, function (err, user) {
            if (user && !bcrypt.compareSync(password, user.password)) {
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

//middleware
//TO-DO
// if auth /user/chat NEED
// if not auth /login OK
app.use(
    require('connect-ensure-login').ensureLoggedIn('/login'),
    function (req, res, next) {
        next();
    });

app.get('/chat', function (req, res, next) {
    return res.render('chat');
});

app.use('/user', userRoutes);

app.use('*', function (req, res) {
    return res.redirect('/login');
});

io.on('connection', function (client) {
    console.log('Client connected...');
    client.broadcast.emit('userEnter');

    client.on('sendForAll', function (msg) {
        client.broadcast.emit('forAll', msg);
        client.emit('forAll', msg);
    });

    client.on('disconnect', (reason) => {
        client.broadcast.emit('userOut');
    });

});

server.listen(3001);