const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
    booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    facility_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    booking_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    booking_status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
        allowNull: false,
        defaultValue: 'confirmed',
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Bookings',
    freezeTableName: true,
    timestamps: false,
    underscored: true
});


Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    
    Booking.belongsTo(models.Facility, {
        foreignKey: 'facility_id',
        as: 'facility'
    });
};

module.exports = Booking;