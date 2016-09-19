module.exports = AST;

const isArray = Array.isArray;
const concat = Array.prototype.concat.bind([]);
const filterPunct = node => node.type !== 'punctuation';

function AST(node, child) {
  switch (node.type) {
    case 'punctuation': return node;
    case 'identifier': return new ASTNodeId(node, child);
    case 'literal': return new ASTNodeLiteral(node, child);
    case 'term': return new ASTNodeTerm(node, child);
    case 'repeat': return new ASTNodeRepeat(node, child);
    case 'list': return new ASTNodeList(node, child);
    case 'alter': return new ASTNodeAlter(node, child);
    case 'rule': return new ASTNodeRule(node, child);
    case 'syntax': return new ASTNodeSyntax(node, child);
  }
}

function ASTNode() {}
ASTNode.prototype.visit = function () {};

function ASTNodeId(node, child) {
  ASTNode.call(this);
  this.name = node.value;
}
ASTNodeId.prototype = Object.create(ASTNode.prototype, { constructor: { value: ASTNodeId } });

function ASTNodeLiteral(node, child) {
  ASTNode.call(this);
  this.value = node.value;
}
ASTNodeLiteral.prototype = Object.create(ASTNode.prototype, { constructor: { value: ASTNodeLiteral } });

function ASTNodeTerm(node, child) {
  ASTNode.call(this);
  if (!child) {
    this.error = new SyntaxError('child expected');
  } else if (child.type === 'identifier') {
    return new ASTNodeId(child, null);
  } else if (child.type === 'literal') {
    return new ASTNodeLiteral(child, null);
  }
}
ASTNodeTerm.prototype = Object.create(ASTNode.prototype, { constructor: { value: ASTNodeTerm } });

function ASTNodeList(node, child) {
  ASTNode.call(this);
  this.items = isArray(child)? child.filter(filterPunct): concat(child);
}
ASTNodeList.prototype = Object.create(ASTNode.prototype, { constructor: { value: ASTNodeList } });

function ASTNodeAlter(node, child) {
  ASTNode.call(this);
  this.variants = isArray(child)? child.filter(filterPunct): concat(child);
}
ASTNodeAlter.prototype = Object.create(ASTNode.prototype, { constructor: { value: ASTNodeAlter } });

function ASTNodeRule(node, child) {
  ASTNode.call(this);
  this.name = child[0];
  this.production = child[2];
}
ASTNodeRule.prototype = Object.create(ASTNode.prototype, { constructor: { value: ASTNodeRule } });

function ASTNodeRepeat(node, child) {
  ASTNode.call(this);
  this.content = child[1];
}
ASTNodeRepeat.prototype = Object.create(ASTNode.prototype, { constructor: { value: ASTNodeRepeat } });

function ASTNodeSyntax(node, child) {
  ASTNode.call(this);
  this.rules = child;
}
ASTNodeSyntax.prototype = Object.create(ASTNode.prototype, { constructor: { value: ASTNodeSyntax } });
