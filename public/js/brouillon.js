const fs = require("fs");
const path = require('path');
const canvas = require("canvas");
const multer = require('multer');
const express = require('express');
const faceapi = require("face-api.js");
const bodyParser = require('body-parser');

//definition glogal fileName
//fileName est utilisé pour récuperer le nom du fichier uploadé, ici une image
var fileName = 'test';
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

app.post('/', upload.single('image'), (req, res) => {
  var image = req.image;

  Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk('public/models'),
    faceapi.nets.faceLandmark68Net.loadFromDisk('public/models'),
    faceapi.nets.ssdMobilenetv1.loadFromDisk('public/models'),
  ]).then(start);

  async function start() {
    console.log("insertion image a rechercher: ",fileName);
    faceapi.env.monkeyPatch({canvas,image});
    console.log("loading image");
    image = await canvas.loadImage(`uploads/${fileName}`);
    console.log("image loaded");
    let fullFaceDescriptions = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptors();
    fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions);

  }

  const labels = ["amy", "bernadette", "howard", "leonard", "penny", "raj", "sheldon", "stuart"];
  const labeledFaceDescriptors = await Promise.all(
    labels.map(async label => {
      // fetch image data from urls and convert blob to HTMLImage element
                img = fs.readFileSync(`public/images/${label}/${i}.png`);
          faceapi.env.monkeyPatch({
            canvas,
            img
          });
          img = await canvas.loadImage(`public/images/${label}/${i}.png`);
      
      // detect the face with the highest score in the image and compute it's landmarks and face descriptor
      const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
      
      if (!fullFaceDescription) {
        throw new Error(`no faces detected for ${label}`)
      }
      
      const faceDescriptors = [fullFaceDescription.descriptor]
      return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
    })
  )
  


  res.send(apiResponse({
    message: 'File uploaded successfully.',
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

