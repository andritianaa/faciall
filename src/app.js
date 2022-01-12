


const fs         = require("fs");
const path       = require('path');
const canvas     = require("canvas");
const multer     = require('multer');
const express    = require('express');
const faceapi    = require("face-api.js");
const bodyParser = require('body-parser');

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
    cb(null,file.originalname);
    fileName= file.originalname;
   }
});

var upload = multer({ storage: storage });

app.post('/', upload.single('image'),(req, res) => {
  const image = req.image;
  
  Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('../public/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('../public/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('../public/models'),
]).then(start);

async function start(){
    console.log("insertion image a rechercher");
    console.log(fileName);
    const image = await faceapi.fetchImage(`../uploads/${fileName}`);
    console.log("loading labels");
    const labeledFaceDescriptors = await loadLabel();
    console.log("face matching");
    const faceMatcher = new faceapi.faceMatcher(labeledFaceDescriptors,0.7);
    console.log("finding best match");
    const results = image.map(d => faceMatcher.findBestMatch(d.descriptor));
    console.log("done");
    console.log(results);
}




  const labels = ["amy","bernadette","howard","leonard","penny","raj","sheldon","stuart"];
function loadLabel(){
    return Promise.all([

        labels.map(async label =>{
            const descriptions=[];
            for(let i= 1; 5>=i; i++){
              const img = await faceapi.fetchImage(`../public/images/${label}/${i}.jpg`);
              const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
              descriptions.push(detections.descriptor)
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    ])
}



    console.log(labels);
  res.send(apiResponse({message: 'File uploaded successfully.', image}));
});


function apiResponse(results){
    return JSON.stringify({"status": 200, "error": null, "response": results});
}

// server listen 
app.listen(port, () => {
    console.log("server started on port "+port);
})

//<>






        // Promise.all([
        //     faceapi.nets.faceRecognitionNet.loadFromUri('../public/models'),
        //     faceapi.nets.faceLandmark68Net.loadFromUri('../public/models'),
        //     faceapi.nets.ssdMobilenetv1.loadFromUri('../public/models'),
        // ]).then(start);

        // function start(){
        //     setTimeout(async ()=>{
        //         const image = await faceapi.fetchImage(`../uploads/${file.originalname}`);
        //     },10);
            
        // }