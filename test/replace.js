/* global describe, it */

'use strict';

var Immutable = require('immutable');
var expect = require('chai').expect;
var patch = require('../');
var testPathNotFound = require('./_util').testPathNotFound;


describe('replace', function () {

  testPathNotFound({ op: 'replace', path: '/not/here', value: 'x' });

  it('should replace an element on self', function () {
    var ob = Immutable.fromJS([1, 'r', 3, 4]);
    var pa = patch(ob, { op: 'replace', path: '/1', value: 2 });
    expect(pa.toJS()).to.eql([1, 2, 3, 4]);
  });

  it('should replace property on self', function () {
    var ob = Immutable.fromJS({ a: 1, b: 'r' });
    var pa = patch(ob, { op: 'replace', path: '/b', value: 2 });
    expect(pa.toJS()).to.eql({ a: 1, b: 2 });
  });

  it('should replace an element on an array member', function () {
    var ob = Immutable.fromJS({ a: [1, 'r', 3, 4] });
    var pa = patch(ob, { op: 'replace', path: '/a/1', value: 2 });
    expect(pa.toJS()).to.eql({ a: [1, 2, 3, 4] });
  });

  it('should replace an element on a nested array member', function () {
    var ob = Immutable.fromJS({ a: { b: [1, 'r', 3, 4] } });
    var pa = patch(ob, { op: 'replace', path: '/a/b/1', value: 2 });
    expect(pa.toJS()).to.eql({ a: { b: [1, 2, 3, 4] } });
  });

  it('should replace a property on a nested object member', function () {
    var ob = Immutable.fromJS({ a: { b: { c: 1, d: 'r' } } });
    var pa = patch(ob, { op: 'replace', path: '/a/b/d', value: 2 });
    expect(pa.toJS()).to.eql({ a: { b: { c: 1, d: 2 } } });
  });

});
