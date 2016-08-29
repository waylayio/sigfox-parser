'use strict'

var tap = require('tap')
var parse = require('./../index')

var cases = [
  {
    data: '1234',
    format: 'int1::uint:8 int2::uint:8',
    expected: { int1: 0x12, int2: 0x34 }
  },
  {
    data: 'C01234',
    format: 'b1::bool:7 b2::bool:6 i1:1:uint:16',
    expected: { b1: true, b2: true, i1: 0x1234 }
  },
  {
    data: '801234',
    format: 'b1::bool:7 b2::bool:6 i1:1:uint:16:little-endian',
    expected: { b1: true, b2: false, i1: 0x3412 }
  },
  {
    data: '80123456',
    format: 'b1::bool:7 b2::bool:6 i1:1:uint:16:little-endian i2::uint:8',
    expected: { b1: true, b2: false, i1: 0x3412, i2: 0x56 }
  },
  {
    data: '41424344454601234567890A',
    format: 'str::char:6 i1::uint:16 i2::uint:32',
    expected: { str: 'ABCDEF', i1: 0x123, i2: 0x4567890A }
  },
  {
    data: '171318',
    format: 'lightAmbi::uint:16 temperature:2:int:8',
    expected: { lightAmbi: 5907, temperature: 24 }
  },
  {
    data: '1E660382BA583FF426D609',
    format: 'Battery::uint:8 pH::uint:16:little-endian Conductivity::float:32:little-endian DO::uint:16:little-endian Temp::uint:16:little-endian',
    expected: { Battery: 30, pH: 870, Conductivity: 0.8465958833694458, DO: 9972, Temp: 2518 }
  }
]

cases.forEach(function (c) {
  tap.test('test format and expected values', function (t) {
    t.plan(1)

    var result = parse(c.data, c.format)
    t.deepEqual(result, c.expected)
  })
})

tap.test('test uinttypes', function (t) {
  t.plan(1)

  var expected = {
    int1: 100,
    int2: 200,
    int3: 42,
    int4: 0,
    int5: 8558,
    int6: 0x0123456789A,
    int7: 0x0123456789A
  }
  var buffer = new Buffer(32)

  buffer.writeUInt8(100, 0)
  buffer.writeUInt16BE(200, 1)
  buffer.writeUInt16LE(42, 3)
  buffer.writeUInt32BE(0, 5)
  buffer.writeUInt32LE(8558, 9)
  buffer.writeUIntBE(0x0123456789A, 13, 6)
  buffer.writeUIntLE(0x0123456789A, 19, 6)

  var data = buffer.toString('hex')
  var result = parse(data, 'int1::uint:8 int2:1:uint:16 int3:3:uint:16:little-endian int4:5:uint:32 int5:9:uint:32:little-endian int6:13:uint:48 int7:19:uint:48:little-endian')
  t.deepEqual(result, expected)
})

tap.test('test inttypes', function (t) {
  t.plan(1)

  var expected = {
    int1: -100,
    int2: -200,
    int3: -42,
    int4: 0,
    int5: -8558,
    int6: -0x0123456789B,
    int7: -0x0123456789A
  }
  var buffer = new Buffer(32)

  buffer.writeInt8(-100, 0)
  buffer.writeInt16BE(-200, 1)
  buffer.writeInt16LE(-42, 3)
  buffer.writeInt32BE(-0, 5)
  buffer.writeInt32LE(-8558, 9)
  buffer.writeIntBE(-0x0123456789B, 13, 6)
  buffer.writeIntLE(-0x0123456789A, 19, 6)

  var data = buffer.toString('hex')
  var result = parse(data, 'int1::int:8 int2:1:int:16 int3:3:int:16:little-endian int4:5:int:32 int5:9:int:32:little-endian int6:13:int:48 int7:19:int:48:little-endian')
  t.deepEqual(result, expected)
})

tap.test('test chars', function (t) {
  t.plan(1)

  var expected = { message: 'Hello world!' }
  var buffer = new Buffer(32)

  buffer.write('Hello world!', 0)

  var data = buffer.toString('hex')
  var result = parse(data, 'message::char:12')
  t.deepEqual(result, expected)
})

tap.test('test bools', function (t) {
  t.plan(1)

  var expected = {
    b1: true,
    b2: false,
    b3: true,
    b4: true,
    b5: false,
    b6: false,
    b7: false,
    b8: true
  }
  var buffer = new Buffer(1)

  buffer.writeUInt8(0b10110001, 0)

  var data = buffer.toString('hex')
  var result = parse(data, 'b1:0:bool:7 b2:0:bool:6 b3:0:bool:5 b4:0:bool:4 b5:0:bool:3 b6:0:bool:2 b7:0:bool:1 b8:0:bool:0')
  t.deepEqual(result, expected)
})
