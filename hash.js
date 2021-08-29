const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds).then((hash) => hash);
}

const verifyPassword = async (password, hash) => {
    return bcrypt.compare(password, hash).then((result) => result);
}

module.exports = {
    hashPassword,
    verifyPassword,
}