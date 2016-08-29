'use strict'

/**
 * float : parameters are the length in bits of the value,
 * which can be either 32 or 64 bits, and optionally the endianness for
 * multi-bytes floats
 *
 * Default is big endian
 * Decoding is done according to the IEEE 754 standard
 */
module.exports = function readFloat (buffer, offset, length, endian) {
  // big-endian (default)
  if (!endian || endian === 'big-endian') {
    return length === 32
      ? buffer.readFloatBE(offset)
      : buffer.readDoubleBE(offset)
  }

  // little-endian
  return (length === 64)
    ? buffer.readDoubleLE(offset)
    : buffer.readFloatLE(offset)
}
