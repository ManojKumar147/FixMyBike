const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware/authMiddleware");
const feedbackController = require('../controller/feedback_controller');

// User submits feedback
router.post('/feedback/create-feedback', authMiddleware, feedbackController.createFeedback);

// Admin gets all feedbacks
router.get('/feedback/get-feedback', authMiddleware, feedbackController.getFeedbacks);

// Admin responds to a feedback
router.put('/feedback/update-response/:id/respond', authMiddleware, feedbackController.respondToFeedback);
//by id
router.get('/feedback/get-feedback-by-id:id', authMiddleware, feedbackController.getFeedbackById);


module.exports = router;