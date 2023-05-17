'use strict';

let express = require('express');
let router = express.Router();
let controller = require('../controllers/productController');

router.get('/', controller.show);

module.exports = router;