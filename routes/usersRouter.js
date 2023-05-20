'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');
const { body, validationResult } = require('express-validator');

router.get('/checkout', controller.checkout);
router.post('/placeorders',
    body('firstName').notEmpty().withMessage('First name is required!'),
    body('lastName').notEmpty().withMessage('Last name is required!'),
    body('email').notEmpty().withMessage('Email is required!').isEmail().withMessage('Invalid email address'),
    body('mobile').notEmpty().withMessage('Mobile is required!'),
    body('address').notEmpty().withMessage('Address is required!'),
    (request, response, next) => {
        let errors = validationResult(request);
        if (request.body.addressId == "0" && !errors.isEmpty()) {
            let errorArray = errors.array();
            let message = '';
            for (let i = 0; i < errorArray.length; i++) {
                message += errorArray[i].msg + '<br />';
            }
            return response.render('error', { message });
        }
        next();
    },
    controller.placeorders
);

module.exports = router;