/**
 * Production type
 * @module lib/parser/combinator/production
 */
module.exports = Production;

const freeze = Object.freeze;
const isArray = Array.isArray;

/**
 * Parser production representation
 * @constructor
 * @param {String} type - production type (same as token type)
 * @param {(Object|Object[])} content - production content
 */
function Production(type, content) {
  if (!(this instanceof Production)) {
    return new Production(type, content);
  }
  /** @member {String} */
  this.type = type;
  /** @member {(Object|Object[])} */
  this.content = unwrap(type, content);
  freeze(this);
}

Production.prototype.type = null;
Production.prototype.content = null;

function unwrap(type, value) {
  return isArray(value)? value.map(unwrapOne.bind(null, type)): unwrapOne(type, value);
}

function unwrapOne(type, value) {
  return value instanceof Production && value.type === type? value.content: value;
}
