const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Facility = sequelize.define('Facility', {
    facility_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    facility_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    building_name:{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    floor:{
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    capacity_min: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    capacity_max: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price_per_hour: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    availability_status: {
        type: DataTypes.ENUM('available', 'limited', 'booked'),
        allowNull: false,
        defaultValue: 'available',
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Facilities',
    freezeTableName: true,
    timestamps: false,
});
module.exports = Facility;