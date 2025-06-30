const { verifyApiKey, verifyUserAgent } = require('../middleware/auth.middleware');
const createError = require('http-errors');
const sinon = require('sinon');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      query: {}
    };
    res = {};
    next = sinon.stub();

    // Reset environment variables
    delete process.env.API_KEY;
    delete process.env.NODE_ENV;
  });

  describe('verifyApiKey', () => {
    it('devrait passer avec une API key valide dans les headers', () => {
      // Arrange
      process.env.API_KEY = 'valid-api-key';
      req.headers['x-api-key'] = 'valid-api-key';

      // Act
      verifyApiKey(req, res, next);

      // Assert
      expect(next.calledOnce).toBe(true);
      expect(next.calledWith()).toBe(true); // appelé sans arguments = succès
    });

    it('devrait passer avec une API key valide dans les query params', () => {
      // Arrange
      process.env.API_KEY = 'valid-api-key';
      req.query.apiKey = 'valid-api-key';

      // Act
      verifyApiKey(req, res, next);

      // Assert
      expect(next.calledOnce).toBe(true);
      expect(next.calledWith()).toBe(true);
    });

    it('devrait retourner une erreur 500 si API_KEY n\'est pas configurée', () => {
      // Arrange
      // API_KEY n'est pas définie
      req.headers['x-api-key'] = 'some-key';

      // Act
      verifyApiKey(req, res, next);

      // Assert
      expect(next.calledOnce).toBe(true);
      const error = next.getCall(0).args[0];
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(500);
      expect(error.message).toBe('Configuration serveur manquante');
    });

    it('devrait retourner une erreur 401 si l\'API key est manquante', () => {
      // Arrange
      process.env.API_KEY = 'valid-api-key';
      // Pas d'API key dans la requête

      // Act
      verifyApiKey(req, res, next);

      // Assert
      expect(next.calledOnce).toBe(true);
      const error = next.getCall(0).args[0];
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(401);
      expect(error.message).toBe('API Key manquante');
    });

    it('devrait retourner une erreur 403 si l\'API key est invalide', () => {
      // Arrange
      process.env.API_KEY = 'valid-api-key';
      req.headers['x-api-key'] = 'invalid-api-key';

      // Act
      verifyApiKey(req, res, next);

      // Assert
      expect(next.calledOnce).toBe(true);
      const error = next.getCall(0).args[0];
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(403);
      expect(error.message).toBe('API Key invalide');
    });

    it('devrait prioriser l\'API key des headers sur celle des query params', () => {
      // Arrange
      process.env.API_KEY = 'valid-api-key';
      req.headers['x-api-key'] = 'valid-api-key';
      req.query.apiKey = 'invalid-api-key';

      // Act
      verifyApiKey(req, res, next);

      // Assert
      expect(next.calledOnce).toBe(true);
      expect(next.calledWith()).toBe(true); // succès avec la clé des headers
    });
  });

  describe('verifyUserAgent', () => {
    it('devrait passer avec un User-Agent valide', () => {
      // Arrange
      req.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

      // Act
      verifyUserAgent(req, res, next);

      // Assert
      expect(next.calledOnce).toBe(true);
      expect(next.calledWith()).toBe(true);
    });

    it('devrait passer si pas de User-Agent en développement', () => {
      // Arrange
      process.env.NODE_ENV = 'development';
      // Pas de user-agent

      // Act
      verifyUserAgent(req, res, next);

      // Assert
      expect(next.calledOnce).toBe(true);
      expect(next.calledWith()).toBe(true);
    });

    it('devrait bloquer curl en production', () => {
      // Arrange
      process.env.NODE_ENV = 'production';
      req.headers['user-agent'] = 'curl/7.68.0';

      // Act
      verifyUserAgent(req, res, next);

      // Assert
      expect(next.calledOnce).toBe(true);
      const error = next.getCall(0).args[0];
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(403);
      expect(error.message).toBe('User-Agent non autorisé');
    });

    it('devrait bloquer wget en production', () => {
      // Arrange
      process.env.NODE_ENV = 'production';
      req.headers['user-agent'] = 'Wget/1.20.3 (linux-gnu)';

      // Act
      verifyUserAgent(req, res, next);

      // Assert
      expect(next.calledOnce).toBe(true);
      const error = next.getCall(0).args[0];
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(403);
      expect(error.message).toBe('User-Agent non autorisé');
    });

    it('devrait bloquer python-requests en production', () => {
      // Arrange
      process.env.NODE_ENV = 'production';
      req.headers['user-agent'] = 'python-requests/2.25.1';

      // Act
      verifyUserAgent(req, res, next);

      // Assert
      expect(next.calledOnce).toBe(true);
      const error = next.getCall(0).args[0];
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(403);
      expect(error.message).toBe('User-Agent non autorisé');
    });

    it('devrait permettre curl en développement', () => {
      // Arrange
      process.env.NODE_ENV = 'development';
      req.headers['user-agent'] = 'curl/7.68.0';

      // Act
      verifyUserAgent(req, res, next);

      // Assert
      expect(next.calledOnce).toBe(true);
      expect(next.calledWith()).toBe(true);
    });

    it('devrait être insensible à la casse pour les User-Agents bloqués', () => {
      // Arrange
      process.env.NODE_ENV = 'production';
      req.headers['user-agent'] = 'CURL/7.68.0';

      // Act
      verifyUserAgent(req, res, next);

      // Assert
      expect(next.calledOnce).toBe(true);
      const error = next.getCall(0).args[0];
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(403);
      expect(error.message).toBe('User-Agent non autorisé');
    });
  });
});
