/* global describe, it */

'use strict';

var Immutable = require('immutable');
var expect = require('chai').expect;
var patch = require('../');
var testPathNotFound = require('./_util').testPathNotFound;


describe('move', function () {

  testPathNotFound({ op: 'move', from: '/not/here', path: '/there' });

  it('should move an element within self', function () {
    var ob = Immutable.fromJS([ 1, 'and', 'a', 2, 3 ]);
    var pa = patch(ob, { op: 'move', from: '/1', path: '/3' });
    expect(pa.toJS()).to.eql([ 1, 'a', 2, 'and', 3 ]);
  });

  it('should move a property with self', function () {
    var ob = Immutable.fromJS({ a: 1, b: 2, x: 3 });
    var pa = patch(ob, { op: 'move', from: '/x', path: '/c' });
    expect(pa.toJS()).to.eql({ a: 1, b: 2, c: 3 });
  });

  it('should move an element within an array member', function () {
    var ob = Immutable.fromJS({ a: [ 1, 'and', 'a', 2, 3 ] });
    var pa = patch(ob, { op: 'move', from: '/a/1', path: '/a/3' });
    expect(pa.toJS()).to.eql({ a: [ 1, 'a', 2, 'and', 3 ] });
  });

  it('should move a property within an object member', function () {
    var ob = Immutable.fromJS({ a: { b: { c: 1 } } });
    var pa = patch(ob, { op: 'move', from: '/a/b/c', path: '/a/b/d' });
    expect(pa.toJS()).to.eql({ a: { b: { d: 1 } } });
  });

  it('should move a property between an object members', function () {
    var ob = Immutable.fromJS({ a: { b: { c: 1 }, d: {} } });
    var pa = patch(ob, { op: 'move', from: '/a/b/c', path: '/a/d/c' });
    expect(pa.toJS()).to.eql({ a: { b: {}, d: { c:1 } } });
  });

  it('should not move a property to it\'s child member', function () {
    var ob = Immutable.fromJS({ a: { b: { o: {} } } });
    expect(function () {
      patch(ob, { op: 'move', from: '/a/b', path: '/a/b/o' });
    }).to.throw(patch.Error, '"from" location cannot be moved into it\'s child');
  });

  it('should move between arrays and objects', function () {
    var ob = Immutable.fromJS({ a: [1,2,3], b: { c:4 } });
    var pa = patch(ob, { op: 'move', from: '/a/2', path: '/b/d' });
    expect(pa.toJS()).to.eql({ a: [1,2], b: { c:4, d:3 } });
  });

  it('should move between objects and arrays', function () {
    var ob = Immutable.fromJS({ a: [1,2], b: { c:3, d:4 } });
    var pa = patch(ob, { op: 'move', from: '/b/c', path: '/a/2' });
    expect(pa.toJS()).to.eql({ a: [1,2,3], b: { d:4 } });
  });
});
