const crypto = require('crypto');
const jwtSecret = crypto.randomBytes(8).toString('hex');
console.log(jwtSecret);
