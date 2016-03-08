/* global createjs */
var PLAYER_COLORS = require('./player_colors.js');
var TILE_COLORS = require('./tile_colors.js');
var QUADRANTS = require('./quadrants.js');
var TILE_SIZE = 32;
var TILE_RADIUS = 4;
var HEIGHT = 480;
var WIDTH = 1024;
var CARD_WIDTH = 192;
var CARD_HEIGHT = 256;
var CARD_CONTENT_SIZE = 96;
var NUM_PLAYERS = 4;
var Deck = require('./deck.js');
var RowColCalc = require('./rowColCalc.js');
var Tile = require('./tile.js');
var Player = require('./player.js');

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var stage = new createjs.Stage('canvas');
var board = new createjs.Shape();
var tiles = [];
var player = [];
var turn = 0;

var deck = new Deck;
deck.shuffle();

for (var k = 0; k < NUM_PLAYERS; k++) {
  player.push(new Player(i, 0));
}

board.graphics.beginFill('black').drawRect(0, 0, 1, 32);
board.graphics.beginFill('black').drawRect(0, 0, 32, 1);
board.graphics.beginFill('black').drawRect(0, 31, 32, 1);
board.graphics.beginFill('black').drawRect(31, 0, 1, 32);
for (var j = 0; j < TILE_COLORS.length; j++) {
  board.graphics.beginFill(TILE_COLORS[j]).drawRect(1, j * 5 + 1, 30, 5);
}

var logIdx = function (event, i) {
  console.log('I clicked on tile ' + i);
};

for (var i = 0; i < 134; i++) {
  var tile = new Tile(
    i,
    TILE_SIZE * RowColCalc.columnNumber(i),
    HEIGHT - TILE_SIZE * RowColCalc.rowNumber(i),
    TILE_COLORS[i % 6]
  );
  tiles.push(tile);
  tile.graphic.graphics.beginFill(tile.color).drawRect(
    tile.x,
    tile.y,
    TILE_SIZE,
    TILE_SIZE
  );
  tile.graphic.addEventListener('click', logIdx.bind(this, event, i));
  stage.addChild(tile.graphic);
}

for (var m = 0; m < player.length; m++) {
  tiles[0].graphic.graphics.beginStroke('black').beginFill(PLAYER_COLORS[m])
    .drawCircle(
      tiles[0].x + TILE_SIZE * QUADRANTS[m].x,
      tiles[0].y + TILE_SIZE * QUADRANTS[m].y,
      6
    );
}

var card = new createjs.Shape();
card.graphics.beginStroke('black').beginFill('white').drawRect(
  WIDTH * 0.75 - CARD_WIDTH * 0.5,
  HEIGHT * 0.5 - CARD_HEIGHT * 0.5,
  CARD_WIDTH,
  CARD_HEIGHT
);
card.addEventListener('click', function (event) {
  var cardToDisplay = deck.draw();
  card.graphics.beginStroke('black').beginFill('white').drawRect(
    WIDTH * 0.75 - CARD_WIDTH * 0.5,
    HEIGHT * 0.5 - CARD_HEIGHT * 0.5,
    CARD_WIDTH,
    CARD_HEIGHT
  );

  if (cardToDisplay.times === 1) {
    card.graphics.beginStroke(null).beginFill(cardToDisplay.color).drawRect(
      WIDTH * 0.75 - CARD_CONTENT_SIZE * 0.5,
      HEIGHT * 0.5 - CARD_CONTENT_SIZE * 0.5,
      CARD_CONTENT_SIZE,
      CARD_CONTENT_SIZE
    );
  } else {
    card.graphics.beginStroke(null).beginFill(cardToDisplay.color).drawRect(
      WIDTH * 0.75 - CARD_CONTENT_SIZE * 0.5,
      HEIGHT * 0.5 - CARD_CONTENT_SIZE * 1.1,
      CARD_CONTENT_SIZE,
      CARD_CONTENT_SIZE
    );
    card.graphics.beginStroke(null).beginFill(cardToDisplay.color).drawRect(
      WIDTH * 0.75 - CARD_CONTENT_SIZE * 0.5,
      HEIGHT * 0.5 + CARD_CONTENT_SIZE * 0.1,
      CARD_CONTENT_SIZE,
      CARD_CONTENT_SIZE
    );
  }



  stage.update();
});

stage.addChild(card);

stage.addChild(board);
stage.update();
