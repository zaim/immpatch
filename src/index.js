import patch from './patch'
import parse from './parse'
import PatchError from './error'

patch.parse = parse
patch.Error = PatchError
patch.isError = PatchError.isError

export default patch
