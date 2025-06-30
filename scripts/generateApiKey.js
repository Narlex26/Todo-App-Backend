#!/usr/bin/env node

/**
 * Script pour générer une nouvelle API Key sécurisée
 * Usage: node scripts/generateApiKey.js
 */

const ApiKeyService = require('../services/apiKey.service');

console.log('🔑 Génération d\'API Keys sécurisées...\n');

// Générer une clé unique
const singleKey = ApiKeyService.generateApiKey();
console.log('API Key unique :');
console.log(`API_KEY=${singleKey}\n`);

// Générer des clés pour différents environnements
const envKeys = ApiKeyService.generateEnvironmentKeys();
console.log('API Keys par environnement :');
console.log(`API_KEY_DEV=${envKeys.development}`);
console.log(`API_KEY_PROD=${envKeys.production}\n`);