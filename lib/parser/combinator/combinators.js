/**
 * Parser combinators
 * @module lib/parser/combinator/combinators
 */
exports.Term = Term;
exports.Text = Text;
exports.Opt = Opt;
exports.Alt = Alt;
exports.Repeat = Repeat;
exports.Seq = Seq;
exports.Prod = Prod;

const Result = require('./result');
const Production = require('./production');
const isArray = Array.isArray;
const freeze = Object.freeze;
const EMPTY_LIST = freeze([]);
const concat = Array.prototype.concat.bind(EMPTY_LIST);

/**
 * @callback Parser
 * @param {Token[]} input
 * @param {Number} pos
 * @return {Result}
 */

/**
 * Term parser constructor
 * @param {String} type - token type
 * @return {Parser}
 */
function Term(type) {
  return function ParseTerm(input, pos) {
    const token = input[pos];
    return token && token.type === type? [Result(token, pos + 1)]: EMPTY_LIST;
  }
}

/**
 * Text parser constructor
 * @param {String} text - token text
 * @return {Parser}
 */
function Text(text) {
  return function ParseText(input, pos) {
    const token = input[pos];
    return token && token.text === text? [Result(token, pos + 1)]: EMPTY_LIST;
  }
}

/**
 * Optional parser constructor
 * @param {Parser} parser
 * @return {Parser}
 */
function Opt(parser) {
  return function ParseOptional(input, pos) {
    const result = parser(input, pos);
    return result.length > 0? result: [Result.Empty(pos)];
  }
}

/**
 * Repeat parser constructor
 * @param {Parser} parser
 * @return {Parser}
 */
function Repeat(parser) {
  return function ParseRepeat(input, pos) {
    let results = EMPTY_LIST;
    for (let head of parser(input, pos)) {
      if (head.end > pos && !head.isEmpty()) {
        let parsed = false;
        for (let tail of ParseRepeat(input, head.end)) {
          if (tail.end > head.end && !tail.isEmpty()) {
            parsed = true;
            results = concat(results, Result(
              concat(head.value, tail.value),
              tail.end
            ));
          }
        }
        if (!parsed) results = concat(results, head);
      }
    }
    return results.length > 0? results: [Result.Empty(pos)];
  }
}

/**
 * Alternative parser constrcutor
 * @param {...Parser} parsers - alternatives
 * @return {Parser}
 */
function Alt(...parsers) {
  return function ParseAlt(input, pos) {
    return parsers.reduce((results, parser) => concat(results, parser(input, pos)), EMPTY_LIST);
  }
}

/**
 * Sequence parser constrcutor
 * @param {...Parser} parsers - sequence of parsers
 * @return {Parser}
 */
function Seq(...parsers) {
  return parsers.reduceRight((right, left) => right? Pair(left, right): left, null);
}

/**
 * Parse sequence by pair (like parser[parser[parser]]...)
 * @param {Parser} left
 * @param {Parser} right
 * @return {Parser}
 */
function Pair(left, right) {
  return function ParsePair(input, pos) {
    let results = EMPTY_LIST;
    for (let head of left(input, pos)) {
      for (let tail of right(input, head.end)) {
        results = concat(results, Result(
          concat(head.maybe(EMPTY_LIST), tail.maybe(EMPTY_LIST)),
          tail.end
        ));
      }
    }
    return results;
  }
}

/**
 * Wrap parser result with type declaration
 * @param {String} type - production type (same as token type in lexer)
 * @param {Parser} parser - parser for generate production content
 * @return {Parser}
 */
function Prod(type, parser) {
  return function ParseProd(input, pos) {
    let results = EMPTY_LIST;
    for (let result of parser(input, pos)) {
      results = concat(results,
        result.isEmpty()? result: Result(Production(type, result.value), result.end)
      );
    }
    return results;
  }
}
