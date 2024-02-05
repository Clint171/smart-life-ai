const synth = window.speechSynthesis;
let speechTimer;

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
    if (message == "" || message == " " || message == null || message == undefined) return;
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
    if(message == "no" || message == "No" || message == "NO" || message == "that's it" || message == "That's it" || message == "THAT'S IT" || message == "stop" || message == "Stop" || message == "STOP" || message == "exit" || message == "Exit" || message == "EXIT" || message == "That's all" || message == "that's all" || message == "THAT'S ALL"){
        stopRecognition();
        return;
    }
    if(message == "sign out" || message == "Sign out" || message == "Sign Out" || message == "SIGN OUT" || message == "log out" || message == "Log out" || message == "Log Out" || message == "LOG OUT" || message == "sign off" || message == "Sign off" || message == "Sign Off" || message == "SIGN OFF" || message == "log off" || message == "Log off" || message == "Log Off" || message == "LOG OFF" || message == "signout" || message == "Signout" || message == "SignOut" || message == "SIGNOUT" || message == "logout" || message == "Logout" || message == "LogOut" || message == "LOGOUT" || message == "signoff" || message == "Signoff" || message == "SignOff" || message == "SIGNOFF" || message == "logoff" || message == "Logoff" || message == "LogOff" || message == "LOGOFF"){
        logout();
        return;
    }
    let token = localStorage.getItem("token");
    let url = "https://smart-life-ai-endpoint.onrender.com/chat";
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
            createAIMessageP("You are not logged in. Try saying 'sign out' to log out and then log in again.");
        }
        else if(res.status == 403){
            createAIMessageP("You are not authorized. Try saying 'sign out' to log out and then log in again.");
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
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
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
    document.getElementById('message').value = 'Speak now. Once you are done, click the microphone icon again.';
}

function recognitionResult(event) {
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => {
        recognition.stop();
    }, 3000);
    const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
    document.getElementById('message').value = transcript;
}

function recognitionEnded() {
    sendMessage();
    document.getElementById('toggleSpeech').style.color = "white";
}

function recognitionError(event) {
    alert('Speech recognition error detected: ' + event.error);
}
