const startRecognitionButton = document.getElementById('start-recognition');
const stopRecognitionButton = document.getElementById('stop-recognition');
const recognitionResultElement = document.getElementById('recognition-result');
const speakTextButton = document.getElementById('speak-text');
const textToSpeakInput = document.getElementById('text-to-speak');

let recognition;

startRecognitionButton.addEventListener('click', startRecognition);
stopRecognitionButton.addEventListener('click', stopRecognition);
speakTextButton.addEventListener('click', speakText);

function startRecognition() {
  if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Adjust language as needed

    recognition.addEventListener('start', recognitionStarted);
    recognition.addEventListener('result', recognitionResult);
    recognition.addEventListener('end', recognitionEnded);
    recognition.addEventListener('error', recognitionError);

    recognition.start();
    recognitionResultElement.textContent = 'Listening...';
  } else {
    recognitionResultElement.textContent = 'Speech recognition not supported in this browser.';
  }
}

function stopRecognition() {
  if (recognition) {
    recognition.stop();
    recognitionResultElement.textContent = '';
  }
}

function recognitionStarted() {
  recognitionResultElement.textContent = 'Speak now...';
}

function recognitionResult(event) {
  const transcript = event.results[event.resultIndex][0].transcript;
  recognitionResultElement.textContent = transcript;
  // Use the recognized text here for further actions
}

function recognitionEnded() {
  recognitionResultElement.textContent = '';
}

function recognitionError(event) {
  console.error('Speech recognition error:', event.error);
  recognitionResultElement.textContent = 'Speech recognition error.';
}

function speakText() {
  const textToSpeak = textToSpeakInput.value;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);

  speechSynthesis.speak(utterance);
}
