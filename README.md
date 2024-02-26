# Candy Rush 🍭

A multiplayer web game. Up to 5 players, be the first to collect the maximum of candies on the map !

## Demo

https://github.com/LFLCH/candy-rush/assets/62034725/42ecd6bf-e9a9-487d-a47c-07507dcdf02d

## Rules

Each item that you eat influence you score.

| Candy  | Points  |
|---|---|
|🍬| 1|
|🍪| 2|
|🍩| 5|
|🧁| 10|
|🥦| -5|

## Technologies
###  [Server](backend)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

### [Client](frontend)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![p5js](https://img.shields.io/badge/p5.js-ED225D?style=for-the-badge&logo=p5.js&logoColor=FFFFFF) ![Mocha](https://img.shields.io/badge/-mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white)

## CI/CD
This project was originally made on GitLab. It is why you can see a [.gitlab-ci file](.gitlab-ci.yml). It was fitting our Agile development process, running tests at each commit, to ensure our sprint where validated.

## Message format
In order to properly exchange messages between the clients and the server via [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), a format, called [```candy-rush-protocol```](../backend/src/protocol.ts)  has been set up. 


| Origin | Method | Description |
|--------|--------|-------------|
|**client**|```connect```|Connection initialization |
|**server**|```registration```|Validation of the connection attempt|
|**client**|```player-ready```|Request to join the new game|
|**server**|```game-init```|Update of the waiting room, with the list of all the registered players|
|**server**|```game-start```|Starting game event|
|**client**|```player-update```|Move done by the player|
|**server**|```game-update```|Candies and players positions and scores update|
|**server**|```game-end```|End game event|

## Authors
[Léo FILOCHE](https://github.com/LFLCH) & [Jérémy Bindel](https://github.com/J-Bindel)
