const validateUsername = (username) => {
    const letters = /^[0-9a-zA-Z\_\.]+$/;
    if (!username.match(letters)) {
        return "Please enter a validate name"
    }
    return ""
}


const validatePassword = (password) => {
    const passw = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if (!password.match(passw) || password.includes(" ")) {
        return "The password must contain at least 1 lowercase letter, 1 uppercase letter, 1 symbol(!@#$%^&*) and 1 number, no spaces, must be at least 8 characters."
    }
    return "";
}

const validateEmail = (Email) => {
    const Emai = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    if (!Email.match(Emai)) {
        return "Please insert a validate Email"
    }
    return ""
}

const validateName = (name) => {
    const letters = /^[A-Za-z]+$/;
    if (!name.match(letters)) {
        return "The name must only contain letters";
    }
    return "";
}

const validateDateOfBirth = (dateOfBirth) => {
    const birthday = Date.parse(dateOfBirth);
    todayDate = new Date()
    if ((birthday >= todayDate) || (dateOfBirth.length === 0)) {
        return "Please enter a valid date";
    }
    return "";
}


const validateInput = (fieldName, userInput) => {
    let result;
    switch (fieldName) {
        case "username": {
            result = validateUsername(userInput);
            break;
        }
        case "password": {
            result = validatePassword(userInput);
            break;
        }
        case "firstName": {
            result = validateName(userInput);
            break;
        }
        case "lastName": {
            result = validateName(userInput);
            break;
        }
        case "Email": {
            result = validateEmail(userInput);
            break;
        }
        case "dateOfBirth": {
            result = validateDateOfBirth(userInput);
            break;
        }
    }
    return result;
}

const returnErrorMessage = (fieldName) => {
    const userInput = document.getElementById(fieldName).value;
    const fieldNameMessage = fieldName + "Message";
    const messageDiv = document.getElementById(fieldNameMessage);
    const errorMessage = validateInput(fieldName, userInput);
    messageDiv.innerText = errorMessage;
    return errorMessage;
}

const signup = () => {
    let flag = true
    const fieldNames = ['username', 'firstName', 'lastName', 'Email', 'password', 'dateOfBirth']
    fieldNames.forEach(fieldName => {
        const errorMessage = returnErrorMessage(fieldName);
        if (errorMessage !== '') {
            flag = false;
        }
    })
    if (flag === true) {
        window.location = "../ActionPage/ActionPage.html";
    }
}