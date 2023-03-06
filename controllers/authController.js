const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

exports.register = (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;
    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {
            if (err) {
                console.log("Error: " + err);
            }

            if (result.length) {
                return res
                    .status(400)
                    .send({ message: "email already taken !" });
            } else if (password !== passwordConfirm) {
                console.log("password not match");
                return res.status(401).send({ message: "password not math" });
                // return res.send({res , text:'password not match'})
            }

            let hashedPass = await bcrypt.hash(password, 8);
            db.query(
                "INSERT INTO users SET ?",
                { name, email, password: hashedPass },
                (err, result) => {
                    if (err) {
                        console.log("Error: " + err);
                    } else {
                        db.query(
                            "SELECT * FROM users WHERE email = ?",
                            [email],
                            async (err, result) => {
                                if (err) {
                                    console.log("Error: " + err);
                                } else {
                                    console.log(result);
                                    return res.status(200).send({
                                        message: "user created succesfully",
                                        user: result[0],
                                    });
                                }
                            }
                        );
                    }
                }
            );
        }
    );
    // res.send("submitted")
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {
            if (err) {
                console.log(err);
            }

            if (result.length) {
                const hashedPass = result[0].password;
                const { id, email } = result[0];
                const isPassCorrect = await bcrypt.compare(
                    password,
                    hashedPass
                );
                if (isPassCorrect) {
                    let token = jwt.sign({ id, email }, "alsakhen", {
                        expiresIn: "2hr",
                    });
                    return res
                        .cookie("token", token, {
                            httpOnly: true,
                            sameSite: "none",
                            secure: true,
                        })
                        .send({ message: "Welcome back", user: result[0] });
                } else {
                    return res.status(403).send({ message: "wrong password" });
                }
            } else {
                return res.status(403).send({ message: "wrong credentials" });
            }
        }
    );
};


exports.logout = (req, res) => {
    return res.cookie("token", "", {
        sameSite: "none",
        secure: true,
    }).json(true);
};
