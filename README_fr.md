# Candy Rush 🍭

Qu'est ce que Candy Rush ?

Candy Rush est un jeu web qui fait s'affronter de un à cinq joueurs pour collecter un maximum de bonbons sur carte pré-définie.

## Démo

![assets/demo_candy_rush.mp4](assets/demo_candy_rush.mp4)


## Règles

Dans Candy Rush, les bonbons valent :
- 1 point pour les `bonbons` 🍬.
- 2 pour les `cookies` 🍪.
- 5 pour les `doughnuts` 🍩.
- 10 pour les `muffins` 🧁.
- **-5** pour les `brocolis`  🥦.

## Architecture

L'architecture du jeu est une architecture `Client/Serveur`.

Le Backend est en TypeScript `Node.js`.

Le Frontend est fait d'`HTML/CSS/JavaScript` (avec la librairie  [P5.js](https://p5js.org/) pour la gestion du canvas).

## Méthodologie

Pour ce projet, nous avons fait le choix d'adapter une méthodologie agile, visible sur notre `workflow` git.

Nous développerons chaque composant sur sa branche dédiée, puis nous la fusionnerons sur la branche `develop` et enfin, nous ouvrirons une `merge request` sur la branche `main` afin de fournir le livrable du `sprint` en cours.

Nous allons également mettre en place une `suite de tests`, avant tout unitaire. Cette suite de tests sera intégrée au sein de notre `pipeline CI/CD`.
Cette CI/CD est basée sur un `runner` hébergé dans un conteneur `Docker` sur la machine de Jérémy.
Nous n'avons pas jugé nécessaire d'ajouter des releases à la fin de chaque sprint, mais une `release générale` sera délivrée en fin de projet.

## Echange de messages

Les échanges entre le backend et le frontend ont été formalisés. Le format des messages a été baptisé  [```candy-rush-protocol```](../backend/src/protocol.ts) . Voici en bref leur signification : 

- [CLIENT] ```connect```: initialisation de la connexion par le client
- [SERVEUR] ```registration``` : validation de la connexion par le serveur
- [CLIENT] ```player-ready``` : demande de rejoindre la partie par le client
- [SERVEUR] ```game-init``` : mise à jour de la salle d'attente de la partie par le serveur, avec la liste de tous les joueurs acceptés.
- [SERVEUR] ```game-start``` : signal de début de partie par le serveur
- [CLIENT] ```player-update``` : mouvement effecté par le client signalé au serveur
- [SERVEUR] ```game-update``` : mise à jour du plateau de jeu par le serveur (positions/noms des joueurs, bonbons restants)
- [SERVEUR] ```game-end``` : signal de fin de partie par le serveur. Indique aux clients que le classement doit être affiché.



## Contributeurs

- Léo FILOCHE
- Jérémy BINDEL

## Rapports 

Veuillez trouver les rapports des contributeurs dans le dossier [reports](reports/), ainsi que la [présentation](docs/Presentation.pdf) du 13/02/2024.

## Documentation

Trouvez les différentes user-stories, sprints et diagrammes d'échange dans le dossier [docs](docs).

## Installation

Dans le dossier ```backend```

```bash
npm install
```

Dans le dossier ```frontend```

```bash
npm install
```
Note : l'installation des dépendances client est seulement nécessaire pour l'exécution de tests côté front.

## Exécution 

Dans le dossier  ```backend```

```bash
npm run serve
```
Dans le dossier ```frontend```

```bash
npm run start
```
Puis cliquer sur le lien du réseau (local ou global). 

L'adresse est partageable à tous les appareils connectés au même réseau !

## Tests

Dans le dossier  ```backend```, en ligne de commande grâce à [jest](https://jestjs.io/fr/).

```bash
npm run test
```

Dans le dossier ```frontend```, cliquer sur le lien affiché dans la console pour exécuter les tests ([mocha](https://mochajs.org/) et [chai](https://www.chaijs.com/)) dans le navigateur.

```bash
npm run test
```