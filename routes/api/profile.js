const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/profile');
const passport = require('passport');
// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

// @route   GET api/profile/    
// @desc    get current user profile
// @access  private
router.get('/',  passport.authenticate('jwt', {session: false}), profileController.getProfile);

// @route   GET api/profile/all  
// @desc    get all profile 
// @access  public
router.get('/all', profileController.getAllProfile);

// @route   GET api/profile/handle/:handle  
// @desc    get profile handle
// @access  public
router.get('/handle/:handle', profileController.getProfileByHandle);

// @route   GET api/profile/user/:user_id  
// @desc    get profile by user id
// @access  public
router.get('/user/:user_id', profileController.getProfileById);


// @route   POST api/profile/    
// @desc    create user profile
// @access  private
router.post('/',  passport.authenticate('jwt', {session: false}), profileController.createProfile);

// @route   POST api/profile/experience   
// @desc    add experience to profile
// @access  private
router.post('/experience',  passport.authenticate('jwt', {session: false}), profileController.addExperience);

// @route   POST api/profile/education   
// @desc    add education to profile
// @access  private
router.post('/education',  passport.authenticate('jwt', {session: false}), profileController.addEducation);

// @route   DELETE api/profile/experience/:exp_id   
// @desc    delete experience from profile
// @access  private
router.delete('/experience/:exp_id',  passport.authenticate('jwt', {session: false}), profileController.deleteExperience);

// @route   DELETE api/profile/education/:edu_id  
// @desc    delete education from profile
// @access  private
router.delete('/education/:edu_id',  passport.authenticate('jwt', {session: false}), profileController.deleteEducation);

// @route   DELETE api/profile
// @desc    delete user and profile
// @access  private
router.delete('/',  passport.authenticate('jwt', {session: false}), profileController.deleteUser);

module.exports = router;
