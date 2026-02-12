const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const City = sequelize.define('City', {
    city_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    city_name:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    state_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Cities',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});


City.associate = (models) => {
    City.belongsTo(models.State, {
        foreignKey: 'state_id',
        as: 'state'
    });
};

module.exports = City;