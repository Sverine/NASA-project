const app = require('./app');
const http = require ('http');

require('dotenv').config();

const {mongoConnect} = require ('./services/mongo')
const {loadPlanetsData} = require('./models/planets.model')
const {loadLaunchData} = require('./models/launches.model')

//We separate express and its middleware from server config
const server = http.createServer(app);
const PORT = process.env.PORT ||  8000;



async function startServer(){
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchData();
    server.listen(PORT,()=>{
        console.log(`listening on ${PORT}`);
    })
}

startServer();




