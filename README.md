# Candy Rush 🍭

A multiplayer web game. Up to 5 players, be the first to collect the maximum of candies on the map !

## Demo

![assets/demo_candy_rush.mp4](assets/demo_candy_rush.mp4)

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

The game is client-server, with a Typescript Backend in `Node.js`, and a `Vanilla JS` frontend. The lib `P5.js` has been used for the HTML canvas drawing.

## CI/CD

This project was originally made on GitLab. It is why you can see a [.gitlab-ci file](.gitlab-ci.yml). It was fitting our Agile development process, running tests at each commit, to ensure our sprint where validated.

## Messages format

In order to properly exchange messages between the clients and the server, a format, called [```candy-rush-protocol```](../backend/src/protocol.ts)  has been set up. 


| Origin | Method | Description |
|--------|--------|-------------|
|CLIENT|connect|Connection initialization |
|SERVER|registration|Validation of the connection attempt|
|CLIENT|player-ready|Request to join the new game|
|SERVER|game-init|Update of the waiting room, with the list of all the registered players|
|SERVER|game-start|Starting game event|
|CLIENT|player-update|Move done by the player|
|SERVER|game-update|Candies and players positions and scores update|
|SERVER|game-end|End game event|