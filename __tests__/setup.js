// Configuration globale pour les tests Jest
const { Sequelize } = require('sequelize');

// Configuration des variables d'environnement pour les tests
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.API_KEY = 'test-api-key-12345678901234567890123456789012';
  process.env.ALLOWED_ORIGINS = 'http://localhost:4200,http://127.0.0.1:4200';
});

// Nettoyage après les tests
afterAll(() => {
  delete process.env.API_KEY;
  delete process.env.ALLOWED_ORIGINS;
});

// Mock console pour réduire le bruit pendant les tests
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: console.error, // Garder les erreurs visibles
  };
}
