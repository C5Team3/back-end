const crypto = require('crypto');

module.exports = function (numberBytes) {
  const buffer = crypto.randomBytes(numberBytes);
  return buffer.toString('hex');
}
