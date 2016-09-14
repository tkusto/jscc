/**
 * Matchers
 * @module lib/lexer/matchers
 */

exports.Text = Text;
exports.Pattern = Pattern;

const Token = require('./token');
const isArray = Array.isArray;
const isFunction = fn => fn instanceof Function;
const sortLiterals = (a, b) => b.length - a.length;
const toLowerCase = Function.prototype.call.bind(String.prototype.toLowerCase);

/**
 * Matches text lexeme from passed set
 * @param {String} type - token type
 * @param {String[]} set - set of lexemes to match
 * @param {Boolean} ignoreCase
 * @param {Function} getValue - function that extracts value from lexeme
 * @return {Function}
 */
function Text(type, set, ignoreCase, getValue) {
  const ordered = (ignoreCase? set.map(toLowerCase): set.slice()).sort(sortLiterals);
  /**
   * Matcher function
   * @param {String} input - string that should be tokenized
   * @param {Number} pos - position in input string to start match from
   * @return {Token}
   */
  return function MatchText(input, pos) {
    const source = ignoreCase? toLowerCase(input): input;
    let result = null;
    ordered.some(literal => {
      if (source.indexOf(literal, pos) === pos) {
        result = Token(type, pos, input.substr(pos, literal.length), isFunction(getValue)? getValue(literal): undefined);
        return true;
      }
      return false;
    });
    return result;
  }
}

/**
 * Matcher regular expression pattern
 * @param {String} type - token type
 * @param {RegExp} regex - regular expression pattern
 * @param {Function} getValue - function that extracts value from lexeme
 * @return {Function}
 */
function Pattern(type, regex, getValue) {
  /**
   * Matcher function
   * @param {String} input - string that should be tokenized
   * @param {Number} pos - position in input string to start match from
   * @return {Token}
   */
  return function MatchPattern(input, pos) {
    const truncated = input.slice(pos);
    const match = regex.exec(truncated);
    return match? Token(type, pos, match[0], isFunction(getValue)? getValue(match): undefined);
  }
}
