const catagory = require('../model/catagory');
let nDate = new Date().toLocaleString('en-us',{
    timeZone:'Asia/Calcutta'
})

module.exports.addcatagory = async (req,res)=>{
    return res.render('add_addcatagory');
}

module.exports.insertdata = async (req,res)=>{

    req.body.updatedAt = nDate ;
    req.body.createdAt = nDate ;
    req.body.isActive = true ;
    await catagory.create(req.body);

    req.flash('success','Data Add successfully');
    return res.redirect('back');
}

module.exports.viewcatagory = async (req,res)=>{
    try {
        if (req.query.status == 'deActive') {
            let Active = await catagory.findByIdAndUpdate(req.query.id, { isActive: false });
        }
        if (req.query.status == 'Active') {
            let Active = await catagory.findByIdAndUpdate(req.query.id, { isActive: true });
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

        let data = await catagory.find({
            $or: [
                { catagory: { $regex: '.*' + search + '.*' } }
            ]
        })
        .limit(per_page*1)
        .skip((page-1) * per_page)
        .exec();

        let page_count = await catagory.find({
            $or: [
                { catagory: { $regex: '.*' + search + '.*' } }
            ]
        })
        .countDocuments();

        let pagenum = Math.ceil(page_count/per_page);

        return res.render('view_cat',{
            data,
            pagenum,
            cpage:page,
            search
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports.delet = async (req,res)=>{
    try {
        await catagory.findByIdAndDelete(req.params.id);
        req.flash('success','Data Deleted successfully');
        return res.redirect('back');
    } catch (err) {
        console.log(err);
    }
}

module.exports.edit_page = async (req,res)=>{
    try {
        let data = await catagory.findById(req.params.id);
        if(data){
            return res.render('cat_edit',{data});
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports.cat_update = async(req,res)=>{
    try {
        req.body.updatedAt = nDate ;
        let id = req.body.uid;
        await catagory.findByIdAndUpdate(id,req.body);
        req.flash('success','Data Updated successfully');
        return res.redirect('/catagory/viewcatagory')
    } catch (err) {
        console.log(err);
    }
}

module.exports.muldel = async (req,res)=>{
    try {
        let data = req.body.muldel;
        await catagory.findByIdAndDelete(data);
        req.flash('success','Data Deletd successfully');
        return res.redirect('back')
    } catch (err) {
        console.log(err);
    }
}