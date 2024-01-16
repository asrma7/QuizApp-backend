const Question = require("../models/question.model");

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getQuestion = async (req, res) => {
  try {
    const questions = await Question.findOne({ _id: req.params.qid });
    res.status(200).json(questions);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const addQuestion = async (req, res) => {
  const newQuestion = new Question(req.body);
  try {
    const savedQuestion = await newQuestion.save();
    res.status(201).json({
      message: "Question added successfully",
      question: savedQuestion,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const editQuestion = async (req, res) => {
  try {
    const updatedQuestion = await Question.updateOne(
      { _id: req.params.qid },
      { $set: req.body }
    );
    res.status(201).json({
      message: "Question updated successfully",
      response: updatedQuestion,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const removedQuestion = await Question.deleteOne({ _id: req.params.qid });
    res.status(201).json({
      message: "Question deleted successfully",
      response: removedQuestion,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  getQuestion,
  getQuestions,
  addQuestion,
  editQuestion,
  deleteQuestion,
};
