/* global describe, it */

'use strict';

var Immutable = require('immutable');
var expect = require('chai').expect;
var patch = require('../');


describe('add', function () {

  it('should add an element to self', function () {
    var ob = Immutable.fromJS([1, 3, 4]);
    var pa = patch(ob, { op: 'add', path: '/1', value: 2 });
    expect(pa.toJS()).to.eql([1, 2, 3, 4]);
  });

  it('should append an element to self', function () {
    var ob = Immutable.fromJS([1, 2, 3]);
    var pa = patch(ob, { op: 'add', path: '/-', value: 4 });
    expect(pa.toJS()).to.eql([1, 2, 3, 4]);
  });

  it('should add a property to self', function () {
    var ob = Immutable.fromJS({ a: 1 });
    var pa = patch(ob, { op: 'add', path: '/b', value: 2 });
    expect(pa.toJS()).to.eql({ a: 1, b: 2 });
  });

  it('should add an element to an array member', function () {
    var ob = Immutable.fromJS({ a: [1, 3, 4] });
    var pa = patch(ob, { op: 'add', path: '/a/1', value: 2 });
    expect(pa.toJS()).to.eql({ a: [1, 2, 3, 4] });
  });

  it('should append an element to an array member', function () {
    var ob = Immutable.fromJS({ a: [1, 2, 3] });
    var pa = patch(ob, { op: 'add', path: '/a/-', value: 4 });
    expect(pa.toJS()).to.eql({ a: [1, 2, 3, 4] });
  });

  it('should add an element to a nested array member', function () {
    var ob = Immutable.fromJS({ a: { b: [1, 3, 4] } });
    var pa = patch(ob, { op: 'add', path: '/a/b/1', value: 2 });
    expect(pa.toJS()).to.eql({ a: { b: [1, 2, 3, 4] } });
  });

  it('should append an element to a nested array member', function () {
    var ob = Immutable.fromJS({ a: { b: [1, 2, 3] } });
    var pa = patch(ob, { op: 'add', path: '/a/b/-', value: 4 });
    expect(pa.toJS()).to.eql({ a: { b: [1, 2, 3, 4] } });
  });

  it('should add a property to a nested object member', function () {
    var ob = Immutable.fromJS({ a: { b: { c: 1 } } });
    var pa = patch(ob, { op: 'add', path: '/a/b/d', value: 2});
    expect(pa.toJS()).to.eql({ a: { b: { c: 1, d: 2 } } });
  });

  it('should replace a property on self', function () {
    var ob = Immutable.fromJS({ a: 1, b: 'r' });
    var pa = patch(ob, { op: 'add', path: '/b', value: 2 });
    expect(pa.toJS()).to.eql({ a: 1, b: 2 });
  });

  it('should replace a property on a nested object member', function () {
    var ob = Immutable.fromJS({ a: { b: { c: 1, d: 'r' } } });
    var pa = patch(ob, { op: 'add', path: '/a/b/d', value: 2});
    expect(pa.toJS()).to.eql({ a: { b: { c: 1, d: 2 } } });
  });

  it('should not add elements at out of bound index', function () {
    var ob = Immutable.fromJS({ a: [1, 2, 3] });
    expect(function () {
      patch(ob, { op: 'add', path: '/a/4', value: 2 });
    }).to.throw(patch.Error, 'Operation failed');
  });

  it('should not create new objects', function () {
    var ob = Immutable.fromJS({ a: {} });
    expect(function () {
      patch(ob, { op: 'add', path: '/a/b/c', value: 1 });
    }).to.throw(patch.Error, 'Operation failed');
  });

});
