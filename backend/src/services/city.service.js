const City = require('../models/City.model');
const State = require('../models/State.model');

const cityService = {
  // get all cities
  getAll: async () => {
    return await City.findAll({
      include: [{
        model: State,
        as: 'state',
        attributes: ['state_id', 'state_name'],
        required: false,
      }],
      order: [['city_name', 'ASC']],
    });
  },

  // get cities by state
  getByState: async (stateId) => {
    return await City.findAll({
      where: { state_id: stateId },
      order: [['city_name', 'ASC']],
    });
  },

  // get city by ID
  getById: async (id) => {
    return await City.findByPk(id, {
      include: [{
        model: State,
        as: 'state',
        attributes: ['state_id', 'state_name'],
        required: false,
      }],
    });
  },

  // create city
  create: async (data) => {
    return await City.create(data);
  },

  // update city
  update: async (city, data) => {
    return await city.update(data);
  },

  // delete city
  remove: async (city) => {
    return await city.destroy();
  },
};

module.exports = cityService;