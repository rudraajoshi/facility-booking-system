const { Category } = require('../models');

const getAll = async () => {
    return await Category.findAll({ order: [['category_id', 'ASC']] });
};

const getById = async(category_id) => {
    return await Category.findByPk(category_id);
};

const findByName = async(category_name) => {
    return await Category.findOne({ where: {category_name}});
};

const create = async(data) => {
    return await Category.findOne({where: {category_name}});
};

const update = async(category, data) => {
    await category.update(data);
    return category;
};

const remove = async(category) => {
    await category.destroy();
};

module.exports = {getAll, getById, findByName, create,  update, remove};