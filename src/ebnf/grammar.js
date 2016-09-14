/**
 * EBNF grammar
 * @module src/ebnf/grammar
 */
module.exports = syntax;

const { Term, Text, Opt, Alt, Repeat, Seq, Production } = require('../../lib/parser/combinator/combinators');

function term(input, pos) {
  const parser = Production('term', Alt(Term('identifier', Term('literal'))));
  return parser(input, pos);
}

function group(input, pos) {
  const parser = Production('group', Seq(Text('('), rhs, Text(')')));
  return parser(input, pos);
}

function optional(input, pos) {
  const parser = Production('optional', Seq(Text('['), rhs, Text(']')));
  return parser(input, pos);
}

function repeat(input, pos) {
  const parser = Production('repeat', Seq(Text('{'), rhs, Text('}')));
  return parser(input, pos);
}

function item(input, pos) {
  const parser = Production('item', Alt(term, group, optional, repeat));
  return parser(input, pos);
}

function list(input, pos) {
  const parser = Production('list', Repeat(Seq(item, Opt(Text(',')))));
  return parser(input, pos);
}

function alter(input, pos) {
  const parser = Production('alter', Repeat(Seq(list, Opt(Text('|')))));
  return parser(input, pos);
}

function rhs(input, pos) {
  const parser = Production('rhs', Repeat(alter));
  return parser(input, pos);
}

function rule(input, pos) {
  const parser = Production('rule', Seq(Term('identifier'), Text('='), rhs, Text(';')));
  return parser(input, pos);
}

function syntax(input, pos) {
  const parser = Production('syntax', Repeat(rule));
  return parser(input, pos);
}
