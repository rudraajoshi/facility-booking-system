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

    price_half_day: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
    },
    price_full_day: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
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

    amenities: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },

    operating_hours: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: { start: '08:00 AM', end: '08:00 PM' },
    },

    rules: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },

    rating: {
        type: DataTypes.DECIMAL(2,1),
        allowNull: true,
        defaultValue: null,
    },
    review_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    image_url: {
        type: DataTypes.STRING(500),
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
    underscored: true,  
});

module.exports = Facility;