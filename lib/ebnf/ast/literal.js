module.exports = ASTNodeLiteral;

const ASTNode = require('../../ast/node');
const { assign, create, freeze } = Object;

function ASTNodeLiteral(node, child) {
  ASTNode.call(this);
  this.value = node.value;
  freeze(this);
}
ASTNodeLiteral.prototype = assign(
  create(ASTNode.prototype),
  { constructor: ASTNodeLiteral }
);
