/**
 * Lexer
 * @module lib/lexer/lexer
 */
module.exports = Lexer;

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
    let tokens = [];
    let pos = 0;
    while (pos < input.length) {
      let token = null;
      matchers.some(matcher => {
        token = matcher(input, pos);
        return Boolean(token);
      });
      if (token) {
        if (!ignore.has(token.type)) {
          tokens.push(token);
        }
        pos += token.text.length;
      }
    }
    return tokens;
  }
}
