const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "e_commerce_db",
  port:3306
});

const conn = db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("DB Connected successfully");
  }
});

module.exports = db;
