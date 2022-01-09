const video = document.getElementById("videoInput");

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
]).then(start);

function start (){
    console.log("Done");
    video.src="../videos/video2.mp4";
    recognizeFaces();
}

async function recognizeFaces(){
    const labeledFaceDescriptors = await loadLabelImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

    video.addEventListener("play",()=>{
        console.log("playing");

        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);

        const displaySize = {width: video.width, height: video.height};
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async ()=>{
            const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
            
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height);

            const results = resizedDetections.map((d) =>{
                return faceMatcher.findBestMatch(d.descriptor);
            });

            results.forEach((result, i) => {
                const box = resizedDetections[i].detection.box;
                const drawBox = new faceapi.draw.DrawBox(box, {label: result.toString()});
                drawBox.draw(canvas);
            });
        },10)
    });
} 

function loadLabelImages(){
    const labels = ['amy','bernadette','howard','leonard','penny','raj','sheldon','stuart']

    return Promise.all(
        labels.map(async (label)=>{
            const descriptions = [];
            for(let i=1; 3>=i; i++){
                const img = await faceapi.fetchImage("../images/raj/1.png");
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                descriptions.push(detections.descriptor)
            }
            console.log(label + 'faces loaded');
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    );
}
//<>