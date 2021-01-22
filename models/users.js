const mongoose = require('mongoose');
const Schema = mongoose.Schema; //Schema definer
const Model = mongoose.model;

//Defining User Schema
const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

//Connecting Schema to Model
Model('users', UserSchema);
//NOTE: WE ARE NOT EXPORTING ANYTHING, WE'RE JUST EXECUTING CODE THAT'LL SET THE SCHEMA FOR THE COLLECTION IN THE DATABASE, SO THEN SUCH SCHEMA CAN BE QUERIED IN ANOTHER MODULE, AND USED TO CREATE ENTRIES
