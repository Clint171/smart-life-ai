let loginSubmit = document.querySelector("#lsubmit");

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
    
    fetch("https://smart-life-ai-endpoint.onrender.com/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }).then(async (res) => {
        if (res.status === 200) {
            const data = await res.json();
            localStorage.setItem("token" , JSON.stringify(data.token));
            window.location.href = "chat.html";
        } else {
        alert("Invalid Credentials");
        }
    });
});