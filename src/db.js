const mysql = require('mysql2/promise')

pool =  mysql.createPool({
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASS,
    port: process.env.PORT_DB,
    database: process.env.DB
});

module.exports = pool