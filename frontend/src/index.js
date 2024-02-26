const connectionStatusElem = document.getElementById('connection-status');
const headerElem = document.getElementsByTagName('header')[0];
const pseudo = document.getElementById('pseudo');
const score = document.getElementById('score');

const channel = new CandyRushClient();
const entities = new CanvasEntities();
const serverUrl =  'ws://'+ window.location.hostname + ':8080'  


channel.addEventListener(ClientEvent.CONNECTING_STATUS_CHANGE, () => {
    statusIconUpdate();
    if(channel.status === ClientStatus.CONNECTED) {
        channel.send(JSON.stringify(CRPFormat.ClientPlayerReady(channel.userId, pseudo.value)));
    }
});

channel.addEventListener(ClientEvent.GAME_UPDATE, (event) => {
    const status = event.detail.status;

    if(status === GameStatus.WAITING) {
        entities.controller.active = true;
        entities.opponents = event.detail.players.filter(player => player.id !== channel.userId);
        entities.player = event.detail.players.find(player => player.id === channel.userId);
        const currentPseudo = entities.player.pseudo;
        if(currentPseudo !== pseudo.value) {
            pseudo.value = currentPseudo;
        }
        entities.candies  = [];
        const time = event.detail.remainingTime / 1000;
        entities.gameStatus = time.toFixed(2)+"\n\nWAITING...";
    }
    else if(status === GameStatus.RUNNING) {
        entities.candies  = event.detail.candies;
        entities.opponents = event.detail.players.filter(player => player.id !== channel.userId);
        entities.player = event.detail.players.find(player => player.id === channel.userId);
        entities.gameStatus = "EAT !";
        updateScore();
    }
    else if(status === GameStatus.ENDED) {
        entities.candies  = [];
        entities.opponents = event.detail.players.filter(player => player.id !== channel.userId);
        entities.player = event.detail.players.find(player => player.id === channel.userId);
        updateScore();
        entities.controller.active = false;
        // sort players by score
        const ranking = event.detail.players.sort((a, b) => b.score - a.score);
        // verfiy if the player is the winner
        if(ranking[0].id === channel.userId) {
            entities.gameStatus = "WIN !";
        } else {
            entities.gameStatus = "LOOSE !";
        }
        // display the ranking 
        for(const [index, player] of ranking.entries()) {
            entities.gameStatus += "\n#" + (index+1) + " " + player.pseudo + " (" + player.score+")";
            if(player.id === channel.userId) {
                entities.gameStatus += "🪅";
            }
        }
        const time = event.detail.remainingTime;
        entities.gameStatus += "\n\n"+(time/1000).toFixed(2)+"s\n\nbefore next game...";

        if(time===0){
            channel.send(JSON.stringify(CRPFormat.ClientPlayerReady(channel.userId, pseudo.value)));
        }
    }
});

channel.connect(serverUrl);

function statusIconUpdate() {
    const icons = {
        'connecting': '🪅',
        'connected': '🍭',
        'disconnected': '🕸️'
    };
    connectionStatusElem.innerHTML = icons[channel.status];
}

function updateScore() {
    score.innerText = entities.player.score;
}

headerElem.addEventListener('click', ()=>{
    if(channel.status === ClientStatus.CONNECTED) channel.close();
    else if(channel.status === ClientStatus.DISCONNECTED)   channel.connect(serverUrl);
});


entities.controller.addEventListener(ControllerEvent.MOVE, (event)=>{
    channel.send(JSON.stringify(CRPFormat.ClientPlayerMove(pseudo.value, (entities.controller.angle(entities.player.x, entities.player.y)) - PI) ));
});


pseudo.addEventListener('change', ()=>{
    channel.send(JSON.stringify(CRPFormat.ClientPlayerMove(pseudo.value, (entities.controller.angle(entities.player.x, entities.player.y)) - PI) ));
});



const gameZone = document.getElementsByTagName('article')[0];

function startingNewGame(){
    if(channel.status === ClientStatus.CONNECTED) {
        party.confetti(gameZone, {
            count: party.variation.range(10, 20),
            spread: 10,
            size: 1,
        });
    }
}

gameZone.addEventListener('click', (event)=>{
    startingNewGame();
});