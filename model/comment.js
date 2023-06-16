const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    oldid:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "blog",
        require:true
    },
    isActive:{
        type:Boolean,
        require:true
    }
})
const comment = mongoose.model('comment', commentSchema);

module.exports = comment;