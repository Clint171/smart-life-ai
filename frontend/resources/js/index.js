function checkSignIn() {
    let token = localStorage.getItem("token");
    if (token) {
        window.location.href = "chat.html";
    }
}

checkSignIn();