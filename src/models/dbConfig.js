const mongoose = require('mongoose');

//connection mongo
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/faciall', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) console.log(err);
    else console.log("MongoDB connected");
});