var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/node_modules'));  
app.use(express.static(__dirname + '/public'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
    console.log('Client connected...');

  client.on('sendForAll', function(msg){
    client.broadcast.emit('forAll', msg);
    client.emit('forAll', msg);
  });

});

server.listen(3001);