'use strict';

module.exports = function readFloat(buffer, offset, length, endian) {
  if (!endian || endian === 'big-endian') {
    if (length === 32) {
      return buffer.readFloatBE(offset);
    } else {
      return buffer.readDoubleBE(offset);
    }
  } else {
    if (length === 64) {
      return buffer.readDoubleLE(offset);
    } else {
      return buffer.readFloatLE(offset);
    }
  }
}
