const mongoose = require('mongoose');

const catagorySchema = mongoose.Schema({
    catagory: {
        type: String,
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

const catagory = mongoose.model('catagory', catagorySchema);
module.exports = catagory;