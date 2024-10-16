const validator = require("validator");

// Création de la fonction de la validité de l'email

const isEmailValid = (email) => validator.isEmail(email);

// Exports

module.exports = isEmailValid;
