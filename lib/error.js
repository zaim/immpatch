"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

exports.isError = isError;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var PatchError = exports.PatchError = (function (_Error) {
  function PatchError() {
    _classCallCheck(this, PatchError);

    if (_Error != null) {
      _Error.apply(this, arguments);
    }
  }

  _inherits(PatchError, _Error);

  return PatchError;
})(Error);

var InvalidOperationError = exports.InvalidOperationError = (function (_PatchError) {
  function InvalidOperationError(op, reason) {
    _classCallCheck(this, InvalidOperationError);

    this.name = "InvalidOperationError";
    this.op = op;
    this.reason = reason;
  }

  _inherits(InvalidOperationError, _PatchError);

  _createClass(InvalidOperationError, {
    toString: {
      value: function toString() {
        return "Invalid " + this.op + " operation: " + this.reason;
      }
    }
  });

  return InvalidOperationError;
})(PatchError);

var PathNotFoundError = exports.PathNotFoundError = (function (_PatchError2) {
  function PathNotFoundError(path) {
    _classCallCheck(this, PathNotFoundError);

    this.name = "PathNotFoundError";
    this.path = path;
  }

  _inherits(PathNotFoundError, _PatchError2);

  _createClass(PathNotFoundError, {
    toString: {
      value: function toString() {
        return "Path not found: " + this.path;
      }
    }
  });

  return PathNotFoundError;
})(PatchError);

var TestFailError = exports.TestFailError = (function (_PatchError3) {
  function TestFailError(path, expected, value) {
    _classCallCheck(this, TestFailError);

    this.name = "TestFailError";
    this.path = path;
    this.expected = expected;
    this.value = value;
  }

  _inherits(TestFailError, _PatchError3);

  _createClass(TestFailError, {
    toString: {
      value: function toString() {
        return "Test failed: " + ("expected " + this.path + " ") + ("to be " + this.expected + ", ") + ("but got " + this.value);
      }
    }
  });

  return TestFailError;
})(PatchError);

var PointerError = exports.PointerError = (function (_PatchError4) {
  function PointerError(message) {
    _classCallCheck(this, PointerError);

    this.name = "PointerError";
    this.message = message;
  }

  _inherits(PointerError, _PatchError4);

  return PointerError;
})(PatchError);

function isError(err) {
  return err instanceof PatchError;
}