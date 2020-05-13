const User = require('../models/userModel')

const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

const salt = 10

async function addUser(req, res) {
    try {
        const { username, password, email, score } = req.body
        const { role } = req.body || 'USER'
        if (typeof username == 'undefined' && typeof password == 'undefined' && typeof email == 'undefined' && typeof score == 'undefined') {

            throw new Error('Incomplete details to add new User')
        }
        else {

            await User.find({ username: username }, async (err, docs) => {
                if (docs.length != 0) {
                    res.status(403).send({
                        success: false,
                        message: 'User Name taken!Try another!'

                    })
                } else {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) {
                            throw err
                        } else {

                            let newUser = new User({
                                username: username,
                                email: email,
                                password: hash,
                                score: score,
                                role: role
                            })
                            newUser.save((err, docs) => {
                                if (err) {
                                    res.status(500).send({
                                        success: false,
                                        message: 'DB Error'
                                    })
                                } else {
                                    res.status(200).send({
                                        success: true,
                                        message: 'User Created!'
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body
        if (typeof username == 'undefined' && typeof password == 'undefined') {
            res.status(400).send({
                success: false,
                message: 'Bad Request!One or more fields are missing!'
            })
        } else {
            await User.findOne({ username: username }, (err, docs) => {
                if (!docs) {
                    res.status(204).send({
                        success: true,
                        message: 'No matches'
                    })
                } else {
                    bcrypt.compare(password, docs.password, (err, isMatch) => {
                        if (err) {
                            throw err;
                        }
                        else if (isMatch) {
                            jwt.sign({ docs }, 'secret', (err, token) => {
                                res.status(200).send({
                                    success: true,
                                    _id: docs._id,
                                    username: docs.username,
                                    score: docs.score,
                                    role: docs.role,
                                    jwttoken: token
                                });
                            });
                        } else {
                            res.status(400).send({
                                success: false,
                                message: 'Wrong Password!'
                            });
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

async function updateScore(req, res) {
    try {
        const { username, score } = req.body
        if (typeof username == 'undefined' && typeof score == 'undefined') {
            res.status(400).send({
                success: false,
                message: 'Bad Request!One or more fields are missing!'
            })
        }
        else {
            await User.findOneAndUpdate({ 'username': username }, { $set: { 'score': score } }, (err, docs) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: 'DB Error'
                    })
                } else {
                    res.status(200).send({
                        success: true,
                        message: 'Score Updated'
                    })
                }
            })

        }

    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server Error!'
        })
    }
}

async function getAllUsers(req, res) {
    try {
        await User.find({ role: { $ne: 'ADMIN' } }, (err, docs) => {
            if (docs.length == 0) {
                res.status(204).send({
                    success: true,
                    message: 'No data!'
                })
            }
            else if (err) {
                throw err;
            }
            else {
                res.status(200).send({
                    success: true,
                    message: docs
                })
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
    addUser,
    login,
    updateScore,
    getAllUsers
}