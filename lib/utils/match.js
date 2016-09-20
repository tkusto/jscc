module.exports = match;
module.exports.not = notMatch;

const isFunction = fn => fn instanceof Function;
const keys = Object.keys;
const every = Function.prototype.call.bind(Array.prototype.every);

function match(pattern, object) {
  switch (arguments.length) {
    case 0: return match;
    case 1: return match.bind(undefined, pattern);
    default:
      return (
        pattern === object ||
        every(keys(pattern), key => {
          const prop = pattern[key];
          return isFunction(prop)? prop(object[key], object): object[key] === prop;
        })
      );
  }
}

function notMatch(pattern, object) {
  switch (arguments.length) {
    case 0: return notMatch;
    case 1: return notMatch.bind(undefined, pattern);
    default: return !match(pattern, object);
  }
}
