const express = require('express');
const passport = require('passport');
const router = express.Router();
const rec_img = require('../model/rec_img_model');
const controller = require('../controller/rec_imgController');
router.get('/', controller.add);
router.post('/add_data', rec_img.upImg, controller.add_data);

router.get('/view_page', controller.view_page);
router.get('/delet/:id', controller.delet);
router.get('/edit_page/:id', controller.edit_page);
router.post('/edit_data', rec_img.upImg, controller.edit_data);
router.post('/delmul', controller.delmul);


module.exports = router;