const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user to the users array
  users.push({ username, password });

  return res.status(200).json({ message: "User registered successfully" });
});

public_users.get('/', async function (req, res) {
    try {
      // Creating a promise method. The promise will get resolved when the timer times out after 6 seconds.
      let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("Promise resolved");
        }, 6000);
      });
  
      // Console log before calling the promise
      console.log("Before calling promise");
  
      // Call the promise and wait for it to be resolved and then print a message.
      myPromise.then((successMessage) => {
        console.log("From Callback: " + successMessage);
  
        // Make an API call to retrieve the book list
        axios.get('https://theophilusuz-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai./books')
          .then(response => {
            const books = response.data;
            return res.status(200).json(books);
          })
          .catch(error => {
            return res.status(500).json({ message: "Error retrieving book list" });
          });
      });
  
      // Console log after calling the promise
      console.log("After calling promise");
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving book list" });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
  
      // Creating a promise method. The promise will get resolved when the timer times out after 6 seconds.
      let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("Promise resolved");
        }, 6000);
      });
  
      // Console log before calling the promise
      console.log("Before calling promise");
  
      // Call the promise and wait for it to be resolved and then print a message.
      myPromise.then((successMessage) => {
        console.log("From Callback: " + successMessage);
  
        // Make an API call to retrieve the book details based on ISBN
        axios.get(`https://theophilusuz-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai./books/${isbn}`)
          .then(response => {
            const book = response.data;
            return res.status(200).json(book);
          })
          .catch(error => {
            return res.status(404).json({ message: "Book not found" });
          });
      });
  
      // Console log after calling the promise
      console.log("After calling promise");
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving book details" });
    }
  });


// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
  
      // Creating a promise method. The promise will get resolved when the timer times out after 6 seconds.
      let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("Promise resolved");
        }, 6000);
      });
  
      // Console log before calling the promise
      console.log("Before calling promise");
  
      // Call the promise and wait for it to be resolved and then print a message.
      myPromise.then((successMessage) => {
        console.log("From Callback: " + successMessage);
  
        // Make an API call to retrieve the book details based on author
        axios.get(`https://theophilusuz-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books?author=${author}`)
          .then(response => {
            const books = response.data;
            return res.status(200).json(books);
          })
          .catch(error => {
            return res.status(404).json({ message: "No books found for the given author" });
          });
      });
  
      // Console log after calling the promise
      console.log("After calling promise");
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving book details" });
    }
  });


// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
  
      // Creating a promise method. The promise will get resolved when the timer times out after 6 seconds.
      let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("Promise resolved");
        }, 6000);
      });
  
      // Console log before calling the promise
      console.log("Before calling promise");
  
      // Call the promise and wait for it to be resolved and then print a message.
      myPromise.then((successMessage) => {
        console.log("From Callback: " + successMessage);
  
        // Make an API call to retrieve the book details based on title
        axios.get(`https://theophilusuz-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books?title=${title}`)
          .then(response => {
            const books = response.data;
            return res.status(200).json(books);
          })
          .catch(error => {
            return res.status(404).json({ message: "No books found for the given title" });
          });
      });
  
      // Console log after calling the promise
      console.log("After calling promise");
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving book details" });
    }
  });

public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  let bookArray = Object.values(books);
  let book = bookArray.find((b) => b.isbn === isbn);
  if (book && book.reviews && book.reviews.length > 0) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for the given ISBN" });
  }
});

module.exports.general = public_users;
