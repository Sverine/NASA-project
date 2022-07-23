const launches = new Map();

let lastestFlightNumber = 100;

const launch = {
    flightNumber:100,
    mission:'Kepler Explora X',
    rocket:'Explorer IS1',
    launchDate:new Date('December 27, 2030'),
    target:'Kepler-442 b',
    customers:['ZTM','NASA'],
    upcoming:true,
    success:true
};

launches.set(launch.flightNumber, launch);

function getAllLaunches(){
    return Array.from(launches.values());
}

function addNewLaunch(launch){
    lastestFlightNumber++;
    launches.set(lastestFlightNumber, Object.assign(launch,{
        success:true,
        upcoming:true,
        customers:['ZTM', 'NAZA'],
        flightNumber : lastestFlightNumber
    }));
}

function existsLaunchWithId(launchId){
    return launches.has(launchId)
}

function abortLaunchById(launchId){
    const aborted= launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}



module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById
}