# write-transform-read

Write to a transform stream and read the output using a function

```
npm install write-transform-read
```

[![build status](http://img.shields.io/travis/mafintosh/write-transform-read.svg?style=flat)](http://travis-ci.org/mafintosh/write-transform-read)
![dat](http://img.shields.io/badge/Development%20sponsored%20by-dat-green.svg?style=flat)

# Usage

``` js
var writeread = require('write-transform-read')
var through = require('through2')

var echo = through.obj(function(data, enc, cb) {
  cb(null, {echo:data})
})

// simply pass any kind of transform stream
var transform = writeread(echo)

// will write 'test' to the stream and pass the next output to the callback
transform('test', function(err, result) {
  console.log(result) // will print {echo:'test'}
})
```

This is useful if you have a transform as a stream but need to only convert a single item

## License

MIT