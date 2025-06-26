const db = require("../models");
const Member = db.members;
const Op = db.Sequelize.Op;

// Créer et sauvegarder un nouveau membre
exports.create = (req, res) => {
  // Valider la requête
  if (!req.body.nom || !req.body.prenom || !req.body.email) {
    res.status(400).send({
      message: "Le nom, prénom et email sont obligatoires!"
    });
    return;
  }

  // Créer un membre
  const member = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email
  };

  // Sauvegarder le membre dans la base de données
  Member.create(member)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur s'est produite lors de la création du membre."
      });
    });
};

// Récupérer tous les membres de la base de données
exports.findAll = (req, res) => {
  Member.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur s'est produite lors de la récupération des membres."
      });
    });
};

// Trouver un seul membre avec un id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Member.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Membre avec id=${id} non trouvé.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la récupération du membre avec id=" + id
      });
    });
};

// Mettre à jour un membre identifié par l'id dans la requête
exports.update = (req, res) => {
  const id = req.params.id;

  Member.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Le membre a été mis à jour avec succès."
        });
      } else {
        res.send({
          message: `Impossible de mettre à jour le membre avec id=${id}. Le membre n'a peut-être pas été trouvé ou req.body est vide!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour du membre avec id=" + id
      });
    });
};

// Supprimer un membre avec l'id spécifié dans la requête
exports.delete = (req, res) => {
  const id = req.params.id;

  Member.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Le membre a été supprimé avec succès!"
        });
      } else {
        res.send({
          message: `Impossible de supprimer le membre avec id=${id}. Le membre n'a peut-être pas été trouvé!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la suppression du membre avec id=" + id
      });
    });
};
