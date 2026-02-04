const cityService = require('../services/city.service');
const stateService = require('../services/state.service');
const { STATUS, MESSAGES } = require('../utils/constants');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

// get api city
exports.getAllCities = async(req, res, next) => {
    try{
        const cities = await cityService.getAll(req.query.state_id || null);
        return successResponse(res, 'Cities fetched successfully', cities);
    } catch(error){
        next(error);
    }
};

// get api city id
exports.getCityById = async(req, res, next) =>{
    try{
        const city = await cityService.getById(req.params.id);
        if(!city){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.CITY_NOT_FOUND);
        }
        return successResponse(res, 'City fetched successfully', city);
    } catch(error) {
        next(error);
    }
};

// post api cities [admin]
exports.createCity = async(req, res, next) => {
    try{
        const { city_name, state_id } = req.body;
        if(!city_name || !state_id){
            return errorResponse(res, STATUS.BAD_REQUEST, 'City name and state id required');
        }
        
        const state = await stateService.getById(state_id);
        if(!state) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.STATE_NOT_FOUND_FOR_CITY);
        }

        const city =  await cityService.create({ city_name, state_id });
        return createdResponse(res, MESSAGES.CITY_CREATED, city);
    } catch(error){
        next(error);
    }
};

// put api cities id [admin]
exports.updateCity = async(req, res, next) => {
    try{
        const city = await cityService.getById(req.params.id);
        if(!city){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.CITY_NOT_FOUND);
        }

        // verify state change
        if(req.body.state_id){
            const state = await stateService.getById(req.body.state_id);
            if(!state){
                return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.STATE_NOT_FOUND_FOR_CITY);
            }
        }

        const updated = await cityService.update(city, req.body);
        return successResponse(res, MESSAGES.CITY_UPDATED, updated);
    } catch(error){
        next(error);
    }
};

// delete city id
exports.deleteCity = async(req, res, next) => {
    try{
        const city = await cityService.getById(req.params.id);
        if(!city){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.CITY_NOT_FOUND);
        }
        await cityService.remove(city);
        return successResponse(res, MESSAGES.CITY_DELETED);
    } catch(error){
        next(error);
    }
};