const subcat = require('../model/subcatagory');
const catagory = require('../model/catagory');
const path = require('path')
const fs = require('fs')

module.exports.addsubcat = async (req,res)=>{
    try {
        let data = await catagory.find({});
        return res.render('subcatagory',{
            data
        });
    } catch (err) {
        console.log(err);
    }
}
module.exports.adddata = async (req,res)=>{
    try {
        let nDate = new Date().toLocaleString('en-us',{
            timeZone:'Asia/Calcutta'
        })
    
        let image = '';
            if (req.file) {
                image = subcat.upPath + '/' + req.file.filename;
            }
            req.body.image = image;
    
        await catagory.find({}).populate('catagory').exec();
    
        req.body.isActive = true;
        req.body.updatedAt = nDate;
        req.body.createdAt = nDate;
        await subcat.create(req.body);
        
        req.flash('success','Data Add successfully');
        return res.redirect('back');
    } catch (err) {
        console.log(err);
    }
}

module.exports.view_subcat = async (req,res)=>{
    try {

        if(req.query.status == 'deActive'){
            await subcat.findByIdAndUpdate(req.query.id,{isActive:false});
        }
        if(req.query.status == 'Active'){
            await subcat.findByIdAndUpdate(req.query.id,{isActive:true});
        }

        let search = '';
        if(req.query.search){
            search = req.query.search;
        }

        let page = 1;
        if(req.query.page){
            page = req.query.page;
        }
        let per_page = 2;

        let data = await subcat.find({
            $or: [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).populate('catagory')
        .limit(per_page)
        .skip((page-1)*per_page)
        .exec();

        let page_count = await subcat.find({})
        .countDocuments();

        let pagenum = Math.ceil(page_count/per_page);

        return res.render('view_subcat',{
            data,
            cpage:page,
            pagenum
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports.delet = async (req,res)=>{
    try {
        let data = await subcat.findById(req.params.id);
        if(data){
            let image = path.join(__dirname,'..',data.image);
            if(image){
                fs.unlinkSync(image);
            }
            await subcat.findByIdAndDelete(req.params.id);
            req.flash('success','Data Deleted successfully');
            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports.edit_page = async (req,res)=>{
    try {
        let data = await subcat.findById(req.params.id);
        let catdata = await catagory.find({});
        return res.render('subcat_edit',{
            data,
            catdata});
    } catch (err) {
        console.log(err);
    }
}

module.exports.subcat_update = async (req,res)=>{
    try {
        let id = req.body.uid;
        if(req.file){
            let olddata = await subcat.findById(id);
            if(olddata){
                let oldimg = path.join(__dirname,'..',olddata.image);
                fs.unlinkSync(oldimg);

                let newimage = subcat.upPath + "/" + req.file.filename;
                req.body.image = newimage;

                await subcat.findByIdAndUpdate(id,req.body);
                req.flash('success','Data Updated successfully');
                return res.redirect('/subcatagory/view_subcat');
            }
        }
        else{
            let olddata = await subcat.findById(id);
            req.body.image = olddata.image;
            await subcat.findByIdAndUpdate(id,req.body);
            req.flash('success','Data Updated successfully');
            return res.redirect('/subcatagory/view_subcat');
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports.muldel = async (req,res)=>{
    try {
        let data = req.body.muldel;
        data.forEach(async element => {
            let id = await subcat.findById(element);
            
            let img = path.join(__dirname, '..', id.image);
            fs.unlinkSync(img);
            await subcat.findByIdAndDelete(id);
            req.flash('success','Data Deleted successfully');
            return res.redirect('back');
        });
    } catch (err) {
        console.log(err);
    }
}