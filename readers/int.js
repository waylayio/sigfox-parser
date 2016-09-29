'use strict'

/**
 * int (signed integer) : parameters are the number of bits to include
 * in the value, and optionally the endianness for multi-bytes integers
 * Default is big endian
 */
module.exports = function readInt (buffer, offset, length, endian) {
  return endian === 'big-endian'
    ? buffer.readIntBE(offset, length / 8)
    : buffer.readIntLE(offset, length / 8)
}
