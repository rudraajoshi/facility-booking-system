const State = require('../models/State.model');
const City = require('../models/City.model');

const stateService = {
  // get all states with cities
  getAll: async () => {
    return await State.findAll({
      include: [{
        model: City,
        as: 'cities',
        attributes: ['city_id', 'city_name'],
        required: false,
      }],
      order: [['state_name', 'ASC']],
    });
  },

  // get state by ID
  getById: async (id) => {
    return await State.findByPk(id, {
      include: [{
        model: City,
        as: 'cities',
        attributes: ['city_id', 'city_name'],
        required: false,
      }],
    });
  },

  // find state by name
  findByName: async (name) => {
    return await State.findOne({
      where: { state_name: name }
    });
  },

  // create state
  create: async (data) => {
    return await State.create(data);
  },

  // update state
  update: async (state, data) => {
    return await state.update(data);
  },

  // delete state
  remove: async (state) => {
    return await state.destroy();
  },
};

module.exports = stateService;