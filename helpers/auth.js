module.exports.ensureAuthenticated = function (request, response, next) {
	if (request.isAuthenticated()) {
		next();
		return;
	}
	request.flash('error', 'Must login First!');
	response.redirect('/users/login');
};
