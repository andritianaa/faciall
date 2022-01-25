const fs = require('fs');
const faceapi = require("face-api.js");
const compareFace = require('./compareFace.js');
const { NONAME } = require('dns');

async function search(imgDescriptor) {

    found = false;
    let correspondance_list = [];
    let id = 0;
    let i = 1;
    let referencePath;
    genre = imgDescriptor.genre;
    const personNumber = fs.readdirSync(`./public/faces/${genre}s`).length;

    while (i <= 2 && found == false) {

        for (let j = 1; j <= personNumber; j++) {

            id++;
            referencePath = `./public/faces/${genre}s/${id}/${i}.json`;
            let compareResult = compareFace.compareObjectJSON(imgDescriptor, referencePath);

            if (compareResult < 0.45) {
                found = true;
                correspondance_list.push({
                    id: id
                });
                if (compareResult < 0.3) {
                    return {
                        id: id,
                        difference: compareResult
                    };
                }
            }
        }

        if (correspondance_list.length == 1) {
            return {
                id: id,
                difference: compareResult
            };
        } else if (correspondance_list.length == 0 && i == 2) {
            return {
                id: 0,
                difference:1
            }
        }else if (correspondance_list.length == 0){
            i++;
        }else {
            max = {
                id: null,
                difference: 0.45
            };
            tmp = i++;
            array.forEach((el, index, correspondance_list) => {
                referencePath = `./public/faces/${genre}s/${el.id}/${tmp}.json`;
                let compareResult = compareFace.compareObjectJSON(imgDescriptor, referencePath);
                if (compareResult < max.difference) {
                    max = {
                        id: el.id,
                        difference: compareResult
                    }
                }
            });
            return max;
        }

    }

    //trouver nombre de dossier dans un dossier avec node.js

    return 404;
}
module.exports.search = search;