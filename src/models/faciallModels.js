const mongoose = require('mongoose');

const PersonModel = mongoose.model(
    "faciall",
    {
        firstName: {
            type:String,
            required: true
        },
        lastName:{
            type: String,
            required: true
        },
        creationDate: {
            type: Date,
            default: Date.now
        },
        birthDate : {
            type: Date,
            require : true
        },
        phone:{
            type: String
        }
    },
    "persons"
);

module.exports = {PersonModel};