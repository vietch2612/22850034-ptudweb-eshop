'use strcit';

const express = require('express');
const expressHandlebars = require('express-handlebars');

const app = express();
const port = process.env.PORT || 4000;

// Static folders
app.use(express.static(__dirname + '/public'));



// Express Handlebars
app.engine('hbs', expressHandlebars.engine({
	layoutsDir: __dirname + '/views/layouts',
	partialsDir: __dirname + '/views/partials',
	extname: 'hbs',
	defaultLayout: 'layout',
}));
app.set('view engine', 'hbs');

app.get('/', (request, response) => {
	response.render('index');
});

app.get('/:page', (request, response) => {
	response.render(request.params.page)
});

app.listen(port, () => {
	console.log(`server is running on port ${port}`);
});
