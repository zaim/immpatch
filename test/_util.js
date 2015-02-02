/* global it */

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
