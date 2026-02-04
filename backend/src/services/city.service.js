const {City, State} = require('../models');
const getAll = async(state_id = null) => {
    const where = {};
    if(state_id) where.state_id = state_id;

    return await City.findAll({
        where,
        order: [['city_id', 'ASC']],
        include: [{model: State, as: 'state'}],
    });
};

const getById = async(city_id) => {
    return await City.findByPk(city_id, {
        include: [{model: State, as:'state'}],
    });
};

const create = async(data) => {
    return await City.create(data);
}

const update = async(city,data) =>{
    await city.update(data);
    return city;
};

const remove = async (city) =>{
    await city.destroy();
};

module.exports = {getAll, getById, create, update, remove};