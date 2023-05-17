'use strcit';

const express = require('express');
const expressHandlebars = require('express-handlebars');
const { createStarList } = require('./controllers/handlebarsHelper');

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
		allowProtoPropertiesByDefault: true
	},
	helpers: {
		createStarList
	}
}));
app.set('view engine', 'hbs');

app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productsRouter'));

app.use((request, respose, next) => {
	respose.status(404).render('error', { message: 'File/Page not found!' });
});

app.use((error, request, response, next) => {
	console.error(error);
	response.status(500).render('error', { message: 'Internal Server Error' });
});

app.listen(port, () => {
	console.log(`server is running on port ${port}`);
});
