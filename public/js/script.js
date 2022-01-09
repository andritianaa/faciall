const video = document.getElementById("videoInput");

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
]).then(start);

function start(){
    console.log("Done");
    video.src="../videos/video2.mp4";
    recognizeFaces();
}

async function recognizeFaces(){
    video.addEventListener("play",()=>{
        console.log("playing");

        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        const displaySize = {width: video.width, height: video.height};
        faceapi.matchDimensions(canvas, displaySize);
    });
} 

//<>