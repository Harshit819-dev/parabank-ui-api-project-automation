const fs = require('fs');
const path = require('path');

class Helper {
    static loadTestData(filePath) {
        const absolutePath = path.resolve(__dirname, '..', filePath);
        const rawData = fs.readFileSync(absolutePath, 'utf-8');
        return JSON.parse(rawData);
    }
    static putTestData(dataToPut) {
        const absolutePath = path.resolve(__dirname, '..','./testData/userData.json');
        console.log("absolutePath",absolutePath);
        fs.writeFileSync(absolutePath,JSON.stringify(dataToPut, null, 2));
    }
}
module.exports = Helper;
