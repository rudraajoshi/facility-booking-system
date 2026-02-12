const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const State = sequelize.define('State', {
    state_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    state_name:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'States',
    freezeTableName: true,
    timestamps: false,
    underscored: true,
});


State.associate = (models) => {
    State.hasMany(models.City, {
        foreignKey: 'state_id',
        as: 'cities'
    });
};

module.exports = State;