const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');

require('./src/models/dbConfig');

//init express
const app = express();
const port = process.env.PORT || 3000;
const basePath = path.join(__dirname, '../public');
app.use(express.static(basePath));

//routes

// parse application/json
app.use(bodyParser.urlencoded({
  extended: true
}));
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



// server listen 
app.listen(port, () => {
  console.log("server started on port " + port);
})

//<>