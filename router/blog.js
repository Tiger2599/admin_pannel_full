const express = require('express');
const passport = require('passport');
const router = express.Router();
const blog = require('../model/blog_model');
const controller = require('../controller/blogController');

router.get('/', controller.add);
router.post('/add_data', blog.upImg, controller.add_data);
router.get('/view_page', controller.view_page);
router.get('/delet/:id', controller.delet);
router.get('/edit_page/:id', controller.edit_page);
router.post('/edit_data', blog.upImg, controller.edit_data);
router.get('/view_comment',controller.view_comment);
router.post('/muldel', controller.muldel);


module.exports = router;