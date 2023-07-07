const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Access token not found' });
    }
  
    jwt.verify(token, 'secretKey', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  };
let users = [];

const isValid = (username) => {
  // Write code to check if the username is valid
  // For example, you can check if the username exists in the users array
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Write code to check if the username and password match the one we have in records
  // For example, you can iterate over the users array and validate the credentials
  return users.some((user) => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }


  // Check if the credentials are authenticated
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate and sign the JWT token
  const token = jwt.sign({ username }, "secretKey");

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const { username } = jwt.decode(req.headers.authorization.split(' ')[1]);
  
    let bookArray = Object.values(books);
    let book = bookArray.find((b) => b.isbn === isbn);
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    let reviewIndex = book.reviews.findIndex((r) => r.username === username);
  
    if (reviewIndex !== -1) {
      // If the user has already posted a review, modify the existing review
      book.reviews[reviewIndex].review = review;
      return res.status(200).json({ message: "Review modified successfully" });
    } else {
      // If it's a new review, add it to the book's reviews array
      book.reviews.push({ username, review });
      return res.status(200).json({ message: "Review added successfully" });
    }
  });
  
 // Delete a book review
 regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
    const { isbn } = req.params;
  const { username } = jwt.decode(req.headers.authorization.split(' ')[1]);

  let bookArray = Object.values(books);
  let book = bookArray.find((b) => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  let reviewIndex = book.reviews.findIndex((r) => r.username === username);

  if (reviewIndex !== -1) {
    // If the user has posted a review, remove it from the book's reviews array
    book.reviews.splice(reviewIndex, 1);
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
