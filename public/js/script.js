const canvas = document.getElementById("canvas");
const camera = document.getElementById("camera");
const result = document.getElementById('result');
const takeButton = document.getElementById('take');
const retakeButton = document.getElementById('retake');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),

]).then(start);

function start(){
    console.log("starting");
    //take webcam
    Webcam.set({
        width: 888, // live preview size
        height: 500,
        dest_width: 888, // device capture size
        dest_height: 500,
        crop_width: 500, // final cropped size
        crop_height: 500,
        image_format:'jpeg',
        jpeg_quality:90
    });
    Webcam.attach("#camera");
}

function take(){
    takeButton.style.display="none";
    retakeButton.style.display="block";
    Webcam.snap(function(data_uri){
        document.getElementById('result').innerHTML = `
            <img id="taken" src="${data_uri}"/>
        `;
        document.getElementById('taken').style.display="block";
    })
    console.log("captured");
}
function retake(){
    takeButton.style.display="block";
    retakeButton.style.display="none";
    document.getElementById('taken').style.display="none";
    
    console.log("retrying");
}
//<>