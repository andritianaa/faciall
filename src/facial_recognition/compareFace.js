const fs = require("fs");
const canvas = require("canvas");
const faceapi = require("face-api.js");



const {
    Canvas,
    Image,
    ImageData
} = canvas;
faceapi.env.monkeyPatch({
    Canvas,
    Image,
    ImageData
})

//declaration asynchrone de la reconnaissance faciale
async function compareImageJSON(pathFaceToSearch, pathReference) {
    //chargement des models
    await faceapi.nets.faceRecognitionNet.loadFromDisk('src/facial_recognition/models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('src/facial_recognition/models');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('src/facial_recognition/models');
    console.log("Models loaded");
    //models chargés

    /**loading image in canvas
     * face api mampiasa htmlImageElement na htmlVideoElement de ny fichier image tsotra atsofoka
     * anaty canvas mba holasa htmlImageElement
     */
    newImage = await canvas.loadImage(pathFaceToSearch);

    /**
     * calculena ny description faciale an'ireo image
     * mamoaka objet js izay hocomparena avy eo ilay calcul
     * raha mahita tarehy de mitohy
     * raha tsy mahita de throw error (to do)
     */
    console.log("Descripting faceToSearch");
    const faceToSearch = await faceapi.detectSingleFace(newImage).withFaceLandmarks().withFaceDescriptor();
    if (faceToSearch) console.log("faceToSearch has face");
    else console.log("No face found in faceToSearch");

    //atao anaty var reference ilay descriptor en JSON an'ireo tarehy anaovana comparaison
    let reference = fs.readFileSync(pathReference, (err, data) => {
        if (err) throw err;
    });
    let parsedFile = JSON.parse(reference);
    //object.values no alaina satria Array ilay descriptor fa tsy objet
    reference = Object.values(parsedFile);

    //amoronana faceMatcher ilay tarehy itadiavana ny tompony
    const faceMatcher = new faceapi.FaceMatcher(faceToSearch);

    /**
     * tadiavina amin'ny alalan'ny methode findBestMatch() ananan'ny objet faceMatcher
     * mamoaka _distance io methode io entre 0 et 1
     * plus manakaiky ny 0 plus mitovy ireo tarehy anakiroa
     * plus manakaiky ny 1 plus tsy mitovy
     * eo amin'ny 0.3 sy 0.4 eo hoeo ny distance Euclidien amin'ny tarehy mitovy fa sary samihafa
     * mila asina tarehy maro ao anaty base amizay mba miena ny probabilité d'erreur
     * raha tsy misy tarehy 0.4 min ao amin'ny base dia raisina ho inconnu ilay input dia miverina mandefa sary na manao enregistrement
     * raha misy 0.25 kosa nefa tonga dia mijanona ny recherche fa efa tena assuré hoe olona ray ihany ny amin'ny sary anakiroa
     * Izay manakaiky indrindra no raisina raha toa ka misy maro samy 0.4
     * mampiasa min max izany
     */
    const bestMatch = faceMatcher.findBestMatch(reference);
    

    //resultats
    if (bestMatch._distance < 0.45) {
        console.log("\nResults : Olona mitovy");
    } else if (bestMatch.distance > 0.45) {
        console.log("\nResults : Olona samihafa ");
    } else {
        console.log("Sary mitovy");
    }
    console.log(`Distance euclidienne : ${bestMatch._distance}`);
    return bestMatch._distance;
}
async function compareJSONJSON(pathFaceToSearch, pathReference) {

    let faceToSearch = fs.readFileSync(pathFaceToSearch, (err, data) => {
        if (err) throw err;
    });
    let parsedFaceToSearch = JSON.parse(faceToSearch);
    faceToSearch = Object.values(parsedFaceToSearch);

    let reference = fs.readFileSync(pathReference, (err, data) => {
        if (err) throw err;
    });
    let parsedFile = JSON.parse(reference);
    reference = Object.values(parsedFile);

    //amoronana faceMatcher ilay tarehy itadiavana ny tompony
    const faceMatcher = new faceapi.FaceMatcher(faceToSearch);

    /**
     * tadiavina amin'ny alalan'ny methode findBestMatch() ananan'ny objet faceMatcher
     * mamoaka _distance io methode io entre 0 et 1
     * plus manakaiky ny 0 plus mitovy ireo tarehy anakiroa
     * plus manakaiky ny 1 plus tsy mitovy
     * eo amin'ny 0.3 sy 0.4 eo hoeo ny distance Euclidien amin'ny tarehy mitovy fa sary samihafa
     * mila asina tarehy maro ao anaty base amizay mba miena ny probabilité d'erreur
     * raha tsy misy tarehy 0.4 ao amin'ny base dia raisina ho inconnu ilay input dia miverina mandefa sary na manao enregistrement
     * raha misy 0.25 kosa nefa tonga dia mijanona ny recherche fa efa tena assuré hoe olona ray ihany ny amin'ny sary anakiroa
     */
    const bestMatch = faceMatcher.findBestMatch(reference);
    

    //resultats
    if (bestMatch._distance < 0.45) {
        console.log("\nResults : Olona mitovy");
    } else if (bestMatch.distance > 0.45) {
        console.log("\nResults : Olona samihafa ");
    } else {
        console.log("Sary mitovy");
    }
    console.log(`Distance euclidienne : ${bestMatch._distance}`);
    return bestMatch._distance;
}
async function compareObjectJSON(objectJS, pathReference) {
    let reference = fs.readFileSync(pathReference, (err, data) => {
        if (err) throw err;
    });
    let parsedFile = JSON.parse(reference);
    reference = Object.values(parsedFile);

    //amoronana faceMatcher ilay tarehy itadiavana ny tompony
    const faceMatcher = new faceapi.FaceMatcher(objectJS);

    /**
     * tadiavina amin'ny alalan'ny methode findBestMatch() ananan'ny objet faceMatcher
     * mamoaka _distance io methode io entre 0 et 1
     * plus manakaiky ny 0 plus mitovy ireo tarehy anakiroa
     * plus manakaiky ny 1 plus tsy mitovy
     * eo amin'ny 0.3 sy 0.4 eo hoeo ny distance Euclidien amin'ny tarehy mitovy fa sary samihafa
     * mila asina tarehy maro ao anaty base amizay mba miena ny probabilité d'erreur
     * raha tsy misy tarehy 0.4 ao amin'ny base dia raisina ho inconnu ilay input dia miverina mandefa sary na manao enregistrement
     * raha misy 0.25 kosa nefa tonga dia mijanona ny recherche fa efa tena assuré hoe olona ray ihany ny amin'ny sary anakiroa
     */
    const bestMatch = faceMatcher.findBestMatch(reference);
    

    //resultats
    // if (bestMatch._distance < 0.45) {
        // console.log("\nResults : Olona mitovy");
    // } else if (bestMatch.distance > 0.45) {
        // console.log("\nResults : Olona samihafa ");
    // } else {
        // console.log("Sary mitovy");
    // }
    // console.log(`Distance euclidienne : ${bestMatch._distance}`);
    return bestMatch;
}


async function searchPerson(pathFaceToSearch) {
    //chargement des models
    await faceapi.nets.faceRecognitionNet.loadFromDisk('src/facial_recognition/models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('src/facial_recognition/models');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('src/facial_recognition/models');
    console.log("Models loaded");
    //models chargés
    newImage = await canvas.loadImage(pathFaceToSearch);

    console.log("Descripting faceToSearch");
    const faceToSearch = await faceapi.detectSingleFace(newImage).withFaceLandmarks().withFaceDescriptor();
    if (faceToSearch) console.log("faceToSearch has face");
    else console.log("No face found in faceToSearch");
}
//compareImageJSON('public/faces/test/howard.jpg','./public/faces/test/howard.json');
//<>

module.exports.compareImageJSON = compareImageJSON;
module.exports.compareJSONJSON = compareJSONJSON;
module.exports.compareObjectJSON = compareObjectJSON;