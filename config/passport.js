const jwtStratergy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const userModel = mongoose.model('users');
const keys = require('./keys');
const opts = {};
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
    passport.use(new jwtStratergy(opts, (jwt_payload, done) => {
        userModel.findById(jwt_payload.id)
            .then(user => {
                if(user){
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
            .catch(err => console.log(err)); 

    }));
};