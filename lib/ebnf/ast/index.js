module.exports = AST;

const ASTNodeId = require('./id');
const ASTNodeLiteral = require('./literal');
const ASTNodeTerm = require('./term');
const ASTNodeRepeat = require('./repeat');
const ASTNodeList = require('./list');
const ASTNodeAlter = require('./alter');
const ASTNodeRule = require('./rule');
const ASTNodeSyntax = require('./syntax');

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
