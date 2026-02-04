const facilityService = require('../services/facility.service');
const categoryService = require('../services/category.service');
const stateService = require('../services/state.service');
const cityService = require('../services/city.service');
const { STATUD, MESSAGES } = require('../utils/constants');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

// get api facilities
exports.getAllFacilities = async(req, res, next) => {
    try{
        const facilities = await facilityService.getAll(req.query);
        return successResponse(res, 'Facilities fetched successfully', facilities);
    } catch(error){
        next(error);
    }
};

// get facilities by id
exports.getFacilityById = async(req, res, next) => {
    try{
        const facility = await facilityService.getById(req.params.id);
        if(!facility){
            return errorResponse(res, status.NOT_FOUND, MESSAGES.FACILITY_NOT_FOUND);
        }
        return successResponse(res, 'Facility fetched successfully', facility);
    } catch(error){
        next(error);
    }
};

// post facilities [admin]
exports.creatFacility = async(req, res, next) => {
    try{
        const { facility_name, category_id, state_id, city_id, building_name, floor, capacity_min, capacity_max, price_per_hour, availability_status, description, image_url} = req.body;

        // validation of fields
        if(!facility_name || !category_id || !state_id || !city_id || !building_name || !floor || !capacity_min == null || !capacity_max == null|| !price_per_hour == null){
            return errorResponse(res, status.BAD_REQUEST, 'Missing required fields');
        }

        // category verification
        const category = await categoryService.getById(category_id);
        if(!category){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.CATEGORY_NOT_FOUND);
        }

        // state verification
        const state = await stateService.getById(state_id);
        if(!state){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.STATE_NOT_FOUND);
        }

        // city verification
        const city = await cityService.getById(city_id);
            if(!city){
                return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.CITY_NOT_FOUND);
        }

        const facility = await facilityService.create({
            facility_name, category_id, state_id, city_id,
            building_name, floor, capacity_min, capacity_max, 
            price_pre_hour, availability_status, description, image_url,
        });

        return createdResponse(res, MESSAGES.FACILITY_CREATED, facility);
    } catch(error){
        next(error);
    }
};

// put facility id [admin]
exports.updateFacility = async(req, res, next) => {
    try{
        const facility = await facilityService.getById(req.params.id);
        if(!facility){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.FACILITY_NOT_FOUND);
        }
        const updated = await facilityService.update(facility, req.body);
        return successResponse(res, MESSAGES.FACILITY_UPDATED, updated);
    } catch(error){
        next(error);
    }
};

// delete facilities id [admin]
exports.deleteFacility = async(req, res, next) => {
    try{
        const facility = await facilityService.getById(req.params.id);
        if(!facility){
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.FACILITY_NOT_FOUND);
        }

        await facilityService.remove(facility);
        return successResponse(res, MESSAGES.FACILITY_DELETED);
    } catch(error){
        next(error);
    }
};