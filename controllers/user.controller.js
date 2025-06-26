const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

// Créer et sauvegarder un nouvel utilisateur
exports.create = (req, res) => {
  // Valider la requête
  if (!req.body.lastName || !req.body.firstName || !req.body.email) {
    res.status(400).send({
      message: "Le nom, prénom et email sont obligatoires!"
    });
    return;
  }

  // Créer un utilisateur
  const user = {
    name: req.body.name,
    firstName: req.body.firstName,
    email: req.body.email
  };

  // Sauvegarder l'utilisateur dans la base de données
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur s'est produite lors de la création de l'utilisateur."
      });
    });
};

// Récupérer tous les utilisateurs de la base de données
exports.findAll = (req, res) => {
  User.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur s'est produite lors de la récupération des utilisateurs."
      });
    });
};

// Trouver un seul utilisateur avec un id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Utilisateur avec id=${id} non trouvé.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la récupération de l'utilisateur avec id=" + id
      });
    });
};

// Mettre à jour un utilisateur identifié par l'id dans la requête
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "L'utilisateur a été mis à jour avec succès."
        });
      } else {
        res.send({
          message: `Impossible de mettre à jour l'utilisateur avec id=${id}. L'utilisateur n'a peut-être pas été trouvé ou req.body est vide!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour de l'utilisateur avec id=" + id
      });
    });
};

// Supprimer un utilisateur avec l'id spécifié dans la requête
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "L'utilisateur a été supprimé avec succès!"
        });
      } else {
        res.send({
          message: `Impossible de supprimer l'utilisateur avec id=${id}. L'utilisateur n'a peut-être pas été trouvé!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la suppression de l'utilisateur avec id=" + id
      });
    });
};
