// This file contains the code used to communicate with the server.

const ClientStatus = {
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected'
};

const GameStatus = {
    WAITING: 'WAITING',
    RUNNING: 'RUNNING',
    ENDED: 'GAME ENDED'
};

const ClientEvent = {
    CONNECTING_STATUS_CHANGE: 'status-changed',
    GAME_UPDATE: 'game-update'
};

/**
 * @class CRPFormat
 * @description
 * This class is used to handle the communication protocol.
 * It provides a set of static methods to parse and generate messages.
 */
class CRPFormat {

    static getName() {
        return 'candy-rush-protocol';
    }

    static isValid(data){
        return data.protocol === 'candy-rush-protocol';
    }

    static isServerOrigin(data){
        return data.source === 'server';
    }

    static isRegistration(data){
        return data.method === 'registration';
    }

    static isGameUpdate(data){
        return data.method === 'game-init' || data.method === 'game-start' || data.method === 'game-update' || data.method === 'game-end';  
    }

    static getGameStatus(data){
        const method = data.method;
        if(method === 'game-init') {
            return GameStatus.WAITING;
        }
        else if (method === 'game-start') {
            return GameStatus.RUNNING;
        }
        else if(method === 'game-update') {
            return GameStatus.RUNNING;
        }
        else if(method === 'game-end') {
            return GameStatus.ENDED;
        }
    }

    static getRegistrationValue(data){
        return data.value;
    }

    static ClientConnect() {
        return {
            "protocol": "candy-rush-protocol",
            "source" : "client",
            "method" : "connect",
        };
    }

    static ClientPlayerReady(id, pseudo) {
        return {
            "protocol": "candy-rush-protocol",
            "source" : "client",
            "method" : "player-ready",
            "value" : {
                "id": id,
                "pseudo" : pseudo
            }
        };
    }

    static ClientPlayerMove(pseudo, angle) {
        return {
            "protocol": "candy-rush-protocol",
            "source" : "client",
            "method" : "player-update",
            "value" : {
                "pseudo": pseudo,
                "angle" : angle
            }
        };
    }
}



/**
 * @class CandyRushClient
 * @description
 * This class is used to communicate with the server.
 * It encapsulates the WebSocket object and provides a simple interface to send and receive messages.
 */
class CandyRushClient extends EventTarget{
    #socket = null;
    status = ClientStatus.DISCONNECTED;
    userId = '';
    

    connect(adress) {
        if(this.#socket) {
            this.close();
        }
        this.#setStatus(ClientStatus.CONNECTING);
        this.userId = '';
        this.#socket = new WebSocket(adress, CRPFormat.getName());
        this.#bindSocketEvents(this.#socket);
        
    }
    

    close(){
        if(this.#socket) {
            this.#socket.close();
        }
        this.#setStatus(ClientStatus.DISCONNECTED);
    }

    send(message) {
        if(this.#socket && this.#socket.readyState === WebSocket.OPEN) {
            // console.log('Sending message', message);
            this.#socket.send(message);
        }
    }

    #bindSocketEvents(socket) {
        socket.addEventListener('open', (event) => {
            if(this.status === ClientStatus.CONNECTING) {
                this.#connectToCRServer();
            }
       });
    
       socket.addEventListener('error', (event) => {
            console.log('Communication Error', event);
            socket.close();
            this.#setStatus(ClientStatus.DISCONNECTED);
        });
    
       socket.addEventListener('close', (event) => {
            console.log('Communication Closed', event);
           this.#setStatus(ClientStatus.DISCONNECTED);
       });
       
       socket.addEventListener('message', (event) => {
           const data = JSON.parse(event.data);
           if(CRPFormat.isServerOrigin(data)) {
            // console.log('Server Message', data);
                if(CRPFormat.isRegistration(data)) {
                    this.userId = CRPFormat.getRegistrationValue(data);
                    this.#setStatus(ClientStatus.CONNECTED);
                }
                if(CRPFormat.isGameUpdate(data)) {
                    const status = CRPFormat.getGameStatus(data);
                    data.value.status = status;
                    this.#emitEvent(ClientEvent.GAME_UPDATE, data.value);
                }
           }
       });
    }

    #connectToCRServer() {;
        this.send(JSON.stringify(CRPFormat.ClientConnect()));
    }

    #emitEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        this.dispatchEvent(event);
    }

    #setStatus(status) {
        this.status = status;
        this.#emitEvent(ClientEvent.CONNECTING_STATUS_CHANGE);
    }
}


// Publish the class for jest tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CandyRushClient;
} 
  