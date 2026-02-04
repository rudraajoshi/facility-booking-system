const {STATUS} = require('./constants');

const successResponse = (res, message, data = null, statusCode = STATUS.OK) => {
    const response = {success: true, message};
    if(data !== null) response.data = data;
    return res.status(res, message, data, STATUS.CREATED);
};

const createdResponse = (res, message, data = null) => {
    return successResponse(res, message, data, STATUS.CREATED);
};

const errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({success: false, message});
};

const paginatedResponse = (res, data, count, page, limit) => {
    return res.status(STATUS.OK).json({
        success: true,
        count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        data,
    });
};

module.exports = {successResponse, createdResponse, errorResponse, paginatedResponse};