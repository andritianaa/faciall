const create = require('./createDescriptorFile.js');
const fs = require('fs');
async function importAll(nbrImport, isMale) {
    if (isMale) {
        genre = "males";
    } else {
        genre = "females";
    }


    for (let i = 1; i <= nbrImport; i++) {
        //id tsy misy voalohany voalohany 
        let id = (fs.readdirSync(`./static/persons/${genre}`).length) + 1;
        fs.mkdir(`./static/persons/${genre}/${id}`, (err) => {
            if (err) throw err;
        });
        for (let j = 1; j <= 3; j++) {
            fs.copyFile(`./temp/${genre}/${i}/0.jpg`, `./static/persons/${genre}/${id}/photo.jpg`, (err) => {
                if (err) throw err;
            });
            await create.createDescriptorFile(`./temp/${genre}/${i}/${j}.jpg`, `./static/persons/${genre}/${id}/${j}.json`);
        }

    }
}

// importAll(6,false);
//<>