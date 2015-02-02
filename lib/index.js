"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var patch = _interopRequire(require("./patch"));

var parse = _interopRequire(require("./parse"));

var PatchError = _interopRequire(require("./error"));

patch.parse = parse;
patch.Error = PatchError;
patch.isError = PatchError.isError;

module.exports = patch;