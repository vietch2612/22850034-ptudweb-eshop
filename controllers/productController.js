'use strict';

let controller = {};
const models = require('../models');

controller.show = async (request, response) => {

    // Categories
    let categories = await models.Category.findAll({
        include: [{
            model: models.Product
        }]
    });
    response.locals.categories = categories;

    // Brands
    let brands = await models.Brand.findAll({
        include: [{
            model: models.Product
        }]
    });
    response.locals.brands = brands;

    // Tags
    let tags = await models.Tag.findAll({
        order: [['name', 'ASC']]
    });
    response.locals.tags = tags;

    // Products
    let options = {
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice'],
        where: {}
    };

    // Request queries
    let category = isNaN(request.query.category) ? 0 : parseInt(request.query.category);
    if (category > 0) {
        options.where.categoryId = category;
    };

    let brand = isNaN(request.query.brand) ? 0 : parseInt(request.query.brand);
    if (brand > 0) {
        options.where.brandId = brand;
    };

    let tag = isNaN(request.query.tag) ? 0 : parseInt(request.query.tag);
    if (tag > 0) {
        options.include = [{
            model: models.Tag,
            where: { id: tag }
        }];
    };

    let products = await models.Product.findAll(options);
    response.locals.products = products;
    response.render('product-list');
}

module.exports = controller;