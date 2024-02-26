/***
 * @fileoverview Protocol for CandyRush
 * @description This file defines the message format exchanged between the client and the server.
*/

export interface CandyRushProtocolMessage {
    protocol: 'candy-rush-protocol', // Name of the protocol 
    source : string, // Source of the message (client or server)
    method : string, // Action name of the message
    value ?:  any, //  Value of the message if needed
}

export interface CRPClientMessage extends CandyRushProtocolMessage {
    source : 'client'
}

/**
 * @description Message sent by the client to connect to a game session
 */
export interface CRPConnectMessage extends CRPClientMessage {
    method : 'connect'
}

// USED as an ack, as well as a signal from the client to the server that it is ready to receive the game state
export interface CRPPlayerReadyMessage extends CRPClientMessage {
    method : 'player-ready'
    value : {
       id : string,
       pseudo : string,
    }
}

export interface CRPPlayerUpdateMessage extends CRPClientMessage {
    method : 'player-update'
    value : {
        pseudo : string, // The pseudo of the player may have changed
        angle : number, // The angle of the player in radians
    }
}

export interface CRPServerMessage extends CandyRushProtocolMessage {
    source : 'server'
}

export interface CRPRegistrationMessage extends CRPServerMessage {
    method : 'registration'
    value : string // UUID of the client
}

// The server is waiting for players before starting the game
// This message is sent to all players frequently to update them on the game state (players positions, candies positions, etc.)
export interface CRPGameInitMessage extends CRPServerMessage {
    method : 'game-init',
    value : CRPGameInitState
}

export interface CRPGameStartMessage extends CRPServerMessage {
    method : 'game-start',
    value : CRPGameState
}

export interface CRPGameUpdateMessage extends CRPServerMessage {
    method : 'game-update',
    value : CRPGameState
}

export interface CRPGameEndMessage extends CRPServerMessage {
    method : 'game-end',
    value : CRPGameEndState
}

export interface CRPGameEndState extends CRPState {
    remainingTime : number
}

export interface CRPState {

}

export interface CRPGameInitState extends CRPState{
    players : CRPPlayer[],
    remainingTime : number,
    maximalPlayersNumber : number,
}

export interface CRPGameState extends CRPState{
    candies: CRPCandy[],
    players : CRPPlayer[],
}

export interface CRPCandy {
    value: number,
    x: number,
    y: number,
    size : number,
}

export interface CRPPlayer {
    id: string, // UUID of the client
    pseudo: string, // Pseudo of the player. Only used for display purpose
    x: number,
    y: number,
    size : number,
    speed : number,
    score : number,
}