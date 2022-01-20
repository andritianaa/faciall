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
  faceapi.env.monkeyPatch({Canvas,Image,ImageData})

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
    //image loaded
    

    //alaina ny description facial ao amin'ny image ilay noloadena itsy ambony
     const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();

    
    console.log("Face matching");
    const labeledFaceDescriptors = await loadLabeledImages();

    console.log("face matching");
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    console.log("faceMatcher done / detection");
    
    console.log("detected");


    const results = detections.map(d => faceMatcher.findBestMatch(d.descriptor));


    results.forEach((result, i) => {
      console.log(`result ${result.toString()}`);
    })
    console.log("done");
  }

  start();

  function loadLabeledImages() {
    console.log("loadLabeledImages starting");
    const labels = ["amy", "bernadette", "howard", "leonard", "penny", "raj", "sheldon", "stuart"];
    return Promise.all(
      labels.map(async label => {
        const descriptions = []
        for (let i = 1; i <= 1; i++) {
          img =  canvas.loadImage(`public/images/${label}/${i}.png`);
          console.log(img);
          const detections =  faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
          
          descriptions.push(detections.descriptor);
          console.log(detections);
          console.log(`${label} ${i}`);
        }
        console.log(`${label} loaded`);
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    )
  }

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