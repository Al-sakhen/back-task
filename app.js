const express = require("express");
const app = express();
var cors = require("cors");
const router = require("./routes");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieServer = require("cookie-parser");
dotenv.config({
    path: "./.env",
});
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:5173"],
    })
);
app.use(cookieServer());
// Define routse
app.use(router);

app.listen(5000, () => {
    console.log("server started on port 5000");
});
