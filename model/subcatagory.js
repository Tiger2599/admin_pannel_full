const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const upPath = '/uplod/subcat';

const subcatSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    catagory: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"catagory",
        required: true
    },
    createdAt:{
        type: String,
        required: true
    },
    updatedAt:{
        type: String,
        required: true
    },
    isActive:{
        type:Boolean,
        require:true
    }
},{
    timestamps:true
})

const imgObj = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', upPath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});


subcatSchema.statics.upImg = multer({ storage: imgObj }).single('image');
subcatSchema.statics.upPath = upPath;
const subcat = mongoose.model('subcat', subcatSchema);

module.exports = subcat;
