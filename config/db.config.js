module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "root",
  DB: process.env.DB_NAME || "todo_app_db",
  PORT: process.env.DB_PORT || 3306,
  dialect: "mysql",

  // Configuration du pool de connexions
  pool: {
    max: parseInt(process.env.DB_POOL_MAX) || 5,
    min: parseInt(process.env.DB_POOL_MIN) || 0,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE) || 10000
  },

  // Options additionnelles selon l'environnement
  logging: process.env.NODE_ENV === 'development' ? console.log : false,

  // Configuration SSL pour la production
  ...(process.env.NODE_ENV === 'production' && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
};
