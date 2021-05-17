module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/users/login');
  },
  isNotLoggedIn: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/rooms');
  }
}