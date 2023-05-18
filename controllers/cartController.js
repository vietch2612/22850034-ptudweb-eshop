'use strict';

const controller = {};
const models = require('../models');

controller.add = async (request, response) => {
	const id = isNaN(request.body.id) ? 0 : Number.parseInt(request.body.id);
	const quantity = isNaN(request.body.quantity) ? 0 : Number.parseInt(request.body.quantity);

	const product = await models.Product.findByPk(id);
	if (product) {
		request.session.cart.add(product, quantity);
	}

	return response.json({
		quantity: request.session.cart.quantity,
	});
};

controller.show = (request, response) => {
	response.locals.cart = request.session.cart.getCart();
	return response.render('cart');
};

module.exports = controller;
