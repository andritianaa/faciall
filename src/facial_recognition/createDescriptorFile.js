const canvas = require("canvas");
const faceapi = require("face-api.js");
const fs = require("fs");
module.exports = async function createDescriptorFile(pathSrc, pathDest) {
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
    await faceapi.nets.faceRecognitionNet.loadFromDisk('public/models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('public/models');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('public/models');

    //models chargés
    console.log("models chargés");
    img = await canvas.loadImage(`${pathSrc}`);
    console.log("imgReference loaded");
    console.log("descripting");
    //create imgDescriptor object
    //io imgDescriptor io no atsofoka anaty base de donnée
    const imgDescriptor = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

    //si face api ne trouve pas de visage
    if (imgDescriptor) console.log("found face in imgDescriptor");
    console.log(imgDescriptor.descriptor);

    //creation fichier json
    fs.writeFile(pathDest, JSON.stringify(imgDescriptor.descriptor), () => console.log("file writed"));
  }
  createDescriptorFile('./public/faces/test/howard.jpg','./public/faces/test/howard.json')