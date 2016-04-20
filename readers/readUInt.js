'use strict'

module.exports = function readUInt(buffer, offset, length, endian) {
  if (!endian || endian === 'big-endian') {
    return buffer.readUIntBE(offset, length / 8);
  } else {
    return buffer.readUIntLE(offset, length / 8);
  }
}
