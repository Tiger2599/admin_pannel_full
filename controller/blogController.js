const blog = require('../model/blog_model')
const path = require('path');
const fs = require('fs');
const comment = require('../model/comment');
const { model } = require('mongoose');

const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});     

module.exports.add = (req, res) => {
    res.render('blog');
}

module.exports.add_data = async (req, res) => {
    try {

        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;
        req.body.name = req.user.name;
        req.body.date = nDate;

        let image = '';
        if (req.file) {
            image = blog.upPath + '/' + req.file.filename;
        }
        req.body.image = image;

        await blog.create(req.body);
        
        req.flash('success','Data Add successfully');
        res.redirect('/blog');
    } catch (err) {
        console.log('blog data add err ', err);
    }
}

Date.prototype.toShortFormat = function() {

    const monthNames = ["Jan", "Feb", "Mar", "Apr",
                        "May", "Jun", "Jul", "Aug",
                        "Sep", "Oct", "Nov", "Dec"];
    
    const day = this.getDate();
    
    const monthIndex = this.getMonth();
    const monthName = monthNames[monthIndex];
    
    const year = this.getFullYear();
    
    return `${day}-${monthName}-${year}`;  
}

module.exports.view_page = async (req, res) => {
    try {

        if (req.query.status == 'deActive') {
            let Active = await say.findByIdAndUpdate(req.query.id, { isActive: false });
        }
        if (req.query.status == 'Active') {
            let Active = await say.findByIdAndUpdate(req.query.id, { isActive: true });
        }
        
        let pre_page=2;
        let data_num = await blog.find({}).countDocuments();
        let page_num=Math.ceil(data_num/pre_page);
        
        let search='';
        if(req.query.search){
            search=req.query.search;
        }

        let page=1;
        if(req.query.page){
            page=req.query.page;
        }
        let data = await blog.find({
            $or:[
                {title:{$regex:'.*'+search+'.*',$options:'i'}},
                {name:{$regex:'.*'+search+'.*',$options:'i'}}
            ]
        }).limit((pre_page)*1)
        .skip((page-1)*pre_page)
        .exec();

        if (data) {
            res.render('blog_view', ({ 
                data: data,
                page_num,
                search,
                cpage:page
            }));
        }
    } catch (error) {
        console.log("blog view_page", error);
    }
}

module.exports.delet = async (req, res) => {
    let id = req.params.id;
    try {
        let data = await blog.findById(id);
        if (data) {
            let delcom = await comment.find({oldid:id});
            if(delcom){
                delcom.forEach(async element => {
                    let id = element.id;
                    await comment.findByIdAndDelete(id);
                });
            }
            else{
                console.log("noo");
            }
            let img = path.join(__dirname, '..', data.image);
            if (img) {
                fs.unlinkSync(img);
            }
            await blog.findByIdAndDelete(req.params.id);
            
            req.flash('success','Data Deleted successfully');
            res.redirect('/blog/view_page')
        }
    } catch (error) {
        console.log("blog  delet", error);
    }
}

module.exports.edit_page = async (req, res) => {
    try {
        let data = await blog.findById(req.params.id);
        if (data) {
            res.render('blog_edit', ({ data: data }))
        }
    } catch (error) {
        console.log("edit_page err : ", error);
    }
}

module.exports.edit_data = async (req, res) => {
    try {
        let id = req.body.eid;
        req.body.updatedAt = nDate;
        let data = await blog.findById(id);
        if (data) {
            if (req.file) {
                let ldimg = path.join(__dirname, '..', data.image);
                fs.unlinkSync(ldimg);

                let newimg = blog.upPath + "/" + req.file.filename;
                req.body.image = newimg;

                await blog.findByIdAndUpdate(id, req.body);
                
                req.flash('success','Data Updated successfully');
                res.redirect('/blog/view_page');
            } else {
                req.body.image = data.image;
                
                await blog.findByIdAndUpdate(id, req.body);
                
                req.flash('success','Data Updated successfully');
                res.redirect('/blog/view_page');
            }
        }
    } catch (error) {
        console.log("blog edit_data", error);
    }
}

module.exports.view_comment = async (req,res)=>{
    if (req.query.status == 'deActive') {
        let Active = await comment.findByIdAndUpdate(req.query.id, { isActive: false });
    }
    if (req.query.status == 'Active') {
        let Active = await comment.findByIdAndUpdate(req.query.id, { isActive: true });
    }

    let data = await comment.find({}).populate('oldid').exec();
    console.log(data);
    
    return res.render('view_comment',{
        data
    });
}

module.exports.muldel = async (req,res)=>{
    try {
        let data = req.body.muldel;
        data.forEach(async element => {
            let id = await blog.findById(element);

            let img = path.join(__dirname, '..', id.image);
            fs.unlinkSync(img);

            await blog.findByIdAndDelete(id);
        });
        return res.redirect('back');
    } catch (err) {
        console.log(err);
    }
}