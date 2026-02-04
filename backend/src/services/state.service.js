const { State, City } = require('../models');

const getAll = async() => {
    return await State.findAll({
        order: [['state_id', 'ASC']],
        include: [{model: City, as: 'cities'}],
    });
};

const getById = async(state_id) => {
    return await State.findByPk(state_id, {
        include: [{model: City, as: 'cities'}],
    });
};

const findByName = async(state_name) => {
    return await State.findOne({where: {state_name}});
};

const create = async(data) => {
    return await State.create(data);
};

const update = async(state,data) =>{
    await state.update(data);
    return state;
};

const remove = async(state) => {
    await state.destroy();
};

module.exports = {getAll, getById, findByName, create, update, remove};