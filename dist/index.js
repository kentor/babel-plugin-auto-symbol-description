'use strict';

var path = require('path');

function assignDescriptionToSymbol(node, name, file) {
  var description = generateDescription(name, file);
  node.arguments = [{
    raw: '"' + description + '"',
    type: 'StringLiteral',
    value: description
  }];
}

function generateDescription(name, file) {
  if (file && file.opts && file.opts.filename && file.opts.filename !== 'unknown') {
    var basename = path.basename(file.opts.filename).split('.')[0];
    return basename + '.' + name;
  } else {
    return name;
  }
}

function isSymbolWithoutDescription(node, t) {
  return t.isCallExpression(node) && t.isIdentifier(node.callee, { name: 'Symbol' }) && node.arguments.length === 0;
}

module.exports = function (_ref) {
  var t = _ref.types;

  return {
    visitor: {
      AssignmentExpression: function AssignmentExpression(_ref2, _ref3) {
        var node = _ref2.node;
        var file = _ref3.file;

        if (node.operator === '=') {
          var left = node.left;
          var right = node.right;

          if (isSymbolWithoutDescription(right, t) && t.isIdentifier(left)) {
            assignDescriptionToSymbol(right, left.name, file);
          }
        }
      },
      VariableDeclaration: function VariableDeclaration(_ref4, _ref5) {
        var node = _ref4.node;
        var file = _ref5.file;

        node.declarations.forEach(function (declaration) {
          var init = declaration.init;
          if (init && isSymbolWithoutDescription(init, t)) {
            assignDescriptionToSymbol(init, declaration.id.name, file);
          }
        });
      }
    }
  };
};
