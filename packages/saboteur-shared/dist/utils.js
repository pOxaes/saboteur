"use strict";

var isFunction = function isFunction(foo) {
  return {}.toString.call(foo) === "[object Function]";
};

var isPromise = function isPromise(obj) {
  return obj && obj.then && isFunction(obj.then);
};

var random = function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var randomPick = function randomPick(arr) {
  return arr[random(0, arr.length)];
};

var shuffle = function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue = void 0;
  var randomIndex = void 0;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

var throwError = function throwError(message) {
  var error = new Error();
  error.message = message;
  return error;
};

var promisify = function promisify(fn, that) {
  return function() {
    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    return new Promise(function(resolve, reject) {
      fn.apply(
        that,
        [].concat(args, [
          function(err, value) {
            return err ? reject(err) : resolve(value);
          }
        ])
      );
    });
  };
};

module.exports = {
  isPromise: isPromise,
  promisify: promisify,
  randomPick: randomPick,
  random: random,
  shuffle: shuffle,
  throwError: throwError
};
