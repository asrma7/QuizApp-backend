const express = require("express");

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();
const {
  getQuestion,
  getQuestions,
  addQuestion,
  editQuestion,
  deleteQuestion,
} = require("../controllers/question.controller");

router.get("/", verifyToken, getQuestions);

router.get("/:qid", verifyToken, getQuestion);

router.post("/", verifyAdmin, addQuestion);

router.put("/:qid", verifyAdmin, editQuestion);

router.delete("/:qid", verifyAdmin, deleteQuestion);

module.exports = router;
