const video = document.getElementById("videoInput");
const canvas = document.getElementById("canvas");
const img = document.getElementById("img");
const camera = document.getElementById("camera");


setInterval(async ()=>{
    const detections = await faceapi.detectAllFaces(camera).withFaceLandmarks();
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