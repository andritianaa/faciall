const fs = require("fs");
const path = require('path');
//canvas ampiasaina toy ny canvas amin'ny html fa anaty node
const canvas = require("canvas");
const multer = require('multer');
const express = require('express');
const faceapi = require("face-api.js");
const bodyParser = require('body-parser');


//definition glogal fileName
//fileName est utilisé pour récuperer le nom du fichier uploadé, ici une image
var fileName = 'test';

//init express
const app = express();
const port = process.env.PORT || 3000;
const basePath = path.join(__dirname, '../public');
app.use(express.static(basePath));

// parse application/json
app.use(bodyParser.json());

// image upload code using multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    fileName = file.originalname;
  }
});

var upload = multer({
  storage: storage
});

//post image à rechercher identité
//return l'id de la personne trouvé
app.post('/', upload.single('image'), (req, res) => {
  var image = req.image;

  //monkey patch
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
  async function start() {
    //chargement des models
    await faceapi.nets.faceRecognitionNet.loadFromDisk('public/models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('public/models');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('public/models');
    //models chargés

    console.log("nom de l'image: ", fileName);
    console.log("chargement de l'image");

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
    console.log("newInput descripting");
    newImage = await canvas.loadImage(`uploads/${fileName}`);
    const newInput = await faceapi.detectSingleFace(newImage).withFaceLandmarks().withFaceDescriptor();
    if (newInput) console.log("found face in newInput");
    else console.log("no face found in newInput");

    //fafana ity rehefa tafavoaka ilay stockage an'ny resultat de calcul anaty static
    imgReference = await canvas.loadImage(`public/faces/females/rasta.jpg`);
    const reference = await faceapi.detectSingleFace(imgReference).withFaceLandmarks().withFaceDescriptor();
    if (newInput) console.log("found face in reference");
    else console.log("no face found in reference");


    // let filePath = './public/faces/females/rastaParse.json';
    // let data = fs.readFileSync(filePath, (err, data) => {
    //   if (err) throw err;
    // });
    // let reference = JSON.parse(data);
    // if (reference) console.log("found face in reference");

    //amoronana faceMatcher ilay tarehy itadiavana ny tompony
    const faceMatcher = new faceapi.FaceMatcher(newInput);
    console.log("facematcher newInput done");

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
    const bestMatch = faceMatcher.findBestMatch(reference.descriptor);
    console.log("all done");

    //test comparaison olona roa
    if (bestMatch._distance < 0.45) {
      console.log("Olona mitovy");
    } else {
      console.log("Olona samihafa");
    }
    console.log(bestMatch._distance);
  }

  start();

  res.send(apiResponse({
    message: fileName,
    image
  }));
});


function apiResponse(results) {
  return JSON.stringify({
    "status": 200,
    "error": null,
    "response": results
  });
}

// server listen 
app.listen(port, () => {
  console.log("server started on port " + port);
  //creatingDescriptorJSONfile();
})


//fonction mamadika image descriptor ho lasa JSON
async function creatingDescriptorJSONfile() {

  //monkey patch
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
  //chargement des models
  await faceapi.nets.faceRecognitionNet.loadFromDisk('public/models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('public/models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('public/models');
  //models chargés
  console.log("models chargés");


  img = await canvas.loadImage(`public/faces/females/rasta.jpg`);
  console.log("imgReference loaded");

  console.log("descripting");
  const imgDescriptor = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
  //io imgDescriptor io no atsofoka anaty base de donnée
  if (imgDescriptor) console.log("found face in imgDescriptor");
  console.log(imgDescriptor);
  //creation fichier json
  fs.writeFile("./public/faces/females/rasta.json", JSON.stringify(imgDescriptor), () => console.log("file writed"));
}


//<>