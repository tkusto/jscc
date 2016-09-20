module.exports = ASTNodeSyntax;

const ASTNode = require('../../ast/node');
const { assign, create, freeze } = Object;

function ASTNodeSyntax(node, child) {
  ASTNode.call(this);
  this.rules = child;
  freeze(this);
}
ASTNodeSyntax.prototype = assign(
  create(ASTNode.prototype),
  { constructor: ASTNodeSyntax }
);
