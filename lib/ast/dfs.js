module.exports = DFS;

const isArray = Array.isArray;
const isFunction = fn => fn instanceof Function;

function DFS(root, visitor, children) {
  const getChildren = isFunction(children)? children: (node => node[children]);
  return visit(root, visitor, getChildren);
}

function visit(node, visitor, getChildren) {
  const children = getChildren(node);
  return visitor(
    node,
    children?
    (isArray(children)?
      children.map(node => visit(node, visitor, getChildren)):
      visit(children, visitor, getChildren)):
    null
  );
}
