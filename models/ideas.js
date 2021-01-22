const mongoose = require('mongoose');
const Schema = mongoose.Schema; //Schema definer
const Model = mongoose.model;

//Defining Idea Schema
const IdeaSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	details: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	user: {
		type: String,
		required: true,
	},
});

//Connecting Schema to Model
Model('ideas', IdeaSchema);
//NOTE: WE ARE NOT EXPORTING ANYTHING, WE'RE JUST EXECUTING CODE THAT'LL SET THE SCHEMA FOR THE COLLECTION IN THE DATABASE, SO THEN SUCH SCHEMA CAN BE QUERIED IN ANOTHER MODULE, AND USED TO CREATE ENTRIES
