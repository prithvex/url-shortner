import express from "express";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import connectDB from "./src/config/mongo.config.js";
import URL from "./src/models/short-url-model-schema.js";

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Create Short URL
app.post("/api/create", async (req, res) => {
  try {
    console.log("Headers:", req.headers["content-type"]);
    console.log("Body:", req.body);

    // Check if body exists
    if (!req.body) {
      return res.status(400).json({
        error: "Request body is missing.",
      });
    }

    const { url } = req.body;

    // Check if url exists
    if (!url) {
      return res.status(400).json({
        error: "URL is required.",
      });
    }

    const shortUrl = nanoid(7);

    const newUrl = new URL({
      full_url: url,
      short_url: shortUrl,
    });

    const savedUrl = await newUrl.save();

    console.log("Saved:", savedUrl);

    res.status(201).json({
      message: "Short URL created successfully",
      data: savedUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// Redirect Route
app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const url = await URL.findOne({ short_url: id });

    if (!url) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }

    res.redirect(url.full_url);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});