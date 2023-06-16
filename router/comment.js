const express=require('express');
const router=express.Router();
const controller = require('../controller/comController');

router.post('/com_insert',controller.com_insert);

module.exports=router;