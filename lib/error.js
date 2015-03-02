"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

exports.isError = isError;

var PatchError = exports.PatchError = (function (Error) {
  function PatchError() {
    _classCallCheck(this, PatchError);

    if (Error != null) {
      Error.apply(this, arguments);
    }
  }

  _inherits(PatchError, Error);

  return PatchError;
})(Error);

var InvalidOperationError = exports.InvalidOperationError = (function (PatchError) {
  function InvalidOperationError(op, reason) {
    _classCallCheck(this, InvalidOperationError);

    this.name = "InvalidOperationError";
    this.op = op;
    this.reason = reason;
  }

  _inherits(InvalidOperationError, PatchError);

  _prototypeProperties(InvalidOperationError, null, {
    toString: {
      value: function toString() {
        return "Invalid " + this.op + " operation: " + this.reason;
      },
      writable: true,
      configurable: true
    }
  });

  return InvalidOperationError;
})(PatchError);

var PathNotFoundError = exports.PathNotFoundError = (function (PatchError) {
  function PathNotFoundError(path) {
    _classCallCheck(this, PathNotFoundError);

    this.name = "PathNotFoundError";
    this.path = path;
  }

  _inherits(PathNotFoundError, PatchError);

  _prototypeProperties(PathNotFoundError, null, {
    toString: {
      value: function toString() {
        return "Path not found: " + this.path;
      },
      writable: true,
      configurable: true
    }
  });

  return PathNotFoundError;
})(PatchError);

var TestFailError = exports.TestFailError = (function (PatchError) {
  function TestFailError(path, expected, value) {
    _classCallCheck(this, TestFailError);

    this.name = "TestFailError";
    this.path = path;
    this.expected = expected;
    this.value = value;
  }

  _inherits(TestFailError, PatchError);

  _prototypeProperties(TestFailError, null, {
    toString: {
      value: function toString() {
        return "Test failed: " + ("expected " + this.path + " ") + ("to be " + this.expected + ", ") + ("but got " + this.value);
      },
      writable: true,
      configurable: true
    }
  });

  return TestFailError;
})(PatchError);

var PointerError = exports.PointerError = (function (PatchError) {
  function PointerError(message) {
    _classCallCheck(this, PointerError);

    this.name = "PointerError";
    this.message = message;
  }

  _inherits(PointerError, PatchError);

  return PointerError;
})(PatchError);

function isError(err) {
  return err instanceof PatchError;
}

Object.defineProperty(exports, "__esModule", {
  value: true
});