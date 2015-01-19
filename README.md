# immpatch
[![Build Status][travis-img]][travis-url] [![coverage][coveralls-img]][coveralls-url] [![dependencies][david-img]][david-url]

> Update [immutable.js](https://github.com/facebook/immutable-js) objects using JSON Patch operations

## Install

```
$ npm install --save immpatch
```

## Usage

```javascript
var expect = require('expect.js');
var Immutable = require('immutable');
var patch = require('immpatch');

var object = Immutable.fromJS({ baz: 'qux', foo: 'bar' });

var patched = patch(object, [
  { op: 'replace', path: '/baz', value: 'boo' },
  { op: 'add', path: '/hello', value: ['world'] },
  { op: 'remove', path: '/foo'}
]);

expect(patched.toJS()).to.eql({
  baz: 'boo',
  hello: ['world']
});
```

For more information about JSON Patch, see:

* [jsonpatch.com](http://jsonpatch.com)
* [RFC 6902](https://tools.ietf.org/html/rfc6902)
* [RFC 6901](https://tools.ietf.org/html/rfc6901)

For a diff / patch generator see
[immutablediff](https://www.npmjs.com/package/immutablediff).

Another similar module is
[immutablepatch](https://www.npmjs.com/package/immutablepatch), immpatch is a
simpler implementation that uses plain JS objects as patch operations, and has
more complete tests with 100% code coverage.

## Testing

```
$ git clone git://github.com/zaim/immpatch
$ npm install
$ npm run test
```

Test coverage:

```
$ npm run testcov
```

## Contributing

Use [Github issues](https://github.com/zaim/immpatch/issues) for bug reports
and requests.

Pull requests are actively welcomed.

## License

`immpatch` is [MIT licensed](./LICENSE).

[travis-url]: https://travis-ci.org/zaim/immpatch
[travis-img]: http://img.shields.io/travis/zaim/immpatch.svg?style=flat-square
[david-url]: https://david-dm.org/zaim/immpatch
[david-img]: https://img.shields.io/david/zaim/immpatch.svg?style=flat-square
[coveralls-url]: https://coveralls.io/zaim/immpatch
[coveralls-img]: https://img.shields.io/coveralls/zaim/immpatch.svg?style=flat-square
