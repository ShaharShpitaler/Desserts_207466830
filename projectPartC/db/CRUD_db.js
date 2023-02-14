var sql = require("./db");
const path = require("path");
const csv = require("csvtojson");


const createUsersTable = (req,res, next)=>{
    var Q1 = "CREATE TABLE IF NOT EXISTS users (email varchar(255) PRIMARY KEY, first_name VARCHAR(255) not null, last_name VARCHAR(255) not null, user_name VARCHAR(255) not null, gender ENUM('Male', 'Female', 'Other') not null, birth_date date not null, password varchar(255) not null) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    sql.query(Q1,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating users table"});
            return;
        }
        console.log('users table created successfully');
        return;
    });
    next();
};


const InsertUsersData = (req,res)=>{
    var Q2 = "INSERT INTO users SET ?";
    const csvFilePath= path.join(__dirname, "users.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    jsonObj.forEach(element => {
        var NewUser = {
            "email": element.email,
            "first_name": element.first_name,
            "last_name": element.last_name,
            "user_name": element.user_name,
            "gender": element.gender,
            "birth_date": element.birth_date,
            "password": element.password
        }
        sql.query(Q2, NewUser, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly ");
        });
    });
    });
    
    res.send("users data inserted");

};


const createRecipesTable = (req,res,next)=>{
    var Q3 = "CREATE TABLE IF NOT EXISTS recipes (dessert_id int AUTO_INCREMENT primary key, dessert_name varchar(255) not null, user_email varchar(255) not null, dessert_description text null, total_time int not null, difficulty_level ENUM('Easy', 'Medium', 'Hard', 'Expert') not null, ingrediants text not null, how_to_prepare text not null, type_of_dessert ENUM('Cake', 'Cookie', 'Confectionery', 'Doughnuts', 'Frozen', 'Ice cream', 'Pastry', 'Pie', 'Pudding', 'Custer') not null, img_path varchar(255) null, constraint fk_username foreign key (user_email) references users(email)) ENGINE=InnoDB DEFAULT CHARSET=utf8;";
    sql.query(Q3,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating recipes table"});
            return;
        }
        console.log("recipes table created");
        return;
    });
    next();
};

const InsertRecipesData = (req,res)=>{
    var Q4 = "INSERT INTO recipes SET ?";
    const csvFilePath= path.join(__dirname, "recipes.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    jsonObj.forEach(element => {
        var description = element.dessert_description;
        var img = element.img_path;
        if (description == "") {
            description = null;
        }
        if (img == "") {
            img = null;
        }
        var NewRecipe = {
            "dessert_name": element.dessert_name,
            "user_email": element.user_email,
            "dessert_description": description,
            "total_time": element.total_time,
            "difficulty_level": element.difficulty_level,
            "ingrediants": element.ingrediants,
            "how_to_prepare": element.how_to_prepare,
            "type_of_dessert": element.type_of_dessert,
            "img_path": img

        }
        sql.query(Q4, NewRecipe, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly");
        });
    });
    });
    
    res.send("recipes data inserted");
};

const showRecipes = (req,res) => {
    var Q8= "SELECT * FROM recipes";
    sql.query(Q8,(err,mysqlres)=>{
    if(err){
        console.log("error: ", err);
        res.status(400).send({message: "error in showing recipes: " +err});
        return;
    }
    console.log("success in showing recpies");
    res.send(mysqlres);
    return;
    });
}


const createRatingsTable = (req,res)=>{
    var Q4 = "CREATE TABLE IF NOT EXISTS ratings (email varchar(255),dessert_id int,rating int not null,comment text null,Primary key(email,dessert_id),constraint email foreign key (email) references users(email),constraint dessert_id foreign key (dessert_id) references recipes(dessert_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8;";    
    sql.query(Q4,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating ratings table"});
            return;
        }
        console.log('ratings table created successfully');
        res.send("all tables created");
        return;
    });
};


const InsertRatingsData = (req,res)=>{
    var Q5 = "INSERT INTO ratings SET ?";
    const csvFilePath= path.join(__dirname, "ratings.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    jsonObj.forEach(element => {
        var NewRating = {
            "email": element.email,
            "dessert_id": element.dessert_id,
            "rating": element.rating,
            "comment": element.comment,
        }
        sql.query(Q5, NewRating, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            console.log("created row sucssefuly ");
        });
    });
    });
    
    res.send("ratings data inserted");

};

const showRatings = (req,res) => {
    var Q8= "SELECT * FROM ratings";
    sql.query(Q8,(err,mysqlres)=>{
    if(err){
        console.log("error: ", err);
        res.status(400).send({message: "error in showing ratings: " +err});
        return;
    }
    console.log("success in showing ratings");
    res.send(mysqlres);
    return;
    });
}

const showUsers = (req,res) => {
    var Q8= "SELECT * FROM users";
    sql.query(Q8,(err,mysqlres)=>{
    if(err){
        console.log("error: ", err);
        res.status(400).send({message: "error in showing users: " +err});
        return;
    }
    console.log("success in showing users");
    res.send(mysqlres);
    return;
    });
}

const dropRatingsTable = (req,res, next)=>{
    var Q9 = "DROP TABLE ratings";
    sql.query(Q9, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping ratings table ", err);
            res.status(400).send({message: "error in dropping ratings table" + err});
            return;
        }
        console.log("ratings table dropped");
        return;
    });
    next();
};

const dropRecipesTable = (req,res, next)=>{
    var Q9 = "DROP TABLE recipes";
    sql.query(Q9, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping recipes table ", err);
            res.status(400).send({message: "error in dropping recipes table" + err});
            return;
        }
        console.log("recipes table dropped");
        return;
    });
    next();
};

const dropUsersTable = (req,res)=>{
    var Q9 = "DROP TABLE users";
    sql.query(Q9, (err, mySQLres)=>{
        if (err) {
            console.log("error in dropping users table ", err);
            res.status(400).send({message: "error in dropping users table" + err});
            return;
        }
        console.log("users table dropped");
        res.send("all tables dropped");
    });
};

module.exports={createUsersTable, InsertUsersData, createRecipesTable, InsertRecipesData, showRecipes, createRatingsTable, InsertRatingsData, showRatings,dropRatingsTable, dropRecipesTable, dropUsersTable,showUsers};