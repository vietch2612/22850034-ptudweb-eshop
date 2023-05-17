'use strict';

let controller = {};
const models = require('../models');

controller.show = async (request, response) => {
    let products = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice'],
    });
    response.locals.products = products;
    response.render('product-list');
}

module.exports = controller;