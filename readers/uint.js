'use strict'

/**
 * uint (unsigned integer) : parameters are the number of bits to
 * include in the value, and optionally the endianness for multi-bytes integers
 * Default is big endian
 */
module.exports = function readUInt (buffer, offset, length, endian) {
  return endian === 'big-endian'
    ? buffer.readUIntBE(offset, length / 8)
    : buffer.readUIntLE(offset, length / 8)
}
