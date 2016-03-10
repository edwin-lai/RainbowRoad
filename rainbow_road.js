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
var winTile = require('./create_win_tile.js');
var displayCard = require('./display_card.js');
var displayWinMessages = require('./display_win_messages.js');

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var stage = new createjs.Stage('canvas');
var tiles = [];
var player = [];
var turn = 0;
var deck = new Deck;

stage.enableDOMEvents(true);
stage.enableMouseOver(10);

createjs.Ticker.addEventListener("tick", function(){stage.update(event);});

for (var k = 0; k < NUM_PLAYERS; k++) {
  player.push(new Player(k, 0));
}

deck.shuffle();

stage.addChild(winTile());

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
  tile.graphic.alpha = 0.5;
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
var wipeCard = function () {
  card.graphics.beginStroke('black').beginFill('white').drawRect(
    WIDTH * 0.75 - CARD_WIDTH * 0.5,
    HEIGHT * 0.5 - CARD_HEIGHT * 0.5,
    CARD_WIDTH,
    CARD_HEIGHT
  );
};
wipeCard();
stage.addChild(card);

var status = new createjs.Text(
  'Current Player: ' + PLAYER_COLORS[turn % NUM_PLAYERS],
  '20px Raleway',
  '#ffffff'
);
status.x = 672;
status.y = 80;

stage.addChild(status);

var moveToken = function (currentPlayer) {
  createjs.Tween.get(currentPlayer.token).to({
    x: tiles[currentPlayer.position].x
      + TILE_SIZE * QUADRANTS[turn % NUM_PLAYERS].x,
    y: tiles[currentPlayer.position].y
      + TILE_SIZE * QUADRANTS[turn % NUM_PLAYERS].y
  }, 1000).call(advanceTurn);
};

var advanceTurn = function () {
  turn++;
  createjs.Tween.get(status).to({
    text: 'Current Player: ' + PLAYER_COLORS[turn % NUM_PLAYERS]
  }, 100);
  wipeCard();
  if (turn % NUM_PLAYERS < window.numHumans) {
    card.addEventListener('click', playTurnListener);
  } else {
    setTimeout(playTurn, 1000);
  }
};

var blink = function (position) {
  return createjs.Tween.get(tiles[position].graphic, {loop: true})
    .to({alpha: 1}, 1000);
};

var deblink = function (tween, position) {
  tween.setPaused(true);
  tiles[position].graphic.alpha = 0.5;
  tiles[position].graphic.removeAllEventListeners();
};

var playTurn = function (event) {
  card.removeAllEventListeners();
  var cardDrawn = deck.draw();
  var currentPlayer = player[turn % NUM_PLAYERS];
  var origPos = currentPlayer.position;
  var start = origPos + 1 + (6 * (cardDrawn.times - 1));

  displayCard(card, cardDrawn);

  for (var n = start; n < start + 6; n++) {
    if (n > 133) { // win condition
      createjs.Tween.get(currentPlayer.token).to({
        x: TILE_SIZE * QUADRANTS[turn % NUM_PLAYERS].x,
        y: TILE_SIZE * QUADRANTS[turn % NUM_PLAYERS].y
      }, 1000);
      card.removeAllEventListeners();
      displayWinMessages(stage, turn, NUM_PLAYERS);
      return;
    }
    if (tiles[n].color === cardDrawn.color) {
      currentPlayer.position = n;
      break;
    }
  }

  if (turn % NUM_PLAYERS < window.numHumans) {
    var startTileTween = blink(origPos);
    tiles[origPos].graphic.addEventListener('click', function () {
      deblink(startTileTween, origPos);
      var endTileTween = blink(currentPlayer.position);
      tiles[currentPlayer.position].graphic.addEventListener('click',
        function () {
          deblink(endTileTween, currentPlayer.position);
          moveToken(currentPlayer);
        }
      );
    });
  }
  else {
    setTimeout(moveToken.bind(this, currentPlayer), 1000);
  }
};

var playTurnListener = card.addEventListener('click', playTurn);
