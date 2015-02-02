"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

module.exports = parse;
var pointer = _interopRequire(require("json-pointer"));

var PatchError = _interopRequire(require("./error"));

var OPERATORS = ["add", "remove", "replace", "move", "copy", "test"];


/**
 * Shallow-clone an object.
 */

function clone(op) {
  var copy = {};
  Object.keys(op).forEach(function (k) {
    copy[k] = op[k];
  });
  return copy;
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

function parse(op) {
  if (OPERATORS.indexOf(op.op) !== -1) {
    op = clone(op);
    if (op.from) {
      op.from = pointer.parse(op.from);
    }
    if (op.path) {
      op.path = pointer.parse(op.path);
    } else {
      throw new PatchError("Invalid operation");
    }
    return op;
  }
  throw new PatchError("Invalid operation");
}