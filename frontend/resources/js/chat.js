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

function processMessage(){
    let message = document.getElementById("message").value;
    createUserMessageP(message);
    //sendMessage(message);
    document.getElementById("message").value = "";
    setTimeout(()=>{
    createAIMessageP("As an AI, I can't understand you.");
    }, 1000);
}