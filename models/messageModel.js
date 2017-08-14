var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var messageSchema = new Schema({
	'message' : String,
	'receptor' : Number,
	'datetime' : String,
	'room' : String
});

module.exports = mongoose.model('message', messageSchema);
