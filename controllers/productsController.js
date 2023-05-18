'use strict';

const controller = {};
const sequelize = require('sequelize');
const models = require('../models');

const Op = sequelize.Op;

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

	const keyword = request.query.keyword || '';
	if (keyword.trim() != '') {
		options.where.name = {
			[Op.iLike]: `%${keyword}%`,
		};
	}

	const sort = ['newest', 'price', 'popular'].includes(request.query.sort) ? request.query.sort : 'price';
	switch (sort) {
		case 'newest':
			options.order = [['createdAt', 'DESC']];
			break;
		case 'popular':
			options.order = [['stars', 'DESC']];
			break;
		default:
			options.order = [['price', 'ASC']];
	}

	response.locals.sort = sort;
	response.locals.originalUrl = removeParameter('sort', request.originalUrl);
	if (Object.keys(request.query).length === 0) {
		response.locals.originalUrl = response.locals.originalUrl + '?';
	}

	// Paging
	const page = isNaN(request.query.page) ? 1 : Math.max(1, Number.parseInt(request.query.page));
	const limit = 6;
	options.limit = limit;
	options.offset = limit * (page - 1);

	const {rows, count} = await models.Product.findAndCountAll(options);
	response.locals.pagination = {
		page,
		limit,
		totalRows: count,
		queryParams: request.query,
	};

	// Const products = await models.Product.findAll(options);
	response.locals.products = rows;
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

function removeParameter(key, sourceURL) {
	let rtn = sourceURL.split('?')[0];
	let parameter;
	let parameters_array = [];
	const queryString = (sourceURL.includes('?')) ? sourceURL.split('?')[1] : '';
	if (queryString !== '') {
		parameters_array = queryString.split('&');
		for (let i = parameters_array.length - 1; i >= 0; i -= 1) {
			parameter = parameters_array[i].split('=')[0];
			if (parameter === key) {
				parameters_array.splice(i, 1);
			}
		}

		if (parameters_array.length > 0) {
			rtn = rtn + '?' + parameters_array.join('&');
		}
	}

	return rtn;
}

module.exports = controller;
