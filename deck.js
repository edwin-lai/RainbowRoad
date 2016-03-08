var COLORS = require('./colors.js');
var cards = [];

var generate = function () {
  for (var i = 0; i < COLORS.length; i++) {
    for (var j = 0; j < 8; j++) {
      cards.push({color: COLORS[i], times: 1});
    }
    for (var k = 0; k < 2; k++) {
      cards.push({color: COLORS[i], times: 2});
    }
  }
};

generate();

function deck () {
  this.cards = cards;
  this.drawnCards = [];

  this.draw = function () {
    if (this.cards.length > 0) {
      this.drawnCards.push(this.cards.pop());
      return this.drawnCards[this.drawnCards.length - 1];
    } else {
      this.cards = this.drawnCards;
      this.drawnCards = [];
      this.shuffle();
      this.draw();
    }
  };

  this.shuffle = function () {
    if (this.cards.length === 60) {
      var i = 0
        , j = 0
        , temp = null;

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
