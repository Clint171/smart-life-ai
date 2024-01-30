let signupSubmit = document.querySelector("#submit");

signupSubmit.addEventListener("click" , ()=>{
    let username = document.querySelector("#user").value;
    let pass = document.querySelector("#pass").value;
    let conf = document.querySelector("#rpass").value;
    let email = document.querySelector("#email").value;

    if(pass != conf){
        alert("Password and confirmation do not match!");
        return;
    } 
    let fetchOptions = {
        "method" : "post",
        "headers": {
            "Content-type" : "application/json"
        },
        "body" : JSON.stringify({
            "username" : username,
            "password" : pass,
            "email" : email
        })
    }
    fetch("https://smart-life-ai-endpoint.onrender.com/register", fetchOptions, false).then(async (response)=>{
        if(response.status != 201){
            const message = await response.text();
            alert(message);
        }
        else{
            alert("Account created successfully!");
            const token = await response.json();
            localStorage.setItem("token" , JSON.stringify(token));
            window.location.href = "chat.html";
        }
    });
});