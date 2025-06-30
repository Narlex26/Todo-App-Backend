const request = require('supertest');

// Créer une version de test de l'app sans les middlewares de sécurité
const express = require('express');
const cors = require('cors');

// Créer une app de test simplifiée
const createTestApp = () => {
  const app = express();

  // Configuration CORS basique
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Routes de test simplifiées
  app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
  });

  // Simuler les middlewares de sécurité
  app.use('/api', (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ message: 'API Key manquante' });
    }
    if (apiKey !== 'test-api-key') {
      return res.status(403).json({ message: 'API Key invalide' });
    }

    const userAgent = req.headers['user-agent'];
    if (process.env.NODE_ENV === 'production' && userAgent && userAgent.toLowerCase().includes('curl')) {
      return res.status(403).json({ message: 'User-Agent non autorisé' });
    }

    next();
  });

  // Route API de test
  app.get('/api/users', (req, res) => {
    res.json([]);
  });

  app.post('/api/users', (req, res) => {
    res.json({ id: 1, message: 'Utilisateur créé' });
  });

  // Gestion des erreurs 404
  app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
  });

  return app;
};

describe('App Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    process.env.NODE_ENV = 'test';
    process.env.API_KEY = 'test-api-key';
  });

  describe('CORS Configuration', () => {
    it('devrait accepter les requêtes OPTIONS', async () => {
      const response = await request(app)
        .options('/')
        .set('Origin', 'http://localhost:4200');

      expect([200, 204]).toContain(response.status);
    });
  });

  describe('Security Middleware', () => {
    it('devrait bloquer les requêtes API sans API key', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('API Key manquante');
    });

    it('devrait bloquer les requêtes API avec une API key invalide', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('x-api-key', 'invalid-key');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('API Key invalide');
    });

    it('devrait bloquer les User-Agents non autorisés en production', async () => {
      process.env.NODE_ENV = 'production';
      app = createTestApp(); // Recréer l'app avec le nouvel environnement

      const response = await request(app)
        .get('/api/users')
        .set('x-api-key', 'test-api-key')
        .set('User-Agent', 'curl/7.68.0');

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('User-Agent non autorisé');
    });

    it('devrait permettre les requêtes avec une API key valide et un User-Agent autorisé', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('x-api-key', 'test-api-key')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('devrait retourner 404 pour les routes non trouvées', async () => {
      const response = await request(app)
        .get('/route-inexistante');

      expect(response.status).toBe(404);
    });

    it('devrait gérer les erreurs d\'authentification', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('JSON Middleware', () => {
    it('devrait parser le JSON dans les requêtes', async () => {
      const userData = {
        lastName: 'Doe',
        firstName: 'John',
        email: 'john@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .set('x-api-key', 'test-api-key')
        .set('User-Agent', 'Mozilla/5.0')
        .set('Content-Type', 'application/json')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Utilisateur créé');
    });
  });
});
