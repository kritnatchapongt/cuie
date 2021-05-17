const fs = require('fs');
const path = require('path');

function initStaticFolder() {
    const dirFiles = path.join(process.env.PATH_STATIC, 'files');
    if (!fs.existsSync(dirFiles)){
        fs.mkdirSync(dirFiles);
    }
    const dirProfiles = path.join(process.env.PATH_STATIC, 'profiles');
    if (!fs.existsSync(dirProfiles)){
        fs.mkdirSync(dirProfiles);
    }
    const dirGroups = path.join(process.env.PATH_STATIC, 'groups');
    if (!fs.existsSync(dirGroups)){
        fs.mkdirSync(dirGroups);
    }
}

module.exports = {initStaticFolder};