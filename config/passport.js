var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    mongoose = require('mongoose');

// load up the user model
var User = require('../models/User');
var settings = require('../config/settings'); // get settings file

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = settings.tokenSecret;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findById(mongoose.Types.ObjectId(jwt_payload._id)).populate('userProfile').exec(function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};