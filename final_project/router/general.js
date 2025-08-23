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
public_users.get('/books', (req, res) => {
    function fetchBooks(callback) {
        try {
            const books = require('./booksdb.js');
            callback(null, books);
        } catch (error) {
            callback(error);
        }
    }

    fetchBooks((err, data) => {
        if (err) {
            res.status(500).json({ message: 'Unable to fetch books', error: err.message });
            return;
        }
        res.status(200).json(data);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    function findBookByISBN(isbn) {
        return new Promise((resolve, reject) => {
            try {
                const books = require('./booksdb.js');
                const book = books[isbn];
                if (book) {
                    resolve(book);
                } else {
                    reject(new Error('Book not found'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    findBookByISBN(isbn)
        .then(book => {
            res.status(200).json(book);
        })
        .catch(error => {
            if (error.message === 'Book not found') {
                res.status(404).json({ message: 'Book not found with this ISBN' });
            } else {
                res.status(500).json({ message: 'Error fetching book by ISBN', error: error.message });
            }
        });
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
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    const reviews = book.reviews || {};
    if (Object.keys(reviews).length === 0) {
        return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json(reviews);
});

module.exports.general = public_users;
