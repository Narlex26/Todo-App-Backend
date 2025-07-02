const sinon = require('sinon');

// Mock de la base de données avec tous les éléments nécessaires
jest.mock('../models', () => ({
  users: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Sequelize: { Op: {} }
}));

const userController = require('../controllers/user.controller');
const db = require('../models');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('devrait créer un utilisateur avec des données valides', async () => {
      // Arrange
      req.body = {
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com'
      };

      const mockUserData = { id: 1, ...req.body };
      db.users.create.mockResolvedValue(mockUserData);

      // Act
      await userController.create(req, res);

      // Assert
      expect(db.users.create).toHaveBeenCalledWith({
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com'
      });
      expect(res.send).toHaveBeenCalledWith(mockUserData);
    });

    it('devrait retourner une erreur 400 si le nom est manquant', async () => {
      // Arrange
      req.body = {
        firstName: 'John',
        email: 'john.doe@example.com'
      };

      // Act
      await userController.create(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Le nom, prénom et email sont obligatoires!"
      });
    });

    it('devrait retourner une erreur 400 si le prénom est manquant', async () => {
      // Arrange
      req.body = {
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      // Act
      await userController.create(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Le nom, prénom et email sont obligatoires!"
      });
    });

    it('devrait retourner une erreur 400 si l\'email est manquant', async () => {
      // Arrange
      req.body = {
        lastName: 'Doe',
        firstName: 'John'
      };

      // Act
      await userController.create(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Le nom, prénom et email sont obligatoires!"
      });
    });

    it('devrait gérer les erreurs de base de données', (done) => {
      // Arrange
      req.body = {
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com'
      };

      const dbError = new Error('Erreur de base de données');
      db.users.create.mockRejectedValue(dbError);

      // Act
      userController.create(req, res);

      // Assert avec timeout pour laisser le temps à la promesse de se résoudre
      setTimeout(() => {
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
          message: "Erreur de base de données"
        });
        done();
      }, 10);
    });
  });

  describe('findAll', () => {
    it('devrait retourner tous les utilisateurs', async () => {
      // Arrange
      const mockUsers = [
        { id: 1, lastName: 'Doe', firstName: 'John', email: 'john@example.com' },
        { id: 2, lastName: 'Smith', firstName: 'Jane', email: 'jane@example.com' }
      ];
      db.users.findAll.mockResolvedValue(mockUsers);

      // Act
      await userController.findAll(req, res);

      // Assert
      expect(db.users.findAll).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(mockUsers);
    });

    it('devrait gérer les erreurs de base de données', (done) => {
      // Arrange
      const dbError = new Error('Erreur de connexion');
      db.users.findAll.mockRejectedValue(dbError);

      // Act
      userController.findAll(req, res);

      // Assert avec timeout
      setTimeout(() => {
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
          message: "Erreur de connexion"
        });
        done();
      }, 10);
    });
  });

  describe('findOne', () => {
    it('devrait retourner un utilisateur par son ID', async () => {
      // Arrange
      req.params.id = '1';
      const mockUserData = { id: 1, lastName: 'Doe', firstName: 'John', email: 'john@example.com' };
      db.users.findByPk.mockResolvedValue(mockUserData);

      // Act
      await userController.findOne(req, res);

      // Assert
      expect(db.users.findByPk).toHaveBeenCalledWith('1');
      expect(res.send).toHaveBeenCalledWith(mockUserData);
    });

    it('devrait retourner 404 si l\'utilisateur n\'existe pas', async () => {
      // Arrange
      req.params.id = '999';
      db.users.findByPk.mockResolvedValue(null);

      // Act
      await userController.findOne(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Utilisateur avec id=999 non trouvé."
      });
    });

    it('devrait gérer les erreurs de base de données', (done) => {
      // Arrange
      req.params.id = '1';
      const dbError = new Error('Erreur de base de données');
      db.users.findByPk.mockRejectedValue(dbError);

      // Act
      userController.findOne(req, res);

      // Assert avec timeout
      setTimeout(() => {
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
          message: "Erreur lors de la récupération de l'utilisateur avec id=1"
        });
        done();
      }, 10);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un utilisateur existant', async () => {
      // Arrange
      req.params.id = '1';
      req.body = { lastName: 'UpdatedDoe' };
      db.users.update.mockResolvedValue([1]);

      // Act
      await userController.update(req, res);

      // Assert
      expect(db.users.update).toHaveBeenCalledWith(req.body, { where: { id: '1' } });
      expect(res.send).toHaveBeenCalledWith({
        message: "L'utilisateur a été mis à jour avec succès."
      });
    });

    it('devrait retourner un message si aucun utilisateur n\'a été mis à jour', async () => {
      // Arrange
      req.params.id = '999';
      req.body = { lastName: 'UpdatedDoe' };
      db.users.update.mockResolvedValue([0]);

      // Act
      await userController.update(req, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith({
        message: "Impossible de mettre à jour l'utilisateur avec id=999. L'utilisateur n'a peut-être pas été trouvé ou req.body est vide!"
      });
    });

    it('devrait gérer les erreurs de base de données', (done) => {
      // Arrange
      req.params.id = '1';
      req.body = { lastName: 'UpdatedDoe' };
      const dbError = new Error('Erreur de mise à jour');
      db.users.update.mockRejectedValue(dbError);

      // Act
      userController.update(req, res);

      // Assert avec timeout
      setTimeout(() => {
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
          message: "Erreur lors de la mise à jour de l'utilisateur avec id=1"
        });
        done();
      }, 10);
    });
  });

  describe('delete', () => {
    it('devrait supprimer un utilisateur existant', async () => {
      // Arrange
      req.params.id = '1';
      db.users.destroy.mockResolvedValue(1);

      // Act
      await userController.delete(req, res);

      // Assert
      expect(db.users.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(res.send).toHaveBeenCalledWith({
        message: "L'utilisateur a été supprimé avec succès!"
      });
    });

    it('devrait retourner un message si aucun utilisateur n\'a été supprimé', async () => {
      // Arrange
      req.params.id = '999';
      db.users.destroy.mockResolvedValue(0);

      // Act
      await userController.delete(req, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith({
        message: "Impossible de supprimer l'utilisateur avec id=999. L'utilisateur n'a peut-être pas été trouvé!"
      });
    });

    it('devrait gérer les erreurs de base de données', (done) => {
      // Arrange
      req.params.id = '1';
      const dbError = new Error('Erreur de suppression');
      db.users.destroy.mockRejectedValue(dbError);

      // Act
      userController.delete(req, res);

      // Assert avec timeout
      setTimeout(() => {
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
          message: "Erreur lors de la suppression de l'utilisateur avec id=1"
        });
        done();
      }, 10);
    });
  });
});
