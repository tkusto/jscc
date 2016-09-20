module.exports = ASTNodeId;

const ASTNode = require('../../ast/node');
const { assign, create, freeze } = Object;

function ASTNodeId(node, child) {
  ASTNode.call(this);
  this.name = node.value;
  freeze(this);
}
ASTNodeId.prototype = assign(
  create(ASTNode.prototype),
  { constructor: ASTNodeId }
);
