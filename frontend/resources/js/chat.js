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
    document.getElementById("message").value = "";
    let token = localStorage.getItem("token");
    let url = "https://smart-life-ai-endpoint.onrender.com/chat";
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
        if (res.status == 401){
            createAIMessageP("You are not logged in.");
        }
        else if (res.status == 500){
            createAIMessageP("An error occurred.");
        }
        else if (res.status == 200){
            let data = await res.json();
            createAIMessageP(data.content);
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