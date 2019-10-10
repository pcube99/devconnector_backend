const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');


//register user controller
exports.registerUser = (req, res, next) => {
    const {errors, isValid } = validateRegisterInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    userModel.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    email: 'Email already exists'
                });
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'mm' // Default
                });
                const newUser = new userModel({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err)
                            throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
};

exports.loginUser = (req, res, next) => {
    const{errors, isValid} = validateLoginInput(req.body);

    const email = req.body.email;
    const password = req.body.password;
    //find user by email
    userModel.findOne({ email: email})
        .then(user => {
        if (!user){
            errors.email = "User not found";
            return res.status(400).json(errors);
        }
        //check password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
            if (isMatch) {
                //user matched  
                //jwt payload
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                };
                //sign token
                jwt.sign(payload, 
                        keys.secretOrKey, 
                        { expiresIn: 3600}, 
                        (err, token) => {
                            res.json({
                                success : true,
                                token: 'Bearer ' + token
                            });
                        }
                    
                );
            } else {
                errors.password = "Password Incorrect";
                res.status(400).json(errors);
            }
            })
        })
};

exports.currentUser = (req, res, next) => {
    res.json({
        id : req.user.id,
        name : req.user.name,
        email : req.user.email
    });
};