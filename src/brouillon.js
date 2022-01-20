const fs = require("fs");
const path = require('path');
//canvas ampiasaina toy ny canvas amin'ny html fa anaty node
const canvas = require("canvas");
const multer = require('multer');
const express = require('express');
const faceapi = require("face-api.js");
const bodyParser = require('body-parser');

let filePath = './public/faces/females/rastaParse.json';


let data = fs.readFileSync(filePath, (err, data) => {
  if(err) throw err;
});
let reference = JSON.parse(data);
console.log(dataParsed);
//<>


async function start() {
  //chargement des models
  await faceapi.nets.faceRecognitionNet.loadFromDisk('public/models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('public/models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('public/models');
  //models chargés

  console.log("nom de l'image: ", fileName);
  console.log("chargement de l'image");

  newImage = await canvas.loadImage(`uploads/${fileName}`);
  console.log("newImage loaded");

  imgReference = await canvas.loadImage(`public/images/andri.jpg`);
  console.log("imgReference loaded");



  console.log("descripting newInput");
  const newInput = await faceapi.detectSingleFace(newImage).withFaceLandmarks().withFaceDescriptor();
  if (newInput) console.log("found face in newInput");

  console.log("descripting reference");
  const reference = await faceapi.detectSingleFace(imgReference).withFaceLandmarks().withFaceDescriptor();
  if (reference) console.log("found face in reference");

  //amoronana faceMatcher ilay tarehy itadiavana ny tompony
  const faceMatcher = new faceapi.FaceMatcher(newInput);
  console.log("facematcher newInput done");

  const bestMatch = faceMatcher.findBestMatch(reference.descriptor);
  console.log("all done");

  //test comparaison olona roa
  if (bestMatch._distance < 0.45) {
    console.log("Olona mitovy");
  } else {
    console.log("Olona samihafa");
  }
  console.log(bestMatch._distance);
}