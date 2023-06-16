const express=require('express');
const router=express.Router();
const controller=require('../controller/sayController');

router.get('/',controller.add);
router.post('/add_data',controller.add_data);


router.get('/view_page',controller.view_page);
router.get('/delet/:id',controller.delet);
router.get('/edit_page/:id',controller.edit_page);
router.post('/edit',controller.edit);
router.post('/muldel',controller.muldel);



module.exports=router;