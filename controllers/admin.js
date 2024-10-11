const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");

const register = async (req, res) => {
  const admin = await User.create({ ...req.body, userType: "Admin" });
  const token = admin.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: admin.name,
      email: admin.email,
      token,
    },
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const admin = await User.findOne({ email });
  if (!admin) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await admin.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = admin.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      email: admin.email,
      name: admin.name,
      token,
    },
  });
};

module.exports = { register, login };
