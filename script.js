const formData = new FormData();
formData.append('audio', audioBlob); // File .webm từ MediaRecorder
formData.append('referenceText', referenceTextFromTextarea); // Câu người học cần đọc

fetch('/upload', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    const score = data.data.score_overall || data.data.pronunciation_score;
    console.log('Score:', score);
    // Hiển thị kết quả ra giao diện
  } else {
    alert('Failed to evaluate pronunciation.');
  }
});
