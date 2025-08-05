require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/speechace', async (req, res) => {
  const { text, audio_url } = req.body;

  if (!text || !audio_url) {
    return res.status(400).json({
      status: 'error',
      short_message: 'error_missing_parameters',
      detail_message: 'Missing "text" or "audio_url"',
    });
  }

  try {
    const response = await axios.get(process.env.SPEECHACE_API_URL, {
      params: {
        key: process.env.SPEECHACE_API_KEY,
        dialect: 'en-us',
        user_audio_url: audio_url,
        text,
        user_id: 'test_user_1',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('SpeechAce API error:', error.response?.data || error.message);
    res.status(500).json({
      status: 'error',
      short_message: 'speechace_api_error',
      detail_message: error.response?.data || error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
