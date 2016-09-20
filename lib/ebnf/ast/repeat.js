module.exports = ASTNodeRepeat;

const ASTNode = require('../../ast/node');
const { assign, create, freeze } = Object;

function ASTNodeRepeat(node, child) {
  ASTNode.call(this);
  this.content = child[1];
  freeze(this);
}
ASTNodeRepeat.prototype = assign(
  create(ASTNode.prototype),
  { constructor: ASTNodeRepeat }
);
