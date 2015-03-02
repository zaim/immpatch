export class PatchError extends Error {}


export class InvalidOperationError extends PatchError {
  constructor (op, reason) {
    this.name = 'InvalidOperationError'
    this.op = op
    this.reason = reason
  }

  toString () {
    return `Invalid ${this.op} operation: ${this.reason}`
  }
}


export class PathNotFoundError extends PatchError {
  constructor (path) {
    this.name = 'PathNotFoundError'
    this.path = path
  }

  toString () {
    return `Path not found: ${this.path}`
  }
}


export class TestFailError extends PatchError {
  constructor (path, expected, value) {
    this.name = 'TestFailError'
    this.path = path
    this.expected = expected
    this.value = value
  }

  toString () {
    return `Test failed: `
    + `expected ${this.path} `
    + `to be ${this.expected}, `
    + `but got ${this.value}`
  }
}


export class PointerError extends PatchError {
  constructor (message) {
    this.name = 'PointerError'
    this.message = message
  }
}


export function isError (err) {
  return err instanceof PatchError
}

