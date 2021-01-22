const { request } = require('express');

function validateRegistrationForm(requestBody) {
	let isValid = true;
	let errors = [];

	if (
		!(
			requestBody.name ||
			requestBody.email ||
			requestBody.password ||
			requestBody.password2
		)
	) {
		isValid = false;
	}

	if (requestBody.password !== requestBody.password2) {
		isValid = false;
		errors.push({ text: "Passwords don't match" });
	}

	if (requestBody.password.length < 4 || requestBody.password2.length < 4) {
		isValid = false;
		errors.push({ text: 'Password must be at least 4 characters long' });
	}

	return {
		isValid,
		errors,
		name: requestBody.name,
		email: requestBody.email,
		password: requestBody.password,
		password2: requestBody.password2,
	};
}

module.exports.validateRegistrationForm = validateRegistrationForm;
