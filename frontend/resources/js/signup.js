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
        method : "post",
        headers: {
            "Content-type" : "application/json"
        },
        body : {
            "username" : username,
            "password" : pass,
            "email" : email
        }
    }
    fetch("https://smart-life-ai-endpoint.onrender.com", fetchOptions, false).then((response)=>{
        alert("Form submitted.");
    });
});