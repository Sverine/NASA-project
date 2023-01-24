const mongoose = require('mongoose');

require('dotenv').config()

const MONGO_URL = process.env.MONGO_URL;    


function mongoConnect(){
    mongoose.connect(MONGO_URL)
    .then(() => console.log("MongoDB Connected!"))
    .catch((error) => console.log("There was an error: ", error));
}

function mongoDisconnect(){
   mongoose.disconnect(); 
}


module.exports = {mongoConnect,mongoDisconnect}