import {describe, expect, test} from '@jest/globals';
import { Game } from '../src/game';

describe('Game creation with candies only.', () => {
  const game = new Game(30);
  game.start();
  test('Game is created with 30 candies.', () => {
    expect(game.candies.length).toBe(30);
  });
  test('Game is created with no player.', () => {
    expect(game.players.length).toBe(0);
  });
});

describe('Game creation with two players.', () => {
  const game = new Game(30);
  game.addPlayer('A');
  game.addPlayer('B');
  test('Game is created with two players.', () => {
    expect(game.players.length).toBe(2);
  });
});

describe('Game creation. One player. Player moves of 90 degrees.', () => {
  const game = new Game(30);
  game.addPlayer('A');
  game.players[0].x = 0.5;
  game.players[0].y = 0.5;
  game.movePlayer('A', 90);
  test('Player "Jérémy" moves from 90 degrees.', () => {
    expect(game.players[0].x).toBeCloseTo(0.5);
    expect(game.players[0].y).toBeCloseTo(0.503);
  });
});

describe('Game creation. One player. Player moves of 30 degrees.', () => {
  const game = new Game(30);
  game.addPlayer('A');
  game.players[0].x = 0.5;
  game.players[0].y = 0.5;
  game.movePlayer('A', 30);
  test('Player "Jérémy" moves from 30 degrees.', () => {
    expect(game.players[0].x).toBeCloseTo(0.5015, 1);
    expect(game.players[0].y).toBeCloseTo(0.5026, 1);
  });
});

describe('Game creation. One player. Player eats one candy. One candy is popped.', () => {
  const game = new Game(1);
  game.addPlayer('A');
  game.players[0].x = 0.5;
  game.players[0].y = 0.5;
  game.start()
  // The position of the player after moving from 90 degrees
  game.candies[0].x = 0.49865577915161247;
  game.candies[0].y = 0.5026819899908017;
  game.movePlayer('A', 90);
  test('Player "Jérémy" eats the candy at (0.5, 0.5).', () => {
    expect(game.candies.length).toBe(0);
  });
});

describe('Game creation. 5 players. All the players should be corrrectly added.', () => {
  const game = new Game(30);
  game.addPlayer('A');
  game.addPlayer('B');
  game.addPlayer('C');
  game.addPlayer('D');
  game.addPlayer('E');
  test('Game is created with 5 players.', () => {
    expect(game.players.length).toBe(5);
  });
});

describe('Game creation. 6 players. Only the 5 first players should be added.', () => {
  const game = new Game(30);
  game.addPlayer('A');
  game.addPlayer('B') ;
  game.addPlayer('C');
  game.addPlayer('D');
  game.addPlayer('E');
  game.addPlayer('F');
  test('Game is created with 5 players.', () => {
    expect(game.players.length).toBe(5);
  });
});

describe('Game creation. 5 players. One player is removed.', () => {
  const game = new Game(30);
  game.addPlayer('A');
  game.addPlayer('B');
  game.addPlayer('C');
  game.addPlayer('D');
  game.addPlayer('E');
  game.removePlayer('C');
  test('Game is created with 4 players.', () => {
    expect(game.players.length).toBe(4);
  });
});


describe('Game creation. 2 players. The second has the same id as the first.', () => {
  const game = new Game(30);
  game.addPlayer('A');
  game.addPlayer('A');
  test('Game is created with 1 player.', () => {
    expect(game.players.length).toBe(1);
    expect(game.players[0].pseudo).toBe('Glucose');
  });
});

describe("Game initialisation with 2 players at the same position", () => {
  const game = new Game(30);
  game.addPlayer('A');
  game.addPlayer('B');
  game.players[0].x = 0.5;
  game.players[0].y = 0.5;
  game.players[1].x = 0.5;
  game.players[1].y = 0.5;
  game.movePlayer('A', 90);
  game.movePlayer('B', 270);
  game.movePlayer('A', 270);
  game.movePlayer('B', 90);
  test('The players must not be at the same position.', () => {
    // we check that the players are not at the same position
    // console.log(game.players);
    expect({x: game.players[0].x, y: game.players[0].y}).not.toEqual({x: game.players[1].x, y: game.players[1].y});
  });
});