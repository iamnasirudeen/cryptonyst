var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
    commentBody: String,
    postId:{
    	type: Schema.Types.ObjectId,
    	ref: 'Blog'
    },
    author: {
    	type: Schema.Types.ObjectId,
    	ref: 'User'
    }
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);