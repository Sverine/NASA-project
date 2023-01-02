const request = require('supertest');
const app = require('../../app');
const {mongoConnect,mongoDisconnect} = require('../../services/mongo')

describe('Launches API',()=>{
    beforeAll(async()=>{
        await mongoConnect();
    });
    afterAll(async()=>{
        await mongoDisconnect();
    })
    describe('Test GET/launches',()=>{
        test('It should respond with 200 success status code',async()=>{
            const response = await request(app)
            .get('/v1/launches')
            //this is a regular expression, means, Content-Type must contains json
            .expect('Content-Type',/json/)
            .expect(200);
        })
    })
    
    describe ('Test POST/launches',()=>{
        const completeLaunchData={
            mission:"USS Entreprise",
            rocket:"NCC 1701",
            target:"Kepler-62 f",
            launchDate:"January 4, 2028"
        };
    
        const launchDataWithoutDate = {
            mission:"USS Entreprise",
            rocket:"NCC 1701",
            target:"Kepler-62 f",
        }
        test('It should respond with 201 created', async()=>{
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type',/json/)
                .expect(201)
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
    
            expect(requestDate).toBe(responseDate)
    
            expect(response.body).toMatchObject(launchDataWithoutDate)
        })
    })
})
