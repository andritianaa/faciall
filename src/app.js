const faceapi = require("face-api.js");
const path = require('path');
const canvas = require("canvas");
const fs = require("fs");
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const basePath = path.join(__dirname, '../public');
app.use(express.static(basePath));

app.listen(port, () => {
    console.log("server started on port "+port);
})
//<>

