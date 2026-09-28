const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// GET / - Home page
router.get("/", (req, res) => {
  const isLoggedIn = !!req.cookies.userId;
  res.render("dashboard", { isLoggedIn, user: null });
});

// GET /register - Register page
router.get("/register", (req, res) => {
  if (req.cookies.userId) {
    return res.redirect("/blogs");
  }
  res.render("register", { error: null, formData: {} });
});

// POST /register - Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      return res.render("register", {
        error: "All fields are required.",
        formData: { name, email },
      });
    }

    if (password !== confirmPassword) {
      return res.render("register", {
        error: "Passwords do not match.",
        formData: { name, email },
      });
    }

    if (password.length < 6) {
      return res.render("register", {
        error: "Password must be at least 6 characters.",
        formData: { name, email },
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.render("register", {
        error: "Email already registered. Please login.",
        formData: { name, email },
      });
    }

    // Create user (password will be hashed by pre-save hook)
    const user = new User({ name, email, password });
    await user.save();

    // Redirect to login after successful registration
    res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);
    res.render("register", {
      error: "Registration failed. Please try again.",
      formData: { name: req.body.name, email: req.body.email },
    });
  }
});

// GET /login - Login page
router.get("/login", (req, res) => {
  if (req.cookies.userId) {
    return res.redirect("/blogs");
  }
  res.render("login", { error: null });
});

// POST /login - Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("login", { error: "Email and password are required." });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.render("login", { error: "Invalid email or password." });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render("login", { error: "Invalid email or password." });
    }

    // Create authentication cookie
    res.cookie("userId", user._id.toString(), {
      httpOnly: true,
    });

    // Redirect to blogs
    res.redirect("/blogs");
  } catch (error) {
    console.error("Login error:", error);
    res.render("login", { error: "Login failed. Please try again." });
  }
});

// GET /logout - Logout
router.get("/logout", authMiddleware, (req, res) => {
  res.clearCookie("userId");
  res.redirect("/login");
});

module.exports = router;
