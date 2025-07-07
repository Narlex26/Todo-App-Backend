FROM node:22


# Étape 2 : définir le dossier de travail dans le conteneur
WORKDIR  /var/www/html/app

# Étape 3 : copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Étape 4 : copier le reste du code
COPY . .

# Étape 5 : exposer le port (ex: 3000)
EXPOSE 3000

# Étape 6 : lancer l'app
CMD ["node", "app.js"]