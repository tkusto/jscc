/**
 * Production type
 * @module lib/parser/combinator/production
 */
module.exports = Production;

const Token = require('../../lexer/token');
const { create, freeze } = Object;
const isArray = Array.isArray;
const concat = Array.prototype.concat.bind([]);

/**
 * Parser production representation
 * @function
 * @param {String} type - production type (same as token type)
 * @param {(Object|Object[])} content - production content
 */
function Production(type, content) {
  // @TODO: investigate "list of lists" problem
  const _content = content.reduce(unwrap.bind(undefined, type), []);
  return _content.length > 1?
    Token(type, _content[0].start, _content[_content.length - 1].end, _content):
    _content;
}

/**
 * Unwrap production
 * @param {String} type - production type
 * @param {Array} list - results collection
 * @param {(*|Production)} item - collection item
 */
function unwrap(type, list, item) {
  return concat(list, item.type === type? item.value: item);
}
