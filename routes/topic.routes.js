const express = require("express");
const router = express.Router();
const {
  getTopics,
  getSingleTopic,
  getTopicQuestions,
  addTopic,
  editTopics,
  deleteTopic,
} = require("../controllers/topic.controller");

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getTopics);

router.get("/:topicid", verifyToken, getSingleTopic);

router.get("/questions/:topicid", verifyToken, getTopicQuestions);

router.post("/", verifyAdmin, addTopic);

router.put("/:topicid", verifyAdmin, editTopics);

router.delete("/:topicid", verifyAdmin, deleteTopic);

module.exports = router;
