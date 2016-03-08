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
