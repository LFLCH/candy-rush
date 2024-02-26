import { Server, WebSocket } from "ws";
import { CRPClientMessage, CRPRegistrationMessage, CRPServerMessage, CandyRushProtocolMessage } from "./protocol";
import { v4 as uuidv4, validate as uuidvalidate } from 'uuid';
import { EventEmitter } from "stream";

export enum ServerEvent {
    MESSAGE_RECEIVED = 'message-received',
    LOST_CLIENT = 'lost-client',
}

export class CRPServer extends EventEmitter{
    private server : Server;
    private clients : Map<string, WebSocket>;

    constructor(port : number){
        super();
        this.start(port);
    }

    private start(port : number){
        this.server = new Server({ port: port });
        this.bindSocketEvents();
        this.clients = new Map<string, WebSocket>();
    }

    private bindSocketEvents(){
        this.server.on('listening', () => {
            const adress = this.server.address();
            const adressValue = typeof adress === 'string' ? adress : adress?.port;
            console.log('Server started and listening on port ' + adressValue);
        });
        this.server.on('connection', (ws: WebSocket) => {
            console.log('New client connected :' + this.server.clients.size + ' clients connected.');
            const uuid = uuidv4();
            this.clients.set(uuid, ws);
            
            if(ws.protocol === 'candy-rush-protocol'){
                ws.on('message', async (message) => {
                    try {
                        const data : CandyRushProtocolMessage = JSON.parse(message.toString());
                        if(data.protocol === 'candy-rush-protocol' && data.source === 'client'){
                            const clientMessage = data as CRPClientMessage;
                            this.emit(ServerEvent.MESSAGE_RECEIVED, clientMessage, uuid);
                        }
                        else{
                            console.log("Invalid message received : " + message);
                            ws.close();
                        }
                    } catch (error) {
                        console.log("Error while parsing message : " + error);
                        ws.close();
                    }
                });
                ws.on('close', (message) => {
                    console.log('Lost Client', uuid);
                    this.emit(ServerEvent.LOST_CLIENT, uuid);
                    this.clients.delete(uuid);
                });
            }
            else{
                console.log("Client not using the candy-rush-protocol");
                ws.close();
            }
        });
        this.server.on('close', () => {
            console.log('Server closed');
        });
    }
    

public sendMessageToClient(message : CRPServerMessage, uuid : string){
    const ws = this.clients.get(uuid);
    if(ws && ws.OPEN  === WebSocket.OPEN){
        ws.send(JSON.stringify(message));
    }
 }
}