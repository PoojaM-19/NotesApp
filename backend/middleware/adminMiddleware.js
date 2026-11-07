
const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    // Find the currently logged-in user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please login again.",
      });
    }

    // Check current role from database
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin permission required.",
      });
    }

    next();

  } catch (error) {
    console.error("Admin authorization error:", error.message);

    res.status(500).json({
      message: "Server error during authorization",
    });
  }
};

module.exports = adminMiddleware;
