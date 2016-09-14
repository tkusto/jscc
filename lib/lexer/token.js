/**
 * Token
 * @module lib/lexer/token
 */
module.exports = Token;

const freeze = Object.freeze;

/**
 * Token representation
 * @constructor
 * @param {String} type - token type
 * @param {Number} index - position in the input string
 * @param {String} text - raw text of token
 * @param {*} value - value of token
 */
function Token(type, index, text, value) {
  if (!(this instanceof Token)) {
    return new Token(type, index, text, value);
  }
  /** @type {String} */
  this.type = type;
  /** @type {Number} */
  this.index = index;
  /** @type {String} */
  this.text = text;
  /** @type {*} */
  this.value = value;
  freeze(this);
}
