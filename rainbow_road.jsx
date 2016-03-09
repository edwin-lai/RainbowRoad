/* global createjs */
var PLAYER_COLORS = require('./player_colors.js');
var TILE_COLORS = require('./tile_colors.js');
var QUADRANTS = require('./quadrants.js');
var TILE_SIZE = 32;
var TOKEN_RADIUS = 6;
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
var winTile = new createjs.Shape();
var tiles = [];
var player = [];
var turn = 0;
var deck = new Deck;
deck.shuffle();

stage.enableDOMEvents(true);

createjs.Ticker.addEventListener("tick", function(){stage.update(event);});

for (var k = 0; k < NUM_PLAYERS; k++) {
  player.push(new Player(i, 0));
}

winTile.graphics.beginFill('white').drawRect(0, 0, 1, TILE_SIZE);
winTile.graphics.beginFill('white').drawRect(0, 0, TILE_SIZE, 1);
winTile.graphics.beginFill('white').drawRect(0, 31, TILE_SIZE, 1);
winTile.graphics.beginFill('white').drawRect(31, 0, 1, TILE_SIZE);
for (var j = 0; j < TILE_COLORS.length; j++) {
  winTile.graphics.beginFill(TILE_COLORS[j]).drawRect(1, j * 5 + 1, 30, 5);
}
stage.addChild(winTile);

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
  tile.graphic.graphics.beginStroke('white').beginFill(tile.color).drawRect(
    tile.x,
    tile.y,
    TILE_SIZE,
    TILE_SIZE
  );
  tile.graphic.addEventListener('click', logIdx.bind(this, event, i));
  stage.addChild(tile.graphic);
}

for (var m = 0; m < player.length; m++) {
  player[m].token.set({
    graphics: new createjs.Graphics().beginStroke('black')
      .beginFill(PLAYER_COLORS[m]).drawCircle(0, 0, TOKEN_RADIUS),
    x: tiles[0].x + TILE_SIZE * QUADRANTS[m].x,
    y: tiles[0].y + TILE_SIZE * QUADRANTS[m].y
  });
  stage.addChild(player[m].token);
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

  var currentPlayer = player[turn % NUM_PLAYERS];
  var origPos = currentPlayer.position;
  var start = origPos + 1 + (6 * (cardToDisplay.times - 1));

  for (var n = start; n < start + 6; n++) {
    if (n > 133) {
      createjs.Tween.get(currentPlayer.token).to({
        x: TILE_SIZE * QUADRANTS[turn % NUM_PLAYERS].x,
        y: TILE_SIZE * QUADRANTS[turn % NUM_PLAYERS].y
      }, 1000);
      stage.update();
      card.removeAllEventListeners();
      return;
    }
    if (tiles[n].color === cardToDisplay.color) {
      currentPlayer.position = n;
      break;
    }
  }

  createjs.Tween.get(currentPlayer.token).to({
    x: tiles[currentPlayer.position].x
      + TILE_SIZE * QUADRANTS[turn % NUM_PLAYERS].x,
    y: tiles[currentPlayer.position].y
      + TILE_SIZE * QUADRANTS[turn % NUM_PLAYERS].y
  }, 1000);

  turn++;
  stage.update();
});

stage.addChild(card);

var instructions = new createjs.Text(
  'Click Card to Play',
  '20px Raleway',
  '#ffffff'
);
instructions.x = 680;
instructions.y = 80;

stage.addChild(instructions);
stage.update();
