let loginSubmit = document.querySelector("#lsubmit");

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
            const token = await res.json();
            localStorage.setItem("token" , JSON.stringify(token));
            window.location.href = "chat.html";
        } else {
        alert("Invalid Credentials");
        }
    });
});