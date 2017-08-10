var express = require('express');
var path = require('path');
routes = express.Router();

routes.use('/public',express.static(path.resolve(__dirname, '../public')));
routes.use('/bootstrap',express.static(path.resolve(__dirname, '../node_modules/bootstrap')));
routes.use('/fontaws',express.static(path.resolve(__dirname, '../node_modules/font-awesome')));
routes.use('/jquery',express.static(path.resolve(__dirname, '../node_modules/jquery')));
routes.use('/socket',express.static(path.resolve(__dirname, '../node_modules/socket.io-client/dist')));

module.exports = routes;