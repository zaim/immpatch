'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = patch;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

var _error = require('./error');

var error = _interopRequireWildcard(_error);

var Iterable = _immutable2['default'].Iterable;

var debug = (0, _debug2['default'])('immpatch');

var operators = {

  add: function add(op) {
    if (typeof op.value === 'undefined') {
      throw new error.InvalidOperationError('add', 'Operation object must have a "value" member');
    }
    var container, idx;
    var path = op.path;
    var value = op.value;
    var parent = path.slice(0, -1);
    //
    // If the target location specifies an array index,
    // a new value is inserted into the array at the
    // specified index.
    //
    // The target location must reference an element
    // to an existing array.
    //
    if (this.hasIn(parent)) {
      // check the parent container and see if it is
      // an indexed collection (array in immutable.js)
      parent = path.slice(0, -1);
      container = this.getIn(parent);
      if (Iterable.isIndexed(container)) {
        // only continue if the index is within the
        // array bounds, or it is '-', which
        // indicates that the value is to be appended
        idx = path[path.length - 1];
        if (idx === '-') {
          return this.updateIn(parent, function (coll) {
            return coll.push(value);
          });
        }
        if (idx >= 0 && idx <= container.size) {
          debug('add array element');
          return this.updateIn(parent, function (coll) {
            return coll.splice(idx, 0, value);
          });
        }
      }
    }
    //
    // The parent container does not exist, or, it
    // is not an array. Continue only if the target
    // location is:
    //
    // 1. The root of the target document, or;
    // 2. A member to add to an existing object
    //
    // (1) is root doc    or (2) container is an object
    if (path.length === 0 || Iterable.isKeyed(container)) {
      debug('add object member');
      return this.setIn(path, value);
    }
    // otherwise, it must be considered an error
    throw new error.InvalidOperationError('add', 'Target location must reference the root document or an existing object');
  },

  remove: function remove(op) {
    if (!this.hasIn(op.path)) {
      throw new error.PathNotFoundError(op.path);
    }
    return this.removeIn(op.path);
  },

  replace: function replace(op) {
    if (typeof op.value === 'undefined') {
      throw new error.InvalidOperationError('replace', 'Operation object must have a "value" member');
    }
    if (!this.hasIn(op.path)) {
      throw new error.PathNotFoundError(op.path);
    }
    return this.setIn(op.path, op.value);
  },

  move: function move(op) {
    if (op.from == null) {
      throw new error.InvalidOperationError('move', 'Operation object must have a "from" member');
    }
    if (!this.hasIn(op.from)) {
      throw new error.PathNotFoundError(op.from);
    }
    var from = op.from;
    var path = op.path;
    var value = this.getIn(from);
    var target = this.getIn(path);
    if (Iterable.isIterable(target) && target.isSubset(value)) {
      throw new error.InvalidOperationError('move', '"from" location cannot be moved into it\'s child');
    }
    // this operation is functionally identical to a "remove"
    // operation on the "from" location, followed immediately
    // by an "add" operation at the target location with the
    // value that was just removed
    var self = operators.remove.call(this, { path: from });
    return operators.add.call(self, { path: path, value: value });
  },

  copy: function copy(op) {
    if (op.from == null) {
      throw new error.InvalidOperationError('copy', 'Operation object must have a "from" member');
    }
    if (!this.hasIn(op.from)) {
      throw new error.PathNotFoundError(op.from);
    }
    var from = op.from;
    var path = op.path;
    // This operation is functionally identical to an "add"
    // operation at the target location using the value
    // specified in the "from" member
    var value = this.getIn(from);
    return operators.add.call(this, { path: path, value: value });
  },

  test: function test(op) {
    if (typeof op.value === 'undefined') {
      throw new error.InvalidOperationError('test', 'Operation object must have a "value" member');
    }
    var path = op.path;
    var value = op.value;
    var target = this.getIn(path);
    // Use Immutable.is for testing, as what the specification
    // describes is essentially a recursive/deep equality check
    if (!_immutable2['default'].is(target, _immutable2['default'].fromJS(value))) {
      throw new error.TestFailError(path, value, target);
    }
    return this;
  }

};

/**
 * Update the immutable object using JSON Patch
 * operations.
 *
 * @param {object} object
 * @param {array|object} ops
 * @returns {object}
 */

function patch(object, ops) {
  ops = Array.isArray(ops) ? ops : [ops];
  object = ops.reduce(function (ob, op) {
    op = (0, _parse2['default'])(op, ob);
    return operators[op.op].call(ob, op);
  }, object);
  // Re-convert the returned object into an
  // immutable structure, in case the entire
  // object was replaced with a POJO
  return _immutable2['default'].fromJS(object);
}

module.exports = exports['default'];