const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT || 3306, // Default to 3306 if not specified
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

module.exports = pool;
