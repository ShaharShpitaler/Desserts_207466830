const mysql = require('mysql2');
const dbConfig = require('./db_config.js');


//create a connection to data base
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});


connection.connect( error =>{
    if (error) throw error; {
        console.log("successefuly connected to DB");
    }});
    
module.exports = connection;

