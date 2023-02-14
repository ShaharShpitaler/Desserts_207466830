var sql = require("./db");
// const path = require("path");
const utilsJS = require("../static/js/Utils");


const checkUser = (req, res)=>{
    if (!req.body) { 
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    const userData = {
        "user_name": req.body.username,
        "password": req.body.password
    };
    sql.query("SELECT email, password FROM users where user_name like ?", userData.user_name + "%", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        if (mysqlres.length == 0) {
            res.render('LogInPage', {
                page_title: "Sweet Talk log in",
                page_h1: "Welcome to Sweet Talk", 
                user_login: false,
                user_name: userData.user_name,
                usernameMsg: 'שם משתמש לא קיים'
            });
            return;
        }
        else {
            if (mysqlres[0].password == userData.password) {
                res.redirect("/setEmailCookie/" + mysqlres[0].email);
                return;
            } else {
                res.render('LogInPage', {
                    page_title: "Sweet Talk log in",
                    page_h1: "Welcome to Sweet Talk", 
                    user_login: false,
                    user_name: userData.user_name,
                    passwordMsg: 'סיסמה לא נכונה'
                });
                return;
            }
        }
    });
};

const getUserData = (req,res)=>{
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    var userEmail = req.cookies.userEmail;
    sql.query("select * from users where email like ?", userEmail + "%", (err, mysqlres) =>{
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        console.log("got user data",mysqlres);
        res.render('UpdateUserPage', {
            page_title: "Sweet Talk - Update your info",
            page_h1: "Update your info",
            user_login: true,
            userData: mysqlres[0]
        });
    });
}



const createNewUser = (req, res)=>{
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    var userNameCheck = utilsJS.validateUsername(req.body.username);
    var checkFirstName = utilsJS.validateName(req.body.firstName);
    var checkLastName = utilsJS.validateName(req.body.lastName);
    var checkPassword = utilsJS.validatePassword(req.body.password);
    var checkBdate = utilsJS.validateDateOfBirth(req.body.dateOfBirth);
    const userData = {
        "email": req.body.email,
        "first_name": req.body.firstName,
        "last_name": req.body.lastName,
        "user_name": req.body.username,
        "gender": req.body.gender,
        "birth_date": req.body.dateOfBirth,
        "password": req.body.password
    };
    sql.query("select * from users where email like ?", userData.email + "%", (err, mysqlres) =>{
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        else if (mysqlres.length == 0) {
            sql.query("select * from users where user_name like ?", userData.user_name + "%", (err, mysqlres2) =>{
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({message: "error: " + err});
                    return;
                }
                else if (mysqlres2.length == 0) {
                    if (userNameCheck == "" && checkFirstName == "" && checkLastName == "" && checkPassword == "" && checkBdate == "") {
                        sql.query("INSERT INTO users SET ?", userData, (err, mysqlres3) => {
                            if (err) {
                                console.log("error: ", err);
                                res.status(400).send({message: "error in create user: " + err + userData});
                                return;
                            }
                            console.log("created user");
                            res.render('LogInPage', {
                                page_title: "Sweet Talk log in",
                                page_h1: "Welcome to Sweet Talk",
                                user_login: false,
                                alertMsg: "The registration was successful! Login to the site"
                            });
                            return;
                        });
                    } else {
                        res.render('signUpPage', {
                            page_title: "Sweet-talk sign up",
                            page_h1: "Welcome to sweet-talk",
                            user_login: false,
                            userInputs: userData,
                            usernameMsg: userNameCheck,
                            firstNameMsg: checkFirstName,
                            lastNameMsg: checkLastName,
                            passwordMsg: checkPassword,
                            birthdayMsg: checkBdate
                        });
                        return;
                    }
                }
                else {
                    res.render('signUpPage', {
                        page_title: "Sweet-talk sign up",
                        page_h1: "Welcome to sweet-talk",
                        user_login: false,
                        userInputs: userData,
                        usernameMsg: "This username is taken, choose another username",
                        firstNameMsg: checkFirstName,
                        lastNameMsg: checkLastName,
                        passwordMsg: checkPassword,
                        birthdayMsg: checkBdate
                    });
                    return;
                }
            })
        } else {
            res.render('signUpPage', {
                page_title: "Sweet-talk sign up",
                page_h1: "Welcome to sweet-talk",
                user_login: false,
                userInputs: userData,
                emailMsg: "Already registered with this email, choose another email",
                usernameMsg: userNameCheck,
                firstNameMsg: checkFirstName,
                lastNameMsg: checkLastName,
                passwordMsg: checkPassword,
                birthdayMsg: checkBdate
            });
            return;
        }
})};


const getAllRecipes = (req, res)=>{
    var userEmail = req.cookies.userEmail;
    // sql.query("select r.*, u.first_name, u.last_name from recipes r join users u on r.user_email = u.email;", (err, mysqlres) => {
    sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from recipes r join users u on r.user_email = u.email;", userEmail + "%", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error in getting all recipes: " + err});
            return;
        }
        res.render('AllRecipes', {
                page_title: "Browse Recipes",
                page_h1: "Browse Recipes",
                recipes: mysqlres,
                user_login: true
        })
        return;
    
    });
};

const showRecipeDetails = (req, res)=>{
    var userEmail = req.cookies.userEmail;
    var recipeID = req.params.id;

    // select r.*, u.first_name, u.last_name, case when r.user_email = ? then 1 else 0 end as is_author from recipes r join users u on r.user_email = u.email where r.dessert_id = ?;
     
    sql.query("SELECT recipes.*,users.last_name, users.first_name, ratings.rating, ratings.comment, ratings.email, case when recipes.user_email = ? then 1 else 0 end as is_author FROM recipes INNER JOIN users ON recipes.user_email = users.email LEFT JOIN ratings ON recipes.dessert_id = ratings.dessert_id where recipes.dessert_id = ?;", [userEmail, recipeID], (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error in getting recipe details: " + err});
            return;
        }
        let ratingsSum = 0;
        let already_rated = false;
        for (r of mysqlres) {
            ratingsSum += r.rating;
            if (r.email == userEmail) {
                already_rated = true;
            }
        }
        const ratingAvg = ratingsSum / mysqlres.length;

        res.render('Recipe', {
                page_title: "Recipe Details",
                page_h1: mysqlres[0].dessert_name,
                recipe: mysqlres,
                avg_rating: ratingAvg.toFixed(2),
                already_rated,
                user_login: true
        })
        return;
    });

};

const removeRecipe = (req, res) => {
    var recipeID = req.params.id;

    sql.query("DELETE FROM recipes WHERE dessert_id like ?", recipeID + "%", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        res.redirect('/allRecipes');
    });

};


const filterRecipes = (req,res)=>{
    var userEmail = req.cookies.userEmail;
    if (!req.query) {
        res.redirect("/allRecipes");
    }
    var difficulty = req.query.difficultyLevelFilter;
    var maxTotalTime = req.query.totalTimeFilter;
    var typeOfDessert = req.query.typeOfDessertFilter;
    var authors = req.query.myOrOthers;
    if (authors == "All") {
        if (difficulty == "" && maxTotalTime == "" && typeOfDessert == "") {
            res.redirect("/allRecipes");
        }
        else if (difficulty == "") {
            if (maxTotalTime != "" && typeOfDessert == "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where total_time <= ? ) as r join users u on r.user_email = u.email;", [userEmail, maxTotalTime], (err, mysqlres)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres,
                        user_login: true
                    })
                    return;
                })
            }
            else if (maxTotalTime == "" && typeOfDessert != "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where type_of_dessert like ? ) as r join users u on r.user_email = u.email;", [userEmail, typeOfDessert], (err, mysqlres2)=>{
                    if (err) {
                        console.log("error:", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres2,
                        user_login: true
                    })
                    return;
                })
            }
            else {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where type_of_dessert like ? && total_time <= ?) as r join users u on r.user_email = u.email;", [userEmail, typeOfDessert, maxTotalTime], (err, mysqlres3)=>{
                    if (err) {
                        console.log("error:", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres3,
                        user_login: true
                    })
                    return;
                })
            }
        }
        else {
            if (maxTotalTime == "" && typeOfDessert == "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where difficulty_level like ?) as r join users u on r.user_email = u.email;", [userEmail, difficulty], (err, mysqlres4)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres4,
                        user_login: true
                    })
                    return;
                })
            }
            else if (maxTotalTime != "" && typeOfDessert == "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where difficulty_level = ? and total_time <= ? ) as r join users u on r.user_email = u.email;", [userEmail, difficulty, maxTotalTime], (err, mysqlres5)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres5,
                        user_login: true
                    })
                    return;
                })
            }
            else if (maxTotalTime == "" && typeOfDessert != "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where difficulty_level = ? and type_of_dessert like ? ) as r join users u on r.user_email = u.email;", [userEmail, difficulty, typeOfDessert], (err, mysqlres6)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres6,
                        user_login: true
                    })
                    return;
                })
            }
            else {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where difficulty_level = ? and type_of_dessert like ? and total_time <= ?) as r join users u on r.user_email = u.email;", [userEmail, difficulty, typeOfDessert, maxTotalTime], (err, mysqlres7)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres7,
                        user_login: true
                    })
                    return;
                })
            }
        }
    }
    else if (authors == "Mine") {
        if (difficulty == "" && maxTotalTime == "" && typeOfDessert == "") {
            sql.query("select r.*, u.first_name, u.last_name, case when r.user_email = ? then 1 else 0 end as is_author from recipes r join users u on r.user_email = u.email where r.user_email = ?;", [userEmail, userEmail], (err, mysqlres)=>{
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({message:"could not find recipes"});
                    return;
                }
                res.render('AllRecipes', {
                    page_title: "Browse Recipes",
                    page_h1: "Browse Recipes",
                    recipes: mysqlres,
                    user_login: true
                })
                return;
            })
        }
        else if (difficulty == "") {
            if (maxTotalTime != "" && typeOfDessert == "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where total_time <= ? ) as r join users u on r.user_email = u.email where r.user_email = ?;", [userEmail, maxTotalTime,userEmail], (err, mysqlres2)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres2,
                        user_login: true
                    })
                    return;
                })
            }
            else if (maxTotalTime == "" && typeOfDessert != "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where type_of_dessert like ? ) as r join users u on r.user_email = u.email where r.user_email = ?;", [userEmail, typeOfDessert,userEmail], (err, mysqlres3)=>{
                    if (err) {
                        console.log("error:", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres3,
                        user_login: true
                    })
                    return;
                })
            }
            else {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where type_of_dessert like ? && total_time <= ?) as r join users u on r.user_email = u.email where r.user_email = ?;", [userEmail, typeOfDessert, maxTotalTime,userEmail], (err, mysqlres4)=>{
                    if (err) {
                        console.log("error:", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres4,
                        user_login: true
                    })
                    return;
                })
            }
        }
        else {
            if (maxTotalTime == "" && typeOfDessert == "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where difficulty_level like ?) as r join users u on r.user_email = u.email where r.user_email = ?;", [userEmail, difficulty,userEmail], (err, mysqlres5)=>{                    
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres5,
                        user_login: true
                    })
                    return;
                })
            }
            else if (maxTotalTime != "" && typeOfDessert == "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where difficulty_level = ? and total_time <= ? ) as r join users u on r.user_email = u.email where r.user_email = ?;", [userEmail, difficulty, maxTotalTime,userEmail], (err, mysqlres6)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres6,
                        user_login: true
                    })
                    return;
                })
            }
            else if (maxTotalTime == "" && typeOfDessert != "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where difficulty_level = ? and type_of_dessert like ? ) as r join users u on r.user_email = u.email where r.user_email = ?;", [userEmail, difficulty, typeOfDessert,userEmail], (err, mysqlres7)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres7,
                        user_login: true
                    })
                    return;
                })
            }
            else {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where difficulty_level = ? and type_of_dessert like ? and total_time <= ?) as r join users u on r.user_email = u.email where r.user_email = ?;", [userEmail, difficulty, typeOfDessert, maxTotalTime,userEmail], (err, mysqlres8)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres8,
                        user_login: true
                    })
                    return;
                })
            }
        }
    }
    else {
        if (difficulty == "" && maxTotalTime == "" && typeOfDessert == "") {
            sql.query("select r.*, u.first_name, u.last_name, case when r.user_email = ? then 1 else 0 end as is_author from recipes r join users u on r.user_email = u.email where r.user_email != ?;", [userEmail, userEmail], (err, mysqlres9)=>{
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({message:"could not find recipes"});
                    return;
                }
                res.render('AllRecipes', {
                    page_title: "Browse Recipes",
                    page_h1: "Browse Recipes",
                    recipes: mysqlres9,
                    user_login: true
                })
                return;
            })
        }
        else if (difficulty == "") {
            if (maxTotalTime != "" && typeOfDessert == "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where total_time <= ? ) as r join users u on r.user_email = u.email where r.user_email != ?;", [userEmail, maxTotalTime,userEmail], (err, mysqlres10)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres10,
                        user_login: true
                    })
                    return;
                })
            }
            else if (maxTotalTime == "" && typeOfDessert != "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where type_of_dessert like ? ) as r join users u on r.user_email = u.email where r.user_email != ?;", [userEmail, typeOfDessert,userEmail], (err, mysqlres11)=>{
                    if (err) {
                        console.log("error:", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres11,
                        user_login: true
                    })
                    return;
                })
            }
            else {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where type_of_dessert like ? && total_time <= ?) as r join users u on r.user_email = u.email where r.user_email != ?;", [userEmail, typeOfDessert, maxTotalTime,userEmail], (err, mysqlres12)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres12,
                        user_login: true
                    })
                    return;
                })
            }
        }
        else {
            if (maxTotalTime == "" && typeOfDessert == "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where difficulty_level like ?) as r join users u on r.user_email = u.email where r.user_email != ?;", [userEmail, difficulty,userEmail], (err, mysqlres12)=>{                    
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres12,
                        user_login: true
                    })
                    return;
                })
            }
            else if (maxTotalTime != "" && typeOfDessert == "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where difficulty_level = ? and total_time <= ? ) as r join users u on r.user_email = u.email where r.user_email != ?;", [userEmail, difficulty, maxTotalTime,userEmail], (err, mysqlres13)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres13,
                        user_login: true
                    })
                    return;
                })
            }
            else if (maxTotalTime == "" && typeOfDessert != "") {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where difficulty_level = ? and type_of_dessert like ? ) as r join users u on r.user_email = u.email where r.user_email != ?;", [userEmail, difficulty, typeOfDessert,userEmail], (err, mysqlres13)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres13,
                        user_login: true
                    })
                    return;
                })
            }
            else {
                sql.query("select r.*, u.first_name, u.last_name, case when r.user_email like ? then 1 else 0 end as is_author from (select * from recipes where difficulty_level = ? and type_of_dessert like ? and total_time <= ?) as r join users u on r.user_email = u.email where r.user_email != ?;", [userEmail, difficulty, typeOfDessert, maxTotalTime,userEmail], (err, mysqlres14)=>{
                    if (err) {
                        console.log("error: ", err);
                        res.status(400).send({message:"could not find recipes"});
                        return;
                    }
                    res.render('AllRecipes', {
                        page_title: "Browse Recipes",
                        page_h1: "Browse Recipes",
                        recipes: mysqlres14,
                        user_login: true
                    })
                    return;
                })
            }
        }        
    }
}



const createNewRating = (req, res)=>{
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    var userEmail = req.cookies.userEmail;
    var dessert_id = req.params.id;
    const RatingData = {
        "email": userEmail,
        "dessert_id": dessert_id,
        "rating": req.body.rating,
        "comment": req.body.comment,
    };
    sql.query("INSERT INTO ratings SET ?", RatingData, (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error in create user: " + err + RatingData});
            return;
        }
        console.log("created rating");
        res.redirect('/dessertPage/'+dessert_id);
        return;
    });
}

const updateUser = (req, res)=>{
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    var userEmail = req.cookies.userEmail;
    var checkFirstName = utilsJS.validateName(req.body.firstName);
    var checkLastName = utilsJS.validateName(req.body.lastName);
    var checkPassword = utilsJS.validatePassword(req.body.password);
    const userData = {
        "email": userEmail,
        "first_name": req.body.firstName,
        "last_name": req.body.lastName,
        "password": req.body.password
    };
    if (checkFirstName == "" && checkLastName == "" && checkPassword == "") {
        sql.query("UPDATE users SET ? WHERE email = ?", [userData,userEmail] , (err, mysqlres) => {
            if (err) {
                console.log("error: ", err);
                res.status(400).send({message: "error in update user: " + err + userData});
                return;
            }
            console.log("updated user");
            res.render('LogInPage', {
                page_title: "Sweet Talk log in",
                page_h1: "Welcome to Sweet Talk",
                user_login: false,
                alertMsg: "The update was successful! Login to the site"
            });
            return;
        });
    } else {
        res.render('UpdateUserPage', {
            page_title: "Update your info",
            page_h1: "Update your info",
            user_login: true,
            userData: userData,
            firstNameMsg: checkFirstName,
            lastNameMsg: checkLastName,
            passwordMsg: checkPassword,
        });
        return;
    }
}
        
    // res.sendStatus(200);


module.exports = {checkUser,createNewUser, getAllRecipes, removeRecipe, showRecipeDetails, filterRecipes, createNewRating,updateUser, getUserData};
