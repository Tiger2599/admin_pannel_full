const slider = require('../model/slider_model');
const path = require('path')
const fs = require('fs');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.add = (req, res) => {
    res.render('slider');
}

module.exports.add_data = async (req, res) => {
    try {
        let i = '';
        if (req.file) {
            i = slider.upPath + '/' + req.file.filename;
        }
        req.body.image = i;


        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;

        let data = await slider.create(req.body);
        if (data) {
            req.flash('success','Slider Add successfully');
            res.redirect('/slider');
        }
    } catch (err) {
        console.log('addslider err ', err);
    }

}

module.exports.view_page = async (req, res) => {
    try {

        if (req.query.status == 'deActive') {
            let Active = await slider.findByIdAndUpdate(req.query.id, { isActive: false });
        }
        if (req.query.status == 'Active') {
            let Active = await slider.findByIdAndUpdate(req.query.id, { isActive: true });
        }

        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        var page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
        var per_page = 2;

        let data = await slider.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).limit(per_page * 1)
            .skip((page - 1) * per_page)
            .exec();

        let page_count = await slider.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
                { content: { $regex: '.*' + search + '.*', $options: 'i' } }
            ]
        }).countDocuments();//---bath data count kare

        let pageNum = Math.ceil(page_count / per_page);

        if (data) {
            res.render('slider_view', ({
                data: data,
                pageNum: pageNum,
                cpage: page,
                search: search
            }));
        }
    } catch (error) {
        console.log("slider view_page err : ", error);
    }
}

module.exports.delet = async (req, res) => {
    try {
        let data = await slider.findById(req.params.id);
        if (data) {
            let img = path.join(__dirname, '..', data.image);
            if (img) {
                fs.unlinkSync(img);
            }
            await slider.findByIdAndDelete(req.params.id);
            req.flash('success','Slider Deleted successfully');
            res.redirect('/slider/view_page')
        }
    } catch (error) {
        console.log("slider delet : ", error);
    }
}

module.exports.edit_page = async (req, res) => {
    try {
        let data = await slider.findById(req.params.id);
        if (data) {
            res.render('slider_edit', ({ data: data }))
        }
    } catch (error) {
        console.log('slider edit_page err : ', error);
    }
}

module.exports.edit = async (req, res) => {
    try {
        let id = req.body.eid;
        let data = await slider.findById(id);
        if (data) {
            if (req.file) {
                let di = path.join(__dirname, '..', data.image);
                fs.unlinkSync(di);

                let ni = slider.upPath + "/" + req.file.filename;
                req.body.image = ni;

                req.body.updatedAt = nDate;

                await slider.findByIdAndUpdate(id, req.body);
                req.flash('success','Slider upadted successfully');
                res.redirect('/slider/view_page');
            } else {
                req.body.image = data.image;
                let nDate = new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Calcutta'
                });

                req.body.updatedAt = nDate;

                await slider.findByIdAndUpdate(id, req.body);
                
                req.flash('success','Slider upadted successfully');
                res.redirect('/slider/view_page');
            }
        }
    } catch (error) {
        console.log("slider edit err : ", error);
    }
}

module.exports.mulDel = async (req, res) => {
    try {
        let data = req.body.mulDel;
        data.forEach(async element => {
            let id = await slider.findById(element);

            let img = path.join(__dirname, '..', id.image);
            fs.unlinkSync(img);

            await slider.findByIdAndDelete(id);
        });
        return res.redirect('/slider/view_page');
    } catch (err) {
        console.log(err);
    }
}

