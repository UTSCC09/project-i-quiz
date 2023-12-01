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
    default: 0
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
  questionResponses: [QuestionResponseSchema],
});

const QuizResponse = mongoose.model("Quiz Responses", QuizResponseSchema);
export default QuizResponse;