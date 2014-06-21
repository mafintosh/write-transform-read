var writeread = require('./')
var through = require('through2')
var tape = require('tape')

tape('passthrough', function(t) {
  var stream = through.obj()
  var transform = writeread(stream)

  transform({hello:'world'}, function(err, data) {
    t.same(data, {hello:'world'})
    t.end()
  })
})

tape('basic transform', function(t) {
  var stream = through.obj(function(data, enc, cb) {
    cb(null, {echo:data})
  })
  var transform = writeread(stream)

  transform({hello:'world'}, function(err, data) {
    t.same(data, {echo:{hello:'world'}})
    t.end()
  })
})

tape('multiple transform', function(t) {
  t.plan(3)

  var stream = through.obj(function(data, enc, cb) {
    cb(null, {echo:data})
  })

  var transform = writeread(stream)

  transform({hello:1}, function(err, data) {
    t.same(data, {echo:{hello:1}})
  })
  transform({hello:2}, function(err, data) {
    t.same(data, {echo:{hello:2}})
  })
  transform({hello:3}, function(err, data) {
    t.same(data, {echo:{hello:3}})
  })
})

tape('error', function(t) {
  var stream = through.obj(function(data, enc, cb) {
    cb(new Error('lol'))
  })

  var transform = writeread(stream)

  transform({hello:1}, function(err, data) {
    t.ok(err)
    t.same(err.message, 'lol')
    t.end()
  })
})