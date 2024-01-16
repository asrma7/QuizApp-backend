const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Topic",
  },
  question: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  options: {
    type: [String],
    required: true,
  },
  answer: {
    type: Number,
    required: true,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
