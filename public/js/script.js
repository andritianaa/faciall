const video = document.getElementById("videoInput");

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
]).then(start)

function start(){
    console.log("Done");
    video.src="../videos/video2.mp4"
}



//<>