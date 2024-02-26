import { Chronometer } from './chronometer';
import { CRPServer, ServerEvent } from './communication';
import { Game } from './game';
import { CRPClientMessage, CRPGameEndMessage, CRPGameEndState, CRPGameInitMessage, CRPGameInitState, CRPGameStartMessage, CRPGameState, CRPGameUpdateMessage, CRPRegistrationMessage } from './protocol';

const port = 8080;
const server = new CRPServer(port);

let game : Game;
let chronometer: Chronometer = new Chronometer();

restartGame();

chronometer.on("tick", () => {
    if (game.status === Game.STATUS.WAITING) {
            gameInitStateUpdate();
    }
    if(game.status === Game.STATUS.ENDED){
        gameEndUpdate();
    }
});

chronometer.on("timeout", () => {
    if(game.status === Game.STATUS.WAITING){
        game.start();
        gameStartUpdate();
    }
    if(game.status === Game.STATUS.ENDED){
        gameEndUpdate();
        restartGame();
    }
});

server.on(ServerEvent.MESSAGE_RECEIVED, (data, uuid) => {
    const message : CRPClientMessage = data as CRPClientMessage;
    // console.log('Message received from client ' + uuid + ' : ' + JSON.stringify(message));
    if(message.method === 'connect'){
        registration(uuid);
    }
    if(message.method === 'player-ready'){
        if(message.value.id=== uuid){
            if(game.status === Game.STATUS.WAITING){
                game.addPlayer(uuid);
                if(chronometer.state === 'running'){
                    chronometer.reset();
                }
                if(game.players.length === Game.MAX_PLAYERS){
                    game.start();
                }
                else {
                    chronometer.start(5000); 
                    gameInitStateUpdate();
                }
            }
            else { // A game is already started. The player is only a spectator
                // TODO : send the game state to the spectator
            }
        }
        // TODO : handle error when the uuid of the client is not correct
    }
    if(message.method === 'player-update'){
        // Move the player
        if(game.status === Game.STATUS.WAITING){
            const angle = message.value.angle as number;
            game.movePlayer(uuid, angle);
            gameInitStateUpdate();
        }
        else if (game.status === Game.STATUS.STARTED){
            const angle = message.value.angle as number;
            game.movePlayer(uuid, angle);
            if(game.status === Game.STATUS.ENDED){
                chronometer.reset();
                chronometer.start(5000);
                gameEndUpdate();
            }
            else {
                gameStatusUpdate();
            }
        }
    }
});

server.on(ServerEvent.LOST_CLIENT, (uuid) => {
    game.removePlayer(uuid);
    if(game.status!==Game.STATUS.WAITING && game.players.length==0){
        restartGame();
    }
});

function registration(uuid : string){
    const registrationMessage : CRPRegistrationMessage = {
        protocol: 'candy-rush-protocol',
        source: 'server',
        method: 'registration',
        value: uuid,
    }
    server.sendMessageToClient(registrationMessage, uuid);
    // console.log('Client ' + uuid + ' registered');
}

function restartGame(){
    game = new Game(10);
    chronometer.reset();
}

function gameInitStateUpdate(){
    const stateValue = game.export() as CRPGameInitState;
    stateValue.remainingTime =  chronometer.maxTime - chronometer.time;
    const gameInitMessage : CRPGameInitMessage = {
        protocol: 'candy-rush-protocol',
        source: 'server',
        method: 'game-init',
        value: stateValue,
    }
    game.players.forEach(player => {
        server.sendMessageToClient(gameInitMessage, player.id);
    });
}

function gameStartUpdate(){
    const gameStartMessage : CRPGameStartMessage = {
        protocol: 'candy-rush-protocol',
        source: 'server',
        method: 'game-start',
        value: game.export() as CRPGameState
    }
    game.players.forEach(player => {
        server.sendMessageToClient(gameStartMessage, player.id);
    });
}

function gameStatusUpdate(){
    const gameUpdateMessage : CRPGameUpdateMessage = {
        protocol: 'candy-rush-protocol',
        source: 'server',
        method: 'game-update',
        value: game.export() as CRPGameState
    }
    game.players.forEach(player => {
        server.sendMessageToClient(gameUpdateMessage, player.id);
    });
}

function gameEndUpdate(){
    const stateValue = game.export() as CRPGameEndState;
    stateValue.remainingTime =  chronometer.maxTime - chronometer.time;
    const gameEndMessage : CRPGameEndMessage = {
        protocol: 'candy-rush-protocol',
        source: 'server',
        method: 'game-end',
        value: stateValue,
    }
    game.players.forEach(player => {
        server.sendMessageToClient(gameEndMessage, player.id);
    });
}