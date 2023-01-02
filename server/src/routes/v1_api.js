const express = require('express');

const planetsRouter = require ('./planets/planets.router')
const launchesRouter = require ('./launches/launches.router')

const v1_api = express.Router()

v1_api.use('/planets', planetsRouter)
v1_api.use('/launches',launchesRouter)

module.exports = v1_api;