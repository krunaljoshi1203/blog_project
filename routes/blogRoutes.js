const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/authMiddleware");

// GET /blogs - View blogs (protected)
router.get("/blogs", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render("blogs", {
      blogs,
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Error loading blogs");
  }
});

module.exports = router;
