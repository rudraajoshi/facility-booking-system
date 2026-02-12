const City = require('../models/City.model');
const State = require('../models/State.model');
const { STATUS, MESSAGES } = require('../utils/constants');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

// get all cities
exports.getAllCities = async(req, res, next) => {
    try {
        const cities = await City.findAll({
            include: [{
                model: State,
                as: 'state',
                attributes: ['state_id', 'state_name'],
            }],
            order: [['city_name', 'ASC']],
        });
        return successResponse(res, 'Cities fetched successfully', cities);
    } catch(error) {
        console.error('❌ Error fetching cities:', error);
        next(error);
    }
};

// get cities by state ID - returns array of city names
exports.getCitiesByState = async(req, res, next) => {
    try {
        const cities = await City.findAll({
            where: { state_id: req.params.id },
            order: [['city_name', 'ASC']],
        });

        // return just the city names as an array
        const cityNames = cities.map(city => city.city_name);
        return successResponse(res, 'Cities fetched successfully', cityNames);
    } catch(error) {
        console.error('❌ Error fetching cities by state:', error);
        next(error);
    }
};

// get city by id
exports.getCityById = async(req, res, next) => {
    try {
        const city = await City.findByPk(req.params.id, {
            include: [{
                model: State,
                as: 'state',
                attributes: ['state_id', 'state_name'],
            }],
        });
        
        if(!city) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.CITY_NOT_FOUND || 'City not found');
        }
        return successResponse(res, 'City fetched successfully', city);
    } catch(error) {
        console.error('❌ Error fetching city:', error);
        next(error);
    }
};

// create city
exports.createCity = async(req, res, next) => {
    try {
        const { stateId } = req.params;
        const { cityName } = req.body;

        console.log('📥 Creating city:', { stateId, cityName });

        if(!cityName) {
            return errorResponse(res, STATUS.BAD_REQUEST, 'City name is required');
        }

        // check if state exists
        const state = await State.findByPk(stateId);
        if(!state) {
            return errorResponse(res, STATUS.NOT_FOUND, 'State not found');
        }

        // check if city already exists in this state
        const existingCity = await City.findOne({
            where: {
                city_name: cityName,
                state_id: stateId
            }
        });

        if(existingCity) {
            return errorResponse(res, STATUS.BAD_REQUEST, 'City already exists in this state');
        }

        // create city
        const city = await City.create({
            city_name: cityName,
            state_id: stateId,
        });

        console.log('✅ City created:', city.city_id);

        return createdResponse(res, MESSAGES.CITY_CREATED || 'City created successfully', {
            id: city.city_id,
            name: city.city_name,
            stateId: city.state_id,
        });
    } catch(error) {
        console.error('❌ Error creating city:', error);
        next(error);
    }
};

// update city
exports.updateCity = async(req, res, next) => {
    try {
        const { stateId, id } = req.params;
        const { cityName } = req.body;

        console.log('📝 Updating city:', { stateId, id, cityName });

        if(!cityName) {
            return errorResponse(res, STATUS.BAD_REQUEST, 'City name is required');
        }

        const city = await City.findOne({
            where: {
                city_id: id,
                state_id: stateId
            }
        });

        if(!city) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.CITY_NOT_FOUND || 'City not found');
        }

        city.city_name = cityName;
        await city.save();

        console.log('✅ City updated:', city.city_id);

        return successResponse(res, MESSAGES.CITY_UPDATED || 'City updated successfully', {
            id: city.city_id,
            name: city.city_name,
            stateId: city.state_id,
        });
    } catch(error) {
        console.error('❌ Error updating city:', error);
        next(error);
    }
};

// delete city by name
exports.deleteCity = async(req, res, next) => {
    try {
        const { stateId, cityName } = req.params;

        console.log('🗑️ Deleting city:', { stateId, cityName });

        const city = await City.findOne({
            where: {
                city_name: decodeURIComponent(cityName),
                state_id: stateId
            }
        });

        if(!city) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.CITY_NOT_FOUND || 'City not found');
        }

        await city.destroy();

        console.log('✅ City deleted');

        return successResponse(res, MESSAGES.CITY_DELETED || 'City deleted successfully');
    } catch(error) {
        console.error('❌ Error deleting city:', error);
        next(error);
    }
};