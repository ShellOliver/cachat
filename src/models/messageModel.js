import mongoose from 'mongoose';
import userModel from './userModel';
const Schema = mongoose.Schema;

const messageSchema = new Schema({
	'message' : String,
	'receptor' : Number,
	'emitter' : userModel.schema,
	'datetime' : {type: Date, default: Date.now},
	'room' : String
});

export default mongoose.model('message', messageSchema);
