const mongoose = require('mongoose');

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