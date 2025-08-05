let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById('start-recording');
const stopBtn = document.getElementById('stop-recording');
const resultContainer = document.getElementById('result');

startBtn.onclick = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) {
                audioChunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('audio', audioBlob);

            fetch('/analyze', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                resultContainer.textContent = data.result || "No result returned.";
            })
            .catch(err => {
                console.error("Audio analysis error:", err);
                resultContainer.textContent = "Error sending recording";
            });
        };

        mediaRecorder.start();
        console.log("Recording started");
    } catch (err) {
        console.error("Cannot access microphone:", err);
        alert("You need to allow microphone access to use this feature.");
    }
};

stopBtn.onclick = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        console.log("Recording stopped");
    }
};