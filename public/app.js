const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resultsDiv = document.getElementById('results');
const sentenceSelector = document.getElementById('sentenceSelector');
const textDiv = document.getElementById('text');

sentenceSelector.addEventListener('change', () => {
  textDiv.textContent = sentenceSelector.value;
});

let mediaRecorder, audioChunks = [];

startBtn.onclick = async () => {
  audioChunks = [];
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();

  mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
};

stopBtn.onclick = async () => {
  mediaRecorder.stop();
  mediaRecorder.onstop = async () => {
    const blob = new Blob(audioChunks, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(blob);

    // Upload to a temporary host or your own backend
    const formData = new FormData();
    formData.append('file', blob);

    // Simulate upload to get a fake audio URL (should be replaced with real upload logic)
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Audio = reader.result;
      const res = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: sentenceSelector.value,
          audioUrl: 'https://example.com/fakeaudio.wav' // Replace with real uploaded audio URL
        })
      });

      const result = await res.json();
      resultsDiv.innerText = JSON.stringify(result, null, 2);
    };
    reader.readAsDataURL(blob);
  };
};