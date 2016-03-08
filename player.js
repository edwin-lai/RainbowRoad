/* global createjs */

module.exports = function Player(num) {
  this.num = num;
  this.position = 0;
  this.token = new createjs.Shape();
};
