const express = require("express");
const personRoutes = require('./api/routes/persons');

//instatiate server
const server = express();

//routes
server.use('/',(req,res,next)=>{
    res.header('Content-Type','text/html');
    res.status(200).send('<h1>connected to server</h1>');
});



//launch server
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{
  console.log(`Server starte on port ${PORT}`);
})
//<>