const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    birth:{
        type:Date,
        require:true
    },
    created:{
        type:Date,
        require:true,
        default:Date.now
    },
    phone:{
        type:String,
        require:false
    },
    image : {
        type:String,
        require:true
    },
    descriptor1:{
        type:String,
        require:true
    },
    descriptor2:{
        type:String,
        require:true
    },
    descriptor3:{
        type:String,
        require:true
    },
    adress:{
        type:String,
        require:false
    }
});

module.exports = mongoose.model("Person", personSchema);