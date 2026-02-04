const {Booking, User, Facility, Category, State, City} = require('../models');
const {Op} = require('sequelize');

const bookingIncludes = [
    {
        model: User,
        as: 'user',
        attributes: ['user_id', 'name', 'email'],
    },
    {
        model: Facility,
        as: 'facility',
        attributes: ['facility_id', 'facility_name', 'price_per_hour', 'building_name', 'floor'],
        include: [
            {model: Category, as: 'category', attributes: ['category_id', 'category_name']},
            {model: State, as: 'state', attributes: ['state_id', 'state_name']},
            {model: City, as: 'city', attributes: ['city_id', 'city_name']},
        ],
    },
];

const checkConflict = async (facility_id, booking_date, start_time, end_time, execludeId = null ) => {
    const where = {
        facility_id,
        booking_date,
        booking_status: {[Op.ne]: 'cancelled'},
        start_time: {[Op.lt]: end_time},
        end_time: {[Op.gt]: start_time},
    };
    if (excludeId) where.booking_id = {[Op.ne]: execludeId};

    const conflict = await Booking.findOne({where});
    return conflict !== null;
};

const getAll = async(filters = {}, page = 1, limit = 10) => {
    const where = {};
    if(filters.user_id)  where.user_id = filters.user_id;
    if(filters.facility_id) where.facility_id = filters.facility_id;
    if(filters.booking_status) where.booking_status = filters.booking_status;
    if(filters.booking_date) where.booking_date = filters.booking_date;

    const offset = (page-1) * limit;

    return await Booking.findAndCountAll({
        where,
        include: bookingIncludes,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
    });
};

const getById = async(booking_id) => {
    return await Booking.findByPk(booking_id, {include: bookingIncludes});
};

const create = async(data) => {
    const booking = await Booking.create(data);
    return await getById(booking.booking_id);
};

const update = async(booking, data) => {
    await booking.update(data);
    return await getById(booking.booking_id);
};

module.exports = {getAll, getById, create, update, checkConflict};