const slider = require("../model/slider_model");
const offer = require("../model/offer_model");
const rec_img=require('../model/rec_img_model');
const blog = require('../model/blog_model');
const say = require('../model/say_model');
const comment = require('../model/comment');
const catagory = require('../model/catagory');
const subcatagory = require('../model/subcatagory');

module.exports.index = async (req, res) => {
  try {
    let slider_data = await slider.find({isActive:true});
    let offer_data = await offer.find({isActive:true});
    let rec_img_data = await rec_img.find({isActive:true});
    let blog_data = await blog.find({isActive:true});
    let say_data = await say.find({isActive:true});

    if (offer_data) {

      res.render("user/index_user", {
        slider: slider_data,
        offer:offer_data,
        rec_img:rec_img_data,
        say:say_data,
        blog:blog_data,
      });

    }
  } catch (err) {
    console.log("slider data send err in index", err);
  }
};

module.exports.blog_single = async (req,res)=>{
  let id = req.query.id;
  try {
    let data = await blog.findById(id);
    let blogdata = await blog.find({});

    let comment_data = await comment.find({oldid:id,isActive:true});
    let dataCount = await comment.find({oldid:id,isActive:true}).countDocuments();

    var pagedata = [];
    blogdata.map((v,i)=>{
      pagedata.push(v.id);
    })
    var next = pagedata.indexOf(id);

    let reversdata = await blog.find({isActive:true}).sort({_id:-1}).limit(3);

    return res.render('user/blog-single',{
      data,
      'comment':comment_data,
      dataCount,
      next ,
      pre:next,
      pagedata,
      reversdata
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports.filtergallary = async (req,res)=>{
  let catdata = await catagory.find({isActive:true});
  let subdata = await subcatagory.find({isActive:true});
  return res.render('user/gallary',{
    catdata,
    subdata
  });
}

module.exports.contact = async (req,res)=>{
  return res.render('user/contact');
}

// module.exports.contactSub = async (req,res)=>{
  
// }