'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _patch = require('./patch');

var _patch2 = _interopRequireDefault(_patch);

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

var _error = require('./error');

var error = _interopRequireWildcard(_error);

for (var key in error) {
  /* istanbul ignore else */
  if (Object.prototype.hasOwnProperty.call(error, key)) {
    _patch2['default'][key] = error[key];
  }
}

_patch2['default'].Error = _patch2['default'].PatchError;
_patch2['default'].parse = _parse2['default'];

exports['default'] = _patch2['default'];
module.exports = exports['default'];