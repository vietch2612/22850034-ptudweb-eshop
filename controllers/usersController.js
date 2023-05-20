'use strict';

const controller = {};
const { response } = require('express');
const models = require('../models');
const userId = 1;

controller.checkout = async (request, response) => {
    if (request.session.cart.quantity > 0) {
        response.locals.addresses = await models.Address.findAll({
            where: {
                userId
            }
        })
        response.locals.cart = request.session.cart.getCart();
        return response.render('checkout');
    };
    response.redirect('/products')
};

controller.placeorders = async (request, response) => {
    let addressId = isNaN(request.body.addressId) ? 0 : Number.parseInt(request.body.addressId);
    let address = await models.Address.findByPk(addressId);
    if (!address) {
        address = await models.Address.create({
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            mobile: request.body.mobile,
            address: request.body.address,
            country: request.body.country,
            city: request.body.city,
            state: request.body.state,
            zipCode: request.body.zipCode,
            isDefault: request.body.isDefault,
            userId: userId
        });
    }
    let cart = request.session.cart;
    cart.paymentMethod = request.body.payment;
    cart.shippingAddress = `${address.firstName} ${address.lastName}, Email: ${address.email}, 
        Mobile: ${address.mobile}, 
        Address: ${address.address}, ${address.city}, ${address.country},${address.state}, ${address.zipCode}`;

    switch (request.body.payment) {
        case 'PAYPAL':
            saveOrders(request, response, 'PAID')
            break;
        case 'COD':
            saveOrders(request, response, 'UNPAID')
            break;
    }
}

async function saveOrders(request, response, status) {
    let { items, ...others } = request.session.cart.getCart();
    let order = await models.Order.create({
        userId,
        ...others,
        status
    });
    let orderDetails = [];
    items.forEach(item => {
        orderDetails.push({
            orderId: order.id,
            productId: item.product.id,
            price: item.product.price,
            quantity: item.quantity,
            total: item.total
        });
    });
    await models.OrderDetail.bulkCreate(orderDetails);
    await request.session.cart.clear();
    return response.render('error', { message: 'Thank you for your order! 22850034' });
}

module.exports = controller;