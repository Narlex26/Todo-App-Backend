const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const { backendLogger } = require('../logger'); // Ajout du logger

// Créer et sauvegarder un nouvel utilisateur
exports.create = (req, res) => {
  if (!req.body.lastName || !req.body.firstName || !req.body.email) {
    backendLogger.warn('Tentative de création avec des champs manquants', { body: req.body });

    res.status(400).send({
      message: "Le nom, prénom et email sont obligatoires!"
    });
    return;
  }

  const user = {
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    email: req.body.email
  };

  User.create(user)
    .then(data => {
      backendLogger.info('Utilisateur créé avec succès', { user: data });
      res.send(data);
    })
    .catch(err => {
      backendLogger.error('Erreur lors de la création de l’utilisateur', { error: err.message, body: req.body });
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la création de l'utilisateur."
      });
    });
};

// Récupérer tous les utilisateurs de la base de données
exports.findAll = (req, res) => {
  User.findAll()
    .then(data => {
      backendLogger.info('Liste des utilisateurs récupérée', { count: data.length });
      res.send(data);
    })
    .catch(err => {
      backendLogger.error('Erreur lors de la récupération des utilisateurs', { error: err.message });
      res.status(500).send({
        message: err.message || "Une erreur s'est produite lors de la récupération des utilisateurs."
      });
    });
};

// Trouver un seul utilisateur avec un id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      if (data) {
        backendLogger.info('Utilisateur trouvé', { userId: id });
        res.send(data);
      } else {
        backendLogger.warn('Utilisateur non trouvé', { userId: id });
        res.status(404).send({
          message: `Utilisateur avec id=${id} non trouvé.`
        });
      }
    })
    .catch(err => {
      backendLogger.error('Erreur lors de la récupération de l’utilisateur', { userId: id, error: err.message });
      res.status(500).send({
        message: "Erreur lors de la récupération de l'utilisateur avec id=" + id
      });
    });
};

// Mettre à jour un utilisateur
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        backendLogger.info("Utilisateur mis à jour avec succès", { userId: id, updates: req.body });
        res.send({ message: "L'utilisateur a été mis à jour avec succès." });
      } else {
        backendLogger.warn("Échec de mise à jour", { userId: id, body: req.body });
        res.send({
          message: `Impossible de mettre à jour l'utilisateur avec id=${id}.`
        });
      }
    })
    .catch(err => {
      backendLogger.error("Erreur lors de la mise à jour de l’utilisateur", { userId: id, error: err.message });
      res.status(500).send({
        message: "Erreur lors de la mise à jour de l'utilisateur avec id=" + id
      });
    });
};

// Supprimer un utilisateur
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({ where: { id: id } })
    .then(num => {
      if (num == 1) {
        backendLogger.info("Utilisateur supprimé avec succès", { userId: id });
        res.send({ message: "L'utilisateur a été supprimé avec succès!" });
      } else {
        backendLogger.warn("Échec de suppression", { userId: id });
        res.send({
          message: `Impossible de supprimer l'utilisateur avec id=${id}.`
        });
      }
    })
    .catch(err => {
      backendLogger.error("Erreur lors de la suppression de l’utilisateur", { userId: id, error: err.message });
      res.status(500).send({
        message: "Erreur lors de la suppression de l'utilisateur avec id=" + id
      });
    });
};
