import path from 'path';

function assignDescriptionToSymbol(node, name, file) {
  const description = generateDescription(name, file);
  node.arguments = [{
    raw: `"${description}"`,
    type: 'Literal',
    value: description,
  }];
}

function generateDescription(name, file) {
  if (file && file.opts && file.opts.filename &&
      file.opts.filename !== 'unknown') {
    const basename = path.basename(file.log.filename).split('.')[0];
    return `${basename}.${name}`;
  } else {
    return name;
  }
}

function isSymbolWithoutDescription(node, t) {
  return t.isCallExpression(node) &&
    t.isIdentifier(node.callee, { name: 'Symbol' }) &&
    node.arguments.length === 0;
}

export default function({ Plugin, types: t }) {
  return new Plugin('remove-symbol-description', {
    visitor: {
      AssignmentExpression(node, parent, scope, file) {
        if (node.operator === '=') {
          const left = node.left;
          const right = node.right;

          if (isSymbolWithoutDescription(right, t) && t.isIdentifier(left)) {
            assignDescriptionToSymbol(right, left.name, file);
          }
        }
        return node;
      },

      VariableDeclaration(node, parent, scope, file) {
        node.declarations.forEach(declaration => {
          const init = declaration.init;
          if (init && isSymbolWithoutDescription(init, t)) {
            assignDescriptionToSymbol(init, declaration.id.name, file);
          }
        });
        return node;
      },
    },
  });
}
