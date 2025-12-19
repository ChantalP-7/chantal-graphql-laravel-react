Collège Maisonneuve 2025

Programme Conception et programmation de site web

# Projet web 2 - Équipe Vino MCHN

Notre projet consiste à développer une application SPA (Single Page Application) dédiée la de gestion de celliers * de vins* via une architecture Laravel + React. 

## Description du projet

Notre appication permet aux utilisateurs de créer et gérer plusieurs celliers, d’y ajouter des bouteilles, de suivre les quantités, et d’effectuer des actions comme le déplacement ou le retrait de bouteilles.

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

## Architecture technique
/backend        → Laravel (API REST)
/public_html    → React (build de production)
Backend (Laravel)

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

## Installation (en local)
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

### Backend
- cd backend
- composer install
- cp .env.example .env
- php artisan key:generate
- php artisan migrate
- php artisan serve

### Frontend
- cd frontend
- npm install
- npm run dev

### Déploiement

- Le backend Laravel est déployé à la racine du serveur

- Le frontend React est compilé et déployé dans le dossier public_html

- Les appels API utilisent des URLs absolues vers le backend

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

- Accessibilité (a11y)

    - Navigation complète au clavier
    - Utilisation de balises HTML sémantiques
    - Formulaires avec labels explicites
    - Modales accessibles (focus, fermeture clavier)
    - Contrastes et lisibilité respectés

**Auteurs Moukda Phaengxay, Hannah Lauzon, Nadia Ouafi et Chantal Pépin**
