const moment = require('moment');
const config = require('config');
const hash = require('../hash');
const PasswordDictionary = require('./PasswordDictionary')
const passwordDictionary = new PasswordDictionary();

const validatePasswordComplexity = (password) => {
    if (!config.has('secureServer.passwordPolicy.passwordComplexity')) {
        return true;
    }
    let passwordComplexityConfig = config.get('secureServer.passwordPolicy.passwordComplexity');

    const minLengthValid = passwordComplexityConfig.minLength ?
            password.length >= passwordComplexityConfig.minLength : true;
    const bigAlphaValid = passwordComplexityConfig.requireBigAlpha === true ?
            /[A-Z]/.test(password) : true;
    const smallAlphaValid = passwordComplexityConfig.requireSmallAlpha === true ?
            /[a-z]/.test(password) : true;
    const numericValid = passwordComplexityConfig.requireNumeric === true ?
            /\d/.test(password) : true;
    const specialCharsValid = passwordComplexityConfig.requireSpecialChars === true ?
            /[!@#$%^&*]/.test(password) : true;

    return minLengthValid && bigAlphaValid && smallAlphaValid && numericValid && specialCharsValid;
}

const validatePasswordAge = (password_modified_time) => {
    if (!config.has('secureServer.passwordPolicy.passwordAge')){
        return true;
    }

    let passwordAge = config.get('secureServer.passwordPolicy.passwordAge');

    return moment().subtract(passwordAge, 'days') < moment(password_modified_time);
}

const validatePasswordHistory = (plaintextPassword, hashedPasswordHistory) => {
    if (!config.has('secureServer.passwordPolicy.passwordHistorySize'
            || !hashedPasswordHistory)){
        return true;
    }
    let passwordHistorySize = config.get('secureServer.passwordPolicy.passwordHistorySize');
    hashedPasswordHistory.sort((a, b) => (b.id - a.id));
    hashedPasswordHistory = hashedPasswordHistory.slice(0, passwordHistorySize);

    return Promise.all(hashedPasswordHistory.map((hashedPasswordEntry) =>
            hash.verifyPassword(plaintextPassword, hashedPasswordEntry.password)))
    .then((results) => {
        for(const passwordExistsInHistory of results) {
            if (passwordExistsInHistory) {
                return false;
            }
        }
        return true;
    });
}

const validateDictPassword = async (password) => {
    if (!config.has('secureServer.passwordPolicy.dictionaryTable')){
        return true;
    }

    const dict = await passwordDictionary.get();
    return !dict.includes(password);
}

module.exports = {
    validatePasswordComplexity,
    validatePasswordAge,
    validatePasswordHistory,
    validateDictPassword
}