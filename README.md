# 🍆 EventBoard - Plateforme d'Événements Collaboratifs

EventBoard est une application web moderne permettant de consulter, créer et voter pour des événements locaux.

L'application se distingue par son design sombre "Aubergine/Cyberpunk", ses animations fluides et son interface réactive.

## 🚀 Fonctionnalités

* **Tableau de bord interactif :** Liste des événements sous forme de cartes avec effet "Glassmorphism".
* **Système de Vote (Like/Unlike) :** Possibilité de voter pour un événement. Le vote est sauvegardé localement (LocalStorage) pour se souvenir des préférences de l'utilisateur.
* **Détails de l'événement :** Page dédiée affichant la description complète, le lieu et une image d'illustration.
* **Ajout d'événement :** Formulaire modal pour publier un nouvel événement instantanément.
* **Animations :** Intégration de la librairie AOS (Animate On Scroll) pour des apparitions fluides au défilement.
* **Responsive Design :** Interface adaptée aux mobiles, tablettes et ordinateurs grâce à TailwindCSS.

## 🛠️ Stack Technique

* **Backend :** Node.js, Express.js
* **Frontend :** HTML5, TailwindCSS (via CDN), Vanilla JS
* **Base de données :** Fichier JSON local (`data/events.json`) 
* **Icônes :** Phosphor Icons
* **Animations :** AOS.js

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :
* [Node.js](https://nodejs.org/) (v14 ou supérieur)
* [Git](https://git-scm.com/)

## 📦 Installation et Lancement

Suivez ces étapes pour lancer le projet sur votre machine locale :

1.  **Cloner le dépôt :**
    ```bash
    git clone [https://github.com/MalauryHn/EventBoard.git](https://github.com/MalauryHn/EventBoard.git)
    cd EventBoard
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```
    *Ceci installera `express`, `cors`, `body-parser` et `nodemon`.*

3.  **Lancer le serveur :**
    ```bash
    npm start
    ```
    *Ou pour le développement avec rechargement automatique :*
    ```bash
    npx nodemon server.js
    ```

4.  **Accéder à l'application :**
    Ouvrez votre navigateur et allez à l'adresse :
    👉 `http://localhost:3000`

## 📂 Structure du Projet

```text
EventBoard/
├── data/
│   └── events.json       # Stockage des données (Base de données JSON) 
├── public/
│   ├── index.html        # Page d'accueil (Dashboard)
│   ├── details.html      # Page de détails d'un événement
│   └── app.js            # Logique Frontend (Fetch API, DOM, Animations)
├── node_modules/         # Dépendances Node.js
├── server.js             # Serveur Express et Routes API 
├── package.json          # Configuration du projet et dépendances
└── README.md             # Documentation du projet