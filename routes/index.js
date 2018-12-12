const express = require('express');
const passport = require('passport');

const api = express.Router();

const announcementRouter = require('./api.js/announcement.js');
const postRouter = require('./api.js/post.js');
const auth = require('./auth.js');
const userRouter = require('./api.js/user.js');

api.use('/announcement', passport.authenticate('jwt', { session: false }), announcementRouter);
api.use('/post', passport.authenticate('jwt', { session: false }), postRouter);
api.use('/user', passport.authenticate('jwt', { session: false }), userRouter);

api.use('/auth', auth);

module.exports = api;
