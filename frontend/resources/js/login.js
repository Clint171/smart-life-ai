let loginSubmit = document.querySelector("#lsubmit");
let serverUrl = "http://localhost:3000";

function checkSignIn() {
    let token = localStorage.getItem("token");
    if (token) {
        window.location.href = "chat.html";
    }
}

checkSignIn();

loginSubmit.addEventListener("click", ()=>{
    let username = document.querySelector("#luser").value;
    let password = document.querySelector("#lpass").value;
    
    let data = {
        username: username,
        password: password,
    };
    
    fetch(serverUrl + "/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }).then(async (res) => {
        if (res.status === 200) {
            window.location.href = "chat.html";
        } 
        else {
            alert("Invalid Credentials");
        }
    });
});