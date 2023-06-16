const express=require('express');
const router=express.Router();
const controller=require('../controller/catagorycontroller');

router.get('/addcatagory',controller.addcatagory);
router.post('/insertdata',controller.insertdata);
router.get('/viewcatagory',controller.viewcatagory);
router.get('/delet/:id',controller.delet);
router.get('/edit_page/:id',controller.edit_page);
router.post('/cat_update',controller.cat_update);
router.post('/muldel',controller.muldel);

module.exports=router;