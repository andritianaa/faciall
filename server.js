const express = require("express");
const session = require('express-session');
const {
  append
} = require("express/lib/response");
require('./src/models/persons.models')

//instatiate server
const server = express();

//routes
server.use('/', (req, res, next) => {
  res.header('Content-Type', 'text/html');
  res.status(200).send('<h1>connected to server</h1>');
});

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

server.use((req, res) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
})




//launch server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server starte on port ${PORT}`);
})
//<>