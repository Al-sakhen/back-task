const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
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

exports.create = (req, res) => {
    const { title, description, price, user_id } = req.body;

    db.query(
        "INSERT INTO products SET ?",
        { title, description, price, user_id },
        (err, result) => {
            if (err) {
                console.log("Error: " + err);
            }
            return res
                .status(200)
                .send({ message: "Product created successfully" });
        }
    );
};

exports.getAll = (req, res) => {
    db.query("SELECT * FROM products", {}, (err, result) => {
        if (err) {
            console.log("Error: " + err);
        } else {
            if (result.length) {
                return res.status(200).send({ products: result });
            }
        }
    });
};

exports.get = (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM products WHERE ?", { id }, (err, result) => {
        if (err) {
            console.log("Error: " + err);
        } else {
            if (result.length) {
                console.log(result);
                return res.status(200).send({ product: result[0] });
            }
        }
    });
};

exports.update = (req, res) => {
    const { id } = req.params;
    const { title, description, price, user_id } = req.body;
    db.query(
        `UPDATE products SET ? WHERE id = ${id}`,
        { title, description, price, user_id },
        (err, result) => {
            if (err) {
                console.log("Error: " + err);
            }
            console.log(result);
            return res.status(200).send({ message: 'Product updated succesfully', product: result[0] });
        }
    );
};

exports.delete = (req, res) => {
    const { id } = req.params;
    db.query(
        `DELETE FROM products WHERE id = ${id}`,
        { },
        (err, result) => {
            if (err) {
                console.log("Error: " + err);
            }
            console.log(result);
            return res.status(200).send({ message: 'Product deleted succesfully'});
        }
    );
};
