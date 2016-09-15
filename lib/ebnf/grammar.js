/**
 * EBNF grammar
 * @module src/ebnf/grammar
 */
module.exports = syntax;

const { Term, Text, Opt, Alt, Repeat, Seq, Prod } = require('../parser/combinator/combinators-lazy');

// term = identifier | literal ;
const _term = Prod('term',
  Alt(
    Term('identifier'),
    Term('literal')
  )
);

// optional = "[" , alter , "]" ;
const _optional = Prod('optional', Seq(Text('['), alter, Text(']')));

// repeat = "{" , alter , "}" ;
const _repeat = Prod('repeat', Seq(Text('{'), alter, Text('}')));

// group = "(" , alter , ")" ;
const _group = Prod('group', Seq(Text('('), alter, Text(')')));

// item = term | optional | repeat | group ;
const _item = Prod('item',
  Alt(
    term,
    optional,
    repeat,
    group
  )
);

// list = item , "," , list | item;
const _list = Prod('list',
  Alt(
    Seq(item, Text(','), list),
    item
  )
);

// alter = list , "|" , alter | list;
const _alter = Prod('alter',
  Alt(
    Seq(list, Text('|'), alter),
    list
  )
);

// rule = identifier , "=" , rhs , ";" ;
const _rule = Prod('rule',
  Seq(Term('identifier'), Text('='), alter, Text(';'))
);

// syntax = { rule } ;
const _syntax = Prod('syntax', Repeat(rule));

/** Use function declaration as wrappers for late-binding */

function term(input, pos) { return _term(input, pos); }

function optional(input, pos) { return _optional(input, pos); }

function repeat(input, pos) { return _repeat(input, pos); }

function group(input, pos) { return _group(input, pos); }

function item(input, pos) { return _item(input, pos); }

function list(input, pos) { return _list(input, pos); } 

function alter(input, pos) { return _alter(input, pos); }

function rule(input, pos) { return _rule(input, pos); }

function syntax(input, pos) { return _syntax(input, pos); }
