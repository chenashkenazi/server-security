const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const auth = require('./auth');
const hash = require('./hash');
const passwordPolicy = require('./password_policy/policies');
const fileUpload = require('./file_upload');

const createSecureServer = (app) => {
    const options = {
        key: fs.readFileSync(process.env.TLS_KEY_PATH),
        cert: fs.readFileSync(process.env.TLS_CERT_PATH),
        dhparam: fs.readFileSync(process.env.TLS_DH_KEY_PATH),
        passphrase: process.env.TLS_PASSPHRASE
    };

    app.use(helmet());

    return https.createServer(options, app);
}

module.exports = {
    createSecureServer,
    hashPassword: hash.hashPassword,
    verifyPassword: hash.verifyPassword,
    validatePasswordOnSignup: auth.validatePasswordOnSignup,
    validateForgotPassword: auth.validateForgotPassword,
    validateResetPassword: auth.validateResetPassword,
    generateForgotPasswordToken: auth.generateForgotPasswordToken,
    validatePasswordAge: passwordPolicy.validatePasswordAge,
    validateFileType: fileUpload.validateFileType
}