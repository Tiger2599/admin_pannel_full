const comment = require('../model/comment');
const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
});    

module.exports.com_insert = async (req,res)=>{
    try {
        req.body.date = nDate;
        console.log(nDate);
        req.body.isActive = true;
        await comment.create(req.body);
        return res.redirect('back');
    } catch (err) {
        console.log(err);
    }
}

