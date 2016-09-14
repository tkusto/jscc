const Lexer = require('../../lib/lexer/lexer');
const { Text, Pattern } = require('../../lib/lexer/matchers');

const whitespace = Text(
  'whitespace',
  [' ', '\t', '\v', '\r', '\n', '\f', '\b', '\u00a0']
);

const punctuation = Text(
  'punctuation',
  ['=', '|', ';', ',', '{', '}', '[', ']', '(', ')'],
  false
);

const identifier = Pattern(
  'identifier',
  /([a-z_-](?:[\w\d -]*[\w\d])?)/i,
  m => m[1]
);

const literal = Pattern(
  'literal',
  /(['"])((?:\\\1|.)*?)\1/,
  m => m[2]
);

const comment = Pattern(
  'comment',
  /\(\*\s*(.*?)\s*\*\)/i,
  m => m[1]
);

/**
 * EBNF lexic
 * @module src/ebnf/lexic
 */
module.exports = Lexer(
  [whitespace, comment, punctuation, literal, identifier],
  new Set(['whitespace', 'comment'])
);
