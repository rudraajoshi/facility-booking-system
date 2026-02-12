require('dotenv').config();
const app = require('./src/app');
const { sequelize, testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

const startServer = async() => {
    await testConnection();
    await sequelize.sync({force: false});
    console.log('Models synced');

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();