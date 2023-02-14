var express = require('express');
var app = express();
var path = require('path');
const bodyParser = require('body-parser');
const csv = require("csvtojson");
const cookieParser = require("cookie-parser");
var fileUpload = require("express-fileupload");
const sql = require('./db/db');
const CRUD = require("./db/CRUD");
const CRUDdb = require("./db/CRUD_db");
const utilsJS = require("./static/js/Utils");
var port = 3000;

app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(fileUpload());

//for pug
app.set('views', path.join(__dirname, 'views'));//dirname is the folder which index.js exists in
app.set('view engine', 'pug');

// home page route
app.get('/', (req, res) => {
    if (req.cookies.userEmail != null) {
        res.redirect('/actionPage');
    }
    res.redirect('/main');
});

//routes
app.get('/login', (req, res) => {
    res.render('LogInPage', {
        page_title: "Sweet Talk log in",
        page_h1: "Welcome to Sweet Talk",
        user_login: false
    })
})

app.get('/AboutPage', (req, res) => {
    var userEmail = req.cookies.userEmail;
    res.render('AboutPage', {
        page_title: "About us",
        page_h1: "Hi, this is Sweet-talk",
        user_login: userEmail == null ? false : true
    })
})

app.get('/AddARecipe', (req, res) => {
    res.render('AddARecipePage', {
        page_title: "Upload a recipe",
        page_h1: "Upload a recipe",
        user_login: true
    })
})

app.get('/actionPage', (req, res) => {
    res.render('ActionPage', {
        page_title: "Welcome to sweet talk",
        page_h1: "welcome to sweet talk",
        user_login: true
    })
})


app.get('/allRecipes', CRUD.getAllRecipes)

app.get('/main', (req, res) => {
    res.render('MainPage', {
        page_title: "Sweet-talk main page",
        page_h1: "Welcome to sweet-talk"
    })
})

app.get('/signUp', (req, res) => {
    res.render('signUpPage', {
        page_title: "Sweet-talk sign up",
        page_h1: "Welcome to sweet-talk",
        user_login: false
    })
})

// app.get('/updateUserPage', (req, res) => {
//     res.render('UpdateUserPage', {
//         page_title: "Sweet-talk - Update your info",
//         page_h1: "Update your info",
//         user_login: true
//     })
// })

app.get('/recipe', (req, res) => {
    res.render('Recipe', {
        page_title: "Sweet-talk",
        page_h1: "Recipe name",
        user_login: true
    })
})

app.get('/RatingPage/:id', (req, res) => {
    res.render('Rating', {
        page_title: "Rate this recipe",
        page_h1: "Rate recipe",
        user_login: true
    })
});

app.post('/addNewRecipe', function(req,res){
    if (!req.body) { 
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    var userEmail = req.cookies.userEmail;
    var description = req.body.description;
    var recipe_data = "";
    if (description == "") {
        description = null;
    }
    var checkIngrediants = utilsJS.checkStringInput(req.body.ingredients);
    var checkPrepare = utilsJS.checkStringInput(req.body.howToPrepare);
    var checkName = utilsJS.checkStringInput(req.body.dessertName);
    var checkTime = utilsJS.checkNumberInput(req.body.totalTime);
    var checkDescription = "";
    if (description != null) {
        checkDescription = utilsJS.validateDescription(description);
    }
    if (!req.files) {
        recipe_data = {
            "dessert_name": req.body.dessertName,
            "user_email": userEmail,
            "dessert_description": description,
            "total_time": req.body.totalTime,
            "difficulty_level": req.body.difficultyLevel,
            "ingrediants": req.body.ingredients,
            "how_to_prepare": req.body.howToPrepare,
            "type_of_dessert": req.body.dessertType,
            "img_path": null
        };
        if (checkIngrediants == "" && checkPrepare == "" && checkName == "" && checkTime == "" && checkDescription == "") {
            sql.query("INSERT INTO recipes SET ?", recipe_data, (err, mysqlres3) => {
                if (err) {
                    res.status(400).send({message: "error in creating row: " + err });
                    return;
                }
                res.render('ActionPage', {
                    page_title: "Welcome to sweet talk",
                    page_h1: "welcome to sweet talk",
                    msg: "Your recipe created",
                    user_login: true
                })
                return;
            });
        } else {
            res.render('AddARecipePage', {
                page_title: "Add a recipe",
                page_h1: "Add a recipe",
                recipeData: recipe_data, 
                dessertNameMsg: checkName,
                descriptionMsg: checkDescription,
                totalTimeMsg: checkTime,
                ingredientsMsg: checkIngrediants,
                howToPrepareMsg: checkPrepare,
                user_login: true
            })
        }

    }
    else {
        var img = req.files.image_file;
        var img_name = userEmail + "_" + img.name;
        const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
        const file_extension = img.name.slice(((img.name.lastIndexOf('.') - 1) >>> 0) + 2);
        console.log("check end:", file_extension);
        recipe_data = {
            "dessert_name": req.body.dessertName,
            "user_email": userEmail,
            "dessert_description": description,
            "total_time": req.body.totalTime,
            "difficulty_level": req.body.difficultyLevel,
            "ingrediants": req.body.ingredients,
            "how_to_prepare": req.body.howToPrepare,
            "type_of_dessert": req.body.dessertType,
            "img_path": img_name
        };
        if (!array_of_allowed_files.includes(file_extension)) {
            res.render('AddARecipePage', {
                page_title: "Add a recipe",
                page_h1: "Add a recipe",
                recipeData: recipe_data, 
                dessertNameMsg: checkName,
                descriptionMsg: checkDescription,
                totalTimeMsg: checkTime,
                ingredientsMsg: checkIngrediants, 
                howToPrepareMsg: checkPrepare,
                imgMsg: "סוג קובץ לא תקין",
                user_login: true
            });
        } else {
            sql.query("select * from recipes where img_path = ?", img_name, (err, mysqlres) => {
                if (err) {
                    res.status(400).send({message: "error in select img row: " + err + img_name});
                    return;
                }
                if (mysqlres.length != 0) {
                    res.render('AddARecipePage', {
                        page_title: "Add a recipe",
                        page_h1: "Add a recipe",
                        recipeData: recipe_data, 
                        dessertNameMsg: checkName,
                        descriptionMsg: checkDescription,
                        totalTimeMsg: checkTime,
                        ingredientsMsg: checkIngrediants,
                        howToPrepareMsg: checkPrepare,
                        imgMsg: "כבר העלאת תמונה בשם זה, בחר שם אחר לתמונה",
                        user_login: true
                    })

                } else {
                    if (checkIngrediants == "" && checkPrepare == "" && checkName == "" && checkTime == "" && checkDescription == "") {
                        img.mv(__dirname + '/static/images/desserts/' + img_name);
                        sql.query("INSERT INTO recipes SET ?", recipe_data, (err, mysqlres2) => {
                            if (err) {
                                res.status(400).send({message: "error in creating row: " + err + img_name});
                                return;
                            }
                            res.render('ActionPage', {
                                page_title: "Welcome to sweet talk",
                                page_h1: "welcome to sweet talk",
                                msg: "Your recipe created",
                                user_login: true
                            })
                            return;
                        });
                    }
                    else {
                        res.render('AddARecipePage', {
                            page_title: "Add a recipe",
                            page_h1: "Add a recipe",
                            recipeData: recipe_data, 
                            dessertNameMsg: checkName,
                            descriptionMsg: checkDescription,
                            totalTimeMsg: checkTime,
                            ingredientsMsg: checkIngrediants,
                            howToPrepareMsg: checkPrepare,
                            user_login: true
                        });
                    }
                }
            })

        }
    }
});

app.get('/removeRecipe/:id', CRUD.removeRecipe);

app.get('/dessertPage/:id', CRUD.showRecipeDetails);

app.get('/filterRecipes', CRUD.filterRecipes);

app.post('/checkUser', CRUD.checkUser);

app.get('/updateUserPage', CRUD.getUserData);

app.post('/createNewUser', CRUD.createNewUser);

app.post('/updateUser', CRUD.updateUser);

app.post('/createNewRating/:id', CRUD.createNewRating);

app.get("/setEmailCookie/:email", (req, res) => {
    const userEmail = req.params.email;
    res.cookie('userEmail', userEmail);
    res.redirect("/actionPage");
});


app.get('/removeUserEmailCookie', (req,res) => {
    res.clearCookie("userEmail");
    res.redirect('/main');
});



//initialize db
//creates
app.get('/createDBtables', [CRUDdb.createUsersTable, CRUDdb.createRecipesTable, CRUDdb.createRatingsTable]);

//inserts
app.get('/InsertUsersData', CRUDdb.InsertUsersData);
app.get('/InsertRecipesData', CRUDdb.InsertRecipesData);
app.get('/InsertRatingsData', CRUDdb.InsertRatingsData);

//show
app.get('/showUsers', CRUDdb.showUsers);
app.get('/showRecipes', CRUDdb.showRecipes);
app.get('/showRatings', CRUDdb.showRatings);

//Drop
app.get('/dropDBtables', [CRUDdb.dropRatingsTable, CRUDdb.dropRecipesTable, CRUDdb.dropUsersTable]);

//listen
app.listen(port, ()=>{
    console.log("express server is running on port "+ port);
});