const fs = require('fs');
const path = require('path');
//canvas ampiasaina toy ny canvas amin'ny html fa anaty node
const canvas = require("canvas");
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const search = require('./facial_recognition/search.js');
const compareFace = require('./facial_recognition/compareFace.js');
const descriptorFile = require('./facial_recognition/createDescriptorFile.js');


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
    searchResult = search(imgDescriptor);
    if(searchResult == 0){
      console.log("Personne inconnue");
    }else{
      console.log(`ID trouvé: ${searchResult}`);
    }

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