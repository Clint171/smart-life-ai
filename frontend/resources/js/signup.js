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
    fetch("http://localhost:3000/register", fetchOptions, false).then((response)=>{
        alert("Account created! Please log in.");
    });
});