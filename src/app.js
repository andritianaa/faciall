const fs = require('fs');
const path = require('path');
//canvas ampiasaina toy ny canvas amin'ny html fa anaty node
const canvas = require("canvas");
const multer = require('multer');
const express = require('express');
const faceapi = require("face-api.js");
const bodyParser = require('body-parser');
const compareFace = require('./facial_recognition/compareFace.js');
const descriptorFile = require('./facial_recognition/createDescriptorFile.js');

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
  async function desc() {
    imgDescriptor = await descriptorFile.description(`uploads/${fileName}`);
    imgDescriptor = await imgDescriptor.descriptor;
    genre = imgDescriptor.genre;
    let found = false;
    let id = 1;
    let folderPath;
    while (!found) {
      for (let i = 1; i <= 3; i++) {
        referencePath = `./public/faces/${genre}/${id}/${i}.json`
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
    }
    //ity id ity tadiavina ary amin'ny database
    faceOwner = id;

    res.send(apiResponse({
      message: fileName,
      image
    }));
  }
  desc();

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