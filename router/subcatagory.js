const express=require('express');
const router=express.Router();
const controller=require('../controller/subController');
const subcatagory = require('../model/subcatagory');

router.get('/addsubcatagory',controller.addsubcat);
router.post('/adddata',subcatagory.upImg,controller.adddata);
router.get('/view_subcat',controller.view_subcat);
router.get('/delet/:id',controller.delet);
router.get('/edit_page/:id',controller.edit_page);
router.post('/subcat_update',subcatagory.upImg, controller.subcat_update);
router.post('/muldel',controller.muldel);

module.exports = router;