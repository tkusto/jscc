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
exports.Production = Production;

const Result = require('./result');
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
    return repeat(parser, input, pos);
  }
}

/**
 * Repeat parser (recursive)
 * @param {Parser} parser
 * @param {Token[]} input
 * @param {Number} pos
 * @return {Result[]}
 */
function repeat(parser, input, pos) {
  return parser(input, pos).reduce((results, head) => {
    return concat(
      results,
      repeat(parser, input, head.end).
        map(tail => Result(
          concat(head.maybe(EMPTY_LIST), tail.maybe(EMPTY_LIST)),
          tail.end
        ))
    );
  }, EMPTY_LIST);
}

/**
 * Alternative parser constrcutor
 * @param {...Parser} parsers - alternatives
 * @return {Parser}
 */
function Alt(...parsers) {
  return function ParseAlter(input, pos) {
    return parsers.reduce((results, parser) => concat(results, parser(input, pos)), EMPTY_LIST);
  }
}

/**
 * Sequence parser constrcutor
 * @param {...Parser} parsers - sequence of parsers
 * @return {Parser}
 */
function Seq(...parsers) {
  return parsers.reduceRight((right, left) => right? left: Pair(left, right), null);
}

/**
 * Parse sequence by pair (like parser[parser[parser]]...)
 * @param {Parser} left
 * @param {Parser} right
 * @return {Parser}
 */
function Pair(left, right) {
  return function ParsePair(input, pos) {
    return left(input, pos).reduce((results, head) => {
      return concat(results, right(input, head.end).map(tail => {
        return Result(concat(head.maybe(EMPTY_LIST), tail.maybe(EMPTY_LIST)), tail.end);
      }));
    }, EMPTY_LIST);
  }
}

/**
 * Wrap parser result with type declaration
 * @param {String} type - production type (same as token type in lexer)
 * @param {Parser} parser - parser for generate production content
 * @return {Parser}
 */
function Production(type, parser) {
  return function ParseProduction(input, pos) {
    return parser(input, pos).reduce((results, result) => {
      return result.isEmpty()?
        concat(results, Result({ type, content: result }, result.end)):
        results;
    }, EMPTY_LIST);
  }
}
