const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); //App-level Data modeler for MongoDB
const { validateIdeaForm } = require('../utils/idea-form-validation.js');
//requiring idea Schema:
require('../models/ideas.js'); //executing code to define schema in the database
const Idea = mongoose.model('ideas'); //querying the database for such schema
//NOTE: connect-flash doesn't need to be imported, since it'll be imported and set through the middleware in app.js
const { ensureAuthenticated } = require('../helpers/auth.js');

//ROUTES START HERE--------------------------
//Visualize ideas Route:
router.get('/', ensureAuthenticated, (request, response) => {
	Idea.find({ user: request.user._id })
		.sort({ date: 'desc' })
		.lean() //.lean() only useful when bringing data to the server, not when passing it back to the db
		.then((ideas) => {
			response.render('ideas/index', { pageTitle: 'Ideas', ideas });
		});
});
//Add ideas Route:
router.get('/add', ensureAuthenticated, (request, response) => {
	response.render('ideas/add', { pageTitle: 'Add Ideas' });
});

//Processing form in ideas/add Route:
router.post('/add', ensureAuthenticated, (request, response) => {
	//response validation code
	let form = validateIdeaForm(request.body);
	if (form.isValid) {
		const newUser = {
			title: form.title,
			details: form.details,
			user: request.user._id,
		};
		new Idea(newUser).save().then(() => {
			request.flash('success_msg', 'New Dev Idea Added!');
			//request.flash just allows us to keep the value assigned through its .flash() method to  the response.locals' success_msg variable so it can be passed to the redirected view (response.locals variables are automatically passed onto the set template engine)
			response.redirect(request.baseUrl);
		});
		return;
	}

	response.render('ideas/add', { pageTitle: 'Add Ideas', form });
	//NOTE: Since this isn't a FrontEnd webapp, when performing the validation in the back, we return the same form page with the incorrect values already assigned to the input fields
});

//Edit ideas Route:
router.get('/edit/:id', ensureAuthenticated, (request, response) => {
	Idea.findOne({ _id: request.params.id })
		.lean() //only useful when bringing data from the DB to the server, not when passing it back to the db
		.then((idea) => {
			if (idea.user != request.user._id) {
				request.flash('error', 'Unauthorized');
				response.redirect('/ideas');
				return;
			}

			response.render('ideas/edit', { pageTitle: 'Edit Idea', idea });
		});
});

//Edit ideas form processing
router.put('/edit/:id', ensureAuthenticated, (request, response) => {
	Idea.findOne({ _id: request.params.id }).then((idea) => {
		idea.title = request.body.title;
		idea.details = request.body.details;
		idea.save().then(() => {
			request.flash('success_msg', 'Dev Idea Updated!');
			response.redirect(request.baseUrl);
		});
	});
});
//Delete idea Route
router.delete('/delete/:id', ensureAuthenticated, (request, response) => {
	Idea.deleteOne({ _id: request.params.id }).then(() => {
		request.flash('success_msg', 'Dev Idea Removed!');
		response.redirect(request.baseUrl);
	});
});

module.exports = router;
