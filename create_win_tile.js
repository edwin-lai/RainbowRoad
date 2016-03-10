/* global createjs */
var TILE_COLORS = require('./tile_colors.js');
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
