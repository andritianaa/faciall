const express = require('express');
const router = express.Router();

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