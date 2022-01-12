const fs         = require("fs");
const path       = require('path');
const canvas     = require("canvas");
const multer     = require('multer');
const express    = require('express');
const faceapi    = require("face-api.js");
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const basePath = path.join(__dirname, '../public');
app.use(express.static(basePath));


// // parse application/json
// app.use(bodyParser.json());

  

// // image upload code using multer
// var storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//       cb(null, 'uploads');
//    },
//    filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname);
//    }
// });

// var upload = multer({ storage: storage });


// app.post('/api/image-upload', upload.single('image'),(req, res) => {
//   const image = req.image;
//   res.send(apiResponse({message: 'File uploaded successfully.', image}));

// });


// function apiResponse(results){
//     return JSON.stringify({"status": 200, "error": null, "response": results});
// }

// server listen 
app.listen(port, () => {
    console.log("server started on port "+port);
})

//<>