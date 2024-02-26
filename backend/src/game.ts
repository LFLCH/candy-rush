import { CRPCandy, CRPGameState, CRPPlayer, CRPState } from "./protocol";

export class Game {
  static readonly CANDY_VALUES = [-5, 1, 2, 5, 10];

  static readonly MAX_PLAYERS = 5;

  private static readonly PLAYER_NAMES = [
    "Glucose",
    "Fructose",
    "Sucrose",
    "Maltose",
    "Galactose",
    "Saccharose",
  ] 

  // Enum available status for the game
  static readonly STATUS = {
    WAITING: "waiting",
    STARTED: "started",
    ENDED: "ended",
  };

  public candies: CRPCandy[];
  public candyCount: number;
  public players: CRPPlayer[];
  public status: string;

  constructor(candyCount: number = 30) {
    this.players = [];
    this.candies = [];
    this.candyCount = candyCount;
    this.init();
  }

  init() {
    console.log("Game is waiting for players to join");
    this.status = Game.STATUS.WAITING;
  }

  start() {
    console.log("Game is starting");
    this.status = Game.STATUS.STARTED;

     // Fill randomly the map with candies
     for (let i = 0; i < this.candyCount; i++) {
        this.candies.push(this.generateCandy(Game.CANDY_VALUES));
      }
  }

  end(){
    console.log("Game is ending");
    this.status = Game.STATUS.ENDED;

  }

  private generateCandy(possibleValues: number[]): CRPCandy {
    const value =
      possibleValues[Math.floor(Math.random() * possibleValues.length)];
    return {
      x: Math.random(),
      y: Math.random(),
      value: value,
      size: 0.05,
    };
  }

  addPlayer(playerId: string) {
    if (this.status == Game.STATUS.WAITING && this.players.length < Game.MAX_PLAYERS) {
      const player = this.players.find((player) => player.id === playerId);
      const playerPseudo = Game.PLAYER_NAMES[this.players.length];
      console.log("Player " + playerPseudo + " is joining the game");
      if(!player){
        this.players.push({
          id: playerId,
          pseudo: playerPseudo,
          x: Math.random(),
          y: Math.random(),
          size: 0.07,
          speed: 0.003,
          score: 0,
        });
        // Make a first move to avoid collision with other players
        this.movePlayer(playerId, Math.random() * 360);
      }
    }
  }

  movePlayer(playerId: string, angle: number) {
    const player = this.players.find((player) => player.id === playerId);
    let nextX = player.x + Math.cos(angle) * player.speed;
    let nextY = player.y + Math.sin(angle) * player.speed;
    if (player) {
      // Border collisions
      nextX = Math.min(1, Math.max(0, nextX));
      nextY =  Math.min(1, Math.max(0, nextY));
      // Player collisions
      for (const otherPlayer of this.players) {
        if (player.id !== otherPlayer.id && Game.collision(player, otherPlayer)) {
          const dx = otherPlayer.x - player.x;
          const dy = otherPlayer.y - player.y;
          const distance = Math.sqrt(dx ** 2 + dy ** 2);
          const overlap = (player.size + otherPlayer.size) / 2 - distance;
          if(distance !== 0){
            nextX -= (dx / distance) * overlap;
            nextY -= (dy / distance) * overlap;
          }
          else {
            // manage the case where the two players are at the same position
            // The current player moves horizontally to the other direction, and keeps the same y position
            nextX -= Math.cos(angle) * player.speed;
          }
          console.log("Collision between " + player.pseudo + " and " + otherPlayer.pseudo);
        }
      }
      player.x = nextX;
      player.y = nextY;
      // Check if the player is eating a candy
      this.candies = this.candies.filter((candy) => {
        if (Game.collision(player, candy)) {
          player.score += candy.value;
          return false;
        }
        return true;
      });

      // check if only negative candies are left
      if (this.status === Game.STATUS.STARTED &&  this.candies.every((candy) => candy.value < 0)) {
        this.end();
      }
    }
  }

  removePlayer(playerId: string) {
    this.players = this.players.filter((player) => player.id !== playerId);
  }

  private static collision(
    a: { x: number; y: number; size: number },
    b: { x: number; y: number; size: number }
  ): boolean {
    return (
      Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) < (a.size + b.size) / 2
    );
  }

  export(): CRPState {
    if (this.status === Game.STATUS.WAITING) {
      return {
        players: this.players,
        remainingTime: 0,
        maximalPlayersNumber: 4,
      };
    }
    return {
      players: this.players,
      candies: this.candies,
    };
  }
}
