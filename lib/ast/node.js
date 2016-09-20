/**
 * AST node
 * @module lib/ast/ast-node
 */
module.exports = ASTNode;

function ASTNode() {
  // base constructor
}

ASTNode.prototype.visit = function visit() {
  throw new Error('Method ASTNode.visit() should be implemented');
}
