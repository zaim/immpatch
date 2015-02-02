/* global describe, it */

'use strict';

var Immutable = require('immutable');
var expect = require('chai').expect;
var patch = require('../');


describe('examples', function () {

  describe('in README.md', function () {

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


  describe('from RFC6092', function () {

    // The examples in the RFC should work
    // https://tools.ietf.org/html/rfc6902#appendix-A

    it('adding an object member', function () {
      var ob = Immutable.fromJS({ foo: 'bar' });
      var pa = patch(ob, { op: 'add', path: '/baz', value: 'qux' });
      expect(pa.toJS()).to.eql({ baz: 'qux', foo: 'bar' });
    });

    it('adding an array element', function () {
      var ob = Immutable.fromJS({ foo: ['bar', 'baz'] });
      var pa = patch(ob, { op: 'add', path: '/foo/1', value: 'qux' });
      expect(pa.toJS()).to.eql({ foo: ['bar', 'qux', 'baz'] });
    });

    it('removing an object member', function () {
      var ob = Immutable.fromJS({ baz: 'qux', foo: 'bar' });
      var pa = patch(ob, { op: 'remove', path: '/baz' });
      expect(pa.toJS()).to.eql({ foo: 'bar' });
    });

    it('removing an array element', function () {
      var ob = Immutable.fromJS({ foo: ['bar', 'qux', 'baz' ] });
      var pa = patch(ob, { op: 'remove', path: '/foo/1' });
      expect(pa.toJS()).to.eql({ foo: ['bar', 'baz'] });
    });

    it('replacing a value', function () {
      var ob = Immutable.fromJS({ baz: 'qux', foo: 'bar' });
      var pa = patch(ob, { op: 'replace', path: '/baz', value: 'boo' });
      expect(pa.toJS()).to.eql({ baz: 'boo', foo: 'bar' });
    });

    it('moving a value', function () {
      var ob = Immutable.fromJS({
        foo: {
          bar: 'baz',
          waldo: 'fred'
        },
        qux: {
          corge: 'grault'
        }
      });
      var pa = patch(ob, { op: 'move', from: '/foo/waldo', path: '/qux/thud' });
      expect(pa.toJS()).to.eql({
        foo: {
          bar: 'baz'
        },
        qux: {
          corge: 'grault',
          thud: 'fred'
        }
      });
    });

    it('moving an array element', function () {
      var ob = Immutable.fromJS({ foo: [ 'all', 'grass', 'cows', 'eat' ] });
      var pa = patch(ob, { op: 'move', from: '/foo/1', path: '/foo/3' });
      expect(pa.toJS()).to.eql({ foo: ['all', 'cows', 'eat', 'grass' ] });
    });

    it('testing a value: success', function () {
      var ob = Immutable.fromJS({ baz: 'qux', foo: [ 'a', 2, 'c' ] });
      var pa = patch(ob, [
        { op: 'test', path: '/baz', value: 'qux' },
        { op: 'test', path: '/foo/1', value: 2 }
      ]);
      expect(pa.toJS()).to.eql(ob.toJS());
    });

    it('testing a value: error', function () {
      var ob = Immutable.fromJS({ baz: 'qux' });
      expect(function () {
        patch(ob, { op: 'test', path: '/baz', value: 'bar' });
      }).to.throw(patch.Error, 'Test failed');
    });

    it('adding a nested member object', function () {
      var ob = Immutable.fromJS({ foo: 'bar' });
      var pa = patch(ob, { op: 'add', path: '/child', value: { grandchild: {} } });
      expect(pa.toJS()).to.eql({ foo: 'bar', child: { grandchild: {} } });
    });

    it('ignoring unrecognized elements', function () {
      var ob = Immutable.fromJS({ foo: 'bar' });
      var pa = patch(ob, { op: 'add', path: '/baz', value: 'qux', xyz: 123 });
      expect(pa.toJS()).to.eql({ foo: 'bar', baz: 'qux' });
    });

    it('adding to nonexistent target', function () {
      var ob = Immutable.fromJS({ foo: 'bar' });
      expect(function () {
        patch(ob, { op: 'add', path: '/baz/bat', value: 'qux' });
      }).to.throw(patch.Error, 'Operation failed');
    });

    it('~ escape ordering', function () {
      var ob = Immutable.fromJS({ '/': 9, '~1': 10 });
      var pa = patch(ob, { op: 'test', path: '/~01', value: 10 });
      expect(pa.toJS()).to.eql(ob.toJS());
    });

    it('comparing string and numbers', function () {
      var ob = Immutable.fromJS({ '/': 9, '~1': 10 });
      expect(function () {
        patch(ob, { op: 'test', path: '/~01', value: '10' });
      }).to.throw(patch.Error, 'Test failed');
    });

    it('adding an array value', function () {
      var ob = Immutable.fromJS({ foo: ['bar'] });
      var pa = patch(ob, { op: 'add', path: '/foo/-', value: ['abc', 'def'] });
      expect(pa.toJS()).to.eql({ foo: ['bar', ['abc', 'def']] });
    });

  });

});
