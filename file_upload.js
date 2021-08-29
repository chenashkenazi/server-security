const config = require('config');
const FileType = require('file-type');

const validateFileType = async (file) => {
    if (!config.has('secureServer.fileUpload.allowedTypes')) {
        return true;
    }
    let fileUploadTypes = config.get('secureServer.fileUpload.allowedTypes');

    const fileExtension = file.name.split('.')[1];
    if (!fileUploadTypes.includes(fileExtension)) {
        return false;
    }

    if (!config.has('secureServer.fileUpload.verifyFileMagicNumbers')) {
        return true;
    }
    let verifyFileMagicNumbers = config.get('secureServer.fileUpload.verifyFileMagicNumbers');

    if (!verifyFileMagicNumbers) {
        return true;
    }

    const fileDetails = await FileType.fromBuffer(file.data);

    if (fileDetails && fileUploadTypes.includes(fileDetails.ext)) {
        return true;
    }
    return false;
}

module.exports = {
    validateFileType
}