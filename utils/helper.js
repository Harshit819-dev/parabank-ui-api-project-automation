const fs = require('fs');
const path = require('path');

class Helper {
    static loadTestData(filePath) {
        const absolutePath = path.resolve(__dirname, '..', filePath);
        const rawData = fs.readFileSync(absolutePath, 'utf-8');
        return JSON.parse(rawData);
    }
}
module.exports = Helper;
