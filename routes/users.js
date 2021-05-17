const router = require('express').Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../auth/helpers');
const UserModel = require('../models/User');

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login');
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];
  if ( !email || !password ) {
    errors.push({ message: 'Please fill in all fields' });
  }
  if (errors.length > 0) {
    res.render('login', { errors, email });
  } else {
    passport.authenticate('local', {
      successRedirect: '/rooms',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  }

});

router.get('/register', isNotLoggedIn, (req, res) => {
  res.render('register');
});

router.post('/register', isNotLoggedIn, (req, res) => {
  const { name, email, password, password2 } = req.body;

  const errors = [];
  if ( !name || !email || !password || !password2) {
    errors.push({ message: 'Please fill in all fields' });
  }

  if ( password !== password2) {
    errors.push({ message: 'The passwords do not match' });
  }

  if (password.length < 4) {
    errors.push({ message: 'The password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {name, email, errors});
  } else {
    UserModel.findOne({ email })
      .then(user => {
          if (user) {
            res.render('register', { errors: [{ message: 'Email is already registered' }], name, email });
          } else {
            const newUser = new UserModel({
              name,
              email,
              password
            });

            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
  
                newUser.password = hash;

                newUser.save()
                  .then(user => {
                    req.flash('success_msg', 'You are now registered and can log in!');
                    res.redirect('/users/login');
                  })
                  .catch(err => console.error(err));
              })
            });
          }
      });
  }
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

module.exports = { router };