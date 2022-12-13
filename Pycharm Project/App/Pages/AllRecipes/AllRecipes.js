const fetchDataForView = (filters) => {
    const cakesDataForView = [];
    for (let i = 0; i < desserts.length; i++) {
        const cakeDataForView = {
            dessertName: fetchCakeField(i, 'dessertName'),
            author: fetchCakeField(i, 'author'),
            description: fetchCakeField(i, 'description'),
            totalTimeInMinutes: fetchCakeField(i, 'totalTimeInMinutes'),
            img: fetchCakeField(i, 'img'),
        }
        cakesDataForView.push(cakeDataForView);
    }

    const dessertsDiv = document.getElementById('recipes');
    dessertsDiv.innerHTML = '';

    cakesDataForView.forEach((dessert) => {
        const cakeUI = createDessertDiv(
            dessert.dessertName,
            dessert.author,
            dessert.description,
            dessert.totalTimeInMinutes,
            dessert.img
        );
        dessertsDiv.appendChild(cakeUI);
    })

    return cakesDataForView;
}

const createDessertFieldDiv = (fieldName, fieldValue) => {
    const fieldDiv = document.createElement("div");

    const fieldLabelSpan = document.createElement("span");
    fieldLabelSpan.innerText = `${fieldName}: `;

    const fieldValueSpan = document.createElement("span");
    if (fieldName === 'Image') {
        const fieldValueImage = document.createElement('img');
        fieldValueImage.src = fieldValue;
        fieldValueSpan.appendChild(fieldValueImage);
    } else {
        fieldValueSpan.innerText = fieldValue;
    }

    fieldDiv.appendChild(fieldLabelSpan);
    fieldDiv.appendChild(fieldValueSpan);

    return fieldDiv;
}

const createDessertDiv = (dessertName, author, description, totalTimeInMinutes, img) => {
    const dessertNameFieldDiv = createDessertFieldDiv('Dessert name', dessertName);
    const authorFieldDiv = createDessertFieldDiv('Author', author);
    const descriptionFieldDiv = createDessertFieldDiv('Description', description);
    const totalTimeFieldDiv = createDessertFieldDiv('Total time in minutes', totalTimeInMinutes);
    const imgDiv = createDessertFieldDiv('Image', img);

    const dessertDiv = document.createElement('div');

    dessertDiv.appendChild(dessertNameFieldDiv);
    dessertDiv.appendChild(authorFieldDiv);
    dessertDiv.appendChild(descriptionFieldDiv);
    dessertDiv.appendChild(totalTimeFieldDiv);
    dessertDiv.appendChild(imgDiv);

    dessertDiv.className = 'recipeInList';
    return dessertDiv;
}
