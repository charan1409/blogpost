const express = require("express");
const router = express();
const User = require("../../models/User");
const { generateToken, verifyToken } = require("../utils/AuthToken");
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    res.status(201).json({ message: "User not found" });
    return;
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(201).json({ message: "Invalid password" });
    return;
  }
  const token = generateToken(user);
  res.status(200).json({ token: token, message: "You are now logged in!" });
});

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const dupli = await User.findOne({ $or: [{ username }, { email }] });
  if (dupli) {
    res.status(201).json({ message: "Username or email already exists" });
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, password: hashedPassword, email });
  await newUser.save();
  const token = generateToken(newUser);
  res.status(200).json({ token, message: "You are now signed up!" });
});

router.get("/profilePicture", verifyToken, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(201).json({ message: "User not found" });
    return;
  }
  res.status(200).json({ image: user.profilePicture });
});

module.exports = router;
