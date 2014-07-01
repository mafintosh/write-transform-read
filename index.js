var eos = require('end-of-stream')

module.exports = function(writable, readable) {
  readable = readable || writable

  var queue = []
  var error

  var consume = function() {
    var data
    while (queue.length && (data = readable.read())) queue.shift()(null, data)
    if (error) while (queue.length) queue.shift()(error)
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

  return function(data, cb) {
    queue.push(cb)
    writable.write(data)
    consume()
  }
}