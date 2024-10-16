// Import du plugin 'password-validator'

const passwordValidator = require("password-validator");

// Création du schéma de mot de passe

const schemaPassword = new passwordValidator();

// Propriétés du schéma de mot de passe

schemaPassword
  .is()
  .min(8) // Minimum de 8 caractères
  .is()
  .max(100) // Maximum de 100 caractères
  .has()
  .lowercase() // Doit contenir des minuscules
  .has()
  .uppercase(1) // Doit contenir au moins 1 majuscule
  .has()
  .digits(2) // Doit contenir au moins 2 chiffres
  .has()
  .symbols(1) // Doit contenir au moins un caractères spécial
  .has()
  .not()
  .spaces(); // Should not have spaces

// Création de la fonction de validité du mot de passe

const isPasswordValid = (password) => schemaPassword.validate(password);

// Création de la fonction retournant les messages de validation

const validationMessages = (password) => {
  let messages = "";

  const arr = schemaPassword.validate(password, { details: true });

  for (let i = 0; i < arr.length; i++) {
    messages += arr[i].message + " *** ";
  }

  return messages;
};

// Exports

module.exports = { isPasswordValid, validationMessages };
