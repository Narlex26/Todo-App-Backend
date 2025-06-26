const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user.controller');


// Créer un nouvel utilisateur
router.post('/', usersController.create);


// Récupérer tous les utilisateurs
router.get('/', usersController.findAll);


// Récupérer un seul utilisateur avec id
router.get('/:id', usersController.findOne);


// Mettre à jour un utilisateur avec id
router.put('/:id', usersController.update);


// Supprimer un utilisateur avec id
router.delete('/:id', usersController.delete);


module.exports = router;
