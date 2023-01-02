const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://nasa-api:1gFl2amMgamrPij3@nasacluster.qtabu0m.mongodb.net/nasa?retryWrites=true&w=majority'


function mongoConnect(){
    mongoose.connect(MONGO_URL)
    .then(() => console.log("MongoDB Connected!"))
    .catch((error) => console.log("There was an error: ", error));
}

function mongoDisconnect(){
   mongoose.disconnect(); 
}


module.exports = {mongoConnect,mongoDisconnect}