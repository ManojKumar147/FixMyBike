const Feedback = require('../model/feedback_model');
const User = require('../model/user_model');

const createFeedback = async (req, res) => {
  try {
    const { title, message } = req.body;
    const userId = req.userId;
    const feedback = new Feedback({ userId, title, message, status: 'pending', response: null });
    await feedback.save();
    res.json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ message: "Failed to create feedback" });
  }
};

const getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate('userId', 'name email');
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let feedbacks;
    if (user.role === 'admin') {
      feedbacks = await Feedback.find().populate('userId', 'name email');
    } else {
      feedbacks = await Feedback.find({ userId }).populate('userId', 'name email');
    }
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};

const respondToFeedback = async (req, res) => {
  try {
    const { response, title } = req.body;
    const updateFields = { response, status: 'responded' };
    if (title) updateFields.title = title;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Failed to respond to feedback" });
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
  respondToFeedback,
  getFeedbackById
};