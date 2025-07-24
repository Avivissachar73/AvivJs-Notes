
const fs = require('fs');


const DYNAMIC_FILES_PATH = 'src/dynamic-files';

function writeFile(fileName, fileContent) {
  if (!fs.existsSync(DYNAMIC_FILES_PATH)) fs.mkdirSync(DYNAMIC_FILES_PATH);
  const path = `${DYNAMIC_FILES_PATH}/${fileName}`;
  fs.writeFileSync(path, fileContent);
  return path;
}

module.exports = {
  writeFile
}