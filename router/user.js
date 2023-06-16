const express=require('express');
const router=express.Router();
const controller=require('../controller/userController');

router.get('/',controller.index);
router.get('/blog_single',controller.blog_single);
router.get('/filtergallary',controller.filtergallary);
router.get('/contact',controller.contact);
// router.post('/contactSub',controller.contactSub);

module.exports=router;