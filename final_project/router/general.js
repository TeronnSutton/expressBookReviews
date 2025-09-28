const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// User registration
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        // Simulate async operation, e.g., fetching from DB or file
        const bookList = await new Promise((resolve, reject) => {
            resolve(books);
        });
        res.send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    try {

        const bookDetails = await new Promise((resolve, reject) => {
            if (book[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found");
            }
        });

        res.send(bookDetails);
    }   catch (error) {
            res.status(404).json({ message: error});
    }

});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();
    const filteredBooks = [];

    try {
        // Simulate async operation to get books by author
        const filteredBooks = await new Promise((resolve, reject) => {
            const results = [];
            for (let key in books) {
                if (books[key].author.toLowerCase() === author) {
                    results.push(books[key]);
                }
            }
            if (results.length > 0) {
                resolve(results);
            } else {
                reject("No books found for this author");
            }
        });

        res.send(filteredBooks);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();
    const filteredBooks = [];

    try {
        // Simulate async operation to get books by title
        const filteredBooks = await new Promise((resolve, reject) => {
            const results = [];
            for (let key in books) {
                if (books[key].title.toLowerCase() === title) {
                    results.push(books[key]);
                }
            }
            if (results.length > 0) {
                resolve(results);
            } else {
                reject("No books found with this title");
            }
        });

        res.send(filteredBooks);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        res.send(JSON.stringify(book.reviews, null, 4));
    } else if (book) {
        res.json({ message: "No reviews available for this book" });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});



module.exports.general = public_users;