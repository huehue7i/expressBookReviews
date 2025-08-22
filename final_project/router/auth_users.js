const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let userDB = {}; // Database to store registered users

const isValid = (username)=>{ //returns boolean
    // Check if username exists in userDB
    return userDB.hasOwnProperty(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Check if username and password match the one we have in records
    return userDB[username] && userDB[username].password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;
    if (userDB[username] && userDB[username].password === password) {
        const token = jwt.sign({username}, "fingerprint_customer", {expiresIn: 60 * 60});
        req.session.token = token;
        req.session.username = username;
        res.status(200).json({message: "Login successful", token});
    } else {
        res.status(401).json({message: "Invalid credentials"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const books = require('./booksdb.js');
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.username;
    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
    books[isbn].reviews = books[isbn].reviews || {};
    books[isbn].reviews[username] = review;
    res.json({ message: "Review added/updated", reviews: books[isbn].reviews });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const books = require('./booksdb.js');
    const isbn = req.params.isbn;
    const username = req.session.username;
    if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        res.json({ message: "Review deleted" });
    } else {
        res.status(404).json({ message: "Review not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.userDB = userDB;
