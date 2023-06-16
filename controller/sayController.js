const say = require('../model/say_model')

const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.add = (req, res) => {
    res.render('say');
}
module.exports.add_data = async (req, res) => {
    try {
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;
        let data = await say.create(req.body);
        
        req.flash('success','Data Enterd successfully');
        return res.redirect('/say');
    } catch (err) {
        console.log("say add data err : ", err);
    }
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

        let data_num = await say.find().countDocuments();
        let page_num=Math.ceil(data_num/pre_page);
        
        let search='';
        if(req.query.search){
            search=req.query.search;
        }

        let page=1;
        if(req.query.page){
            page=req.query.page;
        }

        let data = await say.find(
            {$or:[
                {name:{$regex:'.*'+search+'.*',$options:'i'}},
                {content:{$regex:'.*'+search+'.*',$options:'i'}},
                {city:{$regex:'.*'+search+'.*',$options:'i'}},
                {country:{$regex:'.*'+search+'.*',$options:'i'}}
            ]}
        ).limit((pre_page)*1)
        .skip((page-1)*pre_page)
        .exec();
        
        if (data) {
            res.render('say_view', ({ 
                data,
                page_num,
                cpage:page,
                search
            }));
        }
    } catch (error) {
        console.log("say view page err: ", error);
    }
}

module.exports.delet = async (req, res) => {
    try {
        await say.findByIdAndDelete(req.params.id);
        req.flash('success','Data Deleted successfully');
        res.redirect('/say/view_page')
    } catch (err) {
        console.log("say delet : ", err);
    }
}

module.exports.edit_page = async (req, res) => {
    try {
        let data = await say.findById(req.params.id);
        if (data) {
            res.render('say_edit', ({ data: data }))
        }
    } catch (error) {
        console.log("say edit_page err : ", error);
    }
}

module.exports.edit = async (req, res) => {
    try {
        req.body.updatedAt = nDate;
        let id = req.body.eid;

        await say.findByIdAndUpdate(id, req.body);
        req.flash('success','Data Updated successfully');
        res.redirect('/say/view_page');
    } catch (error) {
        console.log("say edit err ", error);
    }
}

module.exports.muldel = (req,res)=>{
    try {
        let data = req.body.muldel;
        data.forEach(async element => {
            let id = await say.findById(element);

            req.flash('success','Data Deleted successfully');
            await say.findByIdAndDelete(id);
        });
        return res.redirect('back');
    } catch (err) {
        console.log(err);
    }
}