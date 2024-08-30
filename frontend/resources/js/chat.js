let serverUrl = "http://localhost:3000";

function checkSignIn(){
    fetch(serverUrl + "/checkSignIn").then((res)=>{
        if (res.status == 200){
            return true;
        }
        else{
            return null;
        }
    }).catch((err)=>{
        console.log(err);
    });
}

// checkSignIn();

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

//Styling related functions

function transformUp(){
    let el = document.getElementById("message");
    el.style.height = "20em";
    el.style.transition = "all 0.5s ease-in-out";    
}

function transformDown(){
    let el = document.getElementById("message");
    el.style.height = "3em";
    el.style.transition = "all 0.5s ease-in-out";
}