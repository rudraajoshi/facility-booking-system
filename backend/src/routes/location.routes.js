const express = require('express');
const router = express.Router();
const stateController = require('../controllers/state.controller');
const cityController = require('../controllers/city.controller');
const {verifyToken, adminOnly} = require('../middleware/auth.middleware');


router.get('/states', stateController.getAllStates);
router.get('/states/:id', stateController.getStateById);
router.post('/states', verifyToken, adminOnly, stateController.createState);
router.put('/states/:id', verifyToken, adminOnly, stateController.updateState);
router.delete('/states/:id', verifyToken, adminOnly, stateController.deleteState);

router.get('/states/:id/cities', cityController.getCitiesByState);
router.post('/states/:stateId/cities', verifyToken, adminOnly, cityController.createCity);
router.put('/states/:stateId/cities/:id', verifyToken, adminOnly, cityController.updateCity);
router.delete('/states/:stateId/cities/:cityName', verifyToken, adminOnly, cityController.deleteCity);

module.exports = router;