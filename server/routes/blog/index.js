const express = require("express");
const router = express.Router();

const { verifyToken } = require("../utils/AuthToken");
const User = require("../../models/User");
const Blog = require("../../models/Blog");

const { uploadBlogPics } = require("../utils/multer");

// Get all blogs
router.get("/get-blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("owner");
    res.json(blogs);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get a specific blog
router.get("/get-blog/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("owner");
    const owner = await User.findById(blog.owner._id);
    const user = await User.findById(req.userId);
    const isLiked = user.likedBlogs.includes(blog._id);
    const isOwner = owner._id.toString() === user._id.toString();
    const blogData = {
      ...blog._doc,
      isLiked: isLiked,
      isOwner: isOwner,
    };
    res.status(200).json(blogData);
  } catch (err) {
    console.log(err)
    res.status(202).json({ message: err });
  }
});

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
    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      image: `http://localhost:5000/BlogPics/${req.file?.filename}`,
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

// Update a blog
router.put(
  "/update-blog/:id",
  verifyToken,
  uploadBlogPics.single("image"),
  async (req, res) => {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            image: `http://localhost:5000/BlogPics/${req.file?.filename}`,
          },
        }
      );
      res.json(updatedBlog);
    } catch (err) {
      console.log(err);
      res.json({ message: err });
    }
  }
);

// Delete a blog
router.delete("/delete-blog/:id", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $pull: { blogs: req.params.id },
    });
    const removedBlog = await Blog.deleteOne({ _id: req.params.id });
    res.json(removedBlog);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;

// like the blog
router.put("/like-blog/:id", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog.likedBy.includes(req.userId)) {
      await blog.updateOne({ $push: { likedBy: req.userId }, $inc: { likes: 1 } });
      await User.findByIdAndUpdate(req.userId, { $push: { likedBlogs: blog._id } });
      res.json({ message: "The blog has been liked" });
    } else {
      await blog.updateOne({ $pull: { likedBy: req.userId }, $inc: { likes: -1 } });
      await User.findByIdAndUpdate(req.userId, { $pull: { likedBlogs: blog._id } });
      res.json({ message: "The blog has been disliked" });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});
