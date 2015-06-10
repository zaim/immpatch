export class PatchError extends Error {
  // Based on https://gist.github.com/daliwali/09ca19032ab192524dc6
  constructor (message) {
    super();
 
    if (Error.hasOwnProperty('captureStackTrace'))
      Error.captureStackTrace(this, this.constructor);
    else
      Object.defineProperty(this, 'stack', {
        value: (new Error()).stack
      });
 
    Object.defineProperty(this, 'message', {
      value: message
    });
  }
 
  get name () {
    return this.constructor.name;
  }
}


export class InvalidOperationError extends PatchError {
  constructor (op, reason) {
    super(`Invalid ${op} operation: ${reason}`)
    this.op = op
    this.reason = reason
  }
}


export class PathNotFoundError extends PatchError {
  constructor (path) {
    super(`Path not found: ${path}`)
    this.path = path
  }
}


export class TestFailError extends PatchError {
  constructor (path, expected, value) {
    super(`Test failed: expected ${path} to be ${expected}, but got ${value}`)
    this.path = path
    this.expected = expected
    this.value = value
  }
}


export class PointerError extends PatchError {
  constructor (message) {
    super(message)
  }
}


export function isError (err) {
  return err instanceof PatchError
}

