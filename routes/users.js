const path = require('path');
const { response } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); //App-level Data modeler for MongoDB
const bcryptjs = require('bcryptjs'); //Password encription module (Hasher) to encrypt the passwords sent to server before storing/validation
const passport = require('passport'); //for authentication when logging-in
const {
	validateRegistrationForm,
} = require('../utils/user-registration-form-validation.js');
const { ensureAuthenticated } = require('../helpers/auth.js');

//requiring users Schema:
require('../models/users.js'); //executing code to define schema in the database
const User = mongoose.model('users'); //querying the database for such schema

//requiring ideas Schema:
require('../models/ideas.js'); //executing code to define schema in the database
const Idea = mongoose.model('ideas'); //querying the database for such schema

//ROUTES START HERE-----------------------------------
router.get('/login', (request, response) => {
	response.render('users/login', { pageTitle: 'Log In' });
});

//Since we're using passport for authentication, this route needs a different approach (see how we use the 'next' parameter)
router.post('/login', (request, response, next) => {
	passport.authenticate('local', {
		successRedirect: '/ideas',
		failureRedirect: request.baseUrl + request.url,
		failureFlash: true,
	})(request, response, next);
});

router.get('/logout', ensureAuthenticated, (request, response) => {
	request.logout();
	request.flash('success_msg', "You've logged out!");
	response.redirect(request.baseUrl + '/login');
});

router.get('/register', (request, response) => {
	response.render('users/register', { pageTitle: 'Register' });
});

router.post('/register', (request, response) => {
	let form = validateRegistrationForm(request.body);

	if (form.isValid) {
		const newUser = {
			name: form.name,
			email: form.email,
			password: form.password,
		};
		//Checking if email is already registered
		User.findOne({ email: newUser.email })
			.then((user) => {
				if (user) {
					response.render('users/register', {
						error_msg: 'Email is already registered',
						pageTitle: 'Register',
					});
					return; //if already registered, nothing to do here
				}
				bcryptjs.genSalt(10, (err, salt) => {
					bcryptjs.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						new User(newUser)
							.save()
							.then(() => {
								request.flash(
									'success_msg',
									'You are now registered and can log in!'
								);
								response.redirect(request.baseUrl + '/login');
								return;
							})
							.catch((err) => {
								console.log(err);
								return;
							});
					});
				});
			})
			.catch((err) => {
				console.log;
			});
		return;
	}

	response.render('users/register', {
		pageTitle: 'Register',
		errors: form.errors,
	});
});

router.get('/unsubscribe', (request, response) => {
	response.render('users/unsubscribe', { pageTitle: 'Unsubscribe' });
});

router.delete('/unsubscribe', ensureAuthenticated, (request, response) => {
	User.deleteOne({ _id: request.user._id })
		.then(() => {
			Idea.deleteMany({ user: request.user._id });
		})
		.then(() => {
			request.logout();
			request.flash('success_msg', "You've successfully unsubscribed");
			response.redirect('/');
		});
});

module.exports = router;
