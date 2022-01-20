const faceapi = require("face-api.js");
const fs = require("fs");
const canvas = require("canvas");

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
async function compare(pathFaceToSearch, pathReference) {
    //chargement des models
    await faceapi.nets.faceRecognitionNet.loadFromDisk('public/models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('public/models');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('public/models');
    //models chargés


    /**loading image in canvas
     * face api mampiasa htmlImageElement na htmlVideoElement de ny fichier image tsotra atsofoka
     * anaty canvas mba holasa htmlImageElement
     */

    /**
     * calculena ny description faciale an'ireo image
     * mamoaka objet js izay hocomparena avy eo ilay calcul
     * raha mahita tarehy de mitohy
     * raha tsy mahita de throw error (to do)
     */
    console.log("load Image");
    newImage = await canvas.loadImage(pathFaceToSearch);
    console.log("faceToSearch descripting");
    const faceToSearch = await faceapi.detectSingleFace(newImage).withFaceLandmarks().withFaceDescriptor();
    if (faceToSearch) console.log("found face in faceToSearch");
    else console.log("no face found in faceToSearch");

    //fafana ity rehefa tafavoaka ilay stockage an'ny resultat de calcul anaty static
    //imgReference = await canvas.loadImage(`public/faces/females/rasta.jpg`);
    //const reference = await faceapi.detectSingleFace(imgReference).withFaceLandmarks().withFaceDescriptor();
    //if (faceToSearch) console.log("found face in reference");
    //else console.log("no face found in reference");


    let reference = fs.readFileSync(pathReference, (err, data) => {
        if (err) throw err;
    });
    let parsedFile = JSON.parse(reference);
    reference =  Object.values(parsedFile);
    console.log(reference);

    if (reference) console.log("found face in reference");

    //amoronana faceMatcher ilay tarehy itadiavana ny tompony
    const faceMatcher = new faceapi.FaceMatcher(faceToSearch);
    console.log("facematcher faceToSearch done");

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
    } else {
        console.log("Olona samihafa");
    }
    console.log(bestMatch._distance);
}

compare('public/faces/test/howard.jpg','./public/faces/test/howard.json');