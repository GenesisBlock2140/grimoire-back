const Book = require("../models/Book");
const fs = require('fs');

exports.createBook = (req, res, next) => {

  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/optimized/${req.file.filename}`,
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré'}))
    .catch(error => res.status(400).json({ error }));
}

exports.getBookById = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
}

exports.updateBook = (req, res, next) => {

  Book.findOne({ _id: req.params.id })
  .then((book) => {

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Non autorisé à modifier ce livre.' });
    }

    const updatedBook = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get('host')}/images/optimized/${req.file.filename}`,
        }
      : { ...req.body };

    // Si une nouvelle image est fournie, supprimer l'ancienne
    if (req.file) {
      const oldImagePath = book.imageUrl.split('/images/optimized/')[1];
      fs.unlink(`images/optimized/${oldImagePath}`, (err) => {
        if (err) console.error('Erreur lors de la suppression de l\'ancienne image :', err);
      });
    }

    Book.updateOne({ _id: req.params.id }, { ...updatedBook, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Livre modifié !' }))
      .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(400).json({ error }));

}

exports.deleteBook = (req, res, next) => {

  Book.findOne({ _id: req.params.id })
  .then((book) => {

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce livre.' });
    }

    const imagePath = book.imageUrl.split('/images/optimized/')[1];
    fs.unlink(`images/optimized/${imagePath}`, (err) => {
      if (err) console.error('Erreur lors de la suppression de l\'image :', err);
    });

    Book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
      .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));

}

exports.getBooks = (req, res, next) => {
  Book.find()
  .then(books => res.status(200).json(books))
  .catch(error => res.status(400).json({ error}));
}

exports.createRating = (req, res, next) => {
  if (req.body.rating >= 0 && req.body.rating <= 5) {
    delete req.body.id;
    delete req.body.userId;
    
    Book.findOne({_id: req.params.id})
    .then(book => {
      if (book.ratings.filter(rating => rating.userId === req.auth.userId).length > 0) {
        res.status(403).json({ message : "Livre déja noté par l'utilisateur" });
      }
      const newRatingList =  [...book.ratings];

      newRatingList.push({
        userId: req.auth.userId,
        grade: req.body.rating
      })

      const averageGrades = (newRatingList.reduce((sum, rating) => sum + rating.grade, 0) / newRatingList.length).toFixed(1);

      Book.updateOne({ _id: req.params.id }, { ratings: newRatingList, averageRating: averageGrades, _id: req.params.id })
      .then(() => { res.status(201).json({
        ...book._doc,
        id: book._doc._id,
        averageRating: Number(averageGrades),
      })})
      .catch(error => { res.status(400).json( { error })});
    })
    .catch((error) => {
      res.status(404).json({ error });
  });
  }
}

exports.bestRating = (req, res, next) => {
  Book.find().sort({ averageRating: -1 }).limit(3)
  .then((bestBooks) => {
    res.status(200).json(bestBooks);
  })
  .catch((error) => res.status(404).json({ error }));
};