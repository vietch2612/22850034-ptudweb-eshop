'use strict';

const controller = {};
const models = require('../models');

controller.getData = async (request, response, next) => {
	// Categories
	const categories = await models.Category.findAll({
		include: [{
			model: models.Product,
		}],
	});
	response.locals.categories = categories;

	// Brands
	const brands = await models.Brand.findAll({
		include: [{
			model: models.Product,
		}],
	});
	response.locals.brands = brands;

	// Tags
	const tags = await models.Tag.findAll({
		order: [['name', 'ASC']],
	});
	response.locals.tags = tags;

	next();
};

controller.show = async (request, response) => {
	// Products
	const options = {
		attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice'],
		where: {},
	};

	// Request queries
	const category = isNaN(request.query.category) ? 0 : Number.parseInt(request.query.category);
	if (category > 0) {
		options.where.categoryId = category;
	}

	const brand = isNaN(request.query.brand) ? 0 : Number.parseInt(request.query.brand);
	if (brand > 0) {
		options.where.brandId = brand;
	}

	const tag = isNaN(request.query.tag) ? 0 : Number.parseInt(request.query.tag);
	if (tag > 0) {
		options.include = [{
			model: models.Tag,
			where: {id: tag},
		}];
	}

	const products = await models.Product.findAll(options);
	response.locals.products = products;
	response.render('product-list');
};

controller.showDetails = async (request, response) => {
	const id = isNaN(request.params.id) ? 0 : Number.parseInt(request.params.id);
	const product = await models.Product.findOne({
		attributes: ['id', 'name', 'stars', 'oldPrice', 'price', 'summary', 'description', 'specification'],
		where: {id},
		include: [{
			model: models.Image,
			attributes: ['name', 'imagePath'],
		},
		{
			model: models.Review,
			attributes: ['id', 'review', 'stars', 'createdAt'],
			include: [{
				model: models.User,
				attributes: ['firstName', 'lastName'],
			}],
		}],
	});

	response.locals.product = product;
	response.render('product-detail');
};

module.exports = controller;
