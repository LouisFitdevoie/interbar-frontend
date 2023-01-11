[![en](https://img.shields.io/badge/language-english-red)](./README.md)
[![fr](https://img.shields.io/badge/langue-français-brightgreen)](./README.fr.md)

# InterBar-frontend

## Contexte

Ce projet a été développé dans le cadre de ma dernière année de Bachelier en Informatique et systèmes.

## Contenu

Ce projet contient le code pour faire fonctionner le frontend du projet InterBar, qui est une application mobile pour iOS et Android qui permet aux utilisateurs de créer et de rejoindre des événements et d'ensuite commander des boissons ou de la nourriture. [Le dépôt contenant le backend du projet est disponible en cliquant sur ce lien](https://github.com/LouisFitdevoie/interbar-backend).

Ce projet est éalisé en utilisant React Native et Expo.

## Installation

1. Installer Expo CLI

```bash
npm install -g expo-cli
```

2. Cloner le dépôt
3. Ouvrir un terminal et accéder au dossier du projet
4. Installer les dépendances

```bash
npm install
```

5. Modifier [ce fichier](./app/api/config.api.js) en remplaçant la variable _BASE_URL_ par l'URL où le backend est en cours d'exécution. Si votre backend ne fonctionne pas sur le même ordinateur, vous devrez utiliser l'adresse IP du backend au lieu de localhost. Si vous utilisez un autre port que 8000 pour accéder à votre API, vous devrez mettre à jour le port dans l'URL. Enfin, si vous utilisez une autre version de l'API, vous devrez mettre à jour la version dans l'URL.

```JS
export const BASE_URL = "http://localhost:8000/api/v3";
```

6. Lancer le projet

```bash
expo start
```

## Utilisation

Pour utiliser cette application, vous devez avoir installé l'application [_Expo Go_](https://expo.dev/client) sur votre téléphone. Ensuite, vous devrez scanner le QR Code affiché dans le terminal ou dans le navigateur pour lancer l'application sur votre téléphone. Vous devez également être connecté au même réseau que l'ordinateur, le serveur ou le Raspberry Pi qui fait tourner le backend du projet.

## Démonstration vidéo

Une démonstration vidéo est disponible en suivant [ce lien](https://youtu.be/iDYv6lYlgEA).
