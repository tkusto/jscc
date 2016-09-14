/**
 * Lexer
 * @module lib/lexer/lexer
 */
module.exports = Lexer;

const { min, max } = Math;

/**
 * Create lexers
 * @param {Function[]} matchers - ordered list of token matchers
 * @param {Set[]} ignore - types of token to ignore
 * @return {Function}
 */
function Lexer(matchers, ignore) {
  /**
   * Lexer function
   * @param {String} input - input string
   * @return {Token[]}
   */
  return function Lex(input) {
    const len = input.length;
    let tokens = [];
    let pos = 0;
    while (pos < len) {
      let token = null;
      matchers.some(matcher => {
        const match = matcher(input, pos);
        if (match !== null) {
          token = match;
          return true;
        }
        return false;
      });
      if (token) {
        if (!ignore.has(token.type)) {
          tokens.push(token);
        }
        pos += token.text.length;
      } else {
        const fragment = [
          input.slice(max(pos - 10, 0), pos),
          '->', input.charAt(pos), '<-',
          input.slice(min(pos + 1, len), min(pos + 11, len))
        ].join('');
        throw new SyntaxError('unexpected symbol at ' + pos + ' ' + fragment);
      }
    }
    return tokens;
  }
}
