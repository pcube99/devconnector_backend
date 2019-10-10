const mongoose = require('mongoose');
const profileModel = require('../models/profile');
const userModel = require('../models/user');
const postModel = require('../models/post');
const validatePostInput = require('../validation/post');
exports.createPost = (req, res, next) => {
    const {errors, isValid} = validatePostInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    const newPost = new postModel({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });
    newPost.save()
        .then(post => res.json(post));
};

exports.getAllPosts = (req, res,next) => {
    postModel.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({nopostsfound : "No posts found"}));
};

exports.getPostById = (req, res, next) => {
    postModel.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({nopostfound : "No post found"}));
};

exports.deletePostById = (req, res, next) => {
    profileModel.findOne({user : req.user.id})
        .then(profile => {
            postModel.findById(req.params.id)
                .then(post => {
                    if(post.user.toString() !== req.user.id) {
                        return res.status(401).json({notauthorized : "User not authorized"});
                    }

                    //delete 
                    post.remove().then(() => res.json({success : true}));
                })
                .catch(err => res.status(404).json({postnotfound : "post not found"})); 
        });
};  

exports.likePostById = (req,res, next) => {
    profileModel.findOne({user : req.user.id})
    .then(profile => {
        postModel.findById(req.params.id)
            .then(post => {
                if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                    //user has already liked post
                    return res.status(400).json({alreadyliked : "User already liked"});
                }
                //add user to likes
                post.likes.unshift({user : req.user.id});
                post.save()
                    .then(post => {
                        res.json(post);
                    })
            })
            .catch(err => res.status(404).json({postnotfound : "post not found"})); 
    });
};

exports.unlikePostById = (req,res, next) => {
    profileModel.findOne({user : req.user.id})
    .then(profile => {
        postModel.findById(req.params.id)
            .then(post => {
                if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                    //user has already liked post
                    return res.status(400).json({notliked : "You have not liked post"});
                }

                //get remove index
                const removeIndex = post.likes
                    .map(item => item.user.toString())
                    .indexOf(req.user.id);
                post.likes.splice(removeIndex ,1);
                post.save().then(post => res.json(post));
            })
            .catch(err => res.status(404).json({postnotfound : "post not found"})); 
    });
};

exports.commentPost = (req, res, next) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    postModel.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
};

exports.deleteComment = (req, res, next) => {
    postModel.findById(req.params.id)
      .then(post => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
};