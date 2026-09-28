const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.cookies.userId;

    if (!userId) {
      return res.redirect("/login");
    }

    const user = await User.findById(userId);
    if (!user) {
      res.clearCookie("userId");
      return res.redirect("/login");
    }

    // Attach user to request for use in routes/views
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.clearCookie("userId");
    return res.redirect("/login");
  }
};

module.exports = authMiddleware;
