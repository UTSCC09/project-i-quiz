import mongoose from "mongoose";

const QuestionResponseSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a question"]
  },
  response: {
    type: [String],
    required: [true, "Please provide a response"]
  }
});

const QuizResponseSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: [true, "Please provide a quiz"]
  },
  attemptsMade: {
    type: Number,
    default: 0
  },
  questionResponses: [QuestionResponseSchema],
});

const QuizResponse = mongoose.model("Quiz Responses", QuizResponseSchema);
export default QuizResponse;