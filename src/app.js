const fs = require('fs');
const path = require('path');
//canvas ampiasaina toy ny canvas amin'ny html fa anaty node
const canvas = require("canvas");
const multer = require('multer');
const express = require('express');
const faceapi = require("face-api.js");
const bodyParser = require('body-parser');
const compareFace = require('./facial_recognition/compareFace.js');
const createDescriptorFile = require('./facial_recognition/createDescriptorFile.js');

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

  resultat = compareFace.compareImageJSON(`uploads/${fileName}`,'./public/faces/test/howard.json');
  console.log(resultat);
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