import express from 'express';
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
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'main',layoutsDir: path.join(__dirname, "views/layouts") }));
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
        next();
    });

app.get('/chat', function (req, res, next) {
    currentUser = req.user;
    return res.render('chat');
});

app.use('/user', userRoutes);

app.get('/sair', function (req, res) {
    req.session.destroy(function(err) { });
});

app.use('*', function (req, res) {
    return res.redirect('/login');
});

const messageModel = require('./controllers/messageController');
const userModel = require('./models/userModel');


io.engine.generateId = (req) => {
    return (currentUser != '') ? currentUser._id : /=.+;/g.exec(req.headers.cookie)[0]; // custom id must be unique
}

io.on('connection', function (client) {
    /* io.of('/chat').clients((error, clients) => {
        if (error) throw error;
        client.broadcast.emit('userEnter', { clients: clients });   
      }); */
      client.on('getAllUsersIn', function (req) {
        var usersIn = [];
        io.clients((error, clients) => {
            if (error) throw error;
            //clients.forEach(function(usrId, index) {
                for(var i = 0;i < clients.length; i++){
                    userModel.findOne({ _id: clients[i] }, function (err, user) {})
                    .then((usr) => {
                        usr.email = undefined; usr.password = undefined; usr.__v=undefined;
                        usersIn.push(usr);
                        console.log('at persistence: ',usersIn);
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
        if(req.text.trim() == ''){
            return;
        }
        req.receptor = 0;//in future a list of all client ids conected in the same room
        req.emitter = currentUser._id;
        messageModel.create(req).save(function (err, m) {
            msgData = {'msg': m.message, 'time':m.datetime};
            client.broadcast.emit('forAll', msgData);
            client.emit('forAll', msgData);
        });
        
    });

    client.on('disconnect', (reason) => {
        client.broadcast.emit('userOut');
    });
});

server.listen(3001);