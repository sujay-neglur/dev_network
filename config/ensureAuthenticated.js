module.exports = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(400).json({ msg: "User not logged in" });
};
