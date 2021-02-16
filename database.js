const mysql =require('mysql2');

module.exports = mysql.createConnection({
    host: 'localhost' ,
    user: 'root' ,
    password: '159951123' ,
    database: 'senior'
});