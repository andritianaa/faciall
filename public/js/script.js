

const canvas = document.getElementById("canvas");
const camera = document.getElementById("camera");
const result = document.getElementById('result');
const takeButton = document.getElementById('take');
const imgCropped = document.getElementById("imgCropped");

//chargement des models de visage du face api
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
]).then(start);

//lancer la webcam
function start(){
    console.log("starting");
    //take webcam
    Webcam.set({
        width: 888,      // live preview size
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

//fonction pour capturer l'image
function take(){
    takeButton.style.display="none";
    Webcam.snap(function(data_uri){
        document.getElementById('result').innerHTML = `
            <img id="taken" src="${data_uri}"/>
        `;
        document.getElementById('taken').style.display="block";
    })
    console.log("captured");

    let imageTaken = document.getElementById('taken');

    //detecter visage dans la photo prise
    detectFace(imageTaken);
}

//fonction pour reprendre une autre photo
function retake(){
    takeButton.style.display="block";
    document.getElementById('taken').style.display="none";

    console.log("retrying");
}


function detectFace(imageTaken){
    setTimeout(async ()=>{

        const detections = await faceapi.detectAllFaces(imageTaken).withFaceLandmarks();
        console.log("detecting");

        if(detections.length==0){
            //aucun visage trouvé
            console.log("no face found");
            retake();

        }else if(detections.length==1){
            //un visage trouvé
            console.log(detections);
            extractFaceFromBox(imageTaken, detections[0].detection.box);

        }else{
            //plusieur visage trouvé
            retake();
            console.log("Une personne à la fois");
            
        }
    },10);
}


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
            console.log("face cropped");
            imgCropped.src = cnv.toDataURL();

            camera.style.display="none";
            result.style.display="none";
         });  
    }   
}
//<>