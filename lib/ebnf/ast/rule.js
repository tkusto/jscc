module.exports = ASTNodeRule;

const ASTNode = require('../../ast/node');
const { assign, create, freeze } = Object;

function ASTNodeRule(node, child) {
  ASTNode.call(this);
  this.name = child[0];
  this.rule = child[2];
  freeze(this);
}
ASTNodeRule.prototype = assign(
  create(ASTNode.prototype),
  { constructor: ASTNodeRule }
);
