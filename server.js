const express = require("express");
const personRoutes = require('./api/routes/persons');

const app = express();
app.use('/',(req,res,next)=>{
    res.sendFile(__dirname+'/public/camera.html');
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log(`Server starte on port ${PORT}`);
})
//