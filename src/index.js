import patch from './patch'
import parse from './parse'
import * as error from './error'

for (let key in error) {
  /* istanbul ignore else */
  if (Object.prototype.hasOwnProperty.call(error, key)) {
    patch[key] = error[key]
  }
}

patch.Error = patch.PatchError
patch.parse = parse

export default patch
