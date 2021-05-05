const mysql =require('mysql2');

module.exports = mysql.createConnection({
    host: 'db',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});