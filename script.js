const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const userSpeech = document.getElementById("userSpeech");
const textToRead = document.getElementById("textToRead");
const contentSelect = document.getElementById("contentSelect");

let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    userSpeech.textContent = transcript;
  };

  recognition.onerror = function (event) {
    userSpeech.textContent = "Error: " + event.error;
  };

  recognition.onend = function () {
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };
} else {
  alert("Speech Recognition is not supported in this browser.");
}

startBtn.onclick = () => {
  recognition.start();
  userSpeech.textContent = "...Listening...";
  startBtn.disabled = true;
  stopBtn.disabled = false;
};

stopBtn.onclick = () => {
  recognition.stop();
};

contentSelect.onchange = () => {
  const selectedText = contentSelect.value;
  textToRead.textContent = selectedText;
};
