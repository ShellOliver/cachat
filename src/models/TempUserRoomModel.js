var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
import userModel from './userModel';

var TempUserRoomSchema = new Schema({
	'user' : userModel.schema,
	'room' : Number
});

module.exports = mongoose.model('TempUserRoom', TempUserRoomSchema);
