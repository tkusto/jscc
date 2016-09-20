module.exports = ASTNodeList;

const Production = require('../../parser/combinator/production');
const ASTNode = require('../../ast/node');
const match = require('../../utils/match');
const { assign, create, freeze } = Object;
const isArray = Array.isArray;
const concat = Array.prototype.concat.bind([]);
const delim = match.not({ type: 'punctuation', text: ',' });

function ASTNodeList(node, child) {
  ASTNode.call(this);
  this.items = isArray(child)? child.filter(delim): concat(child);
  freeze(this);
}
ASTNodeList.prototype = assign(
  create(ASTNode.prototype),
  { constructor: ASTNodeList }
);
