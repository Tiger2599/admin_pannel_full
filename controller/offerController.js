const offer = require('../model/offer_model')
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});

module.exports.add = (req, res) => {
    res.render('offer');
}
module.exports.add_data = async (req, res) => {
    try {
        req.body.createdAt = nDate;
        req.body.updatedAt = nDate;
        req.body.isActive = true;
        await offer.create(req.body);
        req.flash('success','Offer Add successfully');
        return res.redirect('/offer');
    } catch (error) {
        console.log("offer add_data : ", error);
    }
}

module.exports.view_page = async (req, res) => {
    try {
        if (req.query.status == 'deActive') {
            let Active = await offer.findByIdAndUpdate(req.query.id, { isActive: false });
        }
        if (req.query.status == 'Active') {
            let Active = await offer.findByIdAndUpdate(req.query.id, { isActive: true });
        }

        var search='';
        if(req.query.search){
            search=req.query.search;
        }

        var page = 1;
        if(req.query.page){
            page=req.query.page;
        }
        var per_page = 2;
        
        let data = await offer.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
            ]
        })
        .limit(per_page*1)
        .skip((page-1)*per_page)
        .exec();

        var page_count = await offer.find({
            $or: [
                { title: { $regex: '.*' + search + '.*', $options: 'i' } },
            ]
        }).countDocuments();

        var pageNum = Math.ceil(page_count/per_page);

        if (data) {
            res.render('offer_view', ({ 
                data,
                pageNum,
                cpage:page,
                search
            }));
        }
    } catch (error) {
        console.log("offer error : ", error);
    }
}

module.exports.delet = async (req, res) => {
    try {
        await offer.findByIdAndDelete(req.params.id);
        req.flash('success','Offer Deleted successfully');
        res.redirect('/offer/view_page')
    } catch (error) {
        console.log("offer delet", error);
    }
}

module.exports.edit_page = async (req, res) => {
    try {
        let data = await offer.findById(req.params.id);
        if (data) {
            res.render('offer_edit', ({ data: data }))
        }
    } catch (error) {
        console.log("offer edit_page");
    }
}

module.exports.edit = async (req, res) => {
    try {
        req.body.updatedAt = nDate;
        let id = req.body.eid;
        await offer.findByIdAndUpdate(id, req.body);

        req.flash('success','Offer Updated successfully');
        res.redirect('/offer/view_page');
    } catch (error) {
        console.log("offer edit", error);
    }

}

module.exports.mulDel = async (req,res)=>{
    // console.log(req.body);   
    try {
        let data = req.body.muldel;
        data.forEach(async element => {
            await offer.findByIdAndDelete(element);
        });

        req.flash('success','Offer Deleted successfully');
        return res.redirect('/offer/view_page')
    } catch (err) {
        console.log(err);
    }
}






