const mongoose = require('mongoose')
var moment = require('moment')

const CommentSchema = mongoose.Schema({
    username: String,
    commentcontent: String,
    commentdate: {
        type: Date,
        default: moment()
    }
})
const voteSchema = mongoose.Schema({
    upvote: {
        type: Number,
        default: 0
    },
    downvote: {
        type: Number,
        default: 0
    },
    username: {
        type: String,
        default: " "
    }
})
const PostSchema = mongoose.Schema({
    posttitle: String,
    postcontent: String,
    tags: String,
    postdate: {
        type: Date,
        default: moment()
    },
    comments: [CommentSchema],
    votes: [voteSchema],
    quesId: {
        type: String,
        default: " "
    },
    username: String
})

module.exports = mongoose.model('Post', PostSchema)