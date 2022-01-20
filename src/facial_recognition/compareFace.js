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
module.exports = async function compareImageJSON(pathFaceToSearch, pathReference) {
    //chargement des models
    console.log("Loading models");
    await faceapi.nets.faceRecognitionNet.loadFromDisk('public/models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('public/models');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('public/models');
    console.log("Models loaded");
    //models chargés

    /**loading image in canvas
     * face api mampiasa htmlImageElement na htmlVideoElement de ny fichier image tsotra atsofoka
     * anaty canvas mba holasa htmlImageElement
     */
    console.log("Loading image");
    newImage = await canvas.loadImage(pathFaceToSearch);
    console.log("Image loaded\n");

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
    reference =  Object.values(parsedFile);

    //amoronana faceMatcher ilay tarehy itadiavana ny tompony
    const faceMatcher = new faceapi.FaceMatcher(faceToSearch);
    console.log("Facematcher for faceToSearch created");

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
    console.log("\n\n Matching done\nResults : ");

    //resultats
    if (bestMatch._distance < 0.45) {
        console.log("Olona mitovy");
    } else if(bestMatch.distance > 0.45) {
        console.log("Olona samihafa ");
    }else{
        console.log("Sary mitovy");
    }
    console.log(bestMatch._distance);
    return bestMatch._distance;
}
module.exports = async function compareJSONJSON(pathFaceToSearch, pathReference) {


    let faceToSearch = fs.readFileSync(pathFaceToSearch, (err, data) => {
        if (err) throw err;
    });
    let parsedFaceToSearch = JSON.parse(faceToSearch);
    faceToSearch =  Object.values(parsedFaceToSearch);

    let reference = fs.readFileSync(pathReference, (err, data) => {
        if (err) throw err;
    });
    let parsedFile = JSON.parse(reference);
    reference =  Object.values(parsedFile);

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
    console.log("all done");

    //test comparaison olona roa
    if (bestMatch._distance < 0.45) {
        console.log("Olona mitovy");
    } else if(bestMatch.distance > 0.45) {
        console.log("Olona samihafa ");
    }else{
        console.log("Sary mitovy");
    }
    console.log(bestMatch._distance);
    return bestMatch._distance;
}
//<>