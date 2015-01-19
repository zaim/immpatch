/* global describe, it */

'use strict';

var Immutable = require('immutable');
var debug = require('debug')('immpatch:test');
var expect = require('chai').expect;
var jiff = require('jiff');
var patch = require('../');


function testPathNotFound (op) {
  it('should throw error when path is not found', function () {
    var ob = Immutable.fromJS({ found: 1 });
    expect(patch.bind(null, ob, [op])).to.throw('Path not found');
  });
}


describe('patch', function () {

  describe('errors', function () {

    it('should throw an error when op is invalid', function () {
      expect(function () {
        patch(Immutable.fromJS({ a: 1 }), { op: 'unknown' });
      }).to.throw('Invalid operation');
    });

    it('should throw an error when path is not given', function () {
      expect(function () {
        patch(Immutable.fromJS({ a: 1 }), { op: 'add' });
      }).to.throw('Invalid operation');
    });

    it('should throw an error when path is empty', function () {
      expect(function () {
        patch(Immutable.fromJS({ a: 1 }), { op: 'add', path: '' });
      }).to.throw('Invalid operation');
    });

  });


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
      }).to.throw('Operation failed');
    });

    it('should not create new objects', function () {
      var ob = Immutable.fromJS({ a: {} });
      expect(function () {
        patch(ob, { op: 'add', path: '/a/b/c', value: 1 });
      }).to.throw('Operation failed');
    });

  });


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
      }).to.throw('"from" location cannot be moved into it\'s child');
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


  describe('test', function () {

    it('should throw an error when value is not given', function () {
      expect(function () {
        patch(Immutable.fromJS({ a:1 }), { op: 'test', path: '/a' });
      }).to.throw('Invalid operation');
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
      }).to.throw('Test failed');
    });

    it('should fail when array value is inequal', function () {
      var ob = Immutable.fromJS({ a: [1, 2, ['x','y','z']] });
      expect(function () {
        patch(ob, { op: 'test', path: '/a/2', value: ['a','b','c'] });
      }).to.throw('Test failed');
    });

    it('should fail when object value is inequal', function () {
      var ob = Immutable.fromJS({ a: [1, 2, { b: 42 }] });
      expect(function () {
        patch(ob, { op: 'test', path: '/a/2', value: { b: 36 } });
      }).to.throw('Test failed');
    });

  });


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
        }).to.throw('Test failed');
      });

      it('adding a nested member object', function () {
        var ob = Immutable.fromJS({ foo: 'bar' });
        var pa = patch(ob, { op: 'add', path: '/child', value: { grandchild: { } } });
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
        }).to.throw('Operation failed');
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
        }).to.throw('Test failed');
      });

      it('adding an array value', function () {
        var ob = Immutable.fromJS({ foo: ['bar'] });
        var pa = patch(ob, { op: 'add', path: '/foo/-', value: ['abc', 'def'] });
        expect(pa.toJS()).to.eql({ foo: ['bar', ['abc', 'def']] });
      });

    });

  });


  describe('integration', function () {

    it('should patch a diffed object', function () {
      var current = {
        id: 't3_name',
        ups: 10,
        downs: 3,
        score: 7,
        kind: 't3',
        comments: [
          { id: 't1_comment1',
            ups: 1,
            downs: 0,
            score: 1,
            body: 'test1',
            kind: 't1'
          },
          { id: 't1_comment2',
            ups: 1,
            downs: 0,
            score: 1,
            body: 'test2',
            kind: 't1'
          },
          { id: 't1_comment3',
            ups: 1,
            downs: 0,
            score: 1,
            body: 'test3',
            kind: 't1',
            replies: [
              { id: 't1_comment3_1',
                ups: 1,
                downs: 0,
                score: 1,
                body: 'test3_1',
                kind: 't1'
              },
              { id: 't1_comment3_2',
                ups: 1,
                downs: 0,
                score: 1,
                body: 'test3_2',
                kind: 't1'
              }
            ]
          }
        ]
      };

      var object = Immutable.fromJS(current);

      var next = object.toJS();
      next.ups += 10;
      next.downs += 9;
      next.score = next.ups - next.downs;
      next.comments[0].ups += 8;
      next.comments[0].downs += 7;
      next.comments[0].score = next.comments[0].ups - next.comments[0].downs;
      next.comments[1].ups += 6;
      next.comments[1].downs += 5;
      next.comments[1].score = next.comments[1].ups - next.comments[1].downs;
      next.comments[2].replies[0].ups += 4;
      next.comments[2].replies[0].downs += 3;
      next.comments[2].replies[0].score = next.comments[2].replies[0].ups +
        next.comments[2].replies[0].downs;

      var patches = jiff.diff(current, next, function (o) { return o.id; });
      debug(patches);
      expect(patches.length).to.be.above(1);

      var patched = patch(object, patches).toJS();
      debug(patched);
      expect(patched).to.eql(next);
    });

  });

});
