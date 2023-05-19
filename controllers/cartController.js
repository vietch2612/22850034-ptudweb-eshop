'use strict';

const controller = {};
const models = require('../models');

controller.add = async (request, response) => {
	const id = isNaN(request.body.id) ? 0 : Number.parseInt(request.body.id);
	const quantity = isNaN(request.body.quantity) ? 0 : Number.parseInt(request.body.quantity);

	const product = await models.Product.findByPk(id);
	if (product && quantity > 0) {
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

controller.update = (request, response) => {
	const id = isNaN(request.body.id) ? 0 : Number.parseInt(request.body.id);
	const quantity = isNaN(request.body.quantity) ? 0 : Number.parseInt(request.body.quantity);

	if (quantity > 0) {
		let updatedItem = request.session.cart.update(id, quantity);

		return response.json({
			quantity: request.session.cart.quantity,
			item: updatedItem,
			subtotal: request.session.cart.subtotal,
			total: request.session.cart.total
		});
	}

	response.sendStatus(204).end();
}

controller.remove = (request, response) => {
	let id = isNaN(request.body.id) ? 0 : Number.parseInt(request.body.id);
	request.session.cart.remove(id);
	return response.json({
		quantity: request.session.cart.quantity,
		subtotal: request.session.cart.subtotal,
		total: request.session.cart.total
	});
}

controller.clear = (request, response) => {
	request.session.cart.clear();
	return response.sendStatus(200).end();
}

module.exports = controller;
