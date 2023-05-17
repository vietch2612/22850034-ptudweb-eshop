'use strict';

const controller = {};
const models = require('../models');

controller.showHomepage = async (request, response) => {

    // Recent products
    const recentProducts = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 10
    });
    response.locals.recentProducts = recentProducts;


    // Featured products
    const featuredProducts = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice'],
        order: [['stars', 'DESC']],
        limit: 10
    });
    response.locals.featuredProducts = featuredProducts;

    // Categories
    const Categories = models.Category;
    const categories = await Categories.findAll();
    const secondArray = categories.splice(2, 2);
    const thirdArray = categories.splice(1, 1);
    response.locals.categoryArray = {
        categories,
        secondArray,
        thirdArray
    }

    // Brands
    const Brand = models.Brand;
    const brands = await Brand.findAll();
    response.render('index', { brands });
}

controller.showPage = (request, response, next) => {
    const pages = ['cart', 'checkout', 'contact', 'login', 'my-account', 'product-detail', 'product-list', 'wishlist'];
    if (pages.includes(request.params.page))
        return response.render(request.params.page);
    next();
}

module.exports = controller;
