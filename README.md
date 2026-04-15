Collège Maisonneuve 2025

Programme Conception et programmation de site web

# Projet web 2 - Équipe Vino MCHN

Notre projet consiste à développer une application SPA (Single Page Application) dédiée la de gestion de celliers de vins via une architecture Laravel + React. 

## Description du projet

Notre application permet aux utilisateurs de créer et gérer plusieurs celliers, d’y ajouter des bouteilles, de suivre les quantités, et d’effectuer des actions comme le déplacement ou le retrait de bouteilles.

Le projet repose sur une architecture découplée :

Laravel agit comme backend API (logique métier, base de données, sécurité)

React agit comme frontend SPA (interface utilisateur dynamique)


## Fonctionnalités principales

- Authentification des utilisateurs
- Gestion de plusieurs **celliers**
- Ajout, modification et suppression de **bouteilles**
- Gestion des **quantités**
- Déplacement de bouteilles entre celliers
- Interface **SPA fluide et réactive**


## Objectifs pédagogiques

Ce projet vise à :

- Maîtriser une architecture Laravel + React découplée

- Comprendre la communication API entre frontend et backend

- Mettre en place une SPA complète

- Gérer un projet full‑stack moderne

## Technologies utilisées

Données externes (GraphQL & automatisation)

- Récupération automatisée de plus de 8 000 bouteilles de vin d'un catalogue provenant d’un fournisseur externe

- Utilisation de GraphQL pour interroger l’API exposée par le fournisseur de données

- Extraction des informations suivantes :

    - Nom du produit
    - Millésime
    - Type de vin
    - Pays d'origine
    - Prix
    - etc.

- Mise en place d’un cron job Laravel pour :

    - lancer la première fois la récupération des données et les enregistrer dans la base de données de l'application
    
    - éviter les doublons et maintenir la cohérence des données

## Architecture technique
/backend        → Laravel (API REST)
/public_html    → React (build de production)

- Framework : Laravel

- API REST

- Gestion des routes via routes/api.php

- Accès aux données via Eloquent ORM

### Séparation claire entre logique métier et présentation

- Frontend (React)

- Framework : React

- Application monopage (SPA)

- Communication avec le backend via Axios

- Gestion de l’état avec les hooks React

- Interfaces modulaires basées sur des composants

## Communication Frontend / Backend

- Le frontend communique avec le backend exclusivement via des requêtes HTTP (API)

- Les routes API sont préfixées par /api

- Gestion des erreurs côté frontend

- Réponses JSON normalisées

## Installation et déploiement en développement (local) 

*Fork le projet principal*
https://github.com/Equipe-MCHNC/graphql-laravel-react

*Clonage de notre projet forked comme ceci : *
git clone https://github.com/ChantalP-7/chantal-graphql-laravel-react

### Prérequis

PHP >= 8.x

Composer

Laravel 9 ou plus

Node.js & npm

Base de données MySQL

### Backend terminal local
- cd backend
- composer install
- cp .env.example .env
- php artisan key:generate
- php artisan migrate
- php artisan serve

### Frontend terminal local
- cd frontend
- npm install
- npm run dev

## Déploiement en production (Planet Hoster)

- Le projet est déployé sur un hébergement PlanetHoster avec une architecture découplée.

/home
├── backend → Application Laravel (API)
└── public_html → Frontend React (build de production)

## Backend (Laravel)

- Déployé dans le dossier backend

- Configuration du fichier .env adaptée à l’environnement de production

- Base de données configurée sur le serveur

- Routes exposées uniquement via routes/api.php

## Frontend (React)

- Application compilée avec npm run build

- Fichiers générés copiés dans public_html

- Communication avec le backend via des URLs absolues

## Objectifs pédagogiques

### Ce projet vise à :

- Maîtriser une architecture Laravel + React découplée

- Comprendre la communication API entre frontend et backend

- Mettre en place une SPA complète

- Gérer un projet full‑stack moderne

## Améliorations futures

- Gestion des utilisateurs : liste des noms et de leurs celliers, les bouteilles entreposées, les quantités, etc. (côté administrateur)

- Statistiques sur les utilisateurs et leurs celliers

- Tests automatisés (unitaires et fonctionnels)

- Mise en place d’un cron job Laravel pour :

    - lancer périodiquement la récupération des données de la SAQ

    - mettre à jour les informations en base de données    

- Enregistrement des données normalisées dans la base de données de l’application

- Accessibilité (a11y)

    - Navigation complète au clavier
    - Utilisation de balises HTML sémantiques
    - Formulaires avec labels explicites
    - Modales accessibles (focus, fermeture clavier)
    - Contrastes et lisibilité respectés

**Auteures : Moukda Phaengvixay, Hannah Lauzon, Nadia Ouafi et Chantal Pépin**


## Améliorations printemps 2026

### Gestion du cellier :

- Changer la disposition des cellier : De tiroirs, je les ai mis en grilles. 
- Le nom du cellier, la quantité de bouteilles ainsi que le nombre de vins est inscrit sur chaque cellier. Au clic, chaque contenu de cellier s'affiche pleine largeur en bas de la grille et le contenu est mieux présenté. 
- Ajouts : possibilité de changer le nom du cellier ouvert, annuler l'action. Déplacer les bouteilles du cellier dans un autre à l'aide d'un mini formulaire, pagination lorsque plus de 6 bouteilles, etc. 
- Quand on clique sur un vin, le panneau inférieur coulissant affiche les détails et un bouton dégustation permet au clic d'afficher un mini formulaire qui permet d'indiquer le nombre de bouteilles que le client veut boire de ce vin. Maximum la quantité du produit. Une fois cliqué, une modale indique le nombre de bouteilles restant de ce vin. 

### Création d'un mode démo :

- Ajout du booléen is_demo dans une colonne de la table users qui est par défaut false. J'ai ajouté un nouveau profil dont j'ai ajouté des celliers, bouteilles et rempli une liste d'achats. Une fois fait, j'ai mis son profil a is_demo = true.
- J'ai ajouté du code backend : Middleware de blocage, mis dans le fichier kernel.php. Mis des routes de blocage du CRUD dans le fichier api.php lorsque le profil authentifié est celui du démo. 
- À ce moment, l'utilisateur démo entre dans sa session et peut visualiser tout le contenu du site, le catalogue, sa liste d'achats, ses celliers et bouteilles, son profil etc. Il ne peut rien modifier, s'il tente de le faire, une modale lui explique que les modifications ne sont pas possibles en démo. 
- Même avec l'inspecteur ou Postman, les modifications ne sont pas possible.
