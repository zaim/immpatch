/* global describe, it */

'use strict';

var Immutable = require('immutable');
var expect = require('chai').expect;
var patch = require('../');

exports.testPathNotFound = function testPathNotFound (op) {
  it('should throw error when path is not found', function () {
    var ob = Immutable.fromJS({ found: 1 });
    expect(patch.bind(null, ob, [op])).to.throw(patch.Error, 'Path not found');
  });
};

exports.testSpec = function testSpec (spec) {
  if (typeof spec.doc === 'undefined' ||
      typeof spec.patch === 'undefined' ||
      spec.disabled) {
    return;
  }
  it(spec.comment || '(no description)', function () {
    var ob = Immutable.fromJS(spec.doc);
    var call = function () {
      return patch(ob, spec.patch);
    };
    var test = function (patched) {
      var expected = spec.expected || spec.doc;
      expect(patched.toJS()).to.eql(expected);
    };
    if (spec.error) {
      expect(call).to.throw(patch.Error);
    } else {
      test(call());
    }
  });
};

exports.testSpecList = function testSpecList (specs) {
  specs.forEach(exports.testSpec);
};

exports.testSpecFile = function testSpecFile (filename) {
  var list = require(filename);
  var name = filename.replace(__dirname, '');
  describe(name, function () {
    exports.testSpecList(list);
  });
};
