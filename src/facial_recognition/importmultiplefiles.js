const create = require('./createDescriptorFile.js');
const fs = require('fs');
async function importAll(nbrImport, isMale) {
    if (isMale) {
        genre = "males";
    } else {
        genre = "females";
    }
    //id tsy misy voalohany voalohany 
    const id = (fs.readdirSync(`./public/faces/${genre}`).length) + 1;
    for (let i = 1; i <= nbrPerson; i++) {
        fs.mkdir(`./public/faces/${genre}/${id}`);
        for (let j = 1; j <= 3; j++) {
            await create.createDescriptorFile(`./temp/${genre}/${i}/${j}.jpg`, `./public/faces/${genre}/1/${j}.json`);
        }
        id++;
    }
}


//<>