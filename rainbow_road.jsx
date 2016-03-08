/* global createjs */
var COLORS = ['red', 'purple', 'yellow', 'blue', 'orange', 'green'];

var canvas = document.getElementById('canvas');
var stage = new createjs.Stage('canvas');

for (var i = 0; i < 12; i++) {
  var tile = new createjs.Shape();
  tile.graphics.beginFill(COLORS[i % 6]).drawRoundRect(i * 64, 702, 64, 64, 5);
  stage.addChild(tile);
  stage.update();
}
