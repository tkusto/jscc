const { inspect } = require('util');
const ins = value => inspect(value, { showHidden: false, depth: null });

const Lex = require('../../lib/ebnf/lexic');
const Parse = require('../../lib/parser/combinator/parse');
const syntax = require('../../lib/ebnf/grammar');

const source = [
  'number = digit , {number};',
  'mul = number , "*", mul;',
  'add = mul , "+" , add;',
  'expr = add | paren;'
].join('\n');

console.log(source);

console.time('Lexing');
const input = Lex(source);
console.timeEnd('Lexing');

console.log(input.length + ' tokens found');
console.log(ins(input));

console.time('Parsing');
const parsed = Parse(syntax, input);
console.timeEnd('Parsing');

console.log(ins(parsed));
