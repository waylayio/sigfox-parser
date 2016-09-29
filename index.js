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
function parseMessage (data, format) {
  const buffer = Buffer.isBuffer(data)
    ? data
    : new Buffer(data, 'hex')

  const types = {
    'uint': _.curry(require('./readers/uint'))(buffer),
    'int': _.curry(require('./readers/int'))(buffer),
    'float': _.curry(require('./readers/float'))(buffer),
    'bool': _.curry(require('./readers/bool'))(buffer),
    'char': _.curry(require('./readers/char'))(buffer)
  }
  let current = 0
  let last = 0

  const fields = parseFields(format)
  return _.reduce(fields, (obj, field) => {
    let l = current
    current += last
    if (field.type !== 'bool') {
      l = current
    }

    obj[field.name] = types[field.type](field.offset || l, field.length, field.endianness)

    last = field.length / (field.type === 'char' ? 1 : 8)
    return obj
  }, {})
}

function parseFields (format) {
  const fields = format.trim().replace(/\s+/g, ' ').split(' ')
  return _.map(fields, field => {
    const split = field.split(':')
    return {
      name: split[0],
      offset: split[1],
      type: split[2],
      length: split[3],
      endianness: split[4]
    }
  })
}

module.exports = parseMessage
module.exports.parseFields = parseFields
