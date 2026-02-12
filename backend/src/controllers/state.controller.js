const State = require('../models/State.model');
const City = require('../models/City.model');
const { STATUS, MESSAGES } = require('../utils/constants');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

// get all states with their cities
exports.getAllStates = async(req, res, next) => {
    try {
        const states = await State.findAll({
            include: [{
                model: City,
                as: 'cities',
                attributes: ['city_id', 'city_name'],
            }],
            order: [['state_name', 'ASC']],
        });

        // transform to match frontend expectations
        const transformedStates = states.map(state => ({
            id: state.state_id,
            name: state.state_name,
            code: state.state_name.substring(0, 2).toUpperCase(), // Generate code from name
            cities: state.cities ? state.cities.map(city => city.city_name) : [],
        }));

        return successResponse(res, 'States fetched successfully', transformedStates);
    } catch(error) {
        console.error('❌ Error fetching states:', error);
        next(error);
    }
};

// get state by ID with cities
exports.getStateById = async(req, res, next) => {
    try {
        const state = await State.findByPk(req.params.id, {
            include: [{
                model: City,
                as: 'cities',
                attributes: ['city_id', 'city_name'],
            }],
        });

        if(!state) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.STATE_NOT_FOUND || 'State not found');
        }

        const transformed = {
            id: state.state_id,
            name: state.state_name,
            code: state.state_name.substring(0, 2).toUpperCase(),
            cities: state.cities ? state.cities.map(city => city.city_name) : [],
        };

        return successResponse(res, 'State fetched successfully', transformed);
    } catch(error) {
        console.error('❌ Error fetching state:', error);
        next(error);
    }
};

// create new state
exports.createState = async(req, res, next) => {
    try {
        const { name, code, cities } = req.body;

        console.log('📥 Creating state with data:', { name, code, cities });

        if (!name) {
            return errorResponse(res, STATUS.BAD_REQUEST, 'State name is required');
        }

        // check if state already exists
        const existing = await State.findOne({
            where: { state_name: name }
        });

        if (existing) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.STATE_EXISTS || 'State already exists');
        }

        // create state
        const state = await State.create({
            state_name: name,
        });

        console.log('✅ State created:', state.state_id);

        // create cities if provided
        const createdCities = [];
        if (cities && Array.isArray(cities) && cities.length > 0) {
            for (const cityName of cities) {
                if (cityName && cityName.trim()) {
                    const city = await City.create({
                        city_name: cityName.trim(),
                        state_id: state.state_id,
                    });
                    createdCities.push(city.city_name);
                    console.log('✅ City created:', city.city_name);
                }
            }
        }

        const response = {
            id: state.state_id,
            name: state.state_name,
            code: state.state_name.substring(0, 2).toUpperCase(),
            cities: createdCities,
        };

        return createdResponse(res, MESSAGES.STATE_CREATED || 'State created successfully', response);
    } catch(error) {
        console.error('❌ Error creating state:', error);
        next(error);
    }
};

// update state
exports.updateState = async(req, res, next) => {
    try {
        const { name, code } = req.body;

        const state = await State.findByPk(req.params.id);
        if(!state) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.STATE_NOT_FOUND || 'State not found');
        }

        // update state name if provided
        if (name) {
            state.state_name = name;
        }

        await state.save();

        // get updated state with cities
        const updated = await State.findByPk(state.state_id, {
            include: [{
                model: City,
                as: 'cities',
                attributes: ['city_id', 'city_name'],
            }],
        });

        const response = {
            id: updated.state_id,
            name: updated.state_name,
            code: updated.state_name.substring(0, 2).toUpperCase(),
            cities: updated.cities ? updated.cities.map(city => city.city_name) : [],
        };

        return successResponse(res, MESSAGES.STATE_UPDATED || 'State updated successfully', response);
    } catch (error) {
        console.error('❌ Error updating state:', error);
        next(error);
    }
};

// delete state
exports.deleteState = async(req, res, next) => {
    try {
        const state = await State.findByPk(req.params.id);
        if(!state) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.STATE_NOT_FOUND || 'State not found');
        }

        // delete all cities in this state first
        await City.destroy({
            where: { state_id: state.state_id }
        });

        // delete the state
        await state.destroy();

        return successResponse(res, MESSAGES.STATE_DELETED || 'State deleted successfully');
    } catch(error) {
        console.error('❌ Error deleting state:', error);
        next(error);
    }
};