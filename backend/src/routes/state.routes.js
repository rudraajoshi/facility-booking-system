const express = require('express');
const router = express.Router();
const stateController = require('../controllers/state.controller');
const {verifyToken, adminOnly} = require('../middleware/auth.middleware');
const { verify } = require('jsonwebtoken');

router.get('/', stateController.getAllStates);
router.get('/:id', stateController.getStateById);
router.post('/', verifyToken, adminOnly, stateController.createState);
router.put('/:id', verifyToken, adminOnly, stateController.updateState);
router.delete('/:id', verifyToken, adminOnly, stateController.deleteState);

module.exports = router;