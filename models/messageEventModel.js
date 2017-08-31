var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var messageEventSchema = new Schema({
	'nome' : String,
	'time' : String
});

module.exports = mongoose.model('messageEvent', messageEventSchema);
