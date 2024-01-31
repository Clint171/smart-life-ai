const { set } = require("mongoose");

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

function sendMessage(message){
    let token = localStorage.getItem("token");
    let url = "https://localhost:300/chat";
    let fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({"message" : message})
    };
    fetch(url, fetchOptions)
    .then(async (res)=>{
        return await res.json();
    })
}

function createUserMessageP(message){
    let chatDiv = document.getElementById("chatDiv");
    let p = document.createElement("p");
    p.classList.add("User-cont");
    p.innerText = message;
    chatDiv.appendChild(p);
}

function createAIMessageP(message){
    let chatDiv = document.getElementById("chatDiv");
    let p = document.createElement("p");
    p.classList.add("AI-cont");
    p.innerText = message;
    chatDiv.appendChild(p);
}

function processMessage(){
    let message = document.getElementById("message").value;
    createUserMessageP(message);
    //sendMessage(message);
    document.getElementById("message").value = "";
    setTimeout(()=>{
    createAIMessageP("As an AI, I can't understand you.");
    }, 1000);
}