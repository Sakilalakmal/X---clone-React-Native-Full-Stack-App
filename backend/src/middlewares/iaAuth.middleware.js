const isAuth = async (req, res, next) => {
  if (!req.auth().isAuthenticated) {
    return res
      .status(401)
      .json({ message: "Unauthorized - You must be logged in to App" });
  }
  next();
};

module.exports = { isAuth };
