/* global describe, it */

'use strict';

var Immutable = require('immutable');
var expect = require('chai').expect;
var patch = require('../');
var testPathNotFound = require('./_util').testPathNotFound;


describe('copy', function () {

  testPathNotFound({ op: 'copy', from: '/not/here', path: '/there' });

  it('should copy an element with self', function () {
    var ob = Immutable.fromJS(['r', 2, 'd']);
    var pa = patch(ob, { op: 'copy', from: '/1', path: '/3' });
    expect(pa.toJS()).to.eql(['r', 2, 'd', 2]);
  });

  it('should copy a property within self', function () {
    var ob = Immutable.fromJS({ a: '!', b: 1 });
    var pa = patch(ob, { op: 'copy', from: '/a', path: '/c' });
    expect(pa.toJS()).to.eql({ a: '!', b: 1, c: '!' });
  });

  it('should copy an element within an array member', function () {
    var ob = Immutable.fromJS({ a: ['r', 2, 'd'] });
    var pa = patch(ob, { op: 'copy', from: '/a/1', path: '/a/3' });
    expect(pa.toJS()).to.eql({ a: ['r', 2, 'd', 2] });
  });

  it('should copy an element within a nested array member', function () {
    var ob = Immutable.fromJS({ a: { b: ['r', 2, 'd'] } });
    var pa = patch(ob, { op: 'copy', from: '/a/b/1', path: '/a/b/3' });
    expect(pa.toJS()).to.eql({ a: { b: ['r', 2, 'd', 2] } });
  });

  it('should copy a property within a nested object member', function () {
    var ob = Immutable.fromJS({ a: { b: '!', c: 2, d: { e: 3 } } });
    var pa = patch(ob, { op: 'copy', from: '/a/b', path: '/a/d/f' });
    expect(pa.toJS()).to.eql({ a: { b: '!', c: 2, d: { e: 3, f: '!' } } });
  });

  it('should copy between arrays and objects', function () {
    var ob = Immutable.fromJS({ a: [1, 2, '!'], b: { c: 3 } });
    var pa = patch(ob, { op: 'copy', from: '/a/2', path: '/b/d' });
    expect(pa.toJS()).to.eql({ a: [1, 2, '!'], b: { c: 3, d: '!' } });
  });

  it('should copy between objects and arrays', function () {
    var ob = Immutable.fromJS({ a: [1, 2], b: { c: 3, d: '!' } });
    var pa = patch(ob, { op: 'copy', from: '/b/d', path: '/a/2' });
    expect(pa.toJS()).to.eql({ a: [1, 2, '!'], b: { c: 3, d: '!' } });
  });

});
