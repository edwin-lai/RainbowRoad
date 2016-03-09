/* global createjs */
var PLAYER_COLORS = require('./player_colors.js');

module.exports = function Player(num) {
  this.num = num;
  this.color = PLAYER_COLORS[num];
  this.position = 0;
  this.token = new createjs.Shape();
  this.tween = createjs.Tween.get(this.token);
};
