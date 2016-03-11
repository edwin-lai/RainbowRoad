/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* global createjs */
	var PLAYER_COLORS = __webpack_require__(1);
	var TILE_COLORS = __webpack_require__(2);
	var QUADRANTS = __webpack_require__(3);
	var TILE_SIZE = 32;
	var TOKEN_RADIUS = 6;
	var HEIGHT = 480;
	var WIDTH = 1024;
	var CARD_WIDTH = 192;
	var CARD_HEIGHT = 256;
	var CARD_CONTENT_SIZE = 96;
	var NUM_PLAYERS = 4;
	var Deck = __webpack_require__(4);
	var RowColCalc = __webpack_require__(5);
	var Tile = __webpack_require__(6);
	var Player = __webpack_require__(7);
	var winTile = __webpack_require__(8);
	var displayCard = __webpack_require__(9);
	var displayWinMessages = __webpack_require__(10);
	
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var stage = new createjs.Stage('canvas');
	var tiles = [];
	var player = [];
	var turn = 0;
	var deck = new Deck();
	
	stage.enableDOMEvents(true);
	stage.enableMouseOver(10);
	
	createjs.Ticker.addEventListener("tick", function () {
	  stage.update(event);
	});
	
	for (var k = 0; k < NUM_PLAYERS; k++) {
	  player.push(new Player(k, 0));
	}
	
	deck.shuffle();
	
	stage.addChild(winTile());
	
	for (var i = 0; i < 134; i++) {
	  var tile = new Tile(i, TILE_SIZE * RowColCalc.columnNumber(i), HEIGHT - TILE_SIZE * RowColCalc.rowNumber(i), TILE_COLORS[i % 6]);
	  tiles.push(tile);
	  tile.graphic.graphics.beginStroke('white').beginFill(tile.color).drawRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE);
	  tile.graphic.alpha = 0.5;
	  stage.addChild(tile.graphic);
	}
	
	for (var m = 0; m < player.length; m++) {
	  player[m].token.set({
	    graphics: new createjs.Graphics().beginStroke('black').beginFill(PLAYER_COLORS[m]).drawCircle(0, 0, TOKEN_RADIUS),
	    x: tiles[0].x + TILE_SIZE * QUADRANTS[m].x,
	    y: tiles[0].y + TILE_SIZE * QUADRANTS[m].y
	  });
	  stage.addChild(player[m].token);
	}
	
	var card = new createjs.Shape();
	var wipeCard = function () {
	  card.graphics.beginStroke('black').beginFill('white').drawRect(WIDTH * 0.75 - CARD_WIDTH * 0.5, HEIGHT * 0.5 - CARD_HEIGHT * 0.5, CARD_WIDTH, CARD_HEIGHT);
	};
	wipeCard();
	stage.addChild(card);
	
	var status = new createjs.Text('Current Player: ' + PLAYER_COLORS[turn % NUM_PLAYERS], '20px Raleway', '#ffffff');
	status.x = 672;
	status.y = 80;
	
	stage.addChild(status);
	
	var moveToken = function (currentPlayer) {
	  createjs.Tween.get(currentPlayer.token).to({
	    x: tiles[currentPlayer.position].x + TILE_SIZE * QUADRANTS[turn % NUM_PLAYERS].x,
	    y: tiles[currentPlayer.position].y + TILE_SIZE * QUADRANTS[turn % NUM_PLAYERS].y
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
	  return createjs.Tween.get(tiles[position].graphic, { loop: true }).to({ alpha: 1 }, 1000);
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
	  var start = origPos + 1 + 6 * (cardDrawn.times - 1);
	
	  displayCard(card, cardDrawn);
	
	  for (var n = start; n < start + 6; n++) {
	    if (n > 133) {
	      // win condition
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
	      tiles[currentPlayer.position].graphic.addEventListener('click', function () {
	        deblink(endTileTween, currentPlayer.position);
	        moveToken(currentPlayer);
	      });
	    });
	  } else {
	    setTimeout(moveToken.bind(this, currentPlayer), 1000);
	  }
	};
	
	var playTurnListener = card.addEventListener('click', playTurn);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = ['red', 'yellow', 'green', 'blue'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ['red', 'purple', 'yellow', 'blue', 'orange', 'green'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 }, { x: 0.25, y: 0.75 }, { x: 0.75, y: 0.75 }];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var COLORS = __webpack_require__(2);
	var cards = [];
	
	var generate = function () {
	  for (var i = 0; i < COLORS.length; i++) {
	    for (var j = 0; j < 6; j++) {
	      cards.push({ color: COLORS[i], times: 1 });
	    }
	    for (var k = 0; k < 4; k++) {
	      cards.push({ color: COLORS[i], times: 2 });
	    }
	  }
	};
	
	generate();
	
	function deck() {
	  this.cards = cards;
	  this.drawnCards = [];
	
	  this.draw = function () {
	    if (this.cards.length > 0) {
	      this.drawnCards.push(this.cards.pop());
	    } else {
	      this.cards = this.drawnCards;
	      this.drawnCards = [];
	      this.shuffle();
	      this.drawnCards.push(this.cards.pop());
	    }
	    return this.drawnCards[this.drawnCards.length - 1];
	  };
	
	  this.shuffle = function () {
	    if (this.cards.length === 60) {
	      var i = 0,
	          j = 0,
	          temp = null;
	
	      for (i = this.cards.length - 1; i > 0; i -= 1) {
	        j = Math.floor(Math.random() * (i + 1));
	        temp = this.cards[i];
	        this.cards[i] = this.cards[j];
	        this.cards[j] = temp;
	      }
	    }
	  };
	}
	
	module.exports = deck;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = {
	  rowNumber: function (i) {
	    if (i % 17 === 16) {
	      return (Math.floor(i / 17) + 1) * 2;
	    } else {
	      return (Math.floor(i / 17) + 1) * 2 - 1;
	    }
	  },
	
	  columnNumber: function (i) {
	    if ((Math.floor(i / 17) + 1) % 2) {
	      if (i % 17 === 16) {
	        return 15;
	      } else {
	        return i % 17;
	      }
	    } else {
	      if (i % 17 === 16) {
	        return 0;
	      } else {
	        return 15 - i % 17;
	      }
	    }
	  }
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	/* global createjs */
	
	module.exports = function Tile(position, x, y, color) {
	  this.position = position;
	  this.x = x;
	  this.y = y;
	  this.color = color;
	  this.graphic = new createjs.Shape();
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* global createjs */
	var PLAYER_COLORS = __webpack_require__(1);
	
	module.exports = function Player(num) {
	  this.num = num;
	  this.color = PLAYER_COLORS[num];
	  this.position = 0;
	  this.token = new createjs.Shape();
	  this.tween = createjs.Tween.get(this.token);
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* global createjs */
	var TILE_COLORS = __webpack_require__(2);
	var TILE_SIZE = 32;
	
	module.exports = function (stage) {
	  var winTile = new createjs.Shape();
	  winTile.graphics.beginFill('white').drawRect(0, 0, 1, TILE_SIZE);
	  winTile.graphics.beginFill('white').drawRect(0, 0, TILE_SIZE, 1);
	  winTile.graphics.beginFill('white').drawRect(0, 31, TILE_SIZE, 1);
	  winTile.graphics.beginFill('white').drawRect(31, 0, 1, TILE_SIZE);
	  for (var j = 0; j < TILE_COLORS.length; j++) {
	    winTile.graphics.beginFill(TILE_COLORS[j]).drawRect(1, j * 5 + 1, 30, 5);
	  }
	  return winTile;
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	var HEIGHT = 480;
	var WIDTH = 1024;
	var CARD_WIDTH = 192;
	var CARD_HEIGHT = 256;
	var CARD_CONTENT_SIZE = 96;
	
	module.exports = function (card, cardToDisplay) {
	  card.graphics.beginStroke('black').beginFill('white').drawRect(WIDTH * 0.75 - CARD_WIDTH * 0.5, HEIGHT * 0.5 - CARD_HEIGHT * 0.5, CARD_WIDTH, CARD_HEIGHT);
	
	  if (cardToDisplay.times === 1) {
	    card.graphics.beginStroke(null).beginFill(cardToDisplay.color).drawRect(WIDTH * 0.75 - CARD_CONTENT_SIZE * 0.5, HEIGHT * 0.5 - CARD_CONTENT_SIZE * 0.5, CARD_CONTENT_SIZE, CARD_CONTENT_SIZE);
	  } else {
	    card.graphics.beginStroke(null).beginFill(cardToDisplay.color).drawRect(WIDTH * 0.75 - CARD_CONTENT_SIZE * 0.5, HEIGHT * 0.5 - CARD_CONTENT_SIZE * 1.1, CARD_CONTENT_SIZE, CARD_CONTENT_SIZE);
	    card.graphics.beginStroke(null).beginFill(cardToDisplay.color).drawRect(WIDTH * 0.75 - CARD_CONTENT_SIZE * 0.5, HEIGHT * 0.5 + CARD_CONTENT_SIZE * 0.1, CARD_CONTENT_SIZE, CARD_CONTENT_SIZE);
	  }
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* global createjs */
	var PLAYER_COLORS = __webpack_require__(1);
	
	var refresh = function () {
	  window.location.reload();
	};
	
	module.exports = function (stage, turn, NUM_PLAYERS) {
	  var winMessage = new createjs.Text(PLAYER_COLORS[turn % NUM_PLAYERS] + ' wins!', '128px Raleway', '#ffffff');
	  winMessage.x = 192;
	  winMessage.y = 60;
	  var winMessageOutline = winMessage.clone();
	  winMessageOutline.outline = 4;
	  winMessageOutline.color = '#000000';
	  var playAgain = new createjs.Text('Play Again?', '128px Raleway', '#ffffff');
	  playAgain.x = 200;
	  playAgain.y = 200;
	  var playAgainOutline = playAgain.clone();
	  playAgainOutline.outline = 4;
	  playAgainOutline.color = '#000000';
	  playAgain.addEventListener('mouseover', function () {
	    playAgain.color = 'yellow';
	  });
	  playAgainOutline.addEventListener('mouseover', function () {
	    playAgain.color = 'yellow';
	  });
	  playAgain.addEventListener('mouseout', function () {
	    playAgain.color = '#ffffff';
	  });
	  playAgainOutline.addEventListener('mouseout', function () {
	    playAgain.color = '#ffffff';
	  });
	  playAgain.addEventListener('click', refresh);
	  playAgainOutline.addEventListener('click', refresh);
	  stage.addChild(winMessage, winMessageOutline, playAgain, playAgainOutline);
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map