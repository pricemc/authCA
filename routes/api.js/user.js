const express = require('express');

const router = express.Router();
const passport = require('passport');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const UserProfile = require('../../models/UserProfile');
require('../../config/passport')(passport);

const mongoose = require('mongoose');

/* GET CURRENT USER */
router.get('/', (req, res, next) => {
  const token = getToken(req.headers);
  if (token) {
    return res.json({success: true, message: req.user.userProfile});

  } else {
    return res.status(403).send({ success: false, message: 'Unauthorized.' });
  }
});

/* SAVE User */
router.post('/', (req, res, next) => {
  const token = getToken(req.headers);
  if (token) {
    UserProfile.findById(mongoose.Types.ObjectId(req.user.userProfile._id), (err, user) => {
        console.log(err);
        console.log(user);
        if (err) return next(err);
        user.bio = req.body.bio;
        user.name = req.body.name;
        user.save((err) => {
            console.log(err);
            return res.json({success: true, message: user});
        });
    })
  } else {
    return res.status(403).send({ success: false, message: 'Unauthorized.' });
  }
});

/* SAVE Comment */
router.post('/comment', (req, res, next) => {
  const token = getToken(req.headers);
  console.log(req.body);
  if(!req.body.comment || !req.body.post) return res.status(500).send({ success: false, message: 'Unauthorized.' });
  if (token) {
    Post.findById(mongoose.Types.ObjectId(req.body.post), function (err, post) {
      console.log("Post: " + post);
      if (err || !post) return next(err || { success: false, message: 'No Post Found.' });
      var newPost = new Comment({
        author: mongoose.Types.ObjectId(req.user.userProfile._id),
        message: req.body.comment
      });
      newPost.save(function (err) {
        if (err) return next(err);
        
        post.children.push(newPost._id);
        post.save(function (err) {
          if (err) return next(err);
        })
      })
      res.json({ success: true, message: post });
    })
  } else {
    return res.status(403).send({ success: false, message: 'Unauthorized.' });
  }
});

/* UPDATE POST */
router.put('/:id', (req, res, next) => {
  const token = getToken(req.headers);
  if (token) {
    Post.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
      if (err) return next(err);
      res.json({ success: true, message: post });
    });
  } else {
    return res.status(403).send({ success: false, message: 'Unauthorized.' });
  }
});

/* DELETE POST */
router.delete('/:id', (req, res, next) => {
  const token = getToken(req.headers);
  if (token) {
    Post.findByIdAndRemove(req.params.id, req.body, (err, post) => {
      if (err) return next(err);
      res.json({ success: true, message: post });
    });
  } else {
    return res.status(403).send({ success: false, message: 'Unauthorized.' });
  }
});

function getToken(headers) {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    }
    return null;
  }
  return null;
}

module.exports = router;
