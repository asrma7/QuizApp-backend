const Question = require("../models/question.model");
const Topic = require("../models/topic.model");

const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find();
    res.status(200).json(topics);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getSingleTopic = async (req, res) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.topicid });
    res.status(200).json(topic);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getTopicQuestions = async (req, res) => {
  try {
    const questions = await Question.find({
      topic: req.params.topicid,
    }).populate("topic", "title");
    res.status(200).json(questions);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const addTopic = async (req, res) => {
  const newTopic = new Topic(req.body);
  try {
    const savedTopic = await newTopic.save();
    res.status(201).json({
      message: "Topic added successfully",
      topic: savedTopic,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const editTopics = async (req, res) => {
  try {
    const updatedTopic = await Topic.updateOne(
      { _id: req.params.topicid },
      { $set: req.body }
    );
    res.status(201).json({
      message: "Topic updated successfully",
      response: updatedTopic,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const deleteTopic = async (req, res) => {
  try {
    await Question.deleteMany({ topic: req.params.topicid });
    const removedTopic = await Topic.deleteOne({ _id: req.params.topicid });
    res.status(201).json({
      message: "Topic deleted successfully",
      response: removedTopic,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  getTopics,
  getSingleTopic,
  getTopicQuestions,
  addTopic,
  editTopics,
  deleteTopic,
};
