<<<<<<< HEAD
const faceapi = require("face-api.js");
const path = require('path');
const canvas = require("canvas");
const fs = require("fs");
const express = require('express');

=======
const path = require('path');
const express = require('express');
>>>>>>> a0eca5471ac961b88dc9aca8d3ddb574e1a37154
const app = express();
const port = process.env.PORT || 3000;

const basePath = path.join(__dirname, '../public')
<<<<<<< HEAD
app.use(express.static(basePath))

app.listen(port, () => {
    console.log("server started on port "+port);
})



//<>


=======

app.listen(port, () => {
    console.log("server started on port "+port);
} )
//<>
>>>>>>> a0eca5471ac961b88dc9aca8d3ddb574e1a37154
