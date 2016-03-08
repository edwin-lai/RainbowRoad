/* global createjs */
var COLORS = require('./colors.js');
var TILE_SIZE = 32;
var TILE_RADIUS = 4;
var HEIGHT = 480;
var Deck = require('./deck.js');
var RowColCalc = require('./rowColCalc.js');

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var stage = new createjs.Stage('canvas');
var board = new createjs.Shape();

var deck = new Deck;
deck.shuffle();

board.graphics.beginFill('black').drawRect(0, 0, 1, 32);
board.graphics.beginFill('black').drawRect(0, 0, 32, 1);
board.graphics.beginFill('black').drawRect(0, 31, 32, 1);
board.graphics.beginFill('black').drawRect(31, 0, 1, 32);
for (var j = 0; j < COLORS.length; j++) {
  board.graphics.beginFill(COLORS[j]).drawRect(1, j * 5 + 1, 30, 5);
}

for (var i = 0; i < 134; i++) {
  board.graphics.beginFill(COLORS[i % 6]).drawRect(
    TILE_SIZE * RowColCalc.columnNumber(i),
    HEIGHT - TILE_SIZE * RowColCalc.rowNumber(i),
    TILE_SIZE,
    TILE_SIZE
  );
}

stage.addChild(board);
stage.update();
