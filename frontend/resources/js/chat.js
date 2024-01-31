function checkSignIn() {
    let token = localStorage.getItem("token");
    if (token == null || token == undefined || !token) {
        window.location.href = "Signup.html";
    }
    else{
        alert(token);
    }
}

checkSignIn();