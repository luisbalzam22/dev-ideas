if (process.env.NODE_ENV == 'production') {
	module.exports =
		process.env.MONGO_URI || 'mongodb://localhost:27017/dev-ideas'; //this process.env.MONGO_URI is an enviroment varibale that we need to set in the enviroment of the provider that'll host our application
} else {
	module.exports = 'mongodb://localhost:27017/dev-ideas';
}
