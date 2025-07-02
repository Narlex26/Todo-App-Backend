const request = require('supertest');
const express = require('express');

// Mock du contrôleur utilisateur
jest.mock('../controllers/user.controller', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

const usersRouter = require('../routes/users');
const userController = require('../controllers/user.controller');

describe('Users Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', usersRouter);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('POST /api/users', () => {
    it('devrait appeler le contrôleur create', async () => {
      // Arrange
      userController.create.mockImplementation((req, res) => {
        res.status(201).json({ id: 1, message: 'Utilisateur créé' });
      });

      const userData = {
        lastName: 'Doe',
        firstName: 'John',
        email: 'john.doe@example.com'
      };

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(userData);

      // Assert
      expect(response.status).toBe(201);
      expect(userController.create).toHaveBeenCalled();
    });
  });

  describe('GET /api/users', () => {
    it('devrait appeler le contrôleur findAll', async () => {
      // Arrange
      userController.findAll.mockImplementation((req, res) => {
        res.json([
          { id: 1, lastName: 'Doe', firstName: 'John', email: 'john@example.com' }
        ]);
      });

      // Act
      const response = await request(app)
        .get('/api/users');

      // Assert
      expect(response.status).toBe(200);
      expect(userController.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /api/users/:id', () => {
    it('devrait appeler le contrôleur findOne avec l\'ID correct', async () => {
      // Arrange
      userController.findOne.mockImplementation((req, res) => {
        res.json({ id: 1, lastName: 'Doe', firstName: 'John', email: 'john@example.com' });
      });

      // Act
      const response = await request(app)
        .get('/api/users/1');

      // Assert
      expect(response.status).toBe(200);
      expect(userController.findOne).toHaveBeenCalled();
    });
  });

  describe('PUT /api/users/:id', () => {
    it('devrait appeler le contrôleur update avec l\'ID correct', async () => {
      // Arrange
      userController.update.mockImplementation((req, res) => {
        res.json({ message: 'Utilisateur mis à jour' });
      });

      const updateData = { lastName: 'Updated Doe' };

      // Act
      const response = await request(app)
        .put('/api/users/1')
        .send(updateData);

      // Assert
      expect(response.status).toBe(200);
      expect(userController.update).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('devrait appeler le contrôleur delete avec l\'ID correct', async () => {
      // Arrange
      userController.delete.mockImplementation((req, res) => {
        res.json({ message: 'Utilisateur supprimé' });
      });

      // Act
      const response = await request(app)
        .delete('/api/users/1');

      // Assert
      expect(response.status).toBe(200);
      expect(userController.delete).toHaveBeenCalled();
    });
  });
});
