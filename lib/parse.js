"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

module.exports = parse;
var Iterable = require("immutable").Iterable;
var PatchError = _interopRequire(require("./error"));

var OPERATORS = ["add", "remove", "replace", "move", "copy", "test"];

var hop = Object.prototype.hasOwnProperty;


/**
 * Unescape and a reference token
 *
 * @private
 * @param {string} token
 * @returns {string}
 */

function unescape(token) {
  return token.replace(/~1/g, "/").replace(/~0/g, "~");
}


/**
 * Convert a JSON Pointer into a key path array
 *
 * @private
 * @param {string} pointer
 * @returns {array}
 */

function parsePointer(pointer) {
  if (pointer === "") {
    return [];
  }
  if (pointer.charAt(0) !== "/") {
    throw new PatchError("Invalid JSON pointer: " + pointer);
  }
  return pointer.substring(1).split(/\//).map(unescape);
}


/**
 * Validate key path
 *
 * @private
 * @param {array} path
 * @param {Immutable} target
 * @throws PatchError
 */

function validatePath(path, target) {
  var i = 0;
  var len = path.length;
  var ref = target;
  for (; i < len; i++) {
    if (Iterable.isIterable(ref)) {
      ref = ref.getIn(path.slice(0, i));
      if (Iterable.isIndexed(ref) && !validateIndexToken(path[i])) {
        throw new PatchError("Invalid array index: " + path[i]);
      }
    }
  }
}


/**
 * Validate an 'index' token, making sure
 * it is a valid integer or '-'
 *
 * @private
 * @see {@link https://tools.ietf.org/html/rfc6901#section-4}
 * @param {string} token
 * @returns {boolean}
 */

function validateIndexToken(token) {
  return token === "-" || /^(?:0|(?:[1-9][0-9]*))$/.test(token);
}


/**
 * Shallow-clone an object.
 */

function clone(obj) {
  var key;
  var copy = {};
  for (key in obj) {
    /* istanbul ignore else */
    if (hop.call(obj, key)) {
      copy[key] = obj[key];
    }
  }
  return copy;
}


/**
 * Parse and validate the patch operation.
 *
 * Converts `op.path` (and `op.from` if
 * available) to an array.
 *
 * @param {object} op
 * @param {Immutable} target
 * @returns {object} op
 */

function parse(op, target) {
  if (OPERATORS.indexOf(op.op) !== -1) {
    op = clone(op);
    if (op.from != null) {
      op.from = parsePointer(op.from);
    }
    if (op.path != null) {
      op.path = parsePointer(op.path);
    } else {
      throw new PatchError("Invalid operation");
    }
    validatePath(op.from || op.path, target);
    return op;
  }
  throw new PatchError("Invalid operation");
}