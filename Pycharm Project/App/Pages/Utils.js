/* ---------------Active nav --------------*/

const activeNavBar = () => {
    const activePage = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a').forEach(link => {
        if (link.href.includes(`${activePage}`)) {
            link.classList.add('active');
        }
    });
}

/* ---------------Allow user to add image and save it --------------*/

const image_input = document.querySelector("#img");
image_input?.addEventListener("change", function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        const uploaded_image = reader.result; //Will save the image later in backend
    });
});

/* ---------------Validations --------------*/

const validateUsername = (username) => {
    const letters = /^[0-9a-zA-Z\_\.]+$/;
    if (!username.match(letters)) {
        return "Please enter a valid name"
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
        return "Please insert a valid Email"
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


const validateDessertName = (dessertName) => {
    const letters = /^[0-9a-zA-Z\s]+$/;
    if ((!dessertName.match(letters)) || (dessertName.trim().length === 0)) {
        return "Please enter a valid name"
    }
    return ""
}

const validateDescription = (description) => {
    if (description.length > 500) {
        return "description must be under 500 letters"
    }
    return "";
}

const validateInputForRecipe = (fieldName, userInput) => {
    let result = '';
    switch (fieldName) {
        case "dessertName": {
            result = validateDessertName(userInput);
            break;
        }
        case "description": {
            result = validateDescription(userInput);
            break;
        }
    }
    return result;
}

const validateInputForSignUp = (fieldName, userInput) => {
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


const validateLogin = (fieldName, userInput) => {
    let result = '';
    switch (fieldName) {
        case "username": {
            if (userInput === '') {
                result = "please enter username"
            }
            break;
        }
        case "password": {
            if (userInput === '') {
                result = "please enter password"
            }
            break;
        }
    }
    return result;
}

const returnErrorMessage = (fieldName, form) => {
    const userInput = document.getElementById(fieldName).value;
    const fieldNameMessage = fieldName + "Message";
    const messageDiv = document.getElementById(fieldNameMessage);
    let errorMessage;
    if (form === 'signup') {
        errorMessage = validateInputForSignUp(fieldName, userInput);
    } else if (form === 'login') {
        errorMessage = validateLogin(fieldName, userInput);
    } else {
        errorMessage = validateInputForRecipe(fieldName, userInput);
    }
    messageDiv.innerText = errorMessage;
    return errorMessage;
}


const login = () => {
    let flag = true
    const fieldNames = ['username', 'password']
    fieldNames.forEach(fieldName => {
        const errorMessage = returnErrorMessage(fieldName, 'login');
        if (errorMessage !== '') {
            flag = false;
        }
    })
    if (flag === true) {
        window.location = "../ActionPage/ActionPage.html";
    }
}


const signup = () => {
    let flag = true
    const fieldNames = ['username', 'firstName', 'lastName', 'Email', 'password', 'dateOfBirth']
    fieldNames.forEach(fieldName => {
        const errorMessage = returnErrorMessage(fieldName, 'signup');
        if (errorMessage !== '') {
            flag = false;
        }
    })
    if (flag === true) {
        window.location = "../ActionPage/ActionPage.html";
    }
}

const addARecipe = () => {
    let flag = true;
    const fieldNames = ['dessertName', 'description'];
    fieldNames.forEach(fieldName => {
        const errorMessage = returnErrorMessage(fieldName, 'add-a-recipe');
        if (errorMessage !== '') {
            flag = false;
        }
    });
    if (flag === true) {
        alert('Recipe added successfully! (not really, will be implemented in part 3...)');
    }
}

