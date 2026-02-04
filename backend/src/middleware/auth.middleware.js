const jwt = require('jsonwebtoken');
const { STATUS, MESSAGES, ROLES } = require('../utils/constants');
const { errorResponse } = require('../utils/response');

const verifyToken = (req, res, next) => {
    try{
        const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;

        if(!token){
            return errorResponse(res, STATUS.UNAUTHORIZED, MESSAGES.TOKEN_MISSING);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch(error){
        return errorResponse(res, STATUS.UNAUTHORIZED, MESSAGES.TOKEN_INVALID);
    }
};

// admin
const adminOnly = (req, res, next) => {
    if(req.userRole !== ROLES.ADMIN){
        return errorResponse(res, STATUS.FORBIDDEN, MESSAGES.ACCESS_DENIED);
    }
    next();
};

module.exports = { verifyToken, adminOnly };