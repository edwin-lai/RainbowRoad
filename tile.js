/* global createjs */

module.exports = function Tile (position, x, y, color) {
  this.position = position;
  this.x = x;
  this.y = y;
  this.color = color;
  this.graphic = new createjs.Shape;
};
