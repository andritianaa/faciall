const canvas = require("canvas");
const faceapi = require("face-api.js");
const fs = require("fs");
const perf = require("perf_hooks");


async function createDescriptorFile(pathSrc, pathDest) {
  console.log("GO");

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
  var importModelStart = performance.now();
  await faceapi.nets.faceRecognitionNet.loadFromDisk('src/facial_recognition/models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('src/facial_recognition/models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('src/facial_recognition/models');
  await faceapi.nets.ageGenderNet.loadFromDisk('src/facial_recognition/models');
  var importModelEnd = performance.now();
  console.log(`models chargés en ${importModelEnd-importModelStart}ms`);

  //models chargés

  img = await canvas.loadImage(`${pathSrc}`);
  console.log("imgReference loaded");
  console.log("descripting");
  //create imgDescriptor object
  //io imgDescriptor io no atsofoka anaty base de donnée
  var descStart = performance.now();
  const imgDescriptor = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor().withAgeAndGender();
  var descEnd = performance.now();
  console.log(`Description fini en ${descEnd - descStart}ms`);

  //si face api ne trouve pas de visage
  if (imgDescriptor) console.log("found face in imgDescriptor");
  console.log(imgDescriptor.descriptor);

  //creation fichier json
  fs.writeFile(pathDest, JSON.stringify(imgDescriptor.descriptor), () => console.log("file writed"));
}

async function description(pathSrc) {
  console.log("Description go");
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
  var importModelStart = performance.now();
  await faceapi.nets.faceRecognitionNet.loadFromDisk('src/facial_recognition/models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('src/facial_recognition/models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('src/facial_recognition/models');
  await faceapi.nets.ageGenderNet.loadFromDisk('src/facial_recognition/models');
  var importModelEnd = performance.now();
  console.log(`models chargés en ${importModelEnd-importModelStart}ms`);

  //models chargés

  img = await canvas.loadImage(`${pathSrc}`);
  console.log("imgReference loaded");
  console.log("descripting");
  //create imgDescriptor object
  //io imgDescriptor io no atsofoka anaty base de donnée
  var descStart = performance.now();
  const imgDescriptor = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor().withAgeAndGender();
  var descEnd = performance.now();
  console.log(`Description fini en ${descEnd - descStart}ms`);
  //si face api ne trouve pas de visage
  if (imgDescriptor) console.log("found face in imgDescriptor");
  return imgDescriptor;
}
// createDescriptorFile('./public/faces/test/howard.jpg','./public/faces/test/howard.json')
description('./public/faces/test/howard.jpg');
module.exports.createDescriptorFile = createDescriptorFile;