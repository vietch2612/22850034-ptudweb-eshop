'use strict';

const controller = {};
const models = require('../models');

controller.showHomepage = async (request, response) => {
    const Categories = models.Category;
    const categories = await Categories.findAll();
    const secondArray = categories.splice(2, 2);
    const thirdArray = categories.splice(1, 1);
    response.locals.categoryArray = {
        categories,
        secondArray,
        thirdArray
    }

    const Brand = models.Brand;
    const brands = await Brand.findAll();
    response.render('index', { brands });
}

controller.showPage = (request, response, next) => {
    const pages = ['cart', 'checkout', 'contact', 'login', 'my-account', 'product-detail', 'product-list', 'wishlist'];
    if (pages.includes(request.params.page))
        return response.render(resquest.params.page);
    next();
}

module.exports = controller;
