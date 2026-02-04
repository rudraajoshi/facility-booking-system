const { Facility, Category, State, City} = require('../models');

const facilityIncludes = [
    {model: Category, as: 'category', attributes: ['category_id', 'category_name']},
    {model: State, as: 'state', attributes: ['state_id', 'state_name']},
    {model: City, as: 'city', attributes: ['city_id', 'city_name']},
];

const getAll = async(filters = {}) => {
    const where = {};
    if(filters.category_id)  where.category_id = filters.category_id;
    if(filters.state_id)     where.state_id = filters.state_id;
    if(filters.city_id)      where.city_id = filters.city_id;
    if(filters.availability_status) where.availability_status = filters.availability_status;

    return await Facility.findAll({
        where,
        include: facilityIncludes,
        order: [['facility_id', 'ASC']],
    });
};

const getById = async(facility_id) => {
    return await Facility.findByPk(facility_id, {include: facilityIncludes});
};

const create = async(data) => {
    const facility = await Facility.create(data);
    return await getById(facility.facility_id);
};

const update = async(facility, data) => {
    await facility.update(data);
    return await getById(facility.facility_id);
};

const remove = async(facility) => {
    await facility.destroy();
};

module.exports = {getAll, getById, create, update, remove};