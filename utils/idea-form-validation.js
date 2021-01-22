function validateIdeaForm(requestBody) {
	let isValid = false;
	let errors = [];
	if (requestBody.title && requestBody.details) isValid = true;

	if (!requestBody.title) errors.push({ text: 'Please, add a title' });

	if (!requestBody.details) errors.push({ text: 'Please, add some details' });

	return {
		isValid,
		errors,
		title: requestBody.title,
		details: requestBody.details,
	};
}

module.exports.validateIdeaForm = validateIdeaForm;
