/* global describe, it */

'use strict';

var Immutable = require('immutable');
var expect = require('chai').expect;
var patch = require('../');


describe('errors', function () {

  it('isError() should identify PatchErrors', function () {
    var err1 = new patch.InvalidOperationError('test');
    var err2 = new patch.PathNotFoundError('test');
    var err3 = new patch.TestFailError('test');
    var err4 = new patch.PointerError('test');
    expect(patch.isError(err1)).to.be.true();
    expect(patch.isError(err2)).to.be.true();
    expect(patch.isError(err3)).to.be.true();
    expect(patch.isError(err4)).to.be.true();
  });

  it('should throw an error when op is invalid', function () {
    expect(function () {
      patch(Immutable.fromJS({ a: 1 }), { op: 'unknown' });
    }).to.throw(patch.InvalidOperationError);
  });

  it('should throw an error when path is not given', function () {
    expect(function () {
      patch(Immutable.fromJS({ a: 1 }), { op: 'add' });
    }).to.throw(patch.InvalidOperationError);
  });

  it('should throw an error when path is empty', function () {
    expect(function () {
      patch(Immutable.fromJS({ a: 1 }), { op: 'add', path: '' });
    }).to.throw(patch.InvalidOperationError);
  });

  it('should throw an error when path is not valid', function () {
    expect(function () {
      patch(Immutable.fromJS({ a: 1 }), { op: 'add', path: 'invalid.path' });
    }).to.throw(patch.PointerError);
  });

});
