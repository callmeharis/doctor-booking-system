const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // const user = User.findById(payload.id).select('-password')
    // res.user = user // next line is alternate version of these two lines
    // attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name };

    // fetch user and verify their role
    const user = await User.findById(req.user.userId);
    if (!user || user.userType !== "Admin") {
      console.log("user", user.userType);
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Access denied. Admins only",
      });
    }
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
