'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function assignDescriptionToSymbol(node, name, file) {
  var description = generateDescription(name, file);
  node.arguments = [{
    raw: '"' + description + '"',
    type: 'Literal',
    value: description
  }];
}

function generateDescription(name, file) {
  if (file && file.opts && file.opts.filename && file.opts.filename !== 'unknown') {
    var basename = _path2['default'].basename(file.log.filename).split('.')[0];
    return basename + '.' + name;
  } else {
    return name;
  }
}

function isSymbolWithoutDescription(node, t) {
  return t.isCallExpression(node) && t.isIdentifier(node.callee, { name: 'Symbol' }) && node.arguments.length === 0;
}

exports['default'] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  return new Plugin('remove-symbol-description', {
    visitor: {
      AssignmentExpression: function AssignmentExpression(node, parent, scope, file) {
        if (node.operator == '=') {
          var left = node.left;
          var right = node.right;

          if (isSymbolWithoutDescription(right, t) && t.isIdentifier(left)) {
            assignDescriptionToSymbol(right, left.name, file);
          }
        }
        return node;
      },

      VariableDeclaration: function VariableDeclaration(node, parent, scope, file) {
        node.declarations.forEach(function (declaration) {
          var init = declaration.init;
          if (init && isSymbolWithoutDescription(init, t)) {
            assignDescriptionToSymbol(init, declaration.id.name, file);
          }
        });
        return node;
      }
    }
  });
};

module.exports = exports['default'];