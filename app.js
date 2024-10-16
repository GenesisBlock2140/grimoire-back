const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()

const app = express();
const path = require('path');

const BookRoutes = require("./routes/BookRoutes");
const UserRoutes = require("./routes/UserRoutes");

app.use(cors());

mongoose.connect(process.env.MONGOOSE_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());
app.use('/api/books', BookRoutes);
app.use('/api/auth', UserRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;