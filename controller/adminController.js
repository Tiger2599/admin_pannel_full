const admin = require('../model/admin');
const bcrypt = require('bcrypt')
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

module.exports.login = (req, res) => {
    if(req.isAuthenticated()){
        return res.redirect('/desh');
    }else{
        req.flash('error','Enterd Input is Wrong');
        return res.render('login')
    }
}

module.exports.loginData = (req, res) => {
    req.flash('success','you are log in');
    return res.redirect('/desh');
}
module.exports.deshbord = (req, res) => {
        res.render('deshbord');
}
module.exports.admin_add =  (req, res) => {
        res.render('admin_add');
}

module.exports.admin_view = async (req, res) => {
    try {
        let data = await admin.find();
        if (data) {
            return res.render('admin_view', ({ data: data}));
        } else {
            console.log("admin veiw data find err");
        }
    } catch (err) {
        console.log("admin_view err in catch : ", err);
    }
}

module.exports.addData = async (req, res) => {
    try {
        let ip = '';
        if (req.file) {
            ip = admin.upPath + '/' + req.file.filename;
        }

        const nDate = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Calcutta'
        });
        
        req.body.createdAt=nDate;
        req.body.updatedAt=nDate;
        req.body.isActive=true;
        req.body.image = ip;
        req.body.name = req.body.fname + " " + req.body.lname;
        let pass = await bcrypt.hash(req.body.password, 10)
        req.body.password = pass;

        let data = await admin.create(req.body);
        if (data) {
            req.flash('success','Admin Add successfully');
            res.redirect('/admin_add');
        } else {
            req.flash('error','Oops! Somthing is Wrong');
        }
    } catch (err) {
        console.log("insert err in catch ", err);
    }
}

module.exports.deletData = async (req, res) => {
    try {
        let obj = await admin.findById(req.params.id);
        
        //delet image
        let ip = path.join(__dirname, '..', obj.image);
        fs.unlinkSync(ip);

        let data = await admin.findByIdAndDelete(req.params.id);
        if (data) {
            req.flash('success','Admin Delet successfully');
            return res.redirect('/admin_view');
        }

    } catch (error) {
        console.log("data delet err in catch : ", error);
    }
}
module.exports.edit_page = async (req, res) => {
    try {

        let data = await admin.findById(req.params.id);
        if (data) {
            return res.render('admin_edit', ({ data: data}));
        }

    } catch (error) {
        console.log('edit page lode err in catch');
    }
}

module.exports.upData = async (req, res) => {
    let id=req.body.eid;
    try {
        if (req.file) {
            let data = await admin.findById(id);
            if (data) {
                //delet data
                let oldimg = path.join(__dirname, '..', data.image);
                fs.unlinkSync(oldimg);

                let newimg = admin.upPath + "/" + req.file.filename;
                req.body.image = newimg;
                req.body.name = req.body.fname + " " + req.body.lname;

                await admin.findByIdAndUpdate(id, req.body);
                
                req.flash('success','Admin Updated successfully');
                return res.redirect('/admin_view');
            }
        } else {
            let data = await admin.findById(id);
            if (data) {
                req.body.image = data.image;
                req.body.name = req.body.fname + " " + req.body.lname;

                await admin.findByIdAndUpdate(id, req.body);

                req.flash('success','Admin Updated successfully');
                return res.redirect('/admin_view');
            } else {
                console.log("update data not found in (else)");
            }
        }
    } catch (error) {
        console.log("data  update err : ", error);
    }
}

module.exports.logout = (req, res) => {
    req.logout((err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    })
}

module.exports.password = (req, res) => {
    res.render('password')
}

module.exports.cpass = async (req, res) => {
    try {
        if (await bcrypt.compare(req.body.password,req.user.password)) {
            if (req.body.password != req.body.Npassword) {
                if (req.body.Npassword == req.body.Cpassword) {
                    let pass = await bcrypt.hash(req.body.Npassword, 10);
                    let update = await admin.findByIdAndUpdate(req.user.id, { password: pass });
                    if (update) {
                        return res.redirect('/logout');
                    } else {
                        console.log("password not changed");
                    }
                }
            } else {
                console.log("enter defrent password");
            }
        } else {
            console.log('invalid password');
            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports.profile=  (req,res)=>{
    return res.render('profile');
}

module.exports.editProfile=(req,res)=>{
    res.render('edit_profile');
}

module.exports.upProfile=async(req,res)=>{
    let id=req.user.id;  
    try {
        if (req.file) {
            let data = await admin.findById(id);
            if (data) {
                //delet data
                let ip = path.join(__dirname, '..', data.image);
                fs.unlinkSync(ip);

                let ni = admin.upPath + "/" + req.file.filename;
                req.body.image = ni;
                req.body.name = req.body.fname + " " + req.body.lname;

                let update = await admin.findByIdAndUpdate(id, req.body);
                if (update) {
                    return res.redirect('/logout');
                } else {
                    console.log('data not updated (if) ');
                }
            }
        } else {
            let data = await admin.findById(id);
            if (data) {
                req.body.image = data.image;
                req.body.name = req.body.fname + " " + req.body.lname;

                let update = await admin.findByIdAndUpdate(id, req.body);
                if (update) {
                    return res.redirect('/logout');
                } else {
                    console.log('data not updated (else) ');
                }
            } else {
                console.log("update data not found in (else)");
            }
        }
    } catch (error) {
        console.log("data  update err : ", error);
    }
}

module.exports.checkemail = async (req,res)=>{
    let admindata = await admin.findOne({email:req.body.email});
    if(admindata){
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "323ba4c518c036",
                pass: "d40a3e1bdac692"
            }
        });

        let otp = Math.round(Math.random()*100000);
        res.cookie('otp',otp);
        res.cookie('email',req.body.email);

        let info = await transport.sendMail({
            from: 'parasbanbhiya@gmail.com', // sender address
            to: "jikadarajenish@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `your otp is ${otp}`, // html body
        });

        req.flash('success','otp has been send,check your email');
        return res.redirect('/checkOtp');
    }
    else{
        req.flash('error','invalid email!');
        return res.redirect('back');
    }
}

module.exports.verifyOtp = (req,res)=>{
    try {
        if(req.body.otp == req.cookies.otp){
            return res.redirect('/changeforgetpass');
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports.confirmpass = async (req,res)=>{
    try {
        if(req.body.npass === req.body.cpass){
            let email = req.cookies.email;
            console.log(email);
            let adminData = await admin.findOne({email:email});
            let bpass = await bcrypt.hash(req.body.npass,10);
            if(adminData){
                await admin.findByIdAndUpdate(adminData.id,{password:bpass});
                req.flash('success','Password sucessfully changed');
                return res.redirect('/');
            }
        }
        else{
            req.flash('error','Password was not matched with Confirm Password');
            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
    }
}