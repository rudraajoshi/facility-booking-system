const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facility.controller');
const {verifyToken, adminOnly} = require('../middleware/auth.middleware');

router.get('/', facilityController.getAllFacilities);
router.get('/:id', facilityController.getFacilityById);
router.post('/', verifyToken, adminOnly, facilityController.creatFacility);
router.put('/:id', verifyToken, adminOnly, facilityController.updateFacility); 
router.delete('/:id', verifyToken, adminOnly, facilityController.deleteFacility);

module.exports = router;