const mongoose = require('mongoose')

mongoURI = 'mongodb://127.0.0.1:27017/social-media'
    if(mongoose.connect(mongoURI)){
        console.log("mongo connected");
    }
