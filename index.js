'use strcit';

const express = require('express');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const {createPagination} = require('express-handlebars-paginate');
const {createStarList} = require('./controllers/handlebarsHelper');

const app = express();
const port = process.env.PORT || 3000;

// Static folders
app.use(express.static(__dirname + '/public'));

// Express Handlebars
app.engine('hbs', expressHandlebars.engine({
	layoutsDir: __dirname + '/views/layouts',
	partialsDir: __dirname + '/views/partials',
	extname: 'hbs',
	defaultLayout: 'layout',
	runtimeOptions: {
		allowProtoPropertiesByDefault: true,
	},
	helpers: {
		createStarList,
		createPagination,
	},
}));
app.set('view engine', 'hbs');

// Get request body
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Session
app.use(session({
	secret: 'S3secret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		maxAge: 20 * 60 * 1000, // 20 minutes
	},
}));

// Middleware
app.use((request, response, next) => {
	const Cart = require('./controllers/cart');
	request.session.cart = new Cart(request.session.cart ? request.session.cart : {});
	response.locals.quantity = request.session.cart.quantity;

	next();
});

// Routes
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productsRouter'));

app.use((request, respose, next) => {
	respose.status(404).render('error', {message: 'File/Page not found!'});
});

app.use((error, request, response, next) => {
	console.error(error);
	response.status(500).render('error', {message: 'Internal Server Error'});
});

app.listen(port, () => {
	console.log(`server is running on port ${port}`);
});
