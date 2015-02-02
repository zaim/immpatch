/* global describe, it */

'use strict';

var Immutable = require('immutable');
var expect = require('chai').expect;
var patch = require('../');


describe('examples in README.md', function () {

  it('should work', function () {
    var object = Immutable.fromJS({ baz: 'qux', foo: 'bar' });
    var patched = patch(object, [
      { op: 'replace', path: '/baz', value: 'boo' },
      { op: 'add', path: '/hello', value: ['world'] },
      { op: 'remove', path: '/foo'}
    ]);
    expect(patched.toJS()).to.eql({
      baz: 'boo',
      hello: ['world']
    });
  });

});
