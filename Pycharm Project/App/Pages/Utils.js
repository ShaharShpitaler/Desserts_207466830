/* ---------------Active nav --------------*/

const activeNavBar = () => {
    const activePage = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a').forEach(link => {
        if (link.href.includes(`${activePage}`)) {
            link.classList.add('active');
        }
    });
}

/* ---------------Allow user to add image --------------*/

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

const returnErrorMessage = (fieldName, form) => {
    const userInput = document.getElementById(fieldName).value;
    const fieldNameMessage = fieldName + "Message";
    const messageDiv = document.getElementById(fieldNameMessage);
    let errorMessage;
    if (form === 'signup') {
        errorMessage = validateInputForSignUp(fieldName, userInput);
    } else {
        errorMessage = validateInputForRecipe(fieldName, userInput);
    }
    messageDiv.innerText = errorMessage;
    return errorMessage;
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
    switch (fieldName) {
        case "dessertName": {
            const result = validateDessertName(userInput);
            if (result != "") {
                flag = false;
            }
            return result;
        }
        case "description": {
            const result = validateDescription(userInput);
            if (result != "") {
                flag = false;
            }
            return result;
        }
    }
}


const addARecipe = () => {
    fieldNames = ['dessertName', 'description'] //TODO : Add ingredients and dessert type
    fieldNames.forEach(fieldName => returnErrorMessage(fieldName, 'add-a-recipe'))
    if (flag === true) {
        window.location = "../SignUpPage/SignUpPage.html"
    }
}

