/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *           example: john_doe
 *         password:
 *           type: string
 *           description: The password of the user
 *           format: password
 *           example: password123
 *         email:
 *           type: string
 *           description: The email address of the user
 *           format: email
 *           example: john.doe@example.com
 *         blogs:
 *           type: array
 *           description: Array of blog IDs associated with the user
 *           items:
 *             type: string
 *           example: ["5f8d44d3a99c03b78dabe92a", "5f8d44d3a99c03b78dabe92b"]
 *         likedBlogs:
 *           type: array
 *           description: Array of liked blog IDs associated with the user
 *           items:
 *             type: string
 *           example: ["5f8d44d3a99c03b78dabe92c", "5f8d44d3a99c03b78dabe92d"]
 *         profilePicture:
 *           type: string
 *           description: URL or base64-encoded image of the user's profile picture
 *           example: "https://example.com/profile.jpg"
 */

const express = require("express");
const router = express();
const User = require("../../models/user");
const { generateToken, verifyToken } = require("../utils/AuthToken");
const bcrypt = require("bcryptjs");
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '201':
 *         description: User not found or invalid password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
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
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Successful signup
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '201':
 *         description: Username or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const dupli = await User.findOne({ $or: [{ username }, { email }] });
  if (dupli) {
    if (dupli.username === username) {
      res.status(201).json({ message: "Username already exists" });
      return;
    }
    if (dupli.email === email) {
      res.status(201).json({ message: "Email already exists" });
      return;
    }
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, password: hashedPassword, email });
  await newUser.save();
  const token = generateToken(newUser);
  res.status(200).json({ token, message: "You are now signed up!" });
});
/**
 * @swagger
 * /user/profilePicture:
 *   get:
 *     summary: Get the profile picture of the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '201':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/profilePicture", verifyToken, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(201).json({ message: "User not found" });
    return;
  }
  res.status(200).json({ image: user.profilePicture });
});

module.exports = router;
