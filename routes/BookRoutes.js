const express = require('express');
const router = express.Router();
const auth = require('../middleware/Auth');
const BookControllers = require("../controllers/BookControllers");
const multer = require('../middleware/Multer-config');
const sharp = require("../middleware/Sharp-config");

router.post('/', auth, multer, sharp, BookControllers.createBook);

router.get('/bestrating', BookControllers.bestRating);

router.get('/:id', BookControllers.getBookById);

router.put('/:id', auth, multer, sharp, BookControllers.updateBook);

router.delete('/:id', auth, BookControllers.deleteBook);

router.get('/', BookControllers.getBooks);

router.post('/:id/rating', auth, BookControllers.createRating);


module.exports = router;