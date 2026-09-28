require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const Blog = require("./models/Blog");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/", authRoutes);
app.use("/", blogRoutes);

// Seed sample blogs if collection is empty
async function seedBlogs() {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany([
        {
          title: "Introduction to Node.js",
          description:
            "Node.js is a JavaScript runtime environment used for backend development.",
          author: "Admin",
        },
        {
          title: "Introduction to MongoDB",
          description:
            "MongoDB is a NoSQL database used to store application data.",
          author: "Admin",
        },
        {
          title: "Understanding Express.js",
          description:
            "Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
          author: "Admin",
        },
        {
          title: "Cookie Authentication Explained",
          description:
            "Cookies are small pieces of data stored in the browser. Using httpOnly cookies for authentication helps protect against XSS attacks.",
          author: "Admin",
        },
      ]);
      console.log("Sample blogs seeded successfully.");
    }
  } catch (err) {
    console.error("Error seeding blogs:", err);
  }
}

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await seedBlogs();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
