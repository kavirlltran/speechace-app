const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/analyze', upload.none(), async (req, res) => {
  const { transcript, audioUrl } = req.body;

  try {
    const response = await fetch('https://api.speechace.co/api/scoring/text/v9/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `apikey=${process.env.SPEECHACE_API_KEY}`
      },
      body: JSON.stringify({
        dialect: "en-us",
        user_audio_url: audioUrl,
        text: transcript,
        include_fluency: true,
        include_stress: true,
        include_intonation: true,
        include_word: true,
        include_errors: true
      })
    });

    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to analyze pronunciation." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});