const isFunction = foo => ({}.toString.call(foo) === "[object Function]");

const isPromise = obj => obj && obj.then && isFunction(obj.then);

const random = (min, max) => Math.floor(Math.random() * (max - min) + min);

const randomPick = arr => {
  return arr[random(0, arr.length)];
};

const shuffle = array => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

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

const throwError = message => {
  const error = new Error();
  error.message = message;
  return error;
};

module.exports = {
  isPromise,
  randomPick,
  random,
  shuffle,
  throwError
};
