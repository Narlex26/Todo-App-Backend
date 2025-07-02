const crypto = require('crypto');

/**
 * Service pour la gestion des API Keys
 */
class ApiKeyService {
  /**
   * Génère une nouvelle API Key sécurisée
   * @param {number} length - Longueur de la clé (défaut: 32)
   * @returns {string} API Key générée
   */
  static generateApiKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Valide le format d'une API Key
   * @param {string} apiKey - API Key à valider
   * @returns {boolean} True si valide, False sinon
   */
  static isValidApiKeyFormat(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }

    // Vérifier que la clé fait au moins 32 caractères hexadécimaux
    const hexRegex = /^[a-f0-9]{32,}$/i;
    return hexRegex.test(apiKey);
  }

  /**
   * Génère plusieurs API Keys pour différents environnements
   * @returns {object} Objet contenant les clés pour dev, staging, prod
   */
  static generateEnvironmentKeys() {
    return {
      development: this.generateApiKey(32),
      production: this.generateApiKey(64)
    };
  }
}

module.exports = ApiKeyService;
