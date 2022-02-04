const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const { search } = require('./facial_recognition/search');
const { start } = require('repl');
const performance = require('perf_hooks');


//init express
const app = express();
const port = process.env.PORT || 3000;
const basePath = path.join(__dirname, '../public');
app.use(express.static(basePath));

// parse application/json
app.use(bodyParser.json());

// image upload code using multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    fileName = file.originalname;
  }
});

var upload = multer({
  storage: storage
});

//post image à rechercher identité
//return l'id de la personne trouvé
 app.post('/', upload.single('image'), async (req, res) => {
  var image = req.image;
  testStart = performance.now;
  results = await search(`${fileName}`);
  testEnd = performance.now;
  perfTime = testEnd - testStart;
  console.log(`${perfTime} ms`);
  console.log(results);
  
  res.send(apiResponse(results));
});

function apiResponse(results) {
  return JSON.stringify({
    "status": 200,
    "error": null,
    "response": results
  });
}

// server listen 
app.listen(port, () => {
  console.log("server started on port " + port);
})

//<>