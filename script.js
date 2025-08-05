const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resultDiv = document.getElementById("result");
const textInput = document.getElementById("text-input");

let mediaRecorder;
let chunks = [];

startBtn.addEventListener("click", async () => {
  const sentence = textInput.value.trim();
  if (!sentence) {
    alert("Please enter a sentence to compare.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    chunks = [];

    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });

      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      formData.append("text", sentence);

      try {
        const res = await fetch("/api/speechace", {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        resultDiv.textContent = JSON.stringify(data, null, 2);

      } catch (err) {
        console.error(err);
        resultDiv.textContent = "Error: Unable to send audio.";
      }

      startBtn.classList.remove("recording");
      stopBtn.disabled = true;
      stopBtn.classList.remove("active");
    };

    mediaRecorder.start();
    startBtn.classList.add("recording");
    stopBtn.disabled = false;
    stopBtn.classList.add("active");

  } catch (err) {
    alert("Microphone access denied.");
    console.error(err);
  }
});

stopBtn.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
});
