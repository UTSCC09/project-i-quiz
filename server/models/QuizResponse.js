import mongoose from "mongoose";

const QuestionResponseSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a question"]
  },
  response: {
    type: [String],
    required: [true, "Please provide a response"]
  },
  score: {
    type: Number,
    default: -1
  },
  comment: {
    type: String,
    default: ""
  }
});

const QuizResponseSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: [true, "Please provide a quiz"]
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a student"]
  },
  status: {
    type: String,
    enum: ["writing", "submitted"],
    default: "writing"
  },
  graded: {
    type: String,
    enum: ["not", "partially", "fully"],
    default: "not"
  },
  questionResponses: [QuestionResponseSchema],
});

const QuizResponse = mongoose.model("Quiz Responses", QuizResponseSchema);
export default QuizResponse;