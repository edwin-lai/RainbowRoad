/* global createjs */
var COLORS = ['red', 'purple', 'yellow', 'blue', 'orange', 'green'];
var TILE_SIZE = 32;
var TILE_RADIUS = 4;
var HEIGHT = 480;

var canvas = document.getElementById('canvas');
var stage = new createjs.Stage('canvas');
var board = new createjs.Shape();

var rowNumber = function (i) {
  if (i % 17 === 16) {
    return (Math.floor(i / 17) + 1) * 2;
  } else {
    return (Math.floor(i / 17) + 1) * 2 - 1;
  }
};

var columnNumber = function (i) {
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
};

board.graphics.beginFill('black').drawRect(0, 0, 1, 32);
board.graphics.beginFill('black').drawRect(0, 0, 32, 1);
board.graphics.beginFill('black').drawRect(0, 31, 32, 1);
board.graphics.beginFill('black').drawRect(31, 0, 1, 32);
for (var j = 0; j < COLORS.length; j++) {
  board.graphics.beginFill(COLORS[j]).drawRect(1, j * 5 + 1, 30, 5);
}

for (var i = 0; i < 134; i++) {
  board.graphics.beginFill(COLORS[i % 6]).drawRect(
    TILE_SIZE * columnNumber(i),
    HEIGHT - TILE_SIZE * rowNumber(i),
    TILE_SIZE,
    TILE_SIZE
  );
}

stage.addChild(board);
stage.update();
