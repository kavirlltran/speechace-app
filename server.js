const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'recordings/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.webm');
  }
});
const upload = multer({ storage });

const API_KEY = '9fNIULDeiNwWp7ftCCEcgFPekwXE9QHVfDrEU2WjDCwjoLfNZnZ%2F9imL5Zf9DcO%2B1wStXK8oayr2n3zhCAM9e%2Fz8sAp6k4cYEzM7wVENySoz88NT80NIG881z%2Fr0lXLp';
const SPEECHACE_ENDPOINT = 'https://api.speechace.co/api/scoring/text/v9/json';

app.post('/upload', upload.single('audio'), async (req, res) => {
  const audioPath = req.file.path;
  const referenceText = req.body.referenceText;

  try {
    const formData = new FormData();
    formData.append('key', API_KEY);
    formData.append('dialect', 'en-us'); // hoặc en-gb, tùy bạn
    formData.append('user_audio_file', fs.createReadStream(audioPath));
    formData.append('text', referenceText);
    formData.append('user_id', 'demo_user');
    formData.append('return_audio_links', 'false');

    const response = await axios.post(SPEECHACE_ENDPOINT, formData, {
      headers: formData.getHeaders()
    });

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('SpeechAce API Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to evaluate pronunciation.' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
