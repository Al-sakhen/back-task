const dotenv = require("dotenv");
// db connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
});

db.connect((err) => {
    if (err) {
        console.log("Error connecting to database: " + err);
    }
    console.log("Connected to database");
});
