function validateUsername(username) {
    if ((username.length < 5) || (username.length > 30) || (username.includes(" "))) {
        return "Your username must have 5 to 30 characters which does not contain spaces"
    }
    return "";
}

const isPasswordSecure = (password) => {
    const passw = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if (!password.match(passw) || password.includes(" ")) {
        return "The password must contain at least 1 lowercase letter, 1 uppercase letter, 1 symbol(!@#$%^&*) and 1 number, no spaces, must be at least 8 characters."
    }
    return "";
}


const signup = () => {
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;
    const usernameMessageDiv = document.getElementById("usernameMessage");
    const passwordMessageDiv = document.getElementById("passwordMessage");
    const usernameErrorMessage = validateUsername(username);
    const passwordErrorMessage = isPasswordSecure(password);
    usernameMessageDiv.innerText = usernameErrorMessage;
    passwordMessageDiv.innerText = passwordErrorMessage;
    if (usernameErrorMessage === "" || passwordErrorMessage === "") {
        // validation succeeded
        console.log('username is:', username);
    }
}