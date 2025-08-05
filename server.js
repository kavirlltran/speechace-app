const express = require("express");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

app.post("/api/speechace", upload.single("audio"), async (req, res) => {
  const apiKey = process.env.SPEECHACE_API_KEY;
  const audioFilePath = req.file.path;
  const sentence = req.body.text;

  if (!apiKey || !sentence) {
    return res.status(400).json({
      status: "error",
      short_message: "error_missing_parameters",
      detail_message: "Missing API key or text"
    });
  }

  const apiUrl = "https://api.speechace.co/api/scoring/text/v9/json";

  const formData = new FormData();
  formData.append("key", apiKey);
  formData.append("dialect", "en-us");
  formData.append("user_id", "testuser@example.com");
  formData.append("text", sentence);
  formData.append("audio_file", fs.createReadStream(audioFilePath));

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Speechace API error" });
  } finally {
    fs.unlink(audioFilePath, () => {}); // cleanup
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
