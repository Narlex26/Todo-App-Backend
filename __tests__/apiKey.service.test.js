const ApiKeyService = require('../services/apiKey.service');
const crypto = require('crypto');

describe('ApiKeyService', () => {
  describe('generateApiKey', () => {
    it('devrait générer une API key avec la longueur par défaut (32 bytes = 64 caractères hex)', () => {
      const apiKey = ApiKeyService.generateApiKey();

      expect(typeof apiKey).toBe('string');
      expect(apiKey.length).toBe(64); // 32 bytes * 2 (hex encoding)
      expect(/^[a-f0-9]+$/i.test(apiKey)).toBe(true);
    });

    it('devrait générer une API key avec une longueur personnalisée', () => {
      const length = 16;
      const apiKey = ApiKeyService.generateApiKey(length);

      expect(apiKey.length).toBe(length * 2); // length * 2 pour l'encodage hex
      expect(/^[a-f0-9]+$/i.test(apiKey)).toBe(true);
    });

    it('devrait générer des API keys différentes à chaque appel', () => {
      const apiKey1 = ApiKeyService.generateApiKey();
      const apiKey2 = ApiKeyService.generateApiKey();

      expect(apiKey1).not.toBe(apiKey2);
    });

    it('devrait générer une API key avec 0 length (edge case)', () => {
      const apiKey = ApiKeyService.generateApiKey(0);

      expect(apiKey).toBe('');
    });
  });

  describe('isValidApiKeyFormat', () => {
    it('devrait valider une API key au format correct', () => {
      const validApiKey = 'a1b2c3d4e5f6789012345678901234567890abcdef';

      expect(ApiKeyService.isValidApiKeyFormat(validApiKey)).toBe(true);
    });

    it('devrait invalider une API key trop courte', () => {
      const shortApiKey = 'abc123';

      expect(ApiKeyService.isValidApiKeyFormat(shortApiKey)).toBe(false);
    });

    it('devrait invalider une API key avec des caractères non-hexadécimaux', () => {
      const invalidApiKey = 'g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0';

      expect(ApiKeyService.isValidApiKeyFormat(invalidApiKey)).toBe(false);
    });

    it('devrait invalider une API key null', () => {
      expect(ApiKeyService.isValidApiKeyFormat(null)).toBe(false);
    });

    it('devrait invalider une API key undefined', () => {
      expect(ApiKeyService.isValidApiKeyFormat(undefined)).toBe(false);
    });

    it('devrait invalider une API key vide', () => {
      expect(ApiKeyService.isValidApiKeyFormat('')).toBe(false);
    });

    it('devrait invalider une API key qui n\'est pas une string', () => {
      expect(ApiKeyService.isValidApiKeyFormat(123456)).toBe(false);
      expect(ApiKeyService.isValidApiKeyFormat({})).toBe(false);
      expect(ApiKeyService.isValidApiKeyFormat([])).toBe(false);
    });

    it('devrait accepter les API keys en majuscules et minuscules', () => {
      const upperCaseKey = 'ABCDEF1234567890ABCDEF1234567890ABCDEF12';
      const lowerCaseKey = 'abcdef1234567890abcdef1234567890abcdef12';

      expect(ApiKeyService.isValidApiKeyFormat(upperCaseKey)).toBe(true);
      expect(ApiKeyService.isValidApiKeyFormat(lowerCaseKey)).toBe(true);
    });

    it('devrait valider une API key de longueur exactement 32 caractères', () => {
      const exactLengthKey = '12345678901234567890123456789012';

      expect(ApiKeyService.isValidApiKeyFormat(exactLengthKey)).toBe(true);
    });

    it('devrait valider une API key plus longue que 32 caractères', () => {
      const longerKey = '123456789012345678901234567890123456789012345678901234567890abcd';

      expect(ApiKeyService.isValidApiKeyFormat(longerKey)).toBe(true);
    });
  });

  describe('generateEnvironmentKeys', () => {
    it('devrait générer des clés pour les différents environnements', () => {
      const envKeys = ApiKeyService.generateEnvironmentKeys();

      expect(envKeys).toHaveProperty('development');
      expect(envKeys).toHaveProperty('production');

      expect(typeof envKeys.development).toBe('string');
      expect(typeof envKeys.production).toBe('string');
    });

    it('devrait générer une clé de développement de 64 caractères (32 bytes)', () => {
      const envKeys = ApiKeyService.generateEnvironmentKeys();

      expect(envKeys.development.length).toBe(64);
      expect(/^[a-f0-9]+$/i.test(envKeys.development)).toBe(true);
    });

    it('devrait générer une clé de production de 128 caractères (64 bytes)', () => {
      const envKeys = ApiKeyService.generateEnvironmentKeys();

      expect(envKeys.production.length).toBe(128);
      expect(/^[a-f0-9]+$/i.test(envKeys.production)).toBe(true);
    });

    it('devrait générer des clés différentes pour chaque environnement', () => {
      const envKeys = ApiKeyService.generateEnvironmentKeys();

      expect(envKeys.development).not.toBe(envKeys.production);
    });

    it('devrait générer des clés différentes à chaque appel', () => {
      const envKeys1 = ApiKeyService.generateEnvironmentKeys();
      const envKeys2 = ApiKeyService.generateEnvironmentKeys();

      expect(envKeys1.development).not.toBe(envKeys2.development);
      expect(envKeys1.production).not.toBe(envKeys2.production);
    });
  });

  describe('Intégration avec crypto.randomBytes', () => {
    it('devrait utiliser crypto.randomBytes pour générer des clés sécurisées', () => {
      const cryptoSpy = jest.spyOn(crypto, 'randomBytes');

      ApiKeyService.generateApiKey(16);

      expect(cryptoSpy).toHaveBeenCalledWith(16);

      cryptoSpy.mockRestore();
    });
  });
});
