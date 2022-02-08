const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');
const personsRoutes = require('./src/routes/persons.routes')

require('./src/models/persons.models');

//instatiate server
const server = express();



//middleware
server.use(express.urlencoded({
  extended: true
}));

server.use(express.json());

server.use(session({
  secret: "secret key",
  saveUninitialized: true,
  resave: false
}));

server.use((req, res,next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

//connect to database
mongoose.connect('mongodb://localhost:27017/faciall',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

db = mongoose.connection;
db.on('error',(err)=>{
    console.log(err);
})
db.once('open',()=>{
    console.log('Database connected');
})


//initiate ejs
server.set('view engine','ejs');

//route prefix
server.use('',personsRoutes);

//definition fichier static
server.use(express.static('static'));


//launch server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server starte on port ${PORT}`);
})
//<>