const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let userDB = require("./auth_users.js").userDB;
const public_users = express.Router();
const axios = require('axios');


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
public_users.get('/books', async (req, res) => {
    try {
        const books = require('./booksdb.js');
        res.status(200).json(JSON.stringify(books, null, 2));
    } catch (error) {
        res.status(500).json({ message: 'Unable to fetch books' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const books = require('./booksdb.js');
        const isbn = req.params.isbn;
        if (books[isbn]) {
            // Simulating async operation
            res.status(200).json(books[isbn]);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book by ISBN' });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const books = require('./booksdb.js');
        const author = req.params.author;
        const matchingBooks = [];
        Object.keys(books).forEach(isbn => {
            if (books[isbn].author === author) {
                matchingBooks.push(books[isbn]);
            }
        });
        if (matchingBooks.length > 0) {
            res.status(200).json(matchingBooks);
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books by author' });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const books = require('./booksdb.js');
        const title = req.params.title;
        const matchingBooks = [];
        Object.keys(books).forEach(isbn => {
            if (books[isbn].title === title) {
                matchingBooks.push(books[isbn]);
            }
        });
        if (matchingBooks.length > 0) {
            res.status(200).json(matchingBooks);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books by title' });
    }
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
