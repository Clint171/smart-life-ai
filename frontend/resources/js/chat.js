const synth = window.speechSynthesis;

synth.getVoices();

function checkSignIn() {
    let token = localStorage.getItem("token");
    if (token == null || token == undefined || !token) {
        window.location.href = "Signup.html";
    }
}

checkSignIn();

function logout(){
    localStorage.removeItem("token");
    window.location.href = "Signup.html";
}

function sendMessage(){
    let message = document.getElementById("message").value;
    createUserMessageP(message);
    let loadingDiv = document.createElement("div");
    loadingDiv.classList.add("AI-cont");
    let loading = document.createElement("iconify-icon");
    loading.setAttribute("icon" , "svg-spinners:3-dots-move");
    loading.setAttribute("width" , "70");
    loading.setAttribute("height" , "auto");
    loading.style.color = "white";
    loadingDiv.appendChild(loading);
    document.getElementById("chatDiv").appendChild(loadingDiv);
    document.getElementById("message").value = "";
    let token = localStorage.getItem("token");
    let url = "http://localhost:3000/chat";
    let fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: JSON.stringify({"message" : message})
    };
    fetch(url, fetchOptions)
    .then(async (res)=>{
        document.getElementById("chatDiv").removeChild(loadingDiv);
        if (res.status == 401){
            createAIMessageP("You are not logged in.");
        }
        else if(res.status == 403){
            createAIMessageP("You are not authorized.");
        }
        else if (res.status == 500){
            createAIMessageP("An error occurred.");
        }
        else if (res.status == 200){
            let data = await res.json();
            createAIMessageP(data.content);
            speak(data.content);

        }
    })
}

function createUserMessageP(message){
    let chatDiv = document.getElementById("chatDiv");
    let div = document.createElement("div");
    div.classList.add("User-cont");
    message = marked.parse(message);
    div.innerHTML = message;
    chatDiv.appendChild(div);
}

function createAIMessageP(message){
    let chatDiv = document.getElementById("chatDiv");
    let div = document.createElement("div");
    div.classList.add("AI-cont");
    message = marked.parse(message);
    div.innerHTML = message;
    chatDiv.appendChild(div);
}

function speak(message){
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-GB';
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
}

function toggleSpeech(){
    let speechButton = document.getElementById("toggleSpeech");
    if (speechButton.style.color == "white"){
        startRecognition();
        speechButton.style.color = "blue";
    }
    else{
        stopRecognition();
        speechButton.style.color = "white";
    }
}

function startRecognition(){
    let recognitionResultElement = document.getElementById('message');
    if ('SpeechRecognition' in window) {
        navigator.mediaDevices.getUserMedia({ audio: true });
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
    }
    else if ("webkitSpeechRecognition" in window) {
        navigator.mediaDevices.getUserMedia({ audio: true });
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US'; // Adjust language as needed

        recognition.onstart = recognitionStarted;
        recognition.onresult = recognitionResult;
        recognition.onend = recognitionEnded;
        recognition.onerror = recognitionError;

        recognition.start();
    }
    else {
        alert('Speech recognition not supported in this browser.');
    }
}
function stopRecognition() {
    if (recognition) {
        recognition.stop();
    }
}

function recognitionStarted() {
    recognitionResultElement.textContent = 'Speak now...';
}

function recognitionResult(event) {
    const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
    document.getElementById('message').value = transcript;
}

function recognitionEnded() {
    sendMessage();
}

function recognitionError(event) {
    alert('Speech recognition error detected: ' + event.error);
}