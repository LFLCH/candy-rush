function preload() {
    // broccoli = loadImage('images/broccoli.png'
    for(let key in entities.candyImages) {
        entities.candyImages[key].img = loadImage(entities.candyImages[key].src);
    }
    entities.playerImage.img = loadImage(entities.playerImage.src);

    entities.opponentImage.img = loadImage(entities.opponentImage.src);

    entities.controllerImage.img = loadImage(entities.controllerImage.src);
}

function setup() {
  const canvas = document.getElementsByTagName('canvas')[0];
  createCanvas(canvas.clientWidth, canvas.clientHeight, canvas)
}

function drawCandies(){
    for(let candy of entities.candies) {
        fill(color(57, 155, 252));
        const cdyPosition = toPixels(candy.x, candy.y);
        const cdyRadius = toPixels(candy.size, 0);
        // draw candy image 
        image(entities.candyImages[candy.value+""].img, cdyPosition.x - cdyRadius.x/2, cdyPosition.y - cdyRadius.y/2, cdyRadius.x, cdyRadius.x);
    }
}

function drawOponnents(){
    // color gray
    fill(color(200, 200, 200));
    for(let opponent of entities.opponents) {
        const oppPosition = toPixels(opponent.x, opponent.y);
        const oppDimensions = toPixels(opponent.size, opponent.size);
        // draw opponent image
        image(entities.opponentImage.img, oppPosition.x - oppDimensions.x/2, oppPosition.y - oppDimensions.y/2, oppDimensions.x, oppDimensions.y);
        // Write opponent name under the opponent
        fill(255);
        textSize(15);
        // color gray
        fill(color(200, 200, 200));
        textAlign(CENTER, CENTER);
        text("@" +opponent.pseudo, oppPosition.x, oppPosition.y + oppDimensions.y/2 + 10);
    }
}

function drawPlayer(){
    // Color magenta
    fill(color(234, 51, 247));
    const playerPosition = toPixels(entities.player.x, entities.player.y);
    const playerDimensions = toPixels(entities.player.size, entities.player.size);
    // draw player image
    image(entities.playerImage.img, playerPosition.x - playerDimensions.x/2, playerPosition.y - playerDimensions.y/2, playerDimensions.x, playerDimensions.y);

    // Write player name under the player
    fill(255);
    textSize(15);
    // color fushia
    fill(color(234, 51, 247));   
    textAlign(CENTER, CENTER);
    text("@" +entities.player.pseudo, playerPosition.x, playerPosition.y + playerDimensions.y/2 + 10);

}

function drawController(){
    const position = toPixels(entities.controller.x, entities.controller.y);
    const dimensions = toPixels(entities.controller.size,entities.controller.size);
    // draw controller as a triangle. It should be rotated to point to the mouse
    const angle = entities.controller.angle(entities.player.x, entities.player.y);
    push();
    translate(position.x, position.y);
    rotate(angle - PI/2);
    image(entities.controllerImage.img, 0, 0, dimensions.x, dimensions.y);
    pop();
}

function drawStatus(){
    fill(255);
    textSize(60);
    fill(color(69, 142, 247));
    // extract the text from the game status. Handle \n symbol
    const lines = entities.gameStatus.split("\n");
    let space = 0;
    for(let i = 0; i < lines.length; i++) {
        const size = i===0 ? .15 : .1;
        const pixSize = toPixels(1, size).y;
        textSize(pixSize);
        text(lines[i], width/2, pixSize + space);
        space += pixSize;
    }
    // text(entities.gameStatus, width/2, 0+50);
}


function draw() {
    clear();
    noStroke();

    drawStatus();

    drawCandies();
    drawOponnents();
    drawPlayer();
    drawController();

    controllerUpdate();

}

function controllerUpdate() {
    // distance between the player and the controller
    const dist = Math.sqrt((mouseX / width - entities.player.x)**2 + ( mouseY / height - entities.player.y)**2);
    if(entities.player.size/4 < dist) {
        entities.controller.move(mouseX / width, mouseY / height);
    }
}

function mouseMoved() {
//    controllerUpdate();
}

function mouseDragged() {
    // controllerUpdate();
}

function toPixels(x, y) {
    return{
        x: x * width,
        y: y * height
    }
}