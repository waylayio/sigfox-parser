'use strict';

module.exports = function readInt(buffer, offset, length, endian) {
  if (!endian || endian === 'big-endian') {
    return buffer.readIntBE(offset, length / 8);
  } else {
    return buffer.readIntLE(offset, length / 8);
  }
}
