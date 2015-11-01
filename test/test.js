const babel = require('babel');
const expect = require('expect');
const path = require('path');

describe('babel-plugin-auto-symbol-description', () => {
  function expectTransform(source, transformed) {
    const { code } = babel.transform(source, {
      plugins: [require('../index')],
    });
    expect(code).toBe(`"use strict";\n\n${transformed}`);
  }

  function expectNoTransform(source) {
    expectTransform(source, source);
  }

  describe('assignment', () => {
    it('assigns identifier as description', () => {
      expectTransform('s1 = Symbol();', 's1 = Symbol("s1");');
    });

    it('ignores symbols with description', () => {
      expectTransform('s1 = Symbol("a");', 's1 = Symbol("a");');
    });

    it('only works with = operator', () => {
      expectNoTransform('s1 += Symbol();');
    });
  });

  describe('variable declaration', () => {
    it('assigns identifier as description', () => {
      expectTransform('var s1 = Symbol();', 'var s1 = Symbol("s1");');
      expectTransform(
        'var s1 = Symbol(), s2 = Symbol();',
        'var s1 = Symbol("s1"),\n    s2 = Symbol("s2");'
      );
    });

    it('ignores symbols with description', () => {
      expectTransform('var s1 = Symbol("a");', 'var s1 = Symbol("a");');
    });
  });

  it('prepends description with filename', () => {
    const { code } = babel.transformFileSync(
      path.join(__dirname, 'fixtures', 'TodoActions.js'),
      { plugins: [require('../index')] }
    );
    expect(code).toBe(
      '"use strict";\n\nvar CREATE = Symbol("TodoActions.CREATE");'
    );
  });
});
