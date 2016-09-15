/**
 * Production type
 * @module lib/parser/combinator/production
 */
module.exports = Production;

const freeze = Object.freeze;
const isArray = Array.isArray;
const concat = Array.prototype.concat.bind([]);

/**
 * Parser production representation
 * @constructor
 * @param {String} type - production type (same as token type)
 * @param {(Object|Object[])} content - production content
 */
function Production(type, content) {
  if (content instanceof Production && content.type === type) {
    return content;
  } else if (!(this instanceof Production)) {
    return new Production(type, content);
  }
  /** @member {String} */
  this.type = type;
  /** @member {(Object|Object[])} */
  this.content = isArray(content)? content.reduce(unwrap.bind(null, type), []): content;
  freeze(this);
}

Production.prototype.type = null;
Production.prototype.content = null;

/**
 * Unwrap production
 * @param {String} type - production type
 * @param {Array} list - results collection
 * @param {*|Production} item - collection item
 */
function unwrap(type, list, item) {
  const wrapped = item instanceof Production && item.type === type;
  return concat(list, wrapped? item.content: item);
}
