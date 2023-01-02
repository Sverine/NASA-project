const axios = require('axios');
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'


async function getAllLaunches(){
    return await launchesDatabase
    .find({},{'_id':0, '__v':0});
}

async function saveLaunch(launch){
    const planet = planets.findOne({
        keplerName:launch.target
    })

    if(!planet){
        throw new Error('No matching planet was found !')
    }
    await launchesDatabase.findOneAndUpdate({
        flightNumber:launch.flightNumber,
    }, launch,{
        upsert:true
    })
}

async function scheduleNewLaunch(launch){
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch,{
        success : true,
        upcoming : true,
        customers:['ZTM', 'NAZA'],
        flightNumber:newFlightNumber
    })

    await saveLaunch(newLaunch)
}

async function loadLaunchData(){
    console.log('Downloading launch data ...')
    const response = await axios.post(SPACEX_API_URL,{
        query:{},
        options:{
            populate:[
                {
                    path:"rocket",
                    select:{
                        name:1
                    }
                },
                {
                    path:"payloads",
                    select:{
                        customers:1
                    }
                },
            ]
        }
    })
    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs){
        const payloads = launchDoc.payloads;
        const customers = payloads.flatMap((payload)=>{
            return payload.customers
        })

        const launch = {
            flightNumber:launchDoc.flight_number,
            mission:launchDoc.name,
            rocket:launchDoc.rocket.name,
            launchDate:launchDoc.date_local,
            upcoming:launchDoc.upcoming,
            success:launchDoc.success,
            customers
        };
        console.log(`${launch.flightNumber} ${launch.mission}`)
    }
}

async function existsLaunchWithId(launchId){
    return await launchesDatabase.findOne({
        flightNumber:launchId
    })
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber');
        // add '-' allow to get from the highest

        if(!latestLaunch){
            return DEFAULT_FLIGHT_NUMBER
        }

        return latestLaunch.flightNumber;
}

async function abortLaunchById(launchId){
    const aborted = await launchesDatabase.updateOne({
        flightNumber:launchId
    },{
        upcoming:false,
        success:false
    }
    )
    return aborted
}



module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    abortLaunchById,
    scheduleNewLaunch,
    loadLaunchData
}