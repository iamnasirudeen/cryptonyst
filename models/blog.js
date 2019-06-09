var mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema
var blogSchema = new Schema({
    title: String,
    image: String,
    content: String,
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = mongoose.model('Blog', blogSchema);