const video = document.getElementById("videoInput");
const canvas = document.getElementById("canvas");
const img = document.getElementById("img");

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),

]).then(startVideo);

function startVideo(){
    console.log("loaded");
    navigator.getUserMedia(
        {video: {}},
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', ()=>{
    console.log("playing");
    setInterval(async ()=>{
        const detections = await faceapi.detectAllFaces(video).withFaceLandmarks();

        //verification du nombre de visage
        if(detections.length==0){
            console.log("searching");

        }else if(detections.length==1){
            console.log(detections);
            extractFaceFromBox(video, detections[0].detection.box);
            video.pause();

        }else{
            console.log("Une personne à la fois");
            
        }
    },5000);
})


// extracter une image depuis l'élément detection
async function extractFaceFromBox(inputImage, box){ 
    const regionsToExtract = [
        new faceapi.Rect( box.x, box.y , box.width , box.height)
    ];        
    let faceImages = await faceapi.extractFaces(inputImage, regionsToExtract);
    
    if(faceImages.length == 0){
        console.log('Face not found')
    }
    else
    {
        faceImages.forEach((cnv) => {
            img.src = cnv.toDataURL();
         });  
    }   
}
// //<>