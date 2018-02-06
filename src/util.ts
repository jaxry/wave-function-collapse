
export interface IStringLike {
  toString: () => string;
}

type domChild = Node | IStringLike;

export function buildDomTree(parent: Node, children: Array<domChild | domChild[]>): Node {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child instanceof Array) {
      const innerParent = children[i - 1];
      if (innerParent instanceof Node) {
        buildDomTree(innerParent, child);
      } else {
        console.warn("buildDomTree: Invalid argument format. Array must follow a Node");
      }
    } else {
      parent.appendChild(child instanceof Node ? child : document.createTextNode(child.toString()));
    }
  }

  return parent;
}
