module.exports = ASTNodeTerm;

const ASTNode = require('../../ast/node');
const { assign, create, freeze } = Object;

function ASTNodeTerm(node, child) {
  ASTNode.call(this);
  this.value = child;
  freeze(this);
}
ASTNodeTerm.prototype = assign(
  create(ASTNode.prototype),
  { constructor: ASTNodeTerm }
);
