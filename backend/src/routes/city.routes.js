const express = require('express');
const router = express.Router();
const cityController = require('../controllers/city.controller');
const {verifyToken, adminOnly} = require('../middleware/auth.middleware');

router.get('/', cityController.getAllCities);
router.get('/:id', cityController.getCityById);
router.post('/', verifyToken, adminOnly, cityController.createCity);
router.put('/:id', verifyToken, adminOnly, cityController.updateCity);
router.delete('/:id', verifyToken, adminOnly, cityController.deleteCity);

module.exports = router;