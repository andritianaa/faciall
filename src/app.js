const fs = require("fs");
const path = require('path');
//canvas ampiasaina toy ny canvas amin'ny html fa anaty node
const canvas = require("canvas");
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const faceapi = require("face-api.js");


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
    image = await canvas.loadImage(`uploads/${fileName}`);
    console.log("image loaded");
    imgReference = await canvas.loadImage(`public/images/andri.jpg`);
    console.log("imgReference loaded");
    
    //image loaded


    //alaina ny description facial an'ireo image
    //image uploaded
    console.log("descripting result");
    const result = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
    if (result) console.log("found face in result");
    //database image
    console.log("descripting reference");
    const reference = await faceapi.detectSingleFace(imgReference).withFaceLandmarks().withFaceDescriptor();
    if (reference) console.log("found face in reference");


    const faceMatcher = new faceapi.FaceMatcher(result);
    console.log("facematcher result done");



    console.log("reference true");
    const bestMatch = faceMatcher.findBestMatch(reference.descriptor);
    console.log("all done");

    if(bestMatch._distance < 0.45){
      console.log("Olona mitovy");
    }else{
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
})

//<>