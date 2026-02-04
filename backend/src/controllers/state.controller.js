const stateService = require('../services/state.service');
const { STATUS, MESSAGES } = require('../utils/constants');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

// get api states
exports.getAllStates = async(req, res, next) => {
    try{
        const states = await stateService.getAll();
        return successResponse(res, 'States fetched successfully', states);
    } catch(error) {
        next(error);
    }
};

// get api states id
exports.getStateById = async(req, res, next) => {
    try{
        const state= await stateService.getById(req.params.id);
        if(!state){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.STATE_NOT_FOUND);
        }
        return successResponse(res, 'State fetched successfully', state);
    } catch(error){
        next(error);
    }
};

// post states [admin]
exports.createState = async(req, res, next) => {
    try{
       const { state_name } = req.body;

       if(!state_name){
        return errorResponse(res, STATUS.BAD_REQUEST, 'State name is required');
       }
       const existing = await stateService.findByName(state_name);
       if(existing){
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.STATE_EXISTS);
       }

       const state = await stateService.create({ state_name });
       return createdResponse(res, MESSAGES.STATE_CREATED, state);
    } catch(error){
        next(error);
    }
};

// put states id [admin]
exports.updateState = async(req, res, next) => {
    try{
        const state = await stateService.getById(req.params.id);
        if(!state){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.STATE_NOT_FOUND);
        }
        const updated = await stateService.update(state, req.body);
        return successResponse(res, MESSAGES.STATE_UPDATED, updated);
    } catch (error){
        next(error);
    }
};

// delete api states is [admin]
exports.deleteState = async(req, res, next) =>{
    try{
        const state = await stateService.getById(req.params.id);
        if(!state){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.STATE_NOT_FOUND);
        }

        await stateService.remove(state);
        return successResponse(res, MESSAGES.STATE_DELETED);
    } catch(error){
        next(error);
    }
};