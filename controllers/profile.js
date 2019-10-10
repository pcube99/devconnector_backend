const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const profileModel = require('../models/profile');
const userModel = require('../models/user');
const validateProfileInput = require('../validation/profile');
const validateExperienceInput = require('../validation/experience');
const validateEducationInput = require('../validation/education');

const keys = require('../config/keys');
exports.getProfile = (req, res, next) => {
    const errors = {};
    profileModel.findOne({user : req.user.id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = "There is no profile for this user";
                return res.status(400).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(400).json(err));
};

exports.createProfile = (req, res, next) => {
    // Get fields
    const {errors, isValid} = validateProfileInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    profileModel.findOne({user : req.user.id})
        .then(profile => {
            if(profile){
                //update
                profileModel.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
                ).then(profile => res.json(profile));
            } else{
                //create
                // Check if handle exists
                profileModel.findOne({ handle: profileFields.handle }).then(profile => {
                if (profile) {
                    errors.handle = 'That handle already exists';
                    res.status(400).json(errors);
                }

                // Save Profile
                new profileModel(profileFields).save().then(profile => res.json(profile));
                });
            }

        })
        .catch();

};

exports.getProfileByHandle = (req, res, next) => {
    const errors = {};
    profileModel.findOne({handle : req.params.handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = "THere is no profile for this user";
                res.status(400).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(400).json({profile : "THere is no profile for this user"}));
};

exports.getProfileById = (req, res, next) => {
    const errors = {};

    profileModel.findOne({user : req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = "THere is no profile for this user";
                res.status(400).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(400).json({profile : "THere is no profile for this user"}));
};

exports.getAllProfile = (req, res, next) => {
    const errors = {};
    profileModel.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if(!profiles){
                errors.noprofile = "THere is no profile for this user";
                return res.status(400).json(errors);
            }
            res.json(profiles);
        })
        .catch(err => res.status(400).json({profile : "THere is no profile for this user"}));
};

exports.addExperience = (req, res, next) => {
    const {errors, isValid} = validateExperienceInput(req.body);
    if(!isValid){
        return res.status(400).json(errors); 
    }
    profileModel.findOne({user: req.user.id})
        .then(profile => {
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        };
        //add to exp array
        profile.experience.unshift(newExp);
        profile.save().then(profile => res.json(profile));
    })
};

exports.addEducation = (req, res, next) => {
    const {errors, isValid} = validateEducationInput(req.body);
    if(!isValid){
        return res.status(400).json(errors); 
    }
    profileModel.findOne({user: req.user.id})
        .then(profile => {
        const newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
            };
        //add to exp array
        profile.education.unshift(newEdu);
        profile.save().then(profile => res.json(profile));
    })
};

exports.deleteExperience = (req, res, next) => {
    profileModel.findOne({user: req.user.id})
        .then(profile => {
        //get remove index
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

        //splice out
        profile.experience.splice(removeIndex, 1);
        
        //save
        profile.save().then(profile => res.json(profile));

    })
    .catch(err => res.status(400).json(err));
};

exports.deleteEducation = (req, res, next) => {
    profileModel.findOne({user: req.user.id})
        .then(profile => {
        //get remove index
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);

        //splice out
        profile.education.splice(removeIndex, 1);
        
        //save
        profile.save().then(profile => res.json(profile));

    })
    .catch(err => res.status(400).json(err));
};

exports.deleteUser = (req, res, next) => {
    profileModel.findOneAndRemove({user : req.user.id})
        .then(() => {
            userModel.findByIdAndRemove({_id : req.user.id})
                .then(() => {
                    res.json({success : true})
                });
        })
};