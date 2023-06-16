const express=require('express');
const passport=require('passport');
const router=express.Router();
const slider=require('../model/slider_model');
const controller=require('../controller/sliderController');
router.get('/',controller.add);
router.post('/add_data',slider.upImg,controller.add_data);

router.get('/view_page',controller.view_page);
router.get('/delet/:id',controller.delet);
router.get('/edit_page/:id',controller.edit_page);
router.post('/edit_data',slider.upImg,controller.edit);

router.post('/mulDel',controller.mulDel);

module.exports=router;