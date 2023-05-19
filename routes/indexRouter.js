'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/indexController');

router.get('/', controller.showHomepage);

router.get('/:page', controller.showPage);

// router.get('/createTables', (request, response) => {
//     let models = require('../models');
//     models.sequelize.sync().then(() => {
//         response.send("tables created!!")
//     });
// });

module.exports = router;