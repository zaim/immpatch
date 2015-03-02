"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var patch = _interopRequire(require("./patch"));

var parse = _interopRequire(require("./parse"));

var error = _interopRequireWildcard(require("./error"));

for (var key in error) {
  /* istanbul ignore else */
  if (Object.prototype.hasOwnProperty.call(error, key)) {
    patch[key] = error[key];
  }
}

patch.Error = patch.PatchError;
patch.parse = parse;

module.exports = patch;