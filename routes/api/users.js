const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');


// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: 'Users Works'
}));

// @route   POST api/users/register
// @desc    register a user
// @access  Public
router.post('/register', userController.registerUser);

// @route   GET api/users/login
// @desc    Tests users route
// @access  Public
router.post('/login', userController.loginUser);

// @route   GET api/users/current
// @desc    return current user
// @access  private
router.post('/current', passport.authenticate('jwt', {session: false}), userController.currentUser);
module.exports = router;