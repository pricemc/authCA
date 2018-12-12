const express = require('express');

const router = express.Router();
const passport = require('passport');
const Announcement = require('../../models/Announcement.js');
require('../../config/passport')(passport);

/* GET ALL ANNOUNCEMENTS */
router.get('/', (req, res) => {
  const token = getToken(req.headers);
  console.log(req.user);
  if (token) {
    Announcement.find((err, products) => {
      if (err) return next(err);
      res.json(products);
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* GET SINGLE ANNOUNCEMENT BY ID */
router.get('/:id', (req, res) => {
  const token = getToken(req.headers);
  if (token) {
    Announcement.findById(req.params.id, (err, post) => {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* SAVE ANNOUNCEMENT */
router.post('/', (req, res) => {
  const token = getToken(req.headers);
  console.log(token);
  if (token) {
    req.body.author = req.user._id;
    Announcement.create(req.body, (err, post) => {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* UPDATE ANNOUNCEMENT */
router.put('/:id', (req, res) => {
  const token = getToken(req.headers);
  if (token) {
    Announcement.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* DELETE ANNOUNCEMENT */
router.delete('/:id', (req, res) => {
  const token = getToken(req.headers);
  if (token) {
    Announcement.findByIdAndRemove(req.params.id, req.body, (err, post) => {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
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
