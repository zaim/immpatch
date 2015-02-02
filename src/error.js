class PatchError extends Error {
  constructor (message) {
    this.name = PatchError
    this.message = message
  }
  static isError (e) {
    return e instanceof PatchError
  }
}

export default PatchError
