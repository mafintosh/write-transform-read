var eos = require('end-of-stream')

module.exports = function(stream) {
  var queue = []
  var error

  var consume = function() {
    var data
    while (queue.length && (data = stream.read())) queue.shift()(null, data)
    if (error) while (queue.length) queue.shift()(error)
  }

  stream.on('readable', consume)
  eos(stream, {readable:true, writable:false}, function(err) {
    error = err || new Error('stream closed')
    consume()
  })

  return function(data, cb) {
    queue.push(cb)
    stream.write(data)
    consume()
  }
}