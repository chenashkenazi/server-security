const fs = require('fs');

class PasswordDictionary {

    constructor() {
        this.get();
    }

    async get() {
        if (!this.dict) {
            this.dict = await this.init();
        }
        return Promise.resolve(this.dict);
    }

    async init() {
        return new Promise((resolve, reject) => {
            fs.readFile(__dirname + '/English.dic', 'utf8' , (err, data) => {
                if (err) {
                    reject("Failed to open dictionary file");
                }
                resolve(data.split('\r\n'));
            })
        });
    }
}

module.exports = PasswordDictionary;