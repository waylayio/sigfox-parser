'use strict';

module.exports = function readChar(buffer, offset, length) {
  return buffer.slice(offset, offset + length).toString('utf-8');
}
