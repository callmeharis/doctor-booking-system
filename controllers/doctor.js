const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const createDoctor = async (req, res) => {
  const doctor = await User.create({ ...req.body, userType: "Doctor" });
  const token = doctor.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      name: doctor.name,
      email: doctor.email,
      userType: doctor.userType,
      token,
    },
  });
};
module.exports = { createDoctor };
