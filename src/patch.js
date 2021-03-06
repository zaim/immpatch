import Immutable from 'immutable'
import makeDebug from 'debug'
import parse from './parse'
import * as error from './error'

var Iterable = Immutable.Iterable

const debug = makeDebug('immpatch')


var operators = {

  add (op) {
    if (typeof op.value === 'undefined') {
      throw new error.InvalidOperationError(
        'add',
        'Operation object must have a "value" member'
      )
    }
    var container, idx
    var path = op.path
    var value = op.value
    var parent = path.slice(0, -1)
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
      parent = path.slice(0, -1)
      container = this.getIn(parent)
      if (Iterable.isIndexed(container)) {
        // only continue if the index is within the
        // array bounds, or it is '-', which
        // indicates that the value is to be appended
        idx = path[path.length - 1]
        if (idx === '-') {
          return this.updateIn(parent, (coll) => {
            return coll.push(value)
          })
        }
        if (idx >= 0 && idx <= container.size) {
          debug('add array element')
          return this.updateIn(parent, (coll) => {
            return coll.splice(idx, 0, value)
          })
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
      debug('add object member')
      return this.setIn(path, value)
    }
    // otherwise, it must be considered an error
    throw new error.InvalidOperationError(
      'add',
      'Target location must reference the root document or an existing object'
    )
  },

  remove (op) {
    if (!this.hasIn(op.path)) {
      throw new error.PathNotFoundError(op.path)
    }
    return this.removeIn(op.path)
  },

  replace (op) {
    if (typeof op.value === 'undefined') {
      throw new error.InvalidOperationError(
        'replace',
        'Operation object must have a "value" member'
      )
    }
    if (!this.hasIn(op.path)) {
      throw new error.PathNotFoundError(op.path)
    }
    return this.setIn(op.path, op.value)
  },

  move (op) {
    if (op.from == null) {
      throw new error.InvalidOperationError(
        'move',
        'Operation object must have a "from" member'
      )
    }
    if (!this.hasIn(op.from)) {
      throw new error.PathNotFoundError(op.from)
    }
    var from = op.from
    var path = op.path
    var value = this.getIn(from)
    var target = this.getIn(path)
    if (Iterable.isIterable(target) && target.isSubset(value)) {
      throw new error.InvalidOperationError(
        'move',
        '"from" location cannot be moved into it\'s child'
      )
    }
    // this operation is functionally identical to a "remove"
    // operation on the "from" location, followed immediately
    // by an "add" operation at the target location with the
    // value that was just removed
    var self = operators.remove.call(this, { path: from })
    return operators.add.call(self, { path, value })
  },

  copy (op) {
    if (op.from == null) {
      throw new error.InvalidOperationError(
        'copy',
        'Operation object must have a "from" member'
      )
    }
    if (!this.hasIn(op.from)) {
      throw new error.PathNotFoundError(op.from)
    }
    var from = op.from
    var path = op.path
    // This operation is functionally identical to an "add"
    // operation at the target location using the value
    // specified in the "from" member
    var value = this.getIn(from)
    return operators.add.call(this, { path, value })
  },

  test (op) {
    if (typeof op.value === 'undefined') {
      throw new error.InvalidOperationError(
        'test',
        'Operation object must have a "value" member'
      )
    }
    var path = op.path
    var value = op.value
    var target = this.getIn(path)
    // Use Immutable.is for testing, as what the specification
    // describes is essentially a recursive/deep equality check
    if (!Immutable.is(target, Immutable.fromJS(value))) {
      throw new error.TestFailError(path, value, target)
    }
    return this
  }

}


/**
 * Update the immutable object using JSON Patch
 * operations.
 *
 * @param {object} object
 * @param {array|object} ops
 * @returns {object}
 */

export default function patch (object, ops) {
  ops = Array.isArray(ops) ? ops : [ops]
  object = ops.reduce((ob, op) => {
    op = parse(op, ob)
    return operators[op.op].call(ob, op)
  }, object)
  // Re-convert the returned object into an
  // immutable structure, in case the entire
  // object was replaced with a POJO
  return Immutable.fromJS(object)
}
