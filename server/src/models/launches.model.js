const launches = new Map();
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;

// const launch = {
//     flightNumber:100,
//     mission:'Kepler Explora X',
//     rocket:'Explorer IS1',
//     launchDate:new Date('December 27, 2030'),
//     target:'Kepler-442 b',
//     customers:['ZTM','NASA'],
//     upcoming:true,
//     success:true
// };

// saveLaunch(launch)



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
    scheduleNewLaunch
}