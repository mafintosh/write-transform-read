var eos = require('end-of-stream')

module.exports = function(writable, readable) {
  readable = readable || writable

  var queue = []
  var readableError
  var writableError

  var consume = function() {
    var data
    while (queue.length && (data = readable.read())) queue.shift()(null, data)
    if (readableError) while (queue.length) queue.shift()(readableError)
  }

  readable.on('readable', consume)
  eos(readable, {readable:true, writable:false}, function(err) {
    error = err || new Error('readable stream closed')
    consume()
  })

  eos(writable, {readable:false, writable:false}, function(err) {
    error = err || new Error('writable stream closed')
    consume()
  })

  eos(readable, {readable:true, writable:false}, function(err) {
    readableError = readableError || err || new Error('readable stream closed')
  })

  eos(writable, {readable:false, writable:true}, function(err) {
    writableError = writableError || err || new Error('writable stream closed')
  })

  return function(data, cb) {
    if (writableError) return cb(writableError)
    queue.push(cb)
    writable.write(data)
    consume()
  }
}
