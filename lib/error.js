'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.isError = isError;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var PatchError = (function (_Error) {
  // Based on https://gist.github.com/daliwali/09ca19032ab192524dc6

  function PatchError(message) {
    _classCallCheck(this, PatchError);

    _get(Object.getPrototypeOf(PatchError.prototype), 'constructor', this).call(this);

    if (Error.hasOwnProperty('captureStackTrace')) Error.captureStackTrace(this, this.constructor);else Object.defineProperty(this, 'stack', {
      value: new Error().stack
    });

    Object.defineProperty(this, 'message', {
      value: message
    });
  }

  _inherits(PatchError, _Error);

  _createClass(PatchError, [{
    key: 'name',
    get: function () {
      return this.constructor.name;
    }
  }]);

  return PatchError;
})(Error);

exports.PatchError = PatchError;

var InvalidOperationError = (function (_PatchError) {
  function InvalidOperationError(op, reason) {
    _classCallCheck(this, InvalidOperationError);

    _get(Object.getPrototypeOf(InvalidOperationError.prototype), 'constructor', this).call(this, 'Invalid ' + op + ' operation: ' + reason);
    this.op = op;
    this.reason = reason;
  }

  _inherits(InvalidOperationError, _PatchError);

  return InvalidOperationError;
})(PatchError);

exports.InvalidOperationError = InvalidOperationError;

var PathNotFoundError = (function (_PatchError2) {
  function PathNotFoundError(path) {
    _classCallCheck(this, PathNotFoundError);

    _get(Object.getPrototypeOf(PathNotFoundError.prototype), 'constructor', this).call(this, 'Path not found: ' + path);
    this.path = path;
  }

  _inherits(PathNotFoundError, _PatchError2);

  return PathNotFoundError;
})(PatchError);

exports.PathNotFoundError = PathNotFoundError;

var TestFailError = (function (_PatchError3) {
  function TestFailError(path, expected, value) {
    _classCallCheck(this, TestFailError);

    _get(Object.getPrototypeOf(TestFailError.prototype), 'constructor', this).call(this, 'Test failed: expected ' + path + ' to be ' + expected + ', but got ' + value);
    this.path = path;
    this.expected = expected;
    this.value = value;
  }

  _inherits(TestFailError, _PatchError3);

  return TestFailError;
})(PatchError);

exports.TestFailError = TestFailError;

var PointerError = (function (_PatchError4) {
  function PointerError(message) {
    _classCallCheck(this, PointerError);

    _get(Object.getPrototypeOf(PointerError.prototype), 'constructor', this).call(this, message);
  }

  _inherits(PointerError, _PatchError4);

  return PointerError;
})(PatchError);

exports.PointerError = PointerError;

function isError(err) {
  return err instanceof PatchError;
}