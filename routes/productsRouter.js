'use strict';

let express = require('express');
let router = express.Router();
let controller = require('../controllers/productController');

router.get('/', controller.show);
router.get('/:id', controller.showDetails);

module.exports = router;