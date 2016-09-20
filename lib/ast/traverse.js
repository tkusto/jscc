module.exports = Traverse;

const isArray = Array.isArray;
const isFunction = fn => fn instanceof Function;

function Traverse(tree, configs) {
  traverse(tree, configs);
}

function traverse(node, configs) {
  const config = configs[node.type];
  if (!config) return;
  if (isFunction(config.enter)) {
    config.enter(node);
  }
  if (config.child) {
    const child = node[config.child];
    if (isArray(child)) {
      child.forEach(ch => traverse(ch, configs));
    } else {
      traverse(child, configs);
    }
  }
  if (isFunction(config.leave)) {
    config.leave(node);
  }
}
