const express = require("express");
const { register, login, logout } = require("../controllers/admin");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);

module.exports = router;
