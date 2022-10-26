const mysql = require('mysql2/promise')

pool =  mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    port: process.env.PORT,
    database: process.env.DB
});

module.exports = pool