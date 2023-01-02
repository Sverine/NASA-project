const app = require('./app');
const http = require ('http');
const {mongoConnect} = require ('./services/mongo')

const {loadPlanetsData} = require('./models/planets.model')

//We separate express and its middleware from server config
const server = http.createServer(app);
const PORT = process.env.PORT ||  8000;



async function startServer(){
    await mongoConnect();
    await loadPlanetsData();
    server.listen(PORT,()=>{
        console.log(`listening on ${PORT}`);
    })
}

startServer();




