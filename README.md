# sigfox-parser

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/waylayio/sigfox-parser.svg?branch=master)](https://travis-ci.org/waylayio/sigfox-parser)
[![Coverage Status](https://coveralls.io/repos/github/waylayio/sigfox-parser/badge.svg?branch=master)](https://coveralls.io/github/waylayio/sigfox-parser?branch=master)

Sigfox data format parser

## Usage

### Parse a message

```javascript
require('sigfox-parser')(<messagebytes>, <formatstring>);
```

**messagebytes**: The bytes of the message encoded in a hexadecimal String.

**formatstring**: A formatstring according to the Sigfox documentation.

Example

```javascript
var parsed = require('sigfox-parser')('C01234','b1::bool:7 b2::bool:6 i1:1:uint:16');
```

The variable parsed now contains:

```javascript
{
  b1: true,
  b2: true,
  i1: 0x1234
}
```

### Parse the syntax

```javascript
var parser = require('sigfox-parser')

var fields = parser.parseFields('lightAmbi::uint:16 temperature:2:int:8')

console.log(fields)
/**
[ { name: 'lightAmbi',
    offset: '',
    type: 'uint',
    length: '16',
    endianness: 'big-endian' },
  { name: 'temperature',
    offset: '2',
    type: 'int',
    length: '8',
    endianness: 'big-endian' } ]
**/
```

## Formatstring
A formatstring consists of multiple fields. A field is defined by its name, its position in the message bytes, its length and its type :

* the field name is an identifier including letters, digits and the '-' and '_' characters.
* the byte index is the offset in the message buffer where the field is to be read from, starting at zero. If omitted, the position used is the current byte for boolean fields and the next byte for all other types. For the first field, an omitted position means zero (start of the message buffer)
* Next comes the type name and parameters, which varies depending on the type :
* boolean : parameter is the bit position in the target byte
* char : parameter is the number of bytes to gather in a string
* float : parameters are the length in bits of the value, which can be either 32 or 64 bits, and optionally the endianness for multi-bytes floats. Default is big endian. Decoding is done according to the IEEE 754 standard.
* uint (unsigned integer) : parameters are the number of bits to include in the value, and optionally the endianness for multi-bytes integers. Default is big endian.
* int (signed integer) : parameters are the number of bits to include in the value, and optionally the endianness for multi-bytes integers. Default is big endian.

_(cfr. Sigfox documentation)_
