var HEIGHT = 480;
var WIDTH = 1024;
var CARD_WIDTH = 192;
var CARD_HEIGHT = 256;
var CARD_CONTENT_SIZE = 96;

module.exports = function (card, cardToDisplay) {
  card.graphics.beginStroke('black').beginFill('white').drawRect(
    WIDTH * 0.75 - CARD_WIDTH * 0.5,
    HEIGHT * 0.5 - CARD_HEIGHT * 0.5,
    CARD_WIDTH,
    CARD_HEIGHT
  );

  if (cardToDisplay.times === 1) {
    card.graphics.beginStroke(null).beginFill(cardToDisplay.color).drawRect(
      WIDTH * 0.75 - CARD_CONTENT_SIZE * 0.5,
      HEIGHT * 0.5 - CARD_CONTENT_SIZE * 0.5,
      CARD_CONTENT_SIZE,
      CARD_CONTENT_SIZE
    );
  } else {
    card.graphics.beginStroke(null).beginFill(cardToDisplay.color).drawRect(
      WIDTH * 0.75 - CARD_CONTENT_SIZE * 0.5,
      HEIGHT * 0.5 - CARD_CONTENT_SIZE * 1.1,
      CARD_CONTENT_SIZE,
      CARD_CONTENT_SIZE
    );
    card.graphics.beginStroke(null).beginFill(cardToDisplay.color).drawRect(
      WIDTH * 0.75 - CARD_CONTENT_SIZE * 0.5,
      HEIGHT * 0.5 + CARD_CONTENT_SIZE * 0.1,
      CARD_CONTENT_SIZE,
      CARD_CONTENT_SIZE
    );
  }
};
