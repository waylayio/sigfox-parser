'use strict'

const _ = require('lodash')

/**
 * Parses a message accoring to the Sigfox Payload decoding grammer.
 * A field is defined by its name, its position in the message bytes, its length and its type :
 * the field name is an identifier including letters, digits and the '-' and '_' characters.
 * the byte index is the offset in the message buffer where the field is to be read from, starting at zero. If omitted, the position used is the current byte for boolean fields and the next byte for all other types. For the first field, an omitted position means zero (start of the message buffer)
 * Next comes the type name and parameters, which varies depending on the type :
 * boolean : parameter is the bit position in the target byte
 * char : parameter is the number of bytes to gather in a string
 * float : parameters are the length in bits of the value, which can be either 32 or 64 bits, and optionally the endianness for multi-bytes floats. Default is big endian. Decoding is done according to the IEEE 754 standard.
 * uint (unsigned integer) : parameters are the number of bits to include in the value, and optionally the endianness for multi-bytes integers. Default is big endian.
 * int (signed integer) : parameters are the number of bits to include in the value, and optionally the endianness for multi-bytes integers. Default is big endian.
 */
module.exports = function parseMessage (data, format) {
  const buffer = new Buffer(data, 'hex')
  const types = {
    'uint': _.curry(require('./readers/readUInt'))(buffer),
    'int': _.curry(require('./readers/readInt'))(buffer),
    'float': _.curry(require('./readers/readFloat'))(buffer),
    'bool': _.curry(require('./readers/readBool'))(buffer),
    'char': _.curry(require('./readers/readChar'))(buffer)
  }
  let current = 0
  let last = 0

  return _.reduce(format.split(' '), (obj, value) => {
    const fields = value.split(':')
    let l = current
    current += last
    if (fields[2] !== 'bool') {
      l = current
    }
    obj[fields[0]] = types[fields[2]](fields[1] || l, fields[3], fields[4])

    last = fields[3] / (fields[2] === 'char' ? 1 : 8)
    return obj
  }, {})
}
