module.exports = DFS;

const isArray = Array.isArray;
const isFunction = fn => fn instanceof Function;

function DFS(root, visitor, child) {
  const getChild = isFunction(child)? child: (node => node[child]);
  return visit(root, visitor, getChild);
}

function visit(node, visitor, getChild) {
  const child = getChild(node);
  return visitor(
    node,
    child?
    (isArray(child)?
      child.map(node => visit(node, visitor, getChild)):
      visit(child, visitor, getChild)):
    null
  );
}
