import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a question"]
  },
  type : {
    type: String,
    enum: ["MCQ", "MSQ", "CLO", "OEQ"]
  },
  maxScore: {
    type: Number,
    default: 0
  },
});

const QuizSchema = new mongoose.Schema({
  quizName: {
    type: String,
    required: [true, "Please provide a quiz name"]
  },
  startTime: {
    type: Date,
    required: [true, "Please provide a start time"]
  },
  endTime: {
    type: Date,
    required: [true, "Please provide an end time"]
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Please provide a course"]
  },
  questions: [QuestionSchema],
  isGradeReleased: {
    type: Boolean,
    default: false
  }
});

const Quiz = mongoose.model("Quiz", QuizSchema);
export default Quiz;