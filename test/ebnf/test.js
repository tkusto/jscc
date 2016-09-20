const { inspect } = require('util');
const ins = value => inspect(value, { showHidden: false, depth: null });

const Lex = require('../../lib/ebnf/lexic');
const Parse = require('../../lib/parser/combinator/parse');
const syntax = require('../../lib/ebnf/grammar');
const AST = require('../../lib/ebnf/ast');
const dfs = require('../../lib/ast/dfs');

const source = [
  'number = digit , {number} ;',
  'mul = number , "*", mul | number ;',
  'add = mul , "+" , add | mul ;'
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

// const enter = n => console.log('enter ' + n.type);
// const leave = n => console.log('leave ' + n.type);
// const child = 'content';
// const cfg = {
//   syntax: { child, enter, leave },
//   rule: { child, enter, leave },
//   list: { child, enter, leave },
//   alter: { child, enter, leave },
//   term: { child, enter, leave }
// };

console.time('DFS');
const ast = dfs(parsed, AST, 'content');
console.timeEnd('DFS');

console.log(ins(ast));
