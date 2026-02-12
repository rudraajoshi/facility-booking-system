const Booking = require('../models/Booking.model');
const User = require('../models/User.model');
const Facility = require('../models/Facility.model');
const City = require('../models/City.model');
const State = require('../models/State.model');
const Category = require('../models/Category.model');
const { Op } = require('sequelize');

// get all bookings with user and facility information
exports.getAll = async (filters = {}, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    
    if (filters.user_id) whereClause.user_id = filters.user_id;
    if (filters.facility_id) whereClause.facility_id = filters.facility_id;
    if (filters.booking_status) whereClause.booking_status = filters.booking_status;
    if (filters.booking_date) whereClause.booking_date = filters.booking_date;

    const { count, rows } = await Booking.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['user_id', 'name', 'email']
            },
            {
                model: Facility,
                as: 'facility',
                attributes: [
                    'facility_id', 
                    'facility_name', 
                    'building_name', 
                    'floor',
                    'city_id',
                    'state_id',
                    'category_id',
                    'availability_status'
                ],
                include: [
                    {
                        model: City,
                        as: 'city',
                        attributes: ['city_id', 'city_name'],
                        include: [
                            {
                                model: State,
                                as: 'state',
                                attributes: ['state_id', 'state_name']
                            }
                        ]
                    },
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['category_id', 'category_name']
                    }
                ]
            }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
    });

    return { count, rows };
};

// get booking by ID with user and facility information
exports.getById = async (id) => {
    return await Booking.findOne({
        where: { booking_id: id },
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['user_id', 'name', 'email']
            },
            {
                model: Facility,
                as: 'facility',
                attributes: [
                    'facility_id', 
                    'facility_name', 
                    'building_name', 
                    'floor',
                    'city_id',
                    'state_id',
                    'category_id',
                    'availability_status',
                    'capacity_min',
                    'capacity_max',
                    'price_per_hour'
                ],
                include: [
                    {
                        model: City,
                        as: 'city',
                        attributes: ['city_id', 'city_name'],
                        include: [
                            {
                                model: State,
                                as: 'state',
                                attributes: ['state_id', 'state_name']
                            }
                        ]
                    },
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['category_id', 'category_name']
                    }
                ]
            }
        ]
    });
};

exports.create = async (data) => {
    const booking = await Booking.create(data);
    

    return await exports.getById(booking.booking_id);
};


exports.update = async (booking, updates) => {
    await booking.update(updates);
    
  
    return await exports.getById(booking.booking_id);
};


exports.checkConflict = async (facility_id, booking_date, start_time, end_time, exclude_booking_id = null) => {
    const whereClause = {
        facility_id,
        booking_date,
        booking_status: {
            [Op.in]: ['pending', 'confirmed']
        },
        [Op.or]: [
            {
                start_time: {
                    [Op.between]: [start_time, end_time]
                }
            },
            {
                end_time: {
                    [Op.between]: [start_time, end_time]
                }
            },
            {
                [Op.and]: [
                    { start_time: { [Op.lte]: start_time } },
                    { end_time: { [Op.gte]: end_time } }
                ]
            }
        ]
    };

    if (exclude_booking_id) {
        whereClause.booking_id = { [Op.ne]: exclude_booking_id };
    }

    const conflict = await Booking.findOne({ where: whereClause });
    return !!conflict;
};


exports.delete = async (id) => {
    return await Booking.destroy({ where: { booking_id: id } });
};