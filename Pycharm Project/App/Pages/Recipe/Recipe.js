const fetchCakeField = (dessertId, data) => {
    const dessert = desserts[dessertId];
    return dessert[data];
}

const fetchAllCakeData = (dessertId) => {
    if (!dessertId) { // TODO: delete this
        dessertId = 0;
    } // until here
    const fields = ['dessertName', 'author', 'description', 'totalTimeInMinutes', 'img', 'difficultyLevel', 'ingredients', 'howToPrepare'];
    const elements = fields.map((field) => document.getElementById(field));
    elements.map((el) => {
        if (el.id === 'img') {
            return el.src = fetchCakeField(dessertId, el.id);
        }
        return el.innerText = fetchCakeField(dessertId, el.id);
    })
}
