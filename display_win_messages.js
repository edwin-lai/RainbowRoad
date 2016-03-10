/* global createjs */
var PLAYER_COLORS = require('./player_colors.js');

var refresh = function () {
  window.location.reload();
};

module.exports = function (stage, turn, NUM_PLAYERS) {
  var winMessage = new createjs.Text(
    PLAYER_COLORS[turn % NUM_PLAYERS] + ' wins!',
    '128px Raleway',
    '#ffffff'
  );
  winMessage.x = 192;
  winMessage.y = 60;
  var winMessageOutline = winMessage.clone();
  winMessageOutline.outline = 4;
  winMessageOutline.color = '#000000';
  var playAgain = new createjs.Text(
    'Play Again?',
    '128px Raleway',
    '#ffffff'
  );
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
  stage.addChild(
    winMessage,
    winMessageOutline,
    playAgain,
    playAgainOutline);
};
