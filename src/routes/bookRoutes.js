const express = require('express');
const { createBook, listBooks,barrowBook,returnBook } = require('../controllers/bookController');

const router = express.Router();

router.post('/books', createBook);
router.get('/books', listBooks);
router.post('/users/:userId/borrow/:bookId', borrowBook);
router.post('/users/:userId/return/:bookId', returnBook);

module.exports = router;
