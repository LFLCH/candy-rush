class CanvasEntities {
  player = {};
  opponents = [];
  candies = [];
  controller = new Controller();
  candyImages = {
    "-5": {
        "src" : "images/broccoli.png",
        "img" : null,
    }, 
    "1": {
        "src" : "images/candy.png",
        "img" : null,
    },
    "2": {
        "src" : "images/cookie.png",
        "img" : null,
    },
    "5": {
        "src" : "images/donut.png",
        "img" : null,
    },
    "10": {
        "src" : "images/cupcake.png",
        "img" : null,
    },
  };

  playerImage = {
    "src": "images/cowboy.png",
    "img" : null,
  }

  opponentImage = {
    "src": "images/deamon.png",
    "img" : null,
  }

  controllerImage = {
    "src": "images/arrow.png",
    "img" : null,
  }

  gameStatus = "WAITING...";
}
