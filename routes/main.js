const router = require('express').Router();

const { isLoggedIn } = require('../auth/helpers');

router.get('/', (req, res) => {
  res.render('homepage');
});

router.get('/rooms', isLoggedIn, (req, res) => {
  res.render('rooms', { username: req.user.name });
});

router.get('/chat', (req, res) => {
  res.render('chats');
});

module.exports = { router };  