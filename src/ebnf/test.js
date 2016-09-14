const { inspect } = require('util');
const ins = value => inspect(value, { showHidden: false, depth: null });

const Lex = require('./lexic');

const source = [
  'number = 1digit, number;',
  'mul = number, "*", mul;',
  'add = mul, "+", add;'
].join('\n');

console.log(source);

console.time('Lexing');
const input = Lex(source);
console.timeEnd('Lexing');

console.log(input.length + ' tokens found');
console.log(ins(input));
