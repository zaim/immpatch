'use strict';

var pointer = require('json-pointer');

var OPERATORS = ['add', 'remove', 'replace', 'move', 'copy', 'test'];


function clone (op) {
  return Object.assign({}, op);
}


/**
 * Validate and parse the patch object.
 *
 * Converts `op.path` (and `op.from` if
 * available) to an array.
 *
 * @private
 * @param {object} op
 * @returns {object} op
 */

export default function parse (op) {
  if (OPERATORS.indexOf(op.op) !== -1) {
    op = clone(op);
    if (op.from) {
      op.from = pointer.parse(op.from);
    }
    if (op.path) {
      op.path = pointer.parse(op.path);
    } else {
      throw new Error('Invalid operation');
    }
    return op;
  }
  throw new Error('Invalid operation');
}
