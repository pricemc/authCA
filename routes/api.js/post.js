const express = require('express');

const router = express.Router();
const passport = require('passport');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
require('../../config/passport')(passport);

const mongoose = require('mongoose');

/* GET ALL POSTS */
router.get('/', (req, res, next) => {
  const token = getToken(req.headers);
  if (token) {
    Post.find()
    .populate('author')
    .populate({
      path: 'children',
      populate: { path: 'author'}
  })
      .exec((err, products) => {
        if (err) return next(err);
        console.log(products);
        res.json(products);
      })

  } else {
    return res.status(403).send({ success: false, message: 'Unauthorized.' });
  }
});

/* GET SINGLE POST BY ID */
router.get('/:id', (req, res, next) => {
  const token = getToken(req.headers);
  if (token) {
    Post.findById(req.params.id, (err, post) => {
      if (err) return next(err);
      res.json({ success: true, message: post });
    });
  } else {
    return res.status(403).send({ success: false, message: 'Unauthorized.' });
  }
});

/* SAVE POST */
router.post('/', (req, res, next) => {
  const token = getToken(req.headers);
  console.log(token);
  if (token) {
    req.body.author = mongoose.Types.ObjectId(req.user.userProfile._id);
    Post.create(req.body, (err, post) => {
      console.log(err);
      if (err) return next(err);
      res.json({ success: true, message: post });
    });
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
