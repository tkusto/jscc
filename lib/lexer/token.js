/**
 * Token
 * @module lib/lexer/token
 */
module.exports = Token;

const { create, freeze } = Object;
const TokenPrototype = {
  type: null,
  index: NaN,
  text: null,
  value: null
};

/**
 * Token representation
 * @constructor
 * @param {String} type - token type
 * @param {Number} start - position in the input string
 * @param {Number} end - position where tocken ends
 * @param {*} value - value of token
 */
function Token(type, start, end, value) {
  const token = create(TokenPrototype);
  /** @type {String} */
  token.type = type;
  /** @type {Number} */
  token.start = start;
  /** @type {Number} */
  token.end = end;
  /** @type {*} */
  token.value = value;
  return freeze(token);
}
