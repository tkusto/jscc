/**
 * Parser combinators
 * @module lib/parser/combinator/combinators-lazy
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
  return function* ParseTerm(input, pos) {
    const token = input[pos];
    if (token && token.type === type) {
      yield Result(token, pos + 1);
    }
  }
}

/**
 * Text parser constructor
 * @param {String} text - token text
 * @return {Parser}
 */
function Text(text) {
  return function* ParseText(input, pos) {
    const token = input[pos];
    if (token && token.value === text) {
      yield Result(token, pos + 1);
    }
  }
}

/**
 * Optional parser constructor
 * @param {Parser} parser
 * @return {Parser}
 */
function Opt(parser) {
  return function* ParseOptional(input, pos) {
    let success = false;
    for (let result of parser(input, pos)) {
      if (result.end > pos && !result.isEmpty()) {
        success = true;
        yield result;
      }
    }
    if (!success) yield Result.Empty(pos);
  }
}

/**
 * Repeat parser constructor
 * @param {Parser} parser
 * @return {Parser}
 */
function Repeat(parser) {
  return function* ParseRepeat(input, pos) {
    let success = false;
    for (let head of parser(input, pos)) {
      if (head.end > pos && !head.isEmpty()) {
        success = true;
        let parsed = false;
        for (let tail of ParseRepeat(input, head.end)) {
          if (tail.end > head.end && !tail.isEmpty()) {
            parsed = true;
            yield Result(
              concat(head.value, tail.value),
              tail.end
            );
          }
        }
        if (!parsed) yield head;
      }
    }
    if (!success) yield Result.Empty(pos);
  }
}

/**
 * Alternative parser constrcutor
 * @param {...Parser} parsers - alternatives
 * @return {Parser}
 */
function Alt(...parsers) {
  return function* ParseAlt(input, pos) {
    for (let parser of parsers) {
      for (let result of parser(input, pos)) {
        yield result;
      }
    }
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
  return function* ParsePair(input, pos) {
    for (let head of left(input, pos)) {
      for (let tail of right(input, head.end)) {
        yield Result(
          concat(head.maybe(EMPTY_LIST), tail.maybe(EMPTY_LIST)),
          tail.end
        );
      }
    }
  }
}

/**
 * Wrap parser result with type declaration
 * @param {String} type - production type (same as token type in lexer)
 * @param {Parser} parser - parser for generate production content
 * @return {Parser}
 */
function Prod(type, parser) {
  return function* ParseProd(input, pos) {
    for (let result of parser(input, pos)) {
      yield result.isEmpty() || !isArray(result.value)? result: Result(Production(type, result.value), result.end);
    }
  }
}
