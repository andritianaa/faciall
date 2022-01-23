const fs = require('fs');
const faceapi = require("face-api.js");
const compareFace = require('./compareFace.js');

async function search(imgDescriptor) {
    let found = false;
    let id = 1;
    let referencePath;
    while (!found) {
        for (let i = 1; i <= 3; i++) {
            referencePath = `./public/faces/${genre}s/${id}/${i}.json`
            let compareResult = compareFace.compareObjectJSON(imgDescriptor, referencePath);

            //resultats
            if (compareResult < 0.45) {
                console.log("\nResults : Olona mitovy");
                found = true;
            } else if (compareResult > 0.45) {
                console.log("\nResults : Olona samihafa ");
            } else {
                console.log("Sary mitovy");
                found = true;
            }
        }
        id++;
        //trouver nombre de dossier dans un dossier avec node.js
    }
    //ity id ity tadiavina ary amin'ny database
    if(found){
        return {
            'id':id
        };
    }else{
        return 0;
    }
}
module.exports.search = search;