const Post = require('../models/postModel')
const User = require('../models/userModel')


async function addPost(req, res) {
    try {
        const { posttitle, postcontent, tags, username } = req.body

        if (typeof postcontent == 'undefined' && typeof posttitle == 'undefined' && typeof tags == 'undefined' && typeof username == 'undefined') {
            throw new Error('Incomplete details to create new Post')
        } else {
            await User.find({ username: username }, async (err, docs) => {
                if (docs.length == 0) {
                    res.status(403).send({
                        success: false,
                        message: 'User Name Not Present!Invalid User attempt!'

                    })
                }
                else {
                    let newPost = new Post({
                        postcontent: postcontent,
                        posttitle: posttitle,
                        tags: tags,
                        username: username
                    })
                    await newPost.save((err, docs) => {
                        if (err) {
                            res.status(500).send({
                                success: false,
                                message: 'DB Error'
                            })
                        } else {
                            res.status(200).send({
                                success: true,
                                message: 'Post Created!'
                            })
                        }
                    })
                }
            })

        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}

async function getAllPost(req, res) {
    try {
        await Post.find({ quesId: " " }).sort({ createdAt: -1 }).exec((err, docs) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'DB Error'
                })
            }
            else {
                if (docs.length > 0) {
                    res.status(200).send({
                        success: true,
                        message: docs
                    })
                } else {
                    res.status(204).send({
                        success: true,
                        message: 'No Posts'
                    })
                }
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}

async function deletePost(req, res) {
    try {
        const { id } = req.params;
        if (typeof id == 'undefined') {
            res.status(400).send({
                success: false,
                message: 'Id is missing!'
            })
        } else {
            await Post.deleteOne({ _id: id }, async (err, docs) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: 'DB Error'
                    })
                } else {
                    res.status(200).send({
                        success: true,
                        message: 'Post Deleted!'
                    })
                }
            })
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}

async function vote(req, res) {
    try {
        const { id, upvote, downvote, username } = req.body
        if (typeof id == 'undefined' && typeof username == 'undefined' && typeof upvote == 'undefined' && typeof downvote == 'undefined') {
            res.status(400).send({
                success: false,
                message: 'Bad Request!'
            })
        } else {
            await User.find({ username: username }, async (err, docs) => {
                if (docs.length == 0) {
                    res.status(403).send({
                        success: false,
                        message: 'User Name Not Present!'

                    })
                }
                else {
                    Post.findOne({ _id: id }, (err, docs) => {
                        if (err) {
                            res.status(404).send({
                                success: false,
                                message: 'Post Id Not Found'
                            })
                        }
                        else {
                            var isFound = 0;
                            for (var i in docs.votes) {

                                if (docs.votes[i].username == username) {
                                    isFound = 1;
                                    docs.votes[i].upvote = upvote
                                    docs.votes[i].downvote = downvote
                                    docs.save((err, docs) => {
                                        if (err) {
                                            res.status(500).send({
                                                success: false,
                                                message: 'DB Error'
                                            })
                                            return;
                                        } else {
                                            res.status(200).send({
                                                success: true,
                                                message: 'Voted'
                                            })
                                            return;
                                        }
                                    })
                                    return;
                                }
                                else {
                                    continue;
                                }
                            }
                            if (isFound == 0) {
                                docs.votes.push({ username: username, upvote: upvote, downvote: downvote })
                                docs.save((err, docs) => {
                                    if (err) {
                                        res.status(500).send({
                                            success: false,
                                            message: 'DB Error'
                                        })
                                    } else {
                                        res.status(200).send({
                                            success: true,
                                            message: 'Voted'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}

async function getPostBasedOnUser(req, res) {
    try {
        const { name } = req.params
        if (typeof name == 'undefined') {
            res.status(400).send({
                success: false,
                message: 'Bad Request!'
            })
        } else {
            await Post.find({ username: name, quesId: " " }).sort({ createdAt: -1 }).exec((err, docs) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: 'DB Error'
                    })
                }
                else {
                    if (docs.length > 0) {
                        res.status(200).send({
                            success: true,
                            message: docs
                        })
                    } else {
                        res.status(204).send({
                            success: true,
                            message: 'No Posts'
                        })
                    }
                }
            })
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}
async function replyPost(req, res) {
    try {
        const { posttitle, postcontent, tags, username, quesId } = req.body

        if (typeof postcontent == 'undefined' && typeof posttitle == 'undefined' && typeof tags == 'undefined' && typeof username == 'undefined' && typeof quesId == 'undefined') {
            throw new Error('Incomplete details to create new Reply Post')
        } else {
            await User.find({ username: username }, async (err, docs) => {
                if (docs.length == 0) {
                    res.status(403).send({
                        success: false,
                        message: 'User Name Not Present!Invalid User attempt!'

                    })
                }
                else {
                    let newPost = new Post({
                        postcontent: postcontent,
                        posttitle: posttitle,
                        tags: tags,
                        username: username,
                        quesId: quesId
                    })
                    await newPost.save((err, docs) => {
                        if (err) {
                            res.status(500).send({
                                success: false,
                                message: 'DB Error'
                            })
                        } else {
                            res.status(200).send({
                                success: true,
                                message: 'Post Created!'
                            })
                        }
                    })
                }
            })

        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}

async function getReplyPostForQuestions(req, res) {
    try {
        const { quesId } = req.params
        if (typeof quesId == 'undefined') {
            throw new Error('Incomplete details to retrive Replies!')
        } else {
            await Post.find({ quesId: quesId }).sort({ createdAt: -1 }).exec((err, docs) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: 'DB Error'
                    })
                }
                else {
                    if (docs.length > 0) {
                        res.status(200).send({
                            success: true,
                            message: docs
                        })
                    } else {
                        res.status(204).send({
                            success: true,
                            message: 'No Posts'
                        })
                    }
                }
            })
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}

async function addComment(req, res) {
    try {
        const { id, username, commentcontent } = req.body
        if (typeof id == 'undefined' && typeof username == 'undefined' && typeof commentcontent == 'undefined') {
            res.status(400).send({
                success: false,
                message: 'Bad Request!'
            })
        } else {
            await User.find({ username: username }, async (err, docs) => {
                if (docs.length == 0) {
                    res.status(403).send({
                        success: false,
                        message: 'User Name Not Present!Invalid User attempt!'

                    })
                }
                else {
                    Post.findOne({ _id: id }, (err, docs) => {
                        if (err) {
                            res.status(404).send({
                                success: false,
                                message: 'Post Id Not Found!'
                            })
                        }
                        else {
                            docs.comments.push({ username: username, commentcontent: commentcontent })
                            docs.save((err, docs) => {
                                if (err) {
                                    res.status(500).send({
                                        success: false,
                                        message: 'DB Error'
                                    })
                                } else {
                                    res.status(200).send({
                                        success: true,
                                        message: 'Commented'
                                    })
                                }
                            })
                        }

                    })

                }
            })
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}

async function getPostDetails(req, res) {
    try {
        const { id } = req.params
        if (typeof id == 'undefined') {
            res.status(400).send({
                success: false,
                message: 'Bad Request!'
            })
        } else {
            await Post.find({ _id: id }).sort({ createdAt: -1 }).exec((err, docs) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: 'DB Error'
                    })
                }
                else {
                    if (docs.length > 0) {
                        res.status(200).send({
                            success: true,
                            message: docs
                        })
                    } else {
                        res.status(204).send({
                            success: true,
                            message: 'No Posts'
                        })
                    }
                }
            })

        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}
async function getAllPostBasedOnTags(req, res) {
    try {
        const { tag } = req.params
        await Post.find({ quesId: " ", tags: { $regex: tag } }).sort({ createdAt: -1 }).exec((err, docs) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: 'DB Error'
                })
            }
            else {
                if (docs.length > 0) {
                    res.status(200).send({
                        success: true,
                        message: docs
                    })
                } else {
                    res.status(204).send({
                        success: true,
                        message: 'No Posts'
                    })
                }
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }

}

module.exports = {
    addPost,
    getAllPost,
    deletePost,
    vote,
    getPostBasedOnUser,
    replyPost,
    getReplyPostForQuestions,
    addComment,
    getPostDetails,
    getAllPostBasedOnTags
}