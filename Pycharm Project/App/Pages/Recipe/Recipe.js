const fetchCakeField = (dessertId, data) => {
    const dessert = desserts[dessertId];
    return dessert[data];
}

const createIngredient = (name, quantity) => {
    const nameFieldDiv = document.createElement("span");
    nameFieldDiv.innerText = 'name: ';

    const nameValueDiv = document.createElement("span");
    nameValueDiv.innerText = name;

    const quantityFieldDiv = document.createElement("span");
    quantityFieldDiv.innerText = ', quantity: ';

    const quantityValueDiv = document.createElement("span");
    quantityValueDiv.innerText = quantity;

    const ingredientDiv = document.createElement('div');

    ingredientDiv.appendChild(nameFieldDiv);
    ingredientDiv.appendChild(nameValueDiv);
    ingredientDiv.appendChild(quantityFieldDiv);
    ingredientDiv.appendChild(quantityValueDiv);

    return ingredientDiv;
}

const fetchAllCakeData = () => {
    const fields = ['dessertName', 'author', 'description', 'totalTimeInMinutes', 'img', 'difficultyLevel', 'ingredients', 'howToPrepare'];
    const elements = fields.map((field) => document.getElementById(field));
    const ingredients = desserts[0].ingredients; // TODO: change desserts[0] to actual dessert id

    elements.map((el) => {
        if (el.id === 'img') {
            return el.src = fetchCakeField(0, el.id); // TODO:change 0 to actual dessert id
        }
        if (el.id === 'ingredients') {
            // return el.append(ingredients.map((ingredient) => createIngredient(ingredient.name, ingredient.quantity)));
            return ingredients.map((ingredient) => el.append(createIngredient(ingredient.name, ingredient.quantity)));
            // return el.appendChild(createIngredient('myName', 'myQuantity'));
        }
        return el.innerText = fetchCakeField(0, el.id) // TODO: change 0 to actual dessert id
    })
}