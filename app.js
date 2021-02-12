const path = require('path');
const { response, request } = require('express');
const express = require('express');
const mongoose = require('mongoose'); //App-level Data modeler for MongoDB
const exphbs = require('express-handlebars'); //Template Engine
const favicon = require('serve-favicon'); //Serve favicon
const bodyParser = require('body-parser'); //To handle data sent to the server in an easy way
const methodOverride = require('method-override'); //To be able to handle PUT and DELETE requests from syncronous HTML form sending
const session = require('express-session'); //To enable sessions for users
const flash = require('connect-flash'); //For flash messaging: just allows us to keep the value assigned through its .flash() method to  the response.locals' variables so they can be passed to the redirected view (response.locals variables are automatically passed onto the set template engine)
const passport = require('passport'); //To enable authentication

const ideasRouter = require('./routes/ideas.js');
const usersRouter = require('./routes/users.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.resolve(__dirname, 'public', 'favicon.ico')));

//Setting up handlebars Middleware as template engine:
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

//BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method Override Middleware
app.use(methodOverride('_method'));

//Express session Middleware (Must be set before the "connect-flash" Middleware)
app.use(
	session({
		secret: 'GoblinSlayer',
		resave: true,
		saveUninitialized: true,
	})
);

//Passport Config (passing the passport module into the exported function of the config):
require('./config/passport')(passport);

//MongoDB config
const mongoURI = require('./config/database.js');

//Passport Middleware (MUST BE AFTER the express session Middleware!)
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash Middleware
app.use(flash());

//Global variables (only globally available to each response for the lifetime of a request) linked to request.flash values through this custom funtion definition middleware
app.use(function (request, response, next) {
	response.locals.success_msg = request.flash('success_msg');
	response.locals.error_msg = request.flash('error_msg');
	response.locals.error = request.flash('error');
	response.locals.user = request.user || null; //to allow for the conditional of custom content on the frontend
	next();
});

//Connecting to DB
mongoose
	.connect(mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((err) => {
		console.log(err);
	});

//Index Route
app.get('/', (request, response) => {
	response.render('index', { pageTitle: 'Homepage' });
});

//About Route
app.get('/about', (request, response) => {
	response.render('about', { pageTitle: 'About' });
});
//Ideas Routes
app.use('/ideas', ideasRouter);

//Users Routes
app.use('/users', usersRouter);

//404 Middleware
app.use(function (request, response, next) {
	response.render('notfound', { pageTitle: 'Resource Not Found' });
});

app.listen(PORT, () => {
	console.log(`Server Listening on port: ${PORT}`);
});
