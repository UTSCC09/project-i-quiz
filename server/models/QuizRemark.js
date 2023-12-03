import mongoose from "mongoose";

const QuestionRemarkSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a question for remark"],
  },
  studentComment: {
    type: String,
    required: [true, "Please provide a remark comment"],
  },
  instructorComment: {
    type: String,
    default: "",
  },
});

const QuizRemarkSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: [true, "Please provide a quiz to remark"],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a student"],
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending",
  },
  questionRemarks: [QuestionRemarkSchema],
});

const QuizRemark = mongoose.model("Quiz Remarks", QuizRemarkSchema);
export default QuizRemark;
