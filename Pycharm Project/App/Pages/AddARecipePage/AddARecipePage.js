const validateDessertName = (dessertName) => {
    const letters = /^[0-9a-zA-Z\s]+$/;
    if ((!dessertName.match(letters)) || (dessertName.trim().length === 0)) {
        return "Please enter a validate name"
    }
    return ""
}

const validateDescription = (description) => {
    if (description.length > 500) {
        return "description must be under 500 letters"
    }
    return "";
}


const validateInput = (fieldName, userInput) => {
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

const returnErrorMessage = (fieldName) => {
    const userInput = document.getElementById(fieldName).value;
    const fieldNameMessage = fieldName + "Message";
    const messageDiv = document.getElementById(fieldNameMessage);
    const errorMessage = validateInput(fieldName, userInput);
    messageDiv.innerText = errorMessage;
}


const addARecipe = () => {
    field_names = ['dessertName', 'description']//TODO : Add ingredients and dessert type
    field_names.forEach(returnErrorMessage)
    if (flag === true) {
        window.location = "../SignUpPage/SignUpPage.html"
    }
}

const deleteIngredient = () => {

}

const addIngredient = () => {
    const Div = document.getElementById('ingredients');
    Div.innerHTML("<input type=text name=\"ingredients\" placeholder=\"Enter Ingredients..\">");
    //Div.innerHTML("<input type=text name=\"ingredients\" placeholder=\"Enter Qunatity..\">");
}