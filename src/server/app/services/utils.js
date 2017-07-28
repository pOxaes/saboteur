const isFunction = foo => ({}.toString.call(foo) === "[object Function]");

const isPromise = obj => obj && obj.then && isFunction(obj.then);

module.exports = {
  isPromise
};
