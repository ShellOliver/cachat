var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
var fileRoutes = require('./routes/fileRoutes');

mongoose.connect('mongodb://localhost/chat');

app.engine( 'hbs', hbs({extname: 'hbs', defaultLayout: 'main'}));
app.set( 'view engine', 'hbs' );

// app.use(express.static(__dirname + '/node_modules'));//to remove
app.use('/files', fileRoutes);

app.get('/', function (req, res, next) {
    res.render('loginRegister');
});

app.get('/chat', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
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