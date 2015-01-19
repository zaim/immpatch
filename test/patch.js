/* global describe, it */

'use strict';

var Immutable = require('immutable');
var debug = require('debug')('immpatch:test');
var expect = require('chai').expect;
var jiff = require('jiff');
var patch = require('../');


describe('patch', function () {

  it('should work with a diffed object', function () {
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
