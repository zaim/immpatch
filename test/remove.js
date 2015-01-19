/* global describe, it */

'use strict';

var Immutable = require('immutable');
var expect = require('chai').expect;
var patch = require('../');
var testPathNotFound = require('./_util').testPathNotFound;


describe('remove', function () {

  testPathNotFound({ op: 'remove', path: '/not/here' });

  it('should remove an element from self', function () {
    var ob = Immutable.fromJS([ 1, 'x', 2, 3 ]);
    var pa = patch(ob, { op: 'remove', path: '/1' });
    expect(pa.toJS()).to.eql([ 1, 2, 3 ]);
  });

  it('should remove a property from self', function () {
    var ob = Immutable.fromJS({ a: 1, x: 'x' });
    var pa = patch(ob, { op: 'remove', path: '/x' });
    expect(pa.toJS()).to.eql({ a: 1 });
  });

  it('should remove an element from an array member', function () {
    var ob = Immutable.fromJS({ a: [1, 'x', 2, 3] });
    var pa = patch(ob, { op: 'remove', path: '/a/1' });
    expect(pa.toJS()).to.eql({ a: [1, 2, 3] });
  });

  it('should remove an element from a nested array member', function () {
    var ob = Immutable.fromJS({ a: { b: [1, 'x', 2, 3] } });
    var pa = patch(ob, { op: 'remove', path: '/a/b/1' });
    expect(pa.toJS()).to.eql({ a: { b: [1, 2, 3] } });
  });

  it('should remove a property from a nested object member', function () {
    var ob = Immutable.fromJS({ a: { b: { c: 1, d: 'x' } } });
    var pa = patch(ob, { op: 'remove', path: '/a/b/d' });
    expect(pa.toJS()).to.eql({ a: { b: { c: 1 } } });
  });

});
