const fs = require('fs');
const faceapi = require("face-api.js");
const compareFace = require('./compareFace.js');
const { max } = require('@tensorflow/tfjs-core');

async function search(imgDescriptor) {
    let found = false;
    max = {
        "id": null,
        "distance": 1
    };
    let id = 1;
    let referencePath;
    genre = imgDescriptor.genre;
    while (!found) {
        for (let i = 1; i <= 3; i++) {
            referencePath = `./public/faces/${genre}s/${id}/${i}.json`
            let compareResult = compareFace.compareObjectJSON(imgDescriptor, referencePath);
            if (compareResult < max.distance){
                max = {
                    "id":id,
                    "distance": compareResult
                }
            }
            if (compareResult < 0.3) {
                found = true;
                break;
            }
            
        }
        id++;
        //trouver nombre de dossier dans un dossier avec node.js
    }
    //ity id ity tadiavina ary amin'ny database
    if(found){
        return max;
    }else{
        return 0;
    }
}
module.exports.search = search;