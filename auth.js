const crypto = require("crypto");
const passwordPolicy = require('./password_policy/policies');
const hash = require('./hash');

const generateForgotPasswordToken = async () => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await hash.hashPassword(resetToken);
    return {
        resetToken: resetToken,
        hashedToken: hashedToken
    }
}

const validateForgotPassword = async (token, hashedToken, newPassword, hashedPasswordHistory) => {
    const promises = [
        hash.verifyPassword(token, hashedToken),
        Promise.resolve(passwordPolicy.validatePasswordComplexity(newPassword)),
        passwordPolicy.validatePasswordHistory(newPassword, hashedPasswordHistory),
        passwordPolicy.validateDictPassword(newPassword)
    ];

    return Promise.all(promises)
    .then(isValidationSuccessful);
}

const validatePasswordOnSignup = (password) => {
    const promises = [
        Promise.resolve(passwordPolicy.validatePasswordComplexity(password)),
        passwordPolicy.validateDictPassword(password)
    ];

    return Promise.all(promises)
    .then(isValidationSuccessful);
}

const validateResetPassword = (oldPassword, oldPasswordHash, oldPasswordAge, newPassword, hashedPasswordHistory) => {
    const promises = [
        hash.verifyPassword(oldPassword, oldPasswordHash),
        Promise.resolve(passwordPolicy.validatePasswordComplexity(newPassword)),
        Promise.resolve(passwordPolicy.validatePasswordAge(oldPasswordAge)),
        passwordPolicy.validatePasswordHistory(newPassword, hashedPasswordHistory),
        passwordPolicy.validateDictPassword(newPassword)
    ];

    return Promise.all(promises)
    .then(isValidationSuccessful);
}

const isValidationSuccessful = (results) => {
    for (const valid of results) {
        if (!valid) {
            return false;
        }
    }
    return true;
}

module.exports = {
    generateForgotPasswordToken,
    validateForgotPassword,
    validatePasswordOnSignup,
    validateResetPassword
}