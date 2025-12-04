const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/final', verifyToken, isAdmin, resultsController.getFinalResults);
router.get('/all-evaluations', verifyToken, isAdmin, resultsController.getAllEvaluations);

module.exports = router;