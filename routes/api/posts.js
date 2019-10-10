const express = require('express');
const router = express.Router();
const postController = require('../../controllers/posts');
const passport = require('passport');
// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   GET api/posts/
// @desc    get all post
// @access  public
router.get('/',postController.getAllPosts);

// @route   GET api/posts/:id
// @desc    get post by id
// @access  public
router.get('/:id',postController.getPostById);

// @route   DELETE api/posts/:id
// @desc    delete post by id
// @access  private
router.delete('/:id',passport.authenticate('jwt', {session : false }),postController.deletePostById);

// @route   POST api/posts/
// @desc    create post
// @access  private
router.post('/', passport.authenticate('jwt', {session : false }), postController.createPost);

// @route   POST api/posts/like/:id
// @desc    like post
// @access  private
router.post('/like/:id', passport.authenticate('jwt', {session : false }), postController.likePostById);

// @route   POST api/posts/unlike/:id
// @desc    unlike post
// @access  private
router.post('/unlike/:id', passport.authenticate('jwt', {session : false }), postController.unlikePostById);

// @route   POST api/posts/comment/:id
// @desc    comment a post
// @access  private
router.post('/comment/:id', passport.authenticate('jwt', {session : false }), postController.commentPost);

// @route   DELETE api/posts/comment/:id/:comment_id'
// @desc    remove a post comment
// @access  private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session : false }), postController.deleteComment);



module.exports = router;
