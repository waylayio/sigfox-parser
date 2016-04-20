'use strict';

// returns a boolean according to the nth bit of the byte.
// <<: left bit shift
// eg.:
// input 11100101
// we want the boolean value for the 8th bit (beginning from the right)
// inputmask: 1 << 7
// 00000001
// << 7
// 10000000
// After this we apply the inputmask to the input
//   11100101
// & 10000000
// ----------
//   10000000 -> true
// !! convert to bool
module.exports = function readBool(buffer, offset, position) {
  return !!(buffer.readInt8(buffer) & (1 << position));
}
