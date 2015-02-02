/* global describe, it */

'use strict';

var Immutable = require('immutable');
var expect = require('chai').expect;
var patch = require('../');


describe('errors', function () {

  it('isError() should identify PatchError', function () {
    var err = new patch.Error('test');
    expect(patch.isError(err)).to.be.true();
  });

  it('should throw an error when op is invalid', function () {
    expect(function () {
      patch(Immutable.fromJS({ a: 1 }), { op: 'unknown' });
    }).to.throw(patch.Error, 'Invalid operation');
  });

  it('should throw an error when path is not given', function () {
    expect(function () {
      patch(Immutable.fromJS({ a: 1 }), { op: 'add' });
    }).to.throw(patch.Error, 'Invalid operation');
  });

  it('should throw an error when path is empty', function () {
    expect(function () {
      patch(Immutable.fromJS({ a: 1 }), { op: 'add', path: '' });
    }).to.throw(patch.Error, 'Invalid operation');
  });

  it('should throw an error when path is not valid', function () {
    expect(function () {
      patch(Immutable.fromJS({ a: 1 }), { op: 'add', path: 'invalid.path' });
    }).to.throw(patch.Error, 'Invalid JSON pointer');
  });

});
