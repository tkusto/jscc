module.exports = ASTNodeAlter;

const ASTNode = require('../../ast/node');
const match = require('../../utils/match');
const { assign, create, freeze } = Object;
const isArray = Array.isArray;
const concat = Array.prototype.concat.bind([]);
const delim = match.not({ type: 'punctuation', text: '|' });

function ASTNodeAlter(node, child) {
  ASTNode.call(this);
  this.variants = isArray(child)? child.filter(delim): concat(child);
  freeze(this);
}
ASTNodeAlter.prototype = assign(
  create(ASTNode.prototype),
  { constructor: ASTNodeAlter }
);
