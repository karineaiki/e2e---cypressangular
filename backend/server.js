const express = require("express");
const bookController = require("./book.controller");
const cors = require("cors");

// Créer une application Express
const app = express();
app.use(cors());

// Middleware pour analyser les requêtes JSON
app.use(express.json());

const bookService = require("./book.service.js");
const sampleBook = {
  title: "La vie de Michel",
  author: "Michel",
  availableCopies: 5,
  totalCopies: 5,
}
bookService.createBook(sampleBook, (err) => {
  console.error(err);
});

// Définir les routes pour l'API des livres
app.use("/books", bookController);

// Définir le port sur lequel le serveur écoute
const PORT = 3000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Exporter l'application pour les tests d'intégration
module.exports = app;
