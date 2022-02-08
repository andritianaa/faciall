const express = require('express');
const router = express.Router();
const Person = require('../models/persons.models');
const multer = require('multer');

//upload image
let storage = multer.diskStorage({
    destination:
})

router.get('/',(req,res)=>{
    res.render('index',{
        title:'Home page'
    })
});
router.get('/add',(req,res)=>{
    res.render('add_persons',{
        title: "Ajouter personne"
    })
});

router.get('/about',(req,res)=>{
    res.render('about',{
        title: "A propos"
    })
});

router.get('/contacts',(req,res)=>{
    res.render('contact',{
        title: "Contacts"
    })
});
module.exports = router;
//<>