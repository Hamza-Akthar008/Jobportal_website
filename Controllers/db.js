var mysql = require('mysql');
var con = mysql.createConnection({
    
    
    host: 'remotemysql.com',
    user: 'GNu2Lw7lqn',
    password: 'TY1dwNqZw3',
    database: 'GNu2Lw7lqn',
    port:3306
})


module.exports=con;