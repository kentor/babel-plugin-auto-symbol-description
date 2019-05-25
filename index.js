const path = require('path');

function assignDescriptionToSymbol(node, name, file) {
  const description = generateDescription(name, file);
  node.arguments = [{
    raw: `"${description}"`,
    type: 'StringLiteral',
    value: description,
  }];
}

function generateDescription(name, file) {
  if (file && file.opts && file.opts.filename &&
      file.opts.filename !== 'unknown') {
    const basename = path.basename(file.opts.filename).split('.')[0];
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

module.exports = function({ types: t }) {
  return {
    visitor: {
      AssignmentExpression({ node }, { file }) {
        if (node.operator === '=') {
          const left = node.left;
          const right = node.right;

          if (isSymbolWithoutDescription(right, t) && t.isIdentifier(left)) {
            assignDescriptionToSymbol(right, left.name, file);
          }
        }
      },

      VariableDeclaration({ node }, { file }) {
        node.declarations.forEach(declaration => {
          const init = declaration.init;
          if (init && isSymbolWithoutDescription(init, t)) {
            assignDescriptionToSymbol(init, declaration.id.name, file);
          }
        });
      },
    },
  };
};
