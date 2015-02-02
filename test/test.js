/* global describe, it */

'use strict';

var Immutable = require('immutable');
var expect = require('chai').expect;
var patch = require('../');


describe('test', function () {

  it('should throw an error when value is not given', function () {
    expect(function () {
      patch(Immutable.fromJS({ a:1 }), { op: 'test', path: '/a' });
    }).to.throw(patch.Error, 'Invalid operation');
  });

  it('should pass when scalar value is equal', function () {
    var ob = Immutable.fromJS({ a: [1, 2, 3] });
    var pa = patch(ob, { op: 'test', path: '/a/2', value: 3 });
    expect(pa.toJS()).to.eql({ a: [1, 2, 3] });
  });

  it('should pass when array value is equal', function () {
    var ob = Immutable.fromJS({ a: [1, 2, ['x','y','z']] });
    var pa = patch(ob, { op: 'test', path: '/a/2', value: ['x','y','z'] });
    expect(pa.toJS()).to.eql({ a: [1, 2, ['x','y','z']] });
  });

  it('should pass when object value is equal', function () {
    var ob = Immutable.fromJS({ a: [1, 2, { b: 42 }] });
    var pa = patch(ob, { op: 'test', path: '/a/2', value: { b: 42 } });
    expect(pa.toJS()).to.eql({ a: [1, 2, { b: 42 }] });
  });

  it('should fail when scalar value is inequal', function () {
    var ob = Immutable.fromJS({ a: [1, 2, 3] });
    expect(function () {
      patch(ob, { op: 'test', path: '/a/2', value: 4 });
    }).to.throw(patch.Error, 'Test failed');
  });

  it('should fail when array value is inequal', function () {
    var ob = Immutable.fromJS({ a: [1, 2, ['x','y','z']] });
    expect(function () {
      patch(ob, { op: 'test', path: '/a/2', value: ['a','b','c'] });
    }).to.throw(patch.Error, 'Test failed');
  });

  it('should fail when object value is inequal', function () {
    var ob = Immutable.fromJS({ a: [1, 2, { b: 42 }] });
    expect(function () {
      patch(ob, { op: 'test', path: '/a/2', value: { b: 36 } });
    }).to.throw(patch.Error, 'Test failed');
  });

});
