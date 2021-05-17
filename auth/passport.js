const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const UserModel = require('../models/User');

module.exports = function(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    UserModel.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;

          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      })
      .catch(err => console.error(err));
    }));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, user) => {
      done(err, user);
    });
  })

}