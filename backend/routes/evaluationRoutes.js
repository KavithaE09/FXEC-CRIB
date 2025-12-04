const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { verifyToken, isEvaluator } = require('../middleware/authMiddleware');

router.post('/submit', verifyToken, isEvaluator, evaluationController.submitEvaluation);
router.get('/my-evaluations', verifyToken, isEvaluator, evaluationController.getMyEvaluations);
router.get('/departments', verifyToken, isEvaluator, evaluationController.getAvailableDepartments);

module.exports = router;