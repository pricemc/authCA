const passport = require('passport');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const settings = require('../config/settings');

const router = express.Router();
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

router.post('/register', (req, res) => {
  console.log(req);
  if (!req.body.username || !req.body.password) {
    res.json({ success: false, message: 'Please pass username and password.' });
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save((err) => {
      if (err) {
        return res.json({ success: false, message: 'Username already exists.' });
      }

      const newProfile = new UserProfile({
        username: req.body.username,
        name: req.body.username,
      })

      newProfile.save();
      newUser.userProfile = newProfile._id;
      newUser.save();
      const token = jwt.sign(newUser.toJSON(), settings.tokenSecret, { expiresIn: settings.tokenLife });
      res.json({ success: true, message: 'Successful created new user.', token: token , userProfile: newProfile});
    });
  }
});

router.post('/login', (req, res) => {
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.status(401).send({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          User.findById(user._id).populate('userProfile').exec((err, user) => {
            // if user is found and password is right create a token
            const token = jwt.sign(user.toJSON(), settings.tokenSecret, { expiresIn: settings.tokenLife });
            // return the information including token as JSON
            res.json({ success: true, token: token, userProfile: user.userProfile});
          })

        } else {
          res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.' });
        }
      });
    }
  });
});

module.exports = router;
