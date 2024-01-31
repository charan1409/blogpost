/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the blog post
 *           example: "Introduction to Swagger Documentation"
 *         content:
 *           type: string
 *           description: The content of the blog post
 *           example: "Swagger is a powerful tool for API documentation..."
 *         image:
 *           type: string
 *           description: URL or base64-encoded image associated with the blog post
 *           example: "https://example.com/blog-image.jpg"
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the blog post
 *           example: "2024-01-17"
 *         owner:
 *           type: string
 *           description: ID of the user who owns the blog post
 *           example: "5f8d44d3a99c03b78dabe92a"
 *         likes:
 *           type: number
 *           description: The number of likes for the blog post
 *           example: 15
 *         likedBy:
 *           type: array
 *           description: Array of user IDs who liked the blog post
 *           items:
 *             type: string
 *           example: ["5f8d44d3a99c03b78dabe92b", "5f8d44d3a99c03b78dabe92c"]
 */

const express = require("express");
const router = express.Router();

const { verifyToken } = require("../utils/AuthToken");
const User = require("../../models/user");
const Blog = require("../../models/blog");

const { uploadBlogPics } = require("../utils/multer");
const storage = require("../config/firebase.config");
const { getDownloadURL, ref, uploadBytes } = require("firebase/storage");
/**
 * @swagger
 * paths:
 *   /get-blogs:
 *     get:
 *       summary: Get all blogs
 *       tags:
 *         - Blog
 *       responses:
 *         '200':
 *           description: A list of blogs
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Blog'
 *         '202':
 *           description: Error occurred
 *           content:
 *             application/json:
 *               example:
 *                 message: An error occurred
 */
// Get all blogs
router.get("/get-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("owner");
    res.json(blogs);
  } catch (err) {
    res.json({ message: err });
  }
});
/**
 * @swagger
 * paths:
 *   /get-blog/{id}:
 *     get:
 *       summary: Get a specific blog
 *       tags:
 *         - Blog
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the blog
 *           schema:
 *             type: string
 *             example: "5f8d44d3a99c03b78dabe92a"
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: The blog details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Blog'
 *         '202':
 *           description: Error occurred
 *           content:
 *             application/json:
 *               example:
 *                 message: An error occurred
 */
// Get a specific blog
router.get("/get-blog/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("owner");
    if (!blog) return res.status(202).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) {
    console.log(err);
    res.status(202).json({ message: err });
  }
});
/**
 * @swagger
 * paths:
 *   /create-blog:
 *     post:
 *       summary: Create a blog
 *       tags:
 *         - Blog
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the blog post
 *                 content:
 *                   type: string
 *                   description: The content of the blog post
 *                 image:
 *                   type: string
 *                   format: binary
 *                   description: Image file for the blog post
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Blog posted successfully
 *           content:
 *             application/json:
 *               example:
 *                 message: Blog posted successfully
 *         '202':
 *           description: Error occurred
 *           content:
 *             application/json:
 *               example:
 *                 message: An error occurred
 */
// Create a blog
router.post(
  "/create-blog",
  verifyToken,
  uploadBlogPics.single("image"),
  async (req, res) => {
    const userId = req.userId;
    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const fileBuffer = req.file.buffer;
    const fileName = `blogImages/${Date.now()}-${req.file.originalname}`;
    const storageRef = ref(storage, fileName);
    const blobStream = await uploadBytes(storageRef, fileBuffer);
    const publicUrl = await getDownloadURL(storageRef);
    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      image: publicUrl,
      owner: userId,
      date: date,
    });
    try {
      const savedBlog = await blog.save();
      await User.findByIdAndUpdate(
        userId,
        { $push: { blogs: savedBlog._id } },
        { new: true }
      );
      res.json({ message: "Blog posted successfully" });
    } catch (err) {
      console.log(err);
      res.json({ message: err });
    }
  }
);
/**
 * @swagger
 * paths:
 *   /update-blog/{id}:
 *     put:
 *       summary: Update a blog
 *       tags:
 *         - Blog
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the blog
 *           schema:
 *             type: string
 *             example: "5f8d44d3a99c03b78dabe92a"
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The updated title of the blog post
 *                 content:
 *                   type: string
 *                   description: The updated content of the blog post
 *                 image:
 *                   type: string
 *                   format: binary
 *                   description: Updated image file for the blog post
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: The updated blog
 *           content:
 *             application/json:
 *               $ref: '#/components/schemas/Blog'
 *         '202':
 *           description: Error occurred
 *           content:
 *             application/json:
 *               example:
 *                 message: An error occurred
 */
// Update a blog
router.put(
  "/update-blog/:id",
  verifyToken,
  uploadBlogPics.single("image"),
  async (req, res) => {
    try {
      await Blog.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            image: `http://localhost:5000/BlogPics/${req.file?.filename}`,
          },
        }
      );
      res.json({ message: "Blog updated successfully" });
    } catch (err) {
      console.log(err);
      res.json({ message: err });
    }
  }
);
/**
 * @swagger
 * paths:
 *   /delete-blog/{id}:
 *     delete:
 *       summary: Delete a blog
 *       tags:
 *         - Blog
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the blog
 *           schema:
 *             type: string
 *             example: "5f8d44d3a99c03b78dabe92a"
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: The deleted blog
 *           content:
 *             application/json:
 *               $ref: '#/components/schemas/Blog'
 *         '202':
 *           description: Error occurred
 *           content:
 *             application/json:
 *               example:
 *                 message: An error occurred
 */
// Delete a blog
router.delete("/delete-blog/:id", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $pull: { blogs: req.params.id },
    });
    await Blog.deleteOne({ _id: req.params.id });
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
/**
 * @swagger
 * paths:
 *   /like-blog/{id}:
 *     put:
 *       summary: Like/Dislike a blog
 *       tags:
 *         - Blog
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: ID of the blog
 *           schema:
 *             type: string
 *             example: "5f8d44d3a99c03b78dabe92a"
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: The status of the like operation
 *           content:
 *             application/json:
 *               example:
 *                 message: The blog has been liked
 *         '202':
 *           description: Error occurred
 *           content:
 *             application/json:
 *               example:
 *                 message: An error occurred
 */
// like the blog
router.put("/like-blog/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog.likedBy.includes(req.userId)) {
      await blog.updateOne({
        $push: { likedBy: req.userId },
        $inc: { likes: 1 },
      });
      await User.findByIdAndUpdate(req.userId, {
        $push: { likedBlogs: blog._id },
      });
      res.json({ message: "The blog has been liked" });
    } else {
      await blog.updateOne({
        $pull: { likedBy: req.userId },
        $inc: { likes: -1 },
      });
      await User.findByIdAndUpdate(req.userId, {
        $pull: { likedBlogs: blog._id },
      });
      res.json({ message: "The blog has been disliked" });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});
