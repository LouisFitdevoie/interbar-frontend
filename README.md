[![en](https://img.shields.io/badge/language-english-brightgreen)](./README.md)
[![fr](https://img.shields.io/badge/langue-français-red)](./README.fr.md)

# InterBar-frontend

## Context

This project is realised as part of my bachelor degree in computer science and systems.

## Content

This project contains the code to run the frontend of the InterBar project, which is a mobile application for iOS and Android that allows users to create and join events and then create commands to order drinks or food. [The repository containing the backend of this project is available by clicking on this link](https://github.com/LouisFitdevoie/interbar-backend).

This project is realised with React Native and Expo.

## Installation

1. Install Expo CLI

```bash
npm install -g expo-cli
```

2. Clone the repository
3. Open a terminal and access the project folder
4. Install the dependencies

```bash
npm install
```

5. Edit [this file](./app/api/config.api.js) by updating the _BASE_URL_ variable by the URL where the backend is running. If your backend is not running on the same computer, you will need to use the IP address of the backend instead of localhost. If you are using another port than 8000 to access your API, you will need to update the port in the URL. Finally, if you are using another version of the API, you will need to update the version in the URL.

```JS
export const BASE_URL = "http://localhost:8000/api/v2.2";
```

6. Run the project

```bash
expo start
```

## Usage

To use this application, you need to have the [_Expo Go_](https://expo.dev/client) application installed on your phone. Then, you can scan the QR code displayed in the terminal or in the browser to run the application on your phone. You also need to be connected to the same network as the computer, the server or the Raspberry Pi running the backend of the project.
