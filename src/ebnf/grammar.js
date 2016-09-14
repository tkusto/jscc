/**
 * EBNF grammar
 * @module src/ebnf/grammar
 */
module.exports = syntax;

const { Term, Text, Opt, Alt, Repeat, Seq, Prod } = require('../../lib/parser/combinator/combinators');

// term = identifier | literal ;
function term(input, pos) {
  const parser = Prod('term',
    Alt(
      Term('identifier'),
      Term('literal')
    )
  );
  return parser(input, pos);
}

// optional = "[" , rhs , "]" ;
function optional(input, pos) {
  const parser = Prod('optional',
    Seq(Text('['), alter, Text(']'))
  );
  return parser(input, pos);
}

// repeat = "{" , rhs , "}" ;
function repeat(input, pos) {
  const parser = Prod('repeat',
    Seq(Text('{'), alter, Text('}'))
  );
  return parser(input, pos);
}

// group = "(" , rhs , ")" ;
function group(input, pos) {
  const parser = Prod('group',
    Seq(Text('('), alter, Text(')'))
  );
  return parser(input, pos);
}

// item = term | optional | repeat | group ;
function item(input, pos) {
  const parser = Prod('item',
    Alt(
      term,
      optional,
      repeat,
      group
    )
  );
  return parser(input, pos);
}

// list = item , "," , list | item;
function list(input, pos) {
  const parser = Prod('list',
    Alt(
      Seq(item, Text(','), list),
      item
    )
  );
  return parser(input, pos);
} 

// alter = list , "|" , alter | list;
function alter(input, pos) {
  const parser = Prod('alter',
    Alt(
      Seq(list, Text('|'), alter),
      list
    )
  );
  return parser(input, pos);
}

// rule = identifier , "=" , rhs , ";" ;
function rule(input, pos) {
  const parser = Prod('rule',
    Seq(Term('identifier'), Text('='), alter, Text(';'))
  );
  return parser(input, pos);
}

// syntax = { rule } ;
function syntax(input, pos) {
  const parser = Prod('syntax', Repeat(rule));
  return parser(input, pos);
}
