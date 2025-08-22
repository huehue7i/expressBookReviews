const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }
    if (userDB[username]) {
        return res.status(409).json({ message: "User already exists" });
    }
    userDB[username] = { password };
    res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.status(200).json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).json(books[isbn]);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let results = [];
  Object.keys(books).forEach(isbn => {
      if (books[isbn].author === author) {
          results.push(books[isbn]);
      }
      if (results.length > 0){
          res.status(200).json(results);
      } else {
          res.status(404).json({message: "Author not found"});
      }
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let result1 = [];
  Object.keys(books).forEach(isbn => {
      if (books[isbn].title === title) {
          result1.push(books[isbn]);
      }
      if (result1.length > 0){
          res.status(200).json(result1);
      } else {
          res.status(404).json({message: "Title not found"});
      }
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let result2 = [];
  Object.keys(books).forEach(isbn => {
      if (books[isbn].reviews) {
          result2.push(books[isbn].reviews);
      }
      if (result2.length > 0){
          res.status(200).json(result2);
      } else {
          res.status(404).json({message: "Review not found"});
      }
  })
});

module.exports.general = public_users;
