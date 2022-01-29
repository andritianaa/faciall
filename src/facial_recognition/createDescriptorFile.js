const canvas = require("canvas");
const faceapi = require("face-api.js");
const fs = require("fs");
const perf = require("perf_hooks");


async function createDescriptorFile(pathSrc, pathDest) {
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
  await faceapi.nets.faceRecognitionNet.loadFromDisk('src/facial_recognition/models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('src/facial_recognition/models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('src/facial_recognition/models');
  await faceapi.nets.ageGenderNet.loadFromDisk('src/facial_recognition/models');
  //models chargés

  img = await canvas.loadImage(`${pathSrc}`);
  //create imgDescriptor object
  //io imgDescriptor io no atsofoka anaty base de donnée
  const imgDescriptor = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor().withAgeAndGender();
  
  //creation fichier json
  fs.writeFile(pathDest, JSON.stringify(imgDescriptor.descriptor), () => console.log("file writed"));
}

async function description(pathSrc) {
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
  await faceapi.nets.faceRecognitionNet.loadFromDisk('src/facial_recognition/models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('src/facial_recognition/models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('src/facial_recognition/models');
  await faceapi.nets.ageGenderNet.loadFromDisk('src/facial_recognition/models');
  //models chargés
  img = await canvas.loadImage(`${pathSrc}`);
  //create imgDescriptor object
  //io imgDescriptor io no atsofoka anaty base de donnée
  const imgDescriptor = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor().withAgeAndGender();

  //si face api ne trouve pas de visage
  if (imgDescriptor) console.log("found face in imgDescriptor");
  console.log(imgDescriptor.gender);
  return imgDescriptor;
}
// createDescriptorFile('./public/faces/test/howard.jpg','./public/faces/test/howard.json')
//description('./public/faces/test/howard.jpg');
module.exports.createDescriptorFile = createDescriptorFile;
module.exports.description = description;