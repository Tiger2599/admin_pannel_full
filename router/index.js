const express=require('express');
const admin=require('../model/admin');
const passport=require('passport');
const router=express.Router();
const adminController=require('../controller/adminController');
const { route } = require('./user');

router.get('/',adminController.login);

router.post('/loginData',passport.authenticate('local',{failureRedirect:"/"}),adminController.loginData);

//forget //////////////////
router.get('/forget',(req,res)=>{
    res.render('forget');
})

router.post('/checkemail',adminController.checkemail);

router.get('/checkOtp',(req,res)=>{
    res.render('checkOtp');
})

router.post('/verifyOtp',adminController.verifyOtp);

router.get('/changeforgetpass',(req,res)=>{
    res.render('changeforgetpass');
});

router.post('/confirmpass',adminController.confirmpass);

//foregot end ///////////////////

router.get('/desh',passport.setAuthenticated,adminController.deshbord);

router.get('/admin_add',passport.setAuthenticated,adminController.admin_add);

router.get('/admin_view',passport.setAuthenticated,adminController.admin_view);

router.post('/addData',admin.upImg,adminController.addData);

router.get('/deletData/:id',passport.setAuthenticated,adminController.deletData);

router.get('/editPage/:id',passport.setAuthenticated,adminController.edit_page);

router.post('/upData',passport.setAuthenticated,admin.upImg,adminController.upData);

router.get('/logout',passport.setAuthenticated,adminController.logout);

router.get('/password',passport.setAuthenticated,adminController.password);

router.post('/cpass',passport.setAuthenticated,adminController.cpass);

router.get('/profile',passport.setAuthenticated,adminController.profile);

router.get('/editProfile/:id',passport.setAuthenticated,adminController.editProfile);

router.post('/upProfile',passport.setAuthenticated,admin.upImg,adminController.upProfile);

router.use('/user',require('./user'));

router.use('/slider',passport.setAuthenticated,require('./slider'));
router.use('/offer',passport.setAuthenticated,require('./offer'));
router.use('/rec_img',passport.setAuthenticated,require('./rec_img'))
router.use('/say',passport.setAuthenticated,require('./say'));
router.use('/blog',passport.setAuthenticated,require('./blog'));
router.use('/comment',passport.setAuthenticated,require('./comment'));
router.use('/catagory',passport.setAuthenticated,require('./catagory'));
router.use('/subcatagory',passport.setAuthenticated,require('./subcatagory'));

module.exports=router;