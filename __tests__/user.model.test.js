const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('../models/user.model');

describe('User Model', () => {
  let sequelize;
  let User;

  beforeAll(async () => {
    // Configuration d'une base de données SQLite en mémoire pour les tests
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false // Désactiver les logs SQL pendant les tests
    });

    User = userModel(sequelize, DataTypes);

    // Synchroniser la base de données
    await sequelize.sync();
  });

  beforeEach(async () => {
    // Nettoyer les données avant chaque test
    await User.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  describe('Définition du modèle', () => {
    it('devrait avoir les bonnes propriétés', () => {
      const attributes = Object.keys(User.rawAttributes);

      expect(attributes).toContain('id');
      expect(attributes).toContain('lastName');
      expect(attributes).toContain('firstName');
      expect(attributes).toContain('email');
    });

    it('devrait avoir id comme clé primaire auto-incrémentée', () => {
      const idAttribute = User.rawAttributes.id;

      expect(idAttribute.primaryKey).toBe(true);
      expect(idAttribute.autoIncrement).toBe(true);
      expect(idAttribute.type).toBeInstanceOf(DataTypes.INTEGER);
    });

    it('devrait avoir lastName comme champ obligatoire', () => {
      const lastNameAttribute = User.rawAttributes.lastName;

      expect(lastNameAttribute.allowNull).toBe(false);
      expect(lastNameAttribute.type).toBeInstanceOf(DataTypes.STRING);
    });

    it('devrait avoir firstName comme champ obligatoire', () => {
      const firstNameAttribute = User.rawAttributes.firstName;

      expect(firstNameAttribute.allowNull).toBe(false);
      expect(firstNameAttribute.type).toBeInstanceOf(DataTypes.STRING);
    });

    it('devrait avoir email comme champ obligatoire, unique avec validation', () => {
      const emailAttribute = User.rawAttributes.email;

      expect(emailAttribute.allowNull).toBe(false);
      expect(emailAttribute.unique).toBe(true);
      expect(emailAttribute.type).toBeInstanceOf(DataTypes.STRING);
      expect(emailAttribute.validate).toBeDefined();
      expect(emailAttribute.validate.isEmail).toBe(true);
    });
  });

  describe('Création d\'utilisateur', () => {
    it('devrait créer un utilisateur avec des données valides', async () => {
      const userData = {
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com'
      };

      const user = await User.create(userData);

      expect(user.id).toBeDefined();
      expect(user.lastName).toBe('Doe');
      expect(user.firstName).toBe('John');
      expect(user.email).toBe('john.doe@example.com');
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('devrait échouer si lastName est manquant', async () => {
      const userData = {
        firstName: 'John',
        email: 'john.doe@example.com'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('devrait échouer si firstName est manquant', async () => {
      const userData = {
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('devrait échouer si email est manquant', async () => {
      const userData = {
        lastName: 'Doe',
        firstName: 'John'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('devrait échouer avec un email invalide', async () => {
      const userData = {
        lastName: 'Doe',
        firstName: 'John',
        email: 'email-invalide'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('devrait échouer si l\'email existe déjà', async () => {
      const userData1 = {
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com'
      };

      const userData2 = {
        lastName: 'Smith',
        firstName: 'Jane',
        email: 'john.doe@example.com' // Même email
      };

      await User.create(userData1);
      await expect(User.create(userData2)).rejects.toThrow();
    });
  });

  describe('Opérations CRUD', () => {
    let createdUser;

    beforeEach(async () => {
      createdUser = await User.create({
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com'
      });
    });

    it('devrait trouver un utilisateur par ID', async () => {
      const foundUser = await User.findByPk(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(createdUser.id);
      expect(foundUser.email).toBe('john.doe@example.com');
    });

    it('devrait mettre à jour un utilisateur', async () => {
      await User.update(
        { lastName: 'UpdatedDoe' },
        { where: { id: createdUser.id } }
      );

      const updatedUser = await User.findByPk(createdUser.id);
      expect(updatedUser.lastName).toBe('UpdatedDoe');
    });

    it('devrait supprimer un utilisateur', async () => {
      await User.destroy({ where: { id: createdUser.id } });

      const deletedUser = await User.findByPk(createdUser.id);
      expect(deletedUser).toBeNull();
    });

    it('devrait trouver tous les utilisateurs', async () => {
      await User.create({
        lastName: 'Smith',
        firstName: 'Jane',
        email: 'jane.smith@example.com'
      });

      const users = await User.findAll();
      expect(users.length).toBe(2);
    });
  });
});
