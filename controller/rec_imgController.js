const path = require('path')
const fs = require('fs');
const rec_img = require('../model/rec_img_model');

const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.add = (req, res) => {
    res.render('rec_img');
}

module.exports.add_data = async (req, res) => {
    try {
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;
        
        let image = '';
        if (req.file) {
            image = rec_img.upPath + '/' + req.file.filename;
        }
        req.body.image = image;

        let data = await rec_img.create(req.body);
        if (data) {
            req.flash('success','Data enterd successfully');
            res.redirect('/rec_img');
        }
    } catch (err) {
        console.log('rec_img data add err ', err);
    }

}

module.exports.view_page = async (req, res) => {
    try {
        if (req.query.status == 'deActive') {
            let Active = await rec_img.findByIdAndUpdate(req.query.id, { isActive: false });
        }
        if (req.query.status == 'Active') {
            let Active = await rec_img.findByIdAndUpdate(req.query.id, { isActive: true });
        }
        
        var search = '';
        if(req.query.search){
            search = req.query.search;
        }

        var page = 1;
        if(req.query.page){
            page = req.query.page;
        }
        var per_page = 2;

        let data = await rec_img.find({
            $or:[
                {title:{$regex:'.*'+search+'.*'}}
            ]
        })
        .limit(per_page*1)
        .skip((page-1)*per_page)
        .exec();

        let pageData =  await rec_img.find({
            $or:[
                {title:{$regex:'.*'+search+'.*'}}
            ]
        }).countDocuments();

        let pagenum = Math.ceil(pageData/per_page);

        if (data) {
            res.render('rec_img_view', ({ 
                data,
                pagenum,
                cpage:page,
                search
            }));
        }

    } catch (error) {
        console.log("rec_img view_page err : ", error);
    }
}

module.exports.delet = async (req, res) => {
    try {
        let data = await rec_img.findById(req.params.id);
        if (data) {
            let img = path.join(__dirname, '..', data.image);
            fs.unlinkSync(img);

            let delet = await rec_img.findByIdAndDelete(req.params.id);
            if (delet) {
                req.flash('success','Data Deleted successfully');
                res.redirect('/rec_img/view_page')
            }
        }
    } catch (error) {
        console.log("rec_img delet : ", error);
    }
}

module.exports.edit_page = async (req, res) => {
    try {
        let data = await rec_img.findById(req.params.id);
        if (data) {
            res.render('rec_img_edit', ({ data: data }))
        }
    } catch (error) {
        console.log("rec_img edit_page err : ", error);
    }
}

module.exports.edit_data = async (req, res) => {
    try {
        let id = req.body.eid;
        req.body.updatedAt = nDate;
        let data = await rec_img.findById(id);
        if (data) {
            if (req.file) {
                let oldimg = path.join(__dirname, '..', data.image);
                fs.unlinkSync(oldimg);

                let newimage = rec_img.upPath + "/" + req.file.filename;
                req.body.image = newimage;

                await rec_img.findByIdAndUpdate(id, req.body);
                req.flash('success','Data Updated successfully');
                res.redirect('/slider/view_page');
            } else {
                req.body.image = data.image;
                await rec_img.findByIdAndUpdate(id, req.body);
                
                req.flash('success','Data Updated successfully');
                res.redirect('/slider/view_page');
            }
        }
    } catch (error) {
        console.log("rec_img edig_data : ", error);
    }
}

module.exports.delmul = async (req,res) =>{
    // console.log(req.body.muldel);
    try {
        let data = req.body.muldel;
        data.forEach(async element => {
            let imgdata = await rec_img.findById(element);
            // console.log(img);
            let imgpath = path.join(__dirname,'..',imgdata.image);
            if(imgpath){
                fs.unlinkSync(imgpath);
            }
            await rec_img.findByIdAndDelete(element);
        });
        req.flash('success','Data Deleted successfully');
        return res.redirect('/rec_img/view_page');
    } catch (err) {
        console.log(err);
    }
}