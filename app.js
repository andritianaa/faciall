const express = require("express");
const bodyParser = require('body-parser');
const api = require('./src/controllers/api');
app = express();
const PORT = 3000;

app.listen(PORT, ()=>{
  console.log(`Server starte on port ${PORT}`);
})


//<>